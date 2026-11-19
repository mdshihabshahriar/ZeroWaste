// Donation detail & accept — Member 3 (Monami)
import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../common/components/Screen';
import Header from '../../common/components/Header';
import Card from '../../common/components/Card';
import Button from '../../common/components/Button';
import FoodPhoto from '../../common/components/FoodPhoto';
import StatusBadge from '../../common/components/StatusBadge';
import { Loading, ErrorView, Banner } from '../../common/components/StateViews';
import { useAuth } from '../../common/context/AuthContext';
import { useData } from '../../common/hooks/useData';
import { getDonation } from '../../common/services/donationStore';
import { acceptDonation } from '../volunteerService';
import { colors } from '../../common/constants/theme';

export default function DonationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { data: d, loading, error, reload } = useData(() => getDonation(id), [id]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const accept = async () => {
    setBusy(true);
    setErr(null);
    try {
      await acceptDonation(id, user!);
      router.push({ pathname: '/volunteer/active-pickup', params: { accepted: '1' } });
    } catch (e: any) {
      setErr(e.message);
      reload();
    } finally {
      setBusy(false);
    }
  };

  if (loading && !d) return <Loading />;
  if (error || !d) return <ErrorView message={error ?? 'Not found'} onRetry={reload} />;

  const open = d.status === 'Posted';

  return (
    <Screen footer={<Button title={open ? 'Accept pickup' : 'Not available'} onPress={accept} loading={busy} disabled={!open} icon="hand-left-outline" />}>
      <Header title="Donation detail" back fallback="/volunteer/nearby" serif={false} />

      <View style={styles.photoWrap}>
        <FoodPhoto uri={d.photo} type={d.type} size={width - 40} radius={24} />
        <View style={styles.badge}>
          <StatusBadge status={d.status} label={open ? 'Posted · open' : d.status} />
        </View>
      </View>

      {err ? <Banner type="error" text={err} /> : null}

      <View style={{ gap: 4 }}>
        <Text style={styles.h1}>{d.food}</Text>
        <Text style={styles.meta}>
          {d.type} · cooked {d.cookedAt} · {d.portions} portions
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.box, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.boxLabel, { color: '#6B3A10' }]}>Collect by</Text>
          <Text style={[styles.boxValue, { color: '#6B3A10' }]}>{d.collectBy}</Text>
        </View>
        <View style={[styles.box, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.boxLabel, { color: colors.primaryDark }]}>Distance</Text>
          <Text style={[styles.boxValue, { color: colors.primaryDark }]}>{d.distanceKm} km</Text>
        </View>
      </View>

      <Card style={{ gap: 12 }}>
        <View style={styles.row}>
          <Ionicons name="storefront-outline" size={20} color={colors.primary} />
          <Text style={styles.rowTitle}>{d.donorName}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{d.address}</Text>
            {d.note ? <Text style={styles.meta}>“{d.note}”</Text> : null}
          </View>
        </View>
      </Card>

      <Banner type="info" text="The first volunteer to accept locks this pickup. Bring a clean container or bag." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photoWrap: { alignItems: 'center' },
  badge: { position: 'absolute', left: 12, bottom: 12, backgroundColor: colors.white, borderRadius: 999, padding: 2 },
  h1: { fontSize: 24, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 14, color: colors.muted },
  grid: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, padding: 14, borderRadius: 16, gap: 2 },
  boxLabel: { fontSize: 12, fontWeight: '700' },
  boxValue: { fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.ink },
});
