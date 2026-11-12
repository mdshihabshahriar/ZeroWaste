import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import FoodPhoto from './FoodPhoto';
import StatusBadge from './StatusBadge';
import { Donation } from '../data/types';
import { colors } from '../constants/theme';

interface Props {
  donation: Donation;
  onPress?: () => void;
  subtitle?: string;
  footer?: string; 
  right?: ReactNode; 
  showDistance?: boolean;
}

export default function DonationCard({ donation: d, onPress, subtitle, footer, right, showDistance }: Props) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <FoodPhoto uri={d.photo} type={d.type} size={68} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.food} numberOfLines={1}>
            {d.food}
          </Text>
          {showDistance ? <Text style={styles.dist}>{d.distanceKm} km</Text> : null}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {subtitle ?? `${d.portions} portions · ${d.donorName}`}
        </Text>
        {footer ? (
          <View style={styles.footer}>
            <Ionicons name="time-outline" size={14} color={colors.accentText} />
            <Text style={styles.footerText}>{footer}</Text>
          </View>
        ) : null}
        {!right ? <View style={{ marginTop: 4 }}><StatusBadge status={d.status} /></View> : null}
      </View>
      {right}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12 },
  body: { flex: 1, gap: 3, minWidth: 0 },
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  food: { flex: 1, fontSize: 15, fontWeight: '800', color: colors.ink },
  dist: { fontSize: 14, fontWeight: '800', color: colors.primary },
  meta: { fontSize: 13, color: colors.muted },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, fontWeight: '700', color: colors.accentText },
});