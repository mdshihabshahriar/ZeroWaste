
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Card from '../../common/components/Card';
import Chip, { ChipRow } from '../../common/components/Chip';
import Header from '../../common/components/Header';
import Screen from '../../common/components/Screen';
import { EmptyView, ErrorView, Loading } from '../../common/components/StateViews';
import { colors } from '../../common/constants/theme';
import { AuditLog } from '../../common/data/types';
import { useData } from '../../common/hooks/useData';
import { getLogs } from '../adminService';

const FILTERS: { label: string; kind: AuditLog['kind'] | 'all' }[] = [
  { label: 'All', kind: 'all' },
  { label: 'Status', kind: 'status' },
  { label: 'Posts', kind: 'post' },
  { label: 'Admin', kind: 'admin' },
  { label: 'Auth', kind: 'auth' },
];

const DOT: Record<AuditLog['kind'], string> = {
  status: colors.primary,
  admin: colors.danger,
  auth: '#2B5CAB',
  post: colors.accent,
};

export default function AuditLogs() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<AuditLog['kind'] | 'all'>('all');
  const { data, loading, error, reload } = useData(getLogs, []);

  const list = (data ?? []).filter((l) => {
    if (kind !== 'all' && l.kind !== kind) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return l.actor.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || l.ref.toLowerCase().includes(s);
  });

  return (
    <Screen tabs onRefresh={reload}>
      <Header eyebrow="Admin" title="Audit logs" />

      <View style={styles.search}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search by user or donation ID…" placeholderTextColor="#8C958F" style={styles.input} autoCapitalize="none" accessibilityLabel="Search logs" />
      </View>

      <ChipRow>
        {FILTERS.map((f) => (
          <Chip key={f.kind} label={f.label} selected={kind === f.kind} dark onPress={() => setKind(f.kind)} />
        ))}
      </ChipRow>

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !list.length ? (
        <EmptyView title="No logs found" icon="document-text-outline" />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {list.map((l, i) => (
            <View key={l.id} style={[styles.row, i < list.length - 1 && styles.border]}>
              <View style={[styles.dot, { backgroundColor: DOT[l.kind] }]} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: '800' }}>{l.actor}</Text> {l.action}
                </Text>
                <Text style={styles.meta}>
                  {l.ref} · {l.time}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, fontSize: 15, color: colors.ink },
  row: { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: colors.line },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  text: { fontSize: 14, lineHeight: 20, color: colors.ink },
  meta: { fontSize: 12, color: colors.muted },
});
