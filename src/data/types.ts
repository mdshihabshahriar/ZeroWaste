export type Role = 'donor' | 'volunteer' | 'receiver' | 'admin';

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