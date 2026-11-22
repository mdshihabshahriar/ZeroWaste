import { Donation, DonationStatus } from '../data/types';
import { getItems, setItems, wait } from './storage';
import { formatTime } from '../utils/format';

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

// Shared helper: change fields of one donation (and record a status step)
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

export function isActive(d: Donation) {
  return d.status === 'Posted' || d.status === 'Accepted' || d.status === 'Picked up';
}