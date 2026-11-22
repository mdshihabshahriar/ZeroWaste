// Active pickup — Member 1 (Mahir)
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Screen from '../../common/components/Screen';
import Header from '../../common/components/Header';
import Card from '../../common/components/Card';
import Button from '../../common/components/Button';
import StatusTimeline from '../../common/components/StatusTimeline';
import { Loading, ErrorView, EmptyView, Banner } from '../../common/components/StateViews';
import { useAuth } from '../../common/context/AuthContext';
import { useData } from '../../common/hooks/useData';
import { getActivePickup, markPickedUp, releasePickup } from '../volunteerService';
import { getUser } from '../../common/services/authService';
import { colors } from '../../common/constants/theme';

export default function ActivePickup() {
  const { accepted } = useLocalSearchParams<{ accepted?: string }>();
  const { user } = useAuth();
  const [busy, setBusy] = useState<'pick' | 'release' | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    accepted ? { type: 'success', text: 'Pickup accepted — it’s locked for you.' } : null
  );

  const { data, loading, error, reload } = useData(async () => {
    const d = await getActivePickup(user!.id);
    const receiver = d ? await getUser(d.receiverId) : null;
    return { d, receiver };
  }, [user?.id]);

  const run = async (kind: 'pick' | 'release') => {
    if (!data?.d) return;
    setBusy(kind);
    setMsg(null);
    try {
      if (kind === 'pick') {
        await markPickedUp(data.d.id, user!);
        setMsg({ type: 'success', text: 'Marked as picked up. The receiver will confirm on arrival.' });
      } else {
        await releasePickup(data.d.id, user!);
        setMsg({ type: 'success', text: 'Pickup released for other volunteers.' });
      }
      reload();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen tabs onRefresh={reload}>
      <Header title="My pickup" />
      {msg ? <Banner type={msg.type} text={msg.text} /> : null}

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !data?.d ? (
        <>
          <EmptyView title="No active pickup" subtitle="Accept a donation from the Nearby tab." icon="bicycle-outline" />
          <Button title="Find food nearby" onPress={() => router.push('/volunteer/nearby')} />
        </>
      ) : (
        <>
          <Card style={{ padding: 18 }}>
            <StatusTimeline donation={data.d} />
          </Card>

          <Card style={{ padding: 0 }}>
            <Stop letter="A" color={colors.accentSoft} fg={colors.accentText} label="Pick up from" title={data.d.donorName} meta={`${data.d.address} · ${data.d.distanceKm} km`} />
            <View style={{ height: 1, backgroundColor: colors.line }} />
            <Stop
              letter="B"
              color={colors.blueSoft}
              fg={colors.blue}
              label="Deliver to"
              title={data.receiver?.name ?? 'Waiting for a receiver request'}
              meta={data.receiver ? `${data.receiver.area} · ${data.d.portions} portions` : 'You will see the receiver here once they request it'}
            />
          </Card>

          <Text style={styles.deadline}>Collect by {data.d.collectBy}</Text>

          {data.d.status === 'Accepted' ? (
            <>
              <Button title="Mark as picked up" onPress={() => run('pick')} loading={busy === 'pick'} icon="checkmark-done-outline" />
              <Button title="Can’t make it — release pickup" variant="dangerOutline" onPress={() => run('release')} loading={busy === 'release'} />
            </>
          ) : (
            <Banner type="info" text="Food picked up. Waiting for the receiver to confirm delivery." />
          )}
        </>
      )}
    </Screen>
  );
}

function Stop({ letter, color, fg, label, title, meta }: { letter: string; color: string; fg: string; label: string; title: string; meta: string }) {
  return (
    <View style={styles.stop}>
      <View style={[styles.letter, { backgroundColor: color }]}>
        <Text style={[styles.letterText, { color: fg }]}>{letter}</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.stopLabel}>{label}</Text>
        <Text style={styles.stopTitle}>{title}</Text>
        <Text style={styles.stopMeta}>{meta}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stop: { flexDirection: 'row', gap: 12, padding: 14 },
  letter: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontSize: 14, fontWeight: '800' },
  stopLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  stopTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  stopMeta: { fontSize: 13, color: colors.muted },
  deadline: { fontSize: 14, fontWeight: '800', color: colors.accentText, textAlign: 'center' },
});
