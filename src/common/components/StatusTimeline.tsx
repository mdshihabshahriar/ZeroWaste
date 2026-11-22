import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Donation } from '../data/types';
import { colors } from '../constants/theme';

const STEPS = [
  { status: 'Posted', hint: 'Nearby volunteers notified' },
  { status: 'Accepted', hint: 'Post locked for others' },
  { status: 'Picked up', hint: 'On the way to receiver' },
  { status: 'Delivered', hint: 'Receiver confirms on arrival' },
] as const;

export default function StatusTimeline({ donation }: { donation: Donation }) {
  const timeOf = (s: string) => donation.history.find((h) => h.status === s)?.time;
  const currentIndex = STEPS.findIndex((s) => s.status === donation.status);

  return (
    <View>
      {STEPS.map((step, i) => {
        const time = timeOf(step.status);
        const done = !!time && i < currentIndex;
        const current = i === currentIndex;
        const last = i === STEPS.length - 1;
        return (
          <View key={step.status} style={styles.row}>
            <View style={styles.rail}>
              {done || (current && step.status === 'Delivered') ? (
                <View style={[styles.dot, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={15} color={colors.white} />
                </View>
              ) : current ? (
                <View style={[styles.dot, styles.current]}>
                  <View style={styles.inner} />
                </View>
              ) : (
                <View style={[styles.dot, styles.todo]} />
              )}
              {!last ? <View style={[styles.line, { backgroundColor: done ? colors.primary : '#D5DAD0' }]} /> : null}
            </View>
            <View style={[styles.text, !last && { paddingBottom: 16 }]}>
              <Text style={[styles.title, !time && { color: colors.muted, fontWeight: '700' }]}>{step.status}</Text>
              <Text style={styles.hint}>{time ? `${time} · ${step.hint}` : step.hint}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14 },
  rail: { alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  current: { borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.white },
  inner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  todo: { borderWidth: 2, borderColor: '#C4CABF', backgroundColor: colors.white },
  line: { width: 2, flex: 1, minHeight: 18 },
  text: { flex: 1, gap: 2, paddingTop: 3 },
  title: { fontSize: 15, fontWeight: '800', color: colors.ink },
  hint: { fontSize: 13, color: colors.muted },
});
