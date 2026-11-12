// Donation status — Member 2 (Shihab)
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FoodPhoto from '../../components/FoodPhoto';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';
import { Loading, ErrorView, Banner } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getDonation, cancelDonation } from '../../services/donationService';
import { getUser } from '../../services/authService';
import { initials } from '../../utils/format';
import { colors } from '../../constants/theme';

export default function DonationStatus() {
  const { id, created } = useLocalSearchParams<{ id: string; created?: string }>();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    created ? { type: 'success', text: 'Donation posted! Nearby volunteers have been notified.' } : null
  );

  const { data, loading, error, reload } = useData(async () => {
    const d = await getDonation(id);
    const [volunteer, receiver] = await Promise.all([getUser(d.volunteerId), getUser(d.receiverId)]);
    return { d, volunteer, receiver };
  }, [id]);

  const cancel = async () => {
    setBusy(true);
    try {
      await cancelDonation(id, user!);
      setMsg({ type: 'success', text: 'Donation cancelled.' });
      reload();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading && !data) return <Loading />;
  if (error || !data) return <ErrorView message={error ?? 'Not found'} onRetry={reload} />;

  const { d, volunteer, receiver } = data;
  const ended = ['Expired', 'Cancelled', 'Removed'].includes(d.status);

  return (
    <Screen>
      <Header title={`Donation #${d.id}`} back fallback="/donor/home" serif={false} />
      {msg ? <Banner type={msg.type} text={msg.text} /> : null}

      <Card style={styles.food}>
        <FoodPhoto uri={d.photo} type={d.type} size={84} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.foodName}>{d.food}</Text>
          <Text style={styles.meta}>
            {d.type} · {d.portions} portions
          </Text>
          <Text style={styles.meta}>
            Posted {d.postedAt} · Collect by {d.collectBy}
          </Text>
          <StatusBadge status={d.status} />
        </View>
      </Card>

      <Card style={{ padding: 18 }}>
        <Text style={styles.h2}>Journey</Text>
        {ended ? <Banner type="warning" text={`This donation was ${d.status.toLowerCase()}.`} /> : <StatusTimeline donation={d} />}
      </Card>

      {volunteer ? (
        <Card style={styles.person}>
          <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.avatarText, { color: colors.accentText }]}>{initials(volunteer.name)}</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.personName}>{volunteer.name}</Text>
            <Text style={styles.meta}>
              Volunteer · {volunteer.rating ?? '—'} rating · {volunteer.deliveries ?? 0} deliveries
            </Text>
          </View>
          <View style={styles.call}>
            <Ionicons name="call" size={18} color={colors.white} />
          </View>
        </Card>
      ) : null}

      {receiver ? (
        <Card style={styles.person}>
          <View style={[styles.avatar, { backgroundColor: colors.blueSoft, borderRadius: 14 }]}>
            <Ionicons name="home-outline" size={22} color={colors.blue} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.personName}>Going to: {receiver.name}</Text>
            <Text style={styles.meta}>{receiver.area}</Text>
          </View>
        </Card>
      ) : null}

      {d.status === 'Posted' ? <Button title="Cancel donation" variant="dangerOutline" onPress={cancel} loading={busy} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  food: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  foodName: { fontSize: 17, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
  h2: { fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 14 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '800' },
  personName: { fontSize: 15, fontWeight: '800', color: colors.ink },
  call: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});