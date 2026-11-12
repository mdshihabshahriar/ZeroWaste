import { Donation, FoodRequest, User } from '../data/types';
import { getItems, setItems, wait, newId } from './storage';
import { getDonations, getDonation, updateDonation } from './donationService';
import { addLog, addNotification } from './adminService';
import { today } from '../utils/format';


export async function getNearbyDonations(radiusKm: number): Promise<Donation[]> {
  await wait();
  const list = await getDonations();
  return list
    .filter((d) => d.status === 'Posted' && d.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function acceptDonation(id: string, volunteer: User): Promise<Donation> {
  await wait();
  const d = await getDonation(id);
  if (d.status !== 'Posted') throw new Error('Another volunteer already accepted this pickup.');
  const active = await getActivePickup(volunteer.id);
  if (active) throw new Error('Finish your current pickup before accepting another one.');

  const updated = await updateDonation(id, { volunteerId: volunteer.id }, 'Accepted');
  await addLog('status', volunteer.name, `accepted #${id} (locked)`, id);
  await addNotification(d.donorId, 'done', `${volunteer.name} accepted your donation`, `${d.food} · ${d.portions} portions`);
  return updated;
}

export async function getActivePickup(volunteerId: string): Promise<Donation | null> {
  const list = await getDonations();
  return list.find((d) => d.volunteerId === volunteerId && (d.status === 'Accepted' || d.status === 'Picked up')) ?? null;
}

export async function markPickedUp(id: string, volunteer: User): Promise<Donation> {
  await wait();
  const d = await getDonation(id);
  if (d.status !== 'Accepted') throw new Error('This pickup is not in the Accepted state.');
  const updated = await updateDonation(id, {}, 'Picked up');
  await addLog('status', volunteer.name, `marked #${id} as Picked up`, id);
  if (d.receiverId) await addNotification(d.receiverId, 'food', 'Volunteer is on the way', `${d.food} · ${d.portions} portions`);
  return updated;
}

export async function releasePickup(id: string, volunteer: User): Promise<Donation> {
  await wait();
  const d = await getDonation(id);
  if (d.status !== 'Accepted') throw new Error('You can only release a pickup before picking it up.');
  const list = await getDonations();
  const next = list.map((x) =>
    x.id === id
      ? { ...x, status: 'Posted' as const, volunteerId: null, history: x.history.filter((h) => h.status === 'Posted') }
      : x
  );
  await setItems('donations', next);
  await addLog('status', volunteer.name, `released #${id}`, id);
  return next.find((x) => x.id === id)!;
}


export async function getBrowseList(): Promise<Donation[]> {
  await wait();
  const list = await getDonations();
  return list.filter((d) => (d.status === 'Posted' || d.status === 'Accepted' || d.status === 'Picked up') && d.reports < 3);
}

export async function getMyRequests(receiverId: string): Promise<FoodRequest[]> {
  const list = await getItems<FoodRequest>('requests');
  return list.filter((r) => r.receiverId === receiverId);
}

export async function requestDonation(id: string, receiver: User): Promise<FoodRequest> {
  await wait();
  if (!receiver.verified) throw new Error('Your account is waiting for admin verification.');
  const d = await getDonation(id);
  if (d.receiverId && d.receiverId !== receiver.id) throw new Error('Another receiver already requested this food.');
  const list = await getItems<FoodRequest>('requests');
  const existing = list.find((r) => r.donationId === id && r.receiverId === receiver.id);
  if (existing) return existing;

  const req: FoodRequest = { id: newId('r'), donationId: id, receiverId: receiver.id, status: 'Requested', date: today() };
  await setItems('requests', [req, ...list]);
  await updateDonation(id, { receiverId: receiver.id });
  await addLog('status', receiver.name, `requested #${id}`, id);
  return req;
}

export async function getIncoming(receiverId: string): Promise<Donation[]> {
  await wait();
  const list = await getDonations();
  return list.filter((d) => d.receiverId === receiverId && (d.status === 'Accepted' || d.status === 'Picked up'));
}

export async function confirmReceipt(
  id: string,
  receiver: User,
  details: { portionsReceived: number; condition: 'Good' | 'Okay' | 'Spoiled'; volunteerRating: number; donorRating: number; note?: string }
): Promise<Donation> {
  await wait();
  const d = await getDonation(id);
  if (d.status !== 'Picked up') throw new Error('You can confirm only after the volunteer has picked up the food.');

  const updated = await updateDonation(id, {}, 'Delivered');
  const list = await getItems<FoodRequest>('requests');
  await setItems(
    'requests',
    list.map((r) => (r.donationId === id && r.receiverId === receiver.id ? { ...r, status: 'Received' as const, ...details } : r))
  );
  await addLog('status', receiver.name, `confirmed delivery of #${id}`, id);
  await addNotification(d.donorId, 'done', `Your food reached ${receiver.name}`, `${d.food} · ${details.portionsReceived} portions`);
  if (d.volunteerId) await addNotification(d.volunteerId, 'done', 'Delivery confirmed', `${receiver.name} received the food. Thank you!`);
  return updated;
}