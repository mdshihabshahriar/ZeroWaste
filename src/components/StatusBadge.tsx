import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { statusColors, colors } from '../constants/theme';

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const c = statusColors[status] ?? { bg: colors.graySoft, fg: colors.gray };
  return <Text style={[styles.badge, { backgroundColor: c.bg, color: c.fg }]}>{label ?? status}</Text>;
}

export function Tag({ text, bg = colors.graySoft, fg = '#3A4640' }: { text: string; bg?: string; fg?: string }) {
  return <Text style={[styles.badge, { backgroundColor: bg, color: fg }]}>{text}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
});