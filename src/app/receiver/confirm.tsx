// Receiver: incoming food & confirm receipt — Member 3 (Monami)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import DonationCard from '../../components/DonationCard';
import { Loading, ErrorView, EmptyView, Banner } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getIncoming, confirmReceipt } from '../../services/pickupService';
import { Donation } from '../../data/types';
import { colors } from '../../constants/theme';

const CONDITIONS = ['Good', 'Okay', 'Spoiled'] as const;

export default function Confirm() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useData(() => getIncoming(user!.id), [user?.id]);
  const [selected, setSelected] = useState<Donation | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  return (
    <Screen tabs onRefresh={reload}>
      <Header title={selected ? 'Confirm delivery' : 'My requests'} />
      {msg ? <Banner type={msg.type} text={msg.text} /> : null}

      {selected ? (
        <ConfirmForm
          donation={selected}
          onCancel={() => setSelected(null)}
          onDone={(text) => {
            setSelected(null);
            setMsg({ type: 'success', text });
            reload();
          }}
          onError={(text) => setMsg({ type: 'error', text })}
          user={user!}
        />
      ) : loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyView title="Nothing on the way" subtitle="Request food from the Browse tab." icon="receipt-outline" />
      ) : (
        data.map((d) => (
          <View key={d.id} style={{ gap: 8 }}>
            <DonationCard donation={d} subtitle={`${d.portions} portions · ${d.donorName}`} />
            {d.status === 'Picked up' ? (
              <Button title="Volunteer arrived — confirm" icon="checkmark-circle-outline" onPress={() => { setMsg(null); setSelected(d); }} />
            ) : (
              <Text style={styles.wait}>Waiting for the volunteer to pick up the food.</Text>
            )}
          </View>
        ))
      )}
    </Screen>
  );
}

function ConfirmForm({ donation, user, onCancel, onDone, onError }: any) {
  const d: Donation = donation;
  const [portions, setPortions] = useState(d.portions);
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>('Good');
  const [vRating, setVRating] = useState(5);
  const [dRating, setDRating] = useState(5);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => setPortions(d.portions), [d.id]);

  const submit = async () => {
    setBusy(true);
    try {
      await confirmReceipt(d.id, user, { portionsReceived: portions, condition, volunteerRating: vRating, donorRating: dRating, note });
      onDone(`Thank you! ${portions} portions of ${d.food.toLowerCase()} marked as received.`);
    } catch (e: any) {
      onError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <View style={styles.arrived}>
        <Ionicons name="bicycle" size={26} color={colors.white} />
        <View style={{ flex: 1 }}>
          <Text style={styles.arrivedTitle}>Volunteer has arrived</Text>
          <Text style={styles.arrivedText}>
            {d.food} · {d.portions} portions from {d.donorName}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>Portions received</Text>
      <Stepper value={portions} onChange={setPortions} min={0} max={d.portions} suffix={`of ${d.portions}`} />

      <Text style={styles.label}>Food condition</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {CONDITIONS.map((c) => (
          <Chip key={c} label={c} selected={condition === c} onPress={() => setCondition(c)} style={{ flex: 1 }} />
        ))}
      </View>

      <Card style={{ gap: 12 }}>
        <Stars label="Rate volunteer" value={vRating} onChange={setVRating} />
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <Stars label="Rate donor" value={dRating} onChange={setDRating} />
      </Card>

      <Input label="Note (optional)" value={note} onChangeText={setNote} placeholder="Thank the donor or report an issue" multiline />

      <Button title="Confirm food received" onPress={submit} loading={busy} />
      <Button title="Back" variant="ghost" onPress={onCancel} />
    </>
  );
}

function Stars({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.stars}>
      <Text style={styles.starLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => onChange(n)} accessibilityLabel={`${n} stars`} hitSlop={4}>
            <Ionicons name={n <= value ? 'star' : 'star-outline'} size={26} color={n <= value ? colors.gold : '#B8BFB3'} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wait: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  arrived: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 16, borderRadius: 20, backgroundColor: colors.primary },
  arrivedTitle: { fontSize: 16, fontWeight: '800', color: colors.white },
  arrivedText: { fontSize: 13, color: '#D9EBE0' },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: -6 },
  stars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  starLabel: { fontSize: 14, fontWeight: '700', color: colors.ink },
});