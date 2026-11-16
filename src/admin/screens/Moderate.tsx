
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../common/components/Button';
import Card from '../../common/components/Card';
import Chip, { ChipRow } from '../../common/components/Chip';
import FoodPhoto from '../../common/components/FoodPhoto';
import Header from '../../common/components/Header';
import Screen from '../../common/components/Screen';
import { Banner, EmptyView, ErrorView, Loading } from '../../common/components/StateViews';
import { Tag } from '../../common/components/StatusBadge';
import { colors } from '../../common/constants/theme';
import { useAuth } from '../../common/context/AuthContext';
import { useData } from '../../common/hooks/useData';
import { getRemovedPosts, getReportedPosts, keepPost, removePost } from '../adminService';

export default function Moderate() {
  const { user: admin } = useAuth();
  const [tab, setTab] = useState<'flagged' | 'removed'>('flagged');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { data, loading, error, reload } = useData(() => (tab === 'flagged' ? getReportedPosts() : getRemovedPosts()), [tab]);

  const act = async (id: string, remove: boolean) => {
    setBusy(id + remove);
    setMsg(null);
    try {
      if (remove) await removePost(id, admin!);
      else await keepPost(id, admin!);
      setMsg({ type: 'success', text: remove ? `Post #${id} removed.` : `Post #${id} kept and reports cleared.` });
      setConfirmId(null);
      reload();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen tabs onRefresh={reload}>
      <Header eyebrow="Admin" title="Flagged posts" />
      <ChipRow>
        <Chip label="Flagged" selected={tab === 'flagged'} dark onPress={() => setTab('flagged')} />
        <Chip label="Removed" selected={tab === 'removed'} dark onPress={() => setTab('removed')} />
      </ChipRow>
      {msg ? <Banner type={msg.type} text={msg.text} /> : null}

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyView title={tab === 'flagged' ? 'No reported posts' : 'Nothing removed yet'} icon="flag-outline" />
      ) : (
        data.map((d) => (
          <Card key={d.id} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <FoodPhoto uri={d.photo} type={d.type} size={60} radius={12} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.food}>{d.food}</Text>
                <Text style={styles.meta}>
                  {d.donorName} · {d.area} · {d.postedAt}
                </Text>
              </View>
            </View>
            <View style={styles.tags}>
              {d.flagReason ? <Tag text={d.flagReason} bg={colors.dangerSoft} fg="#8E2E24" /> : null}
              {d.reports ? <Tag text={`${d.reports} report${d.reports > 1 ? 's' : ''}`} /> : null}
              {!d.photo ? <Tag text="No photo" /> : null}
              {tab === 'removed' ? <Tag text="Removed" bg={colors.dangerSoft} fg="#8E2E24" /> : null}
            </View>

            {tab === 'flagged' ? (
              confirmId === d.id ? (
                <View style={styles.confirm}>
                  <Text style={styles.confirmText}>Remove this post and warn the user?</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button title="Cancel" variant="secondary" small style={{ flex: 1 }} onPress={() => setConfirmId(null)} />
                    <Button title="Remove" variant="danger" small style={{ flex: 1 }} onPress={() => act(d.id, true)} loading={busy === d.id + true} />
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button title="Keep post" variant="secondary" small style={{ flex: 1 }} onPress={() => act(d.id, false)} loading={busy === d.id + false} />
                  <Button title="Remove" variant="dangerOutline" small style={{ flex: 1 }} onPress={() => setConfirmId(d.id)} />
                </View>
              )
            ) : null}
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  food: { fontSize: 15, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  confirm: { gap: 10, padding: 12, borderRadius: 14, backgroundColor: colors.dangerSoft },
  confirmText: { fontSize: 14, fontWeight: '800', color: '#6E2219' },
});
