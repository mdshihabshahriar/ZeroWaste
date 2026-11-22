import React, { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../services/authService';
import { Role } from '../data/types';
import { Loading } from './StateViews';

// Lets only the given role open these screens; everyone else is sent to their own home
export default function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect href="/login" />;
  if (user.role !== role) return <Redirect href={homeFor(user.role) as any} />;
  return <>{children}</>;
}
