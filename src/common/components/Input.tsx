import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
  hint?: string;
  password?: boolean;
}

export default function Input({ label, error, hint, password, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, { borderColor }]}>
        <TextInput
          placeholderTextColor="#8C958F"
          secureTextEntry={password && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, style]}
          accessibilityLabel={label}
          {...rest}
        />
        {password ? (
          <Pressable onPress={() => setHidden(!hidden)} style={styles.eye} accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink },
  box: { flexDirection: 'row', alignItems: 'center', minHeight: 52, borderRadius: radius.sm + 2, borderWidth: 1.5, backgroundColor: colors.surface },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: colors.ink },
  eye: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  error: { fontSize: 13, color: colors.danger, fontWeight: '600' },
  hint: { fontSize: 13, color: colors.muted },
});
