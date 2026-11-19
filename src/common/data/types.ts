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

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role | null;
  verified: boolean;
  area: string;
  orgType?: string; // Restaurant, NGO, Orphanage ...
  docs?: string[]; // documents shown on the Verify screen
  rating?: number;
  deliveries?: number;
  appliedAt?: string;
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

export interface AppNotification {
  id: string;
  userId: string;
  type: 'food' | 'done' | 'time' | 'shield';
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface AuditLog {
  id: string;
  kind: 'status' | 'admin' | 'auth' | 'post';
  actor: string;
  action: string;
  ref: string;
  time: string;
}
