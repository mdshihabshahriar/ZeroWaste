import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, fonts, shadow } from '../constants/theme';

interface Props {
  title: string;
  eyebrow?: string; // small text above the title
  back?: boolean;
  fallback?: string; // where "back" goes if there is no history
  right?: ReactNode;
  serif?: boolean;
}

export default function Header({ title, eyebrow, back, fallback = '/', right, serif = true }: Props) {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace(fallback as any));

  return (
    <View style={styles.row}>
      {back ? (
        <Pressable onPress={goBack} style={styles.icon} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={[styles.title, serif && { fontFamily: fonts.serif, fontWeight: '600' }, back && { fontSize: 21 }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

export function IconButton({ name, onPress, label, badge }: { name: any; onPress: () => void; label: string; badge?: boolean }) {
  return (
    <Pressable onPress={onPress} style={styles.icon} accessibilityRole="button" accessibilityLabel={label}>
      <Ionicons name={name} size={21} color={colors.ink} />
      {badge ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', color: colors.muted, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: '800', color: colors.ink },
  dot: { position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.surface },
});
