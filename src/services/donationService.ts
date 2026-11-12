import { Donation, DonationStatus, FoodType, User } from '../data/types';
import { getItems, setItems, wait, newId } from './storage';
import { addLog, addNotification } from './adminService';
import { formatTime, today, addHours } from '../utils/format';

export async function getDonations(): Promise<Donation[]> {
  return getItems<Donation>('donations');
}

export async function getDonation(id: string): Promise<Donation> {
  await wait(250);
  const list = await getDonations();
  const d = list.find((x) => x.id === id);
  if (!d) throw new Error('This donation could not be found.');
  return d;
}

export async function updateDonation(id: string, patch: Partial<Donation>, newStatus?: DonationStatus): Promise<Donation> {
  const list = await getDonations();
  let updated: Donation | null = null;
  const next = list.map((d) => {
    if (d.id !== id) return d;
    updated = { ...d, ...patch };
    if (newStatus) {
      updated.status = newStatus;
      updated.history = [...d.history, { status: newStatus, time: formatTime() }];
    }
    return updated;
  });
  if (!updated) throw new Error('This donation could not be found.');
  await setItems('donations', next);
  return updated;
}

export async function getDonorDonations(donorId: string): Promise<Donation[]> {
  await wait();
  const list = await getDonations();
  return list.filter((d) => d.donorId === donorId).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function isActive(d: Donation) {
  return d.status === 'Posted' || d.status === 'Accepted' || d.status === 'Picked up';
}

export interface NewDonation {
  food: string;
  type: FoodType;
  portions: number;
  cookedAt: string;
  collectWithinHours: number;
  address: string;
  photo: string | null;
  note?: string;
}

export async function createDonation(input: NewDonation, donor: User): Promise<Donation> {
  await wait();
  if (!donor.verified) throw new Error('Your account is waiting for admin verification.');
  if (!input.food.trim()) throw new Error('Please write what food it is.');
  if (input.portions < 1) throw new Error('Portions must be at least 1.');

  const now = formatTime();
  const donation: Donation = {
    id: newId('FR'),
    food: input.food.trim(),
    type: input.type,
    portions: input.portions,
    donorId: donor.id,
    donorName: donor.name,
    address: input.address || donor.area,
    area: donor.area.split(',')[0],
    distanceKm: Math.round((0.8 + Math.random() * 4) * 10) / 10, 
    cookedAt: input.cookedAt,
    postedAt: now,
    collectBy: addHours(input.collectWithinHours),
    date: today(),
    status: 'Posted',
    volunteerId: null,
    receiverId: null,
    photo: input.photo,
    note: input.note,
    reports: 0,
    flagReason: null,
    history: [{ status: 'Posted', time: now }],
  };
  const list = await getDonations();
  await setItems('donations', [donation, ...list]);
  await addLog('post', donor.name, `posted ${donation.portions} portions of ${donation.food.toLowerCase()}`, donation.id);
  await addNotification('u3', 'food', `New food ${donation.distanceKm} km away`, `${donation.food} · ${donation.portions} portions`);
  return donation;
}

export async function cancelDonation(id: string, donor: User): Promise<Donation> {
  await wait();
  const d = await getDonation(id);
  if (d.status !== 'Posted') throw new Error('Only a donation nobody accepted yet can be cancelled.');
  const updated = await updateDonation(id, {}, 'Cancelled');
  await addLog('status', donor.name, `cancelled #${id}`, id);
  return updated;
}

export function donorStats(list: Donation[]) {
  const delivered = list.filter((d) => d.status === 'Delivered');
  const finished = list.filter((d) => !isActive(d));
  return {
    meals: delivered.reduce((s, d) => s + d.portions, 0),
    donations: list.length,
    deliveredRate: finished.length ? Math.round((delivered.length / finished.length) * 100) : 0,
  };
}