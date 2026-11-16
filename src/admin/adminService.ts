
import { AuditLog, Donation, User } from '../common/data/types';
import { addLog, addNotification } from '../common/services/activityService';
import { getItems, setItems, wait } from '../common/services/storage';
import { formatTime } from '../common/utils/format';

export async function getLogs(): Promise<AuditLog[]> {
  await wait();
  return getItems<AuditLog>('logs');
}



export async function getStats() {
  await wait();
  const donations = await getItems<Donation>('donations');
  const users = await getItems<User>('users');
  const count = (s: Donation['status']) => donations.filter((d) => d.status === s).length;
  return {
    mealsSaved: donations.filter((d) => d.status === 'Delivered').reduce((s, d) => s + d.portions, 0),
    volunteers: users.filter((u) => u.role === 'volunteer').length,
    pending: users.filter((u) => !u.verified && (u.role === 'donor' || u.role === 'receiver')).length,
    flagged: donations.filter((d) => d.reports > 0 && d.status === 'Posted').length,
    byStatus: [
      { label: 'Posted', value: count('Posted') },
      { label: 'Accepted', value: count('Accepted') },
      { label: 'Picked up', value: count('Picked up') },
      { label: 'Delivered', value: count('Delivered') },
      { label: 'Expired', value: count('Expired') },
    ],
   
    week: [
      { day: 'Sat', meals: 380 },
      { day: 'Sun', meals: 420 },
      { day: 'Mon', meals: 310 },
      { day: 'Tue', meals: 455 },
      { day: 'Wed', meals: 520 },
      { day: 'Thu', meals: 677 },
      { day: 'Fri', meals: 720 },
    ],
  };
}



export async function getUsersByStatus(status: 'pending' | 'approved'): Promise<User[]> {
  await wait();
  const list = await getItems<User>('users');
  return list.filter(
    (u) => (u.role === 'donor' || u.role === 'receiver') && (status === 'pending' ? !u.verified : u.verified)
  );
}

export async function verifyUser(userId: string, approve: boolean, admin: User): Promise<void> {
  await wait();
  const list = await getItems<User>('users');
  const target = list.find((u) => u.id === userId);
  if (!target) throw new Error('User not found.');
  const next = approve
    ? list.map((u) => (u.id === userId ? { ...u, verified: true } : u))
    : list.map((u) => (u.id === userId ? { ...u, role: null, verified: false } : u));
  await setItems('users', next);
  await addLog('admin', admin.name, `${approve ? 'approved' : 'rejected'} ${target.name}`, userId);
  await addNotification(
    userId,
    'shield',
    approve ? 'Your account was verified' : 'Your verification was rejected',
    approve ? 'You can now use all features.' : 'Please choose your role again and upload correct documents.'
  );
}



export async function getReportedPosts(): Promise<Donation[]> {
  await wait();
  const list = await getItems<Donation>('donations');
  return list.filter((d) => d.reports > 0 && d.status === 'Posted').sort((a, b) => b.reports - a.reports);
}

export async function getRemovedPosts(): Promise<Donation[]> {
  await wait();
  const list = await getItems<Donation>('donations');
  return list.filter((d) => d.status === 'Removed');
}

export async function keepPost(id: string, admin: User): Promise<void> {
  await wait();
  const list = await getItems<Donation>('donations');
  await setItems('donations', list.map((d) => (d.id === id ? { ...d, reports: 0, flagReason: null } : d)));
  await addLog('admin', admin.name, `kept reported post #${id}`, id);
}

export async function removePost(id: string, admin: User): Promise<void> {
  await wait();
  const list = await getItems<Donation>('donations');
  await setItems(
    'donations',
    list.map((d) =>
      d.id === id ? { ...d, status: 'Removed' as const, history: [...d.history, { status: 'Removed' as const, time: formatTime() }] } : d
    )
  );
  await addLog('admin', admin.name, `removed post #${id}`, id);
}
