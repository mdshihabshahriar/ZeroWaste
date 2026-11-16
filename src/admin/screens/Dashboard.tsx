
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Card from '../../common/components/Card';
import Screen from '../../common/components/Screen';
import { ErrorView, Loading } from '../../common/components/StateViews';
import { colors, fonts } from '../../common/constants/theme';
import { useData } from '../../common/hooks/useData';
import { getStats } from '../adminService';

const STATUS_COLORS: Record<string, string> = {
  Posted: '#2B5CAB',
  Accepted: '#C9962C',
  'Picked up': '#6A3FA0',
  Delivered: colors.primary,
  Expired: '#A3AAA0',
};

export default function Dashboard() {
  const { data, loading, error, reload } = useData(getStats, []);

  return (
    <Screen tabs onRefresh={reload} style={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>ADMIN</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={styles.hIcon} onPress={() => router.push('/admin/notifications')} accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={20} color={colors.white} />
            </Pressable>
            <Pressable style={styles.hIcon} onPress={() => router.push('/admin/profile')} accessibilityLabel="Profile">
              <Ionicons name="person-outline" size={20} color={colors.white} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.h1}>Platform overview</Text>
        <Text style={styles.sub}>Dhaka · live from saved data</Text>
      </View>

      <View style={styles.body}>
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : data ? (
          <>
            <View style={styles.grid}>
              <Kpi label="Meals saved" value={data.mealsSaved.toLocaleString()} note="from delivered posts" />
              <Kpi label="Volunteers" value={String(data.volunteers)} note="registered" />
              <Kpi label="Pending verifications" value={String(data.pending)} note="Review →" warm onPress={() => router.push('/admin/verify')} />
              <Kpi label="Flagged posts" value={String(data.flagged)} note="Moderate →" danger onPress={() => router.push('/admin/moderate')} />
            </View>

            <Card style={{ gap: 12 }}>
              <Text style={styles.h2}>Meals delivered, last 7 days</Text>
              <View style={styles.chart} accessibilityLabel="Bar chart of meals delivered per day">
                {data.week.map((w, i) => {
                  const max = Math.max(...data.week.map((x) => x.meals));
                  return (
                    <View key={w.day} style={styles.barCol}>
                      <View style={[styles.bar, { height: (w.meals / max) * 90, backgroundColor: i === data.week.length - 1 ? colors.primary : '#A9CDB7' }]} />
                      <Text style={styles.barLabel}>{w.day}</Text>
                    </View>
                  );
                })}
              </View>
            </Card>

            <Card style={{ gap: 10 }}>
              <Text style={styles.h2}>Donations by status</Text>
              <View style={styles.stack}>
                {data.byStatus
                  .filter((s) => s.value > 0)
                  .map((s) => (
                    <View key={s.label} style={{ flex: s.value, backgroundColor: STATUS_COLORS[s.label] }} />
                  ))}
              </View>
              <View style={styles.legend}>
                {data.byStatus.map((s) => (
                  <View key={s.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[s.label] }]} />
                    <Text style={styles.legendText}>
                      {s.label} {s.value}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

function Kpi({ label, value, note, warm, danger, onPress }: { label: string; value: string; note: string; warm?: boolean; danger?: boolean; onPress?: () => void }) {
  const bg = warm ? '#FFF5E6' : danger ? colors.dangerSoft : colors.surface;
  const fg = warm ? '#6B4A12' : danger ? '#8E2E24' : colors.ink;
  return (
    <Card onPress={onPress} style={{ width: '48%', backgroundColor: bg, gap: 4 }}>
      <Text style={[styles.kLabel, { color: warm || danger ? fg : colors.muted }]}>{label}</Text>
      <Text style={[styles.kValue, { color: fg }]}>{value}</Text>
      <Text style={[styles.kNote, { color: warm || danger ? fg : colors.primary }]}>{note}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.dark, paddingHorizontal: 20, paddingTop: 64, paddingBottom: 64, gap: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#9FD3B4' },
  hIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#26322B', alignItems: 'center', justifyContent: 'center' },
  h1: { fontFamily: fonts.serif, fontSize: 26, fontWeight: '600', color: colors.white },
  sub: { fontSize: 13, color: '#C3CCC6' },
  body: { marginTop: -48, paddingHorizontal: 20, gap: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  kLabel: { fontSize: 12, fontWeight: '700' },
  kValue: { fontSize: 26, fontWeight: '800' },
  kNote: { fontSize: 12, fontWeight: '800' },
  h2: { fontSize: 15, fontWeight: '800', color: colors.ink },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 112 },
  barCol: { flex: 1, alignItems: 'center', gap: 6, justifyContent: 'flex-end', height: '100%' },
  bar: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  barLabel: { fontSize: 11, fontWeight: '700', color: colors.muted },
  stack: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, fontWeight: '700', color: '#3A4640' },
});
