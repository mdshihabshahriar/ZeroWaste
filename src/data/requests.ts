import { FoodRequest } from './types.js';

export const requests: FoodRequest[] = [
  { id: 'r1', donationId: 'FR-2381', receiverId: 'u4', status: 'Requested', date: '2026-11-05' },
  {
    id: 'r2',
    donationId: 'FR-2378',
    receiverId: 'u4',
    status: 'Received',
    portionsReceived: 25,
    condition: 'Good',
    volunteerRating: 5,
    donorRating: 5,
    date: '2026-11-03',
  },
  {
    id: 'r3',
    donationId: 'FR-2376',
    receiverId: 'u4',
    status: 'Received',
    portionsReceived: 60,
    condition: 'Good',
    volunteerRating: 5,
    donorRating: 4,
    date: '2026-11-01',
  },
];