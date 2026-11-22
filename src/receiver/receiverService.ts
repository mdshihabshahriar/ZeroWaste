import { Donation, FoodRequest, User } from '../common/data/types';
import { getItems, setItems, wait, newId } from '../common/services/storage';
import { getDonations, getDonation, updateDonation } from '../common/services/donationStore';
import { addLog, addNotification } from '../common/services/activityService';
import { today } from '../common/utils/format';

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

// Donations on their way to this receiver
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