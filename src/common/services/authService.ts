// Member 1 (Mahir) — login, sign up, roles
import { Role, User } from '../data/types';
import { getItems, setItems, getValue, setValue, removeValue, wait, newId } from './storage';
import { addLog } from './activityService';

const SESSION = 'session';

export async function login(email: string, password: string): Promise<User> {
  await wait();
  const list = await getItems<User>('users');
  const user = list.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) {
    throw new Error('Incorrect email or password.');
  }
  await setValue(SESSION, user.id);
  await addLog('auth', user.name, 'logged in', user.id);
  return user;
}

export async function signup(input: { name: string; phone: string; email: string; password: string }): Promise<User> {
  await wait();
  const list = await getItems<User>('users');
  if (list.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const user: User = {
    id: newId('u'),
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
    phone: input.phone.trim(),
    role: null,
    verified: false,
    area: 'Dhaka',
    appliedAt: 'just now',
  };
  await setItems('users', [...list, user]);
  await setValue(SESSION, user.id);
  await addLog('auth', user.name, 'created an account', user.id);
  return user;
}

// Volunteers are verified straight away; donors and receivers wait for an admin
export async function setRole(userId: string, role: Role): Promise<User> {
  await wait();
  const list = await getItems<User>('users');
  let updated: User | null = null;
  const next = list.map((u) => {
    if (u.id !== userId) return u;
    updated = {
      ...u,
      role,
      verified: role === 'volunteer',
      docs: role === 'volunteer' ? u.docs : role === 'donor' ? ['Trade licence'] : ['Registration letter'],
    };
    return updated;
  });
  if (!updated) throw new Error('User not found.');
  await setItems('users', next);
  return updated;
}

export async function getCurrentUser(): Promise<User | null> {
  const id = await getValue(SESSION);
  if (!id) return null;
  const list = await getItems<User>('users');
  return list.find((u) => u.id === id) ?? null;
}

export async function getUser(id: string | null): Promise<User | null> {
  if (!id) return null;
  const list = await getItems<User>('users');
  return list.find((u) => u.id === id) ?? null;
}

export async function logout(): Promise<void> {
  await removeValue(SESSION);
}

export function homeFor(role: Role | null): string {
  switch (role) {
    case 'donor':
      return '/donor/home';
    case 'volunteer':
      return '/volunteer/nearby';
    case 'receiver':
      return '/receiver/browse';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/role-select';
  }
}
