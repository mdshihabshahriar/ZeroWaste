// Donor history — Member 2 (Shihab)
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Chip, { ChipRow } from '../../components/Chip';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorView, EmptyView } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getDonorDonations } from '../../services/donationService';
import { splitDate } from '../../utils/format';
import { colors } from '../../constants/theme';

const FILTERS = ['All', 'Delivered', 'Expired', 'Cancelled'] as const;

export default function History() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const { data, loading, error, reload } = useData(() => getDonorDonations(user!.id), [user?.id]);

  const list = (data ?? []).filter((d) => filter === 'All' || d.status === filter);
  const delivered = (data ?? []).filter((d) => d.status === 'Delivered');
  const receivers = new Set(delivered.map((d) => d.receiverId)).size;

  return (
    <Screen tabs onRefresh={reload}>
      <Header title="History" />

      <View style={styles.summary}>
        <Sum value={delivered.reduce((s, d) => s + d.portions, 0)} label="Meals delivered" />
        <View style={styles.divider} />
        <Sum value={data?.length ?? 0} label="Donations" />
        <View style={styles.divider} />
        <Sum value={receivers} label="Receivers fed" />
      </View>

      <ChipRow>
        {FILTERS.map((f) => (
          <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ChipRow>

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : list.length === 0 ? (
        <EmptyView title="Nothing here" subtitle={`No ${filter.toLowerCase()} donations yet.`} />
      ) : (
        list.map((d) => {
          const { day, month } = splitDate(d.date);
          return (
            <Card key={d.id} style={styles.row} onPress={() => router.push({ pathname: '/donor/status', params: { id: d.id } })}>
              <View style={styles.date}>
                <Text style={styles.day}>{day}</Text>
                <Text style={styles.month}>{month}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.food}>{d.food}</Text>
                <Text style={styles.meta}>{d.portions} portions</Text>
              </View>
              <StatusBadge status={d.status} />
            </Card>
          );
        })
      )}
    </Screen>
  );
}

function Sum({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={styles.sumNum}>{value}</Text>
      <Text style={styles.sumLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 20, backgroundColor: colors.dark },
  divider: { width: 1, backgroundColor: '#3A4640' },
  sumNum: { fontSize: 24, fontWeight: '800', color: colors.white },
  sumLabel: { fontSize: 12, fontWeight: '600', color: '#C3CCC6' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  date: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#F3EBE1', alignItems: 'center', justifyContent: 'center' },
  day: { fontSize: 15, fontWeight: '800', color: colors.ink },
  month: { fontSize: 10, fontWeight: '700', color: '#6B4A2A' },
  food: { fontSize: 15, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
});