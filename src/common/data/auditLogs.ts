import { AuditLog } from './types';

export const auditLogs: AuditLog[] = [
  { id: 'l1', kind: 'status', actor: 'Shihab', action: 'accepted #FR-2381 (locked)', ref: 'FR-2381', time: '8:09 PM' },
  { id: 'l2', kind: 'post', actor: 'Rahman Biryani House', action: 'posted 30 portions of chicken biryani', ref: 'FR-2381', time: '8:02 PM' },
  { id: 'l3', kind: 'admin', actor: 'Admin Munna', action: 'approved Shishu Niketan as Receiver', ref: 'u4', time: '7:15 PM' },
  { id: 'l4', kind: 'auth', actor: 'Shihab', action: 'signed in from a new device', ref: 'u3', time: '6:52 PM' },
  { id: 'l5', kind: 'status', actor: 'System', action: 'expired #FR-2374 — no volunteer accepted', ref: 'FR-2374', time: '6:00 PM' },
  { id: 'l6', kind: 'status', actor: 'Shishu Niketan', action: 'confirmed delivery of #FR-2378', ref: 'FR-2378', time: '3:10 PM' },
];
