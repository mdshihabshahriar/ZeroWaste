// Receiver: browse & request food — Member 3 (Monami)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import DonationCard from '../../components/DonationCard';
import Button from '../../components/Button';
import Chip, { ChipRow } from '../../components/Chip';
import { Tag } from '../../components/StatusBadge';
import { Loading, ErrorView, EmptyView, Banner } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getBrowseList, requestDonation } from '../../services/pickupService';
import { colors, fonts } from '../../constants/theme';

const FILTERS = ['All', 'Veg', 'Non-veg', '20+ portions'] as const;

export default function Browse() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { data, loading, error, reload } = useData(getBrowseList, []);

  const list = (data ?? []).filter((d) => {
    if (q && !d.food.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === 'Veg' || filter === 'Non-veg') return d.type === filter;
    if (filter === '20+ portions') return d.portions >= 20;
    return true;
  });

  const request = async (id: string) => {
    setBusyId(id);
    setMsg(null);
    try {
      await requestDonation(id, user!);
      setMsg({ type: 'success', text: 'Requested! You will be notified when a volunteer is on the way.' });
      reload();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Screen tabs onRefresh={reload}>
      <View>
        <Text style={styles.small}>
          {user?.name} · {user?.orgType ?? 'Receiver'}
        </Text>
        <Text style={styles.h1}>Available food</Text>
      </View>

      {!user?.verified ? <Banner type="warning" text="Your account is waiting for admin verification. You can request food after approval." /> : null}
      {msg ? <Banner type={msg.type} text={msg.text} /> : null}

      <View style={styles.search}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search rice, biryani, sweets…" placeholderTextColor="#8C958F" style={styles.input} accessibilityLabel="Search food" />
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
        <EmptyView title="No food found" subtitle="Try another search or filter." icon="search-outline" />
      ) : (
        list.map((d) => {
          const mine = d.receiverId === user?.id;
          const taken = !!d.receiverId && !mine;
          return (
            <DonationCard
              key={d.id}
              donation={d}
              subtitle={`${d.portions} portions · ${d.distanceKm} km`}
              footer={mine ? (d.status === 'Picked up' ? 'Volunteer on the way' : 'Requested · waiting for pickup') : `Expires ${d.collectBy}`}
              right={
                mine ? (
                  <Tag text="Requested" bg={colors.primarySoft} fg={colors.primaryDark} />
                ) : taken ? (
                  <Tag text="Taken" />
                ) : (
                  <Button title="Request" small onPress={() => request(d.id)} loading={busyId === d.id} disabled={!user?.verified} />
                )
              }
            />
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  small: { fontSize: 13, fontWeight: '600', color: colors.muted },
  h1: { fontFamily: fonts.serif, fontSize: 26, fontWeight: '600', color: colors.ink },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, fontSize: 15, color: colors.ink },
});