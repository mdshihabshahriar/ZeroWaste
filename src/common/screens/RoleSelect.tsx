// Role selection — Member 1 (Mahir)
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Button from '../components/Button';
import { Banner, Loading } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../services/authService';
import { Role } from '../data/types';
import { colors, fonts, radius } from '../constants/theme';

const ROLES: { role: Role; title: string; text: string; icon: any; bg: string; fg: string }[] = [
  { role: 'donor', title: 'Donor', text: 'Restaurant, venue or household with surplus cooked food', icon: 'restaurant-outline', bg: colors.accentSoft, fg: colors.accent },
  { role: 'volunteer', title: 'Volunteer', text: 'Pick up food nearby and deliver it to receivers', icon: 'bicycle-outline', bg: colors.primarySoft, fg: colors.primary },
  { role: 'receiver', title: 'Receiver', text: 'NGO, orphanage, shelter or family that needs food', icon: 'home-outline', bg: colors.blueSoft, fg: colors.blue },
];

export default function RoleSelect() {
  const { user, loading: authLoading, chooseRole } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) return <Loading />;
  if (!user) return <Redirect href="/login" />;

  const submit = async () => {
    if (!role) return;
    setLoading(true);
    setError(null);
    try {
      const u = await chooseRole(role);
      router.replace(homeFor(u.role) as any);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const chosen = ROLES.find((r) => r.role === role);

  return (
    <Screen
      footer={<Button title={chosen ? `Continue as ${chosen.title}` : 'Choose a role'} onPress={submit} disabled={!role} loading={loading} />}
    >
      <View style={styles.progress}>
        <View style={[styles.bar, { backgroundColor: colors.primary }]} />
        <View style={[styles.bar, { backgroundColor: colors.primary }]} />
      </View>
      <View style={{ gap: 6 }}>
        <Text style={styles.h1}>How will you help?</Text>
        <Text style={styles.p}>Your role decides which screens you see.</Text>
      </View>

      {error ? <Banner type="error" text={error} /> : null}

      {ROLES.map((r) => {
        const active = role === r.role;
        return (
          <Pressable
            key={r.role}
            onPress={() => setRole(r.role)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            style={[styles.card, active && styles.cardActive]}
          >
            <View style={[styles.icon, { backgroundColor: active ? colors.primary : r.bg }]}>
              <Ionicons name={r.icon} size={26} color={active ? colors.white : r.fg} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={styles.title}>{r.title}</Text>
              <Text style={styles.text}>{r.text}</Text>
            </View>
            <View style={[styles.radio, active && styles.radioOn]} />
          </Pressable>
        );
      })}

      <Banner type="warning" text="Donor and Receiver accounts are verified by an admin before they can post or request food." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: 6, width: 120 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
  h1: { fontFamily: fonts.serif, fontSize: 28, fontWeight: '600', color: colors.ink },
  p: { fontSize: 15, color: colors.muted },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  cardActive: { backgroundColor: '#EDF5F0', borderColor: colors.primary, borderWidth: 2 },
  icon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: colors.ink },
  text: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#B8BFB3' },
  radioOn: { borderWidth: 7, borderColor: colors.primary },
});
