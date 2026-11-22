import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  dark?: boolean; // selected style uses dark ink instead of green
  style?: ViewStyle;
}

export default function Chip({ label, selected, onPress, dark, style }: Props) {
  const activeBg = dark ? colors.ink : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected ? { backgroundColor: activeBg, borderColor: activeBg } : null, style]}
    >
      <Text style={[styles.text, selected && { color: colors.white, fontWeight: '800' }]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 13, fontWeight: '700', color: '#3A4640' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
