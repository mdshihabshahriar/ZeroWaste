import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'dangerOutline' | 'ghost' | 'light';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  small?: boolean;
  style?: ViewStyle;
}

const V: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  secondary: { bg: colors.surface, fg: colors.ink, border: colors.border },
  danger: { bg: colors.danger, fg: colors.white },
  dangerOutline: { bg: colors.surface, fg: colors.danger, border: '#E0B8B2' },
  ghost: { bg: 'transparent', fg: colors.primary },
  light: { bg: 'rgba(255,255,255,0.08)', fg: colors.white, border: 'rgba(255,255,255,0.18)' },
};

export default function Button({ title, onPress, variant = 'primary', loading, disabled, icon, small, style }: Props) {
  const v = V[variant];
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        { backgroundColor: v.bg, borderColor: v.border ?? 'transparent', borderWidth: v.border ? 1 : 0 },
        variant === 'primary' && styles.glow,
        off && { opacity: 0.55 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={small ? 16 : 18} color={v.fg} /> : null}
          <Text style={[styles.text, small && { fontSize: 14 }, { color: v.fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderRadius: radius.md + 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  small: { height: 44, borderRadius: radius.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 16, fontWeight: '700' },
  glow: { shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
});