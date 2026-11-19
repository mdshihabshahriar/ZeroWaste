import { AppNotification } from './types';

export const notifications: AppNotification[] = [
  // Volunteer (u3)
  { id: 'n1', userId: 'u3', type: 'food', title: 'New food 2.8 km away', body: 'Wedding buffet leftovers · 80 portions · collect by 10:50 PM', time: '8:40 PM', unread: true },
  { id: 'n2', userId: 'u3', type: 'time', title: 'Pickup expires in 30 minutes', body: 'Chicken biryani at Rahman Biryani House', time: '11:00 PM', unread: true },
  { id: 'n3', userId: 'u3', type: 'done', title: 'Delivery confirmed', body: 'Shishu Niketan received 25 portions. Thank you!', time: '3:10 PM', unread: false },
  { id: 'n4', userId: 'u3', type: 'shield', title: 'Your volunteer account was verified', body: '', time: 'Yesterday', unread: false },

  // Donor (u1)
  { id: 'n5', userId: 'u1', type: 'done', title: 'Shihab accepted your donation', body: 'Chicken biryani · 30 portions', time: '8:09 PM', unread: true },
  { id: 'n6', userId: 'u1', type: 'done', title: 'Your food reached Shishu Niketan', body: 'Khichuri & egg curry · 25 portions', time: '3 Nov', unread: false },

  // Receiver (u4)
  { id: 'n7', userId: 'u4', type: 'food', title: 'Volunteer is on the way', body: 'Chicken biryani · ETA 15 min', time: '8:45 PM', unread: true },

  // Admin (u7)
  { id: 'n8', userId: 'u7', type: 'shield', title: '3 accounts waiting for verification', body: 'Asha Foundation, Shapla Convention Hall, Dhaka Night Shelter', time: '7:00 PM', unread: true },
  { id: 'n9', userId: 'u7', type: 'time', title: 'A post was reported 5 times', body: '“Free food, call now!!”', time: '7:40 PM', unread: true },
];
