import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import { Tag } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getDonations } from '../services/donationStore';
import { resetAllData } from '../services/storage';
import { initials } from '../utils/format';
import { colors } from '../constants/theme';

export default function Profile() {
  const { user, logout, refresh } = useAuth();
  const [alerts, setAlerts] = useState(true);
  const [stats, setStats] = useState<{ a: number; b: number; c: string }>({ a: 0, b: 0, c: '—' });

  useFocusEffect(
    useCallback(() => {
      refresh();
      getDonations().then((list) => {
        if (!user) return;
        if (user.role === 'volunteer') {
          const mine = list.filter((d) => d.volunteerId === user.id && d.status === 'Delivered');
          setStats({ a: mine.length, b: mine.reduce((s, d) => s + d.portions, 0), c: String(user.rating ?? '—') });
        } else if (user.role === 'donor') {
          const mine = list.filter((d) => d.donorId === user.id);
          const del = mine.filter((d) => d.status === 'Delivered');
          setStats({ a: mine.length, b: del.reduce((s, d) => s + d.portions, 0), c: String(del.length) });
        } else if (user.role === 'receiver') {
          const mine = list.filter((d) => d.receiverId === user.id && d.status === 'Delivered');
          setStats({ a: mine.length, b: mine.reduce((s, d) => s + d.portions, 0), c: '—' });
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])
  );

  if (!user) return null;

  const labels =
    user.role === 'volunteer'
      ? ['Deliveries', 'Meals rescued', 'Rating']
      : user.role === 'donor'
        ? ['Donations', 'Meals donated', 'Delivered']
        : ['Received', 'Meals received', '—'];

  const doLogout = async () => {
    await logout();
    router.replace('/');
  };

  const reset = async () => {
    await resetAllData();
    await logout();
    router.replace('/');
  };

  // Alert with buttons does nothing on web, so use the browser confirm there
  const doReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset demo data?\nAll posts and changes will go back to the original dummy data.')) reset();
      return;
    }
    Alert.alert('Reset demo data?', 'All posts and changes will go back to the original dummy data.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <Screen tabs>
      <Header title="Profile" />

      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user.name)}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.meta}>
            {user.area} · {user.phone}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 2 }}>
            <Tag text={user.role ? user.role[0].toUpperCase() + user.role.slice(1) : 'No role'} bg={colors.primarySoft} fg={colors.primaryDark} />
            <Tag text={user.verified ? 'Verified' : 'Pending verification'} bg={user.verified ? colors.blueSoft : colors.amberSoft} fg={user.verified ? colors.blue : colors.amber} />
          </View>
        </View>
      </Card>

      {user.role !== 'admin' ? (
        <View style={styles.stats}>
          {[stats.a, stats.b, stats.c].map((v, i) => (
            <Card key={i} style={styles.stat}>
              <Text style={styles.statNum}>{v}</Text>
              <Text style={styles.statLabel}>{labels[i]}</Text>
            </Card>
          ))}
        </View>
      ) : null}

      <Card style={{ padding: 0 }}>
        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={20} color="#3A4640" />
          <Text style={styles.rowTitle}>Push notifications</Text>
          <Switch value={alerts} onValueChange={setAlerts} trackColor={{ true: colors.primary }} />
        </View>
        {user.role === 'volunteer' ? <Row icon="location-outline" title="Pickup radius" value="5 km" /> : null}
        <Row icon="refresh-outline" title="Reset demo data" onPress={doReset} />
        <Pressable style={[styles.row, { borderBottomWidth: 0 }]} onPress={doLogout} accessibilityRole="button">
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.rowTitle, { color: colors.danger, fontWeight: '700' }]}>Log out</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

function Row({ icon, title, value, onPress }: { icon: any; title: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <Ionicons name={icon} size={20} color="#3A4640" />
      <Text style={styles.rowTitle}>{title}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  userCard: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 18 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#CFE5D7', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '800', color: colors.primaryDark },
  name: { fontSize: 18, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.ink },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, minHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.muted },
});