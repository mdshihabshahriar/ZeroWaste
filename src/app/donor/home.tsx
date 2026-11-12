// Donor Home — Member 2 (Shihab)
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import DonationCard from '../../components/DonationCard';
import { IconButton } from '../../components/Header';
import { Loading, ErrorView, EmptyView, Banner } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getDonorDonations, isActive, donorStats } from '../../services/donationService';
import { colors, fonts } from '../../constants/theme';

export default function DonorHome() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useData(() => getDonorDonations(user!.id), [user?.id]);

  const active = data?.filter(isActive) ?? [];
  const stats = donorStats(data ?? []);
  const openStatus = (id: string) => router.push({ pathname: '/donor/status', params: { id } });

  return (
    <Screen tabs onRefresh={reload}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Good evening,</Text>
          <Text style={styles.name} numberOfLines={1}>
            {user?.name}
          </Text>
        </View>
        <IconButton name="notifications-outline" label="Notifications" badge onPress={() => router.push('/donor/notifications')} />
      </View>

      {!user?.verified ? <Banner type="warning" text="Your account is waiting for admin verification. You can post food after approval." /> : null}

      <Pressable style={styles.hero} onPress={() => router.push('/donor/create-post')} accessibilityRole="button">
        <View style={styles.heroGlow} />
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.heroTitle}>Have extra food?</Text>
          <Text style={styles.heroText}>Post it in under a minute. Volunteers nearby get notified instantly.</Text>
        </View>
        <View style={styles.plus}>
          <Ionicons name="add" size={28} color={colors.primary} />
        </View>
      </Pressable>

      <View style={styles.stats}>
        <Stat value={stats.meals.toLocaleString()} label="Meals donated" />
        <Stat value={String(stats.donations)} label="Donations" />
        <Stat value={`${stats.deliveredRate}%`} label="Delivered" />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.section}>Active donations</Text>
        <Text style={styles.link} onPress={() => router.push('/donor/history')}>
          See all
        </Text>
      </View>

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : active.length === 0 ? (
        <EmptyView title="No active donations" subtitle="Tap “Have extra food?” to post surplus food." />
      ) : (
        active.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            onPress={() => openStatus(d.id)}
            subtitle={`${d.portions} portions · ${d.status === 'Posted' ? 'waiting for volunteer' : 'volunteer assigned'}`}
            footer={`Collect by ${d.collectBy}`}
          />
        ))
      )}
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card style={{ flex: 1, gap: 2, paddingVertical: 12 }}>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hello: { fontSize: 14, fontWeight: '600', color: colors.muted },
  name: { fontSize: 22, fontWeight: '800', color: colors.ink },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 22, borderRadius: 26, backgroundColor: colors.dark, overflow: 'hidden' },
  heroGlow: { position: 'absolute', right: -60, top: -70, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(28,122,82,0.55)' },
  heroTitle: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '600', color: colors.white },
  heroText: { fontSize: 14, lineHeight: 20, color: '#C9D3CD' },
  plus: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 10 },
  statNum: { fontSize: 20, fontWeight: '800', color: colors.ink },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.muted },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 },
  section: { fontSize: 18, fontWeight: '800', color: colors.ink },
  link: { fontSize: 14, fontWeight: '700', color: colors.primary, padding: 6 },
});