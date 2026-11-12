import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors } from '../constants/theme';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <View style={[styles.icon, { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? <Button title="Try again" onPress={onRetry} variant="secondary" small style={{ marginTop: 8, paddingHorizontal: 24 }} /> : null}
    </View>
  );
}

export function EmptyView({ title, subtitle, icon = 'leaf-outline' }: { title: string; subtitle?: string; icon?: any }) {
  return (
    <View style={styles.center}>
      <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.muted}>{subtitle}</Text> : null}
    </View>
  );
}

// Success / error message box inside a screen
export function Banner({ text, type = 'info' }: { text: string; type?: 'info' | 'success' | 'error' | 'warning' }) {
  const c = {
    info: { bg: colors.blueSoft, fg: colors.blue, icon: 'information-circle-outline' },
    success: { bg: colors.primary, fg: colors.white, icon: 'checkmark-circle-outline' },
    error: { bg: colors.dangerSoft, fg: '#8E2E24', icon: 'alert-circle-outline' },
    warning: { bg: colors.amberSoft, fg: '#6B4A12', icon: 'time-outline' },
  }[type];
  return (
    <View style={[styles.banner, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon as any} size={19} color={c.fg} />
      <Text style={[styles.bannerText, { color: c.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 8, paddingHorizontal: 20 },
  icon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  muted: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  banner: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, alignItems: 'flex-start' },
  bannerText: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
});