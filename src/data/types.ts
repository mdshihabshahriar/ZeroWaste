export type Role = 'donor' | 'volunteer' | 'receiver' | 'admin';

export type DonationStatus =
  | 'Posted'
  | 'Accepted'
  | 'Picked up'
  | 'Delivered'
  | 'Expired'
  | 'Cancelled'
  | 'Removed';

export type FoodType = 'Veg' | 'Non-veg' | 'Dry food' | 'Dessert';

export interface FoodRequest {
  id: string;
  donationId: string;
  receiverId: string;
  status: 'Requested' | 'Received';
  portionsReceived?: number;
  condition?: 'Good' | 'Okay' | 'Spoiled';
  volunteerRating?: number;
  donorRating?: number;
  note?: string;
  date: string;
}

export interface Donation {
  id: string;
  food: string;
  type: FoodType;
  portions: number;
  donorId: string;
  donorName: string;
  address: string;
  area: string;
  distanceKm: number;
  cookedAt: string;
  postedAt: string;
  collectBy: string;
  date: string; // YYYY-MM-DD
  status: DonationStatus;
  volunteerId: string | null;
  receiverId: string | null;
  photo: string | null;
  note?: string;
  reports: number;
  flagReason: string | null;
  history: { status: DonationStatus; time: string }[];
}