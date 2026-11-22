import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';

// − value + control (portions etc.)
export default function Stepper({ value, onChange, min = 1, max = 999, suffix }: { value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string }) {
  return (
    <View style={styles.box}>
      <Pressable style={styles.btn} onPress={() => onChange(Math.max(min, value - 1))} accessibilityLabel="Decrease">
        <Text style={styles.sign}>−</Text>
      </Pressable>
      <Text style={styles.value}>
        {value}
        {suffix ? <Text style={styles.suffix}> {suffix}</Text> : null}
      </Text>
      <Pressable style={styles.btn} onPress={() => onChange(Math.min(max, value + 1))} accessibilityLabel="Increase">
        <Text style={styles.sign}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.sm + 2,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
  },
  btn: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F0F2EC', alignItems: 'center', justifyContent: 'center' },
  sign: { fontSize: 20, fontWeight: '800', color: colors.ink },
  value: { fontSize: 17, fontWeight: '800', color: colors.ink },
  suffix: { fontSize: 13, fontWeight: '600', color: colors.muted },
});
