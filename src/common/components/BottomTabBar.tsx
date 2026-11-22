import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { colors } from '../constants/theme';

export interface TabItem {
  name: string; // route file name inside the role folder, e.g. "home"
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Dark floating tab bar from the design. Only the listed tabs are shown,
// so detail screens (status, confirm ...) stay hidden.
// It reads the current URL and navigates with full hrefs (e.g. "/donor/history"),
// so it does not depend on the navigator's internal state (Expo Router 58).
export default function BottomTabBar({ base, items, hideOn = [] }: { base: string; items: TabItem[]; hideOn?: string[] }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  // "/donor/history" -> "history"; "/donor" -> first tab
  const rest = pathname.startsWith(base) ? pathname.slice(base.length).replace(/^\/+/, '') : '';
  const current = rest.split('/')[0] || items[0]?.name;

  // Full-screen forms (with their own bottom button) hide the tab bar
  if (hideOn.includes(current)) return null;

  return (
    <View style={[styles.bar, { bottom: Math.max(insets.bottom, 12) }]}>
      {items.map((item) => {
        const active = current === item.name;
        return (
          <Pressable
            key={item.name}
            onPress={() => router.navigate(`${base}/${item.name}` as any)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            style={[styles.item, active && styles.active]}
          >
            <Ionicons name={item.icon} size={22} color={active ? colors.white : colors.darkMuted} />
            <Text style={[styles.label, { color: active ? colors.white : colors.darkMuted }, active && { fontWeight: '800' }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 68,
    padding: 6,
    gap: 4,
    borderRadius: 26,
    backgroundColor: colors.dark,
    flexDirection: 'row',
    shadowColor: colors.dark,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 20 },
  active: { backgroundColor: colors.tabActive },
  label: { fontSize: 11, fontWeight: '700' },
});