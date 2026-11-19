// Volunteer — nearby food and pickups (Member 3, Monami)
import { Donation, User } from '../common/data/types';
import { setItems, wait } from '../common/services/storage';
import { getDonations, getDonation, updateDonation } from '../common/services/donationStore';
import { addLog, addNotification } from '../common/services/activityService';

export async function getNearbyDonations(radiusKm: number): Promise<Donation[]> {
  await wait();
  const list = await getDonations();
  return list
    .filter((d) => d.status === 'Posted' && d.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// The first volunteer to accept locks the pickup
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
