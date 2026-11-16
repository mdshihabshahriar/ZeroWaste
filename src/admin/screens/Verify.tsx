
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../common/components/Button';
import Card from '../../common/components/Card';
import Chip from '../../common/components/Chip';
import Header from '../../common/components/Header';
import Screen from '../../common/components/Screen';
import { Banner, EmptyView, ErrorView, Loading } from '../../common/components/StateViews';
import { Tag } from '../../common/components/StatusBadge';
import { colors } from '../../common/constants/theme';
import { useAuth } from '../../common/context/AuthContext';
import { useData } from '../../common/hooks/useData';
import { initials } from '../../common/utils/format';
import { getUsersByStatus, verifyUser } from '../adminService';

export default function Verify() {
  const { user: admin } = useAuth();
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { data, loading, error, reload } = useData(() => getUsersByStatus(tab), [tab]);

  const act = async (id: string, name: string, approve: boolean) => {
    setBusy(id + approve);
    setMsg(null);
    try {
      await verifyUser(id, approve, admin!);
      setMsg({ type: 'success', text: `${name} was ${approve ? 'approved' : 'rejected'}.` });
      reload();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen tabs onRefresh={reload}>
      <Header eyebrow="Admin" title="Verify accounts" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="Pending" selected={tab === 'pending'} dark onPress={() => setTab('pending')} style={{ flex: 1 }} />
        <Chip label="Approved" selected={tab === 'approved'} dark onPress={() => setTab('approved')} style={{ flex: 1 }} />
      </View>
      {msg ? <Banner type={msg.type} text={msg.text} /> : null}

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyView title={tab === 'pending' ? 'All caught up' : 'No approved accounts'} subtitle={tab === 'pending' ? 'No accounts are waiting for verification.' : undefined} icon="shield-checkmark-outline" />
      ) : (
        data.map((u) => {
          const receiver = u.role === 'receiver';
          const bg = receiver ? colors.blueSoft : colors.accentSoft;
          const fg = receiver ? colors.blue : colors.accentText;
          return (
            <Card key={u.id} style={{ gap: 12 }}>
              <View style={styles.top}>
                <View style={[styles.avatar, { backgroundColor: bg }]}>
                  <Text style={[styles.avatarText, { color: fg }]}>{initials(u.name)}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.name}>{u.name}</Text>
                  <Text style={styles.meta}>
                    {u.orgType ?? 'Organisation'} · {u.area}
                    {u.appliedAt ? ` · ${u.appliedAt}` : ''}
                  </Text>
                </View>
                <Tag text={receiver ? 'Receiver' : 'Donor'} bg={bg} fg={fg} />
              </View>
              {u.docs?.length ? (
                <View style={styles.docs}>
                  {u.docs.map((doc) => (
                    <View key={doc} style={styles.doc}>
                      <Ionicons name="document-outline" size={14} color="#3A4640" />
                      <Text style={styles.docText}>{doc}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              {tab === 'pending' ? (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button title="Reject" variant="dangerOutline" small style={{ flex: 1 }} onPress={() => act(u.id, u.name, false)} loading={busy === u.id + false} />
                  <Button title="Approve" small style={{ flex: 1 }} onPress={() => act(u.id, u.name, true)} loading={busy === u.id + true} />
                </View>
              ) : null}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '800' },
  name: { fontSize: 15, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
  docs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  doc: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 34, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#F7F8F4' },
  docText: { fontSize: 12, fontWeight: '700', color: colors.ink },
});
