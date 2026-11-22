// Sign up — Member 1 (Mahir)
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { Banner } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../constants/theme';

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-4
}

export default function SignUp() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });
  const s = strength(form.password);
  const sLabel = ['Too short', 'Weak', 'Medium', 'Strong', 'Very strong'][s];

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!/^\d{10,11}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid phone number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (form.password.length < 6) e.password = 'Use at least 6 characters.';
    setErrors(e);
    setError(null);
    if (Object.keys(e).length) return;
    if (!agree) {
      setError('Please accept the terms and food safety guidelines.');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      router.replace('/role-select');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.progressRow}>
        <View style={{ flex: 1 }}>
          <Header title="" back fallback="/" />
        </View>
        <View style={styles.bars}>
          <View style={[styles.bar, { backgroundColor: colors.primary }]} />
          <View style={styles.bar} />
        </View>
        <Text style={styles.step}>Step 1 of 2</Text>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={styles.h1}>Create your account</Text>
        <Text style={styles.p}>You will choose your role on the next step.</Text>
      </View>

      {error ? <Banner type="error" text={error} /> : null}

      <Input label="Full name" value={form.name} onChangeText={set('name')} placeholder="Your name or organisation" error={errors.name} />
      <Input label="Phone number" value={form.phone} onChangeText={set('phone')} placeholder="01XXXXXXXXX" keyboardType="phone-pad" error={errors.phone} />
      <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
      <View style={{ gap: 6 }}>
        <Input label="Password" value={form.password} onChangeText={set('password')} placeholder="At least 6 characters" password error={errors.password} />
        {form.password ? (
          <>
            <View style={styles.meter}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={[styles.meterBar, i < s && { backgroundColor: s >= 3 ? colors.primary : colors.accent }]} />
              ))}
            </View>
            <Text style={styles.hint}>{sLabel}</Text>
          </>
        ) : null}
      </View>

      <Pressable style={styles.agree} onPress={() => setAgree(!agree)} accessibilityRole="checkbox" accessibilityState={{ checked: agree }}>
        <View style={[styles.box, agree && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          {agree ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
        </View>
        <Text style={styles.agreeText}>
          I agree to the <Text style={styles.link}>Terms</Text> and the <Text style={styles.link}>Food Safety Guidelines</Text>.
        </Text>
      </Pressable>

      <Button title="Continue" onPress={submit} loading={loading} />
      <Text style={styles.bottom}>
        Already registered?{' '}
        <Text style={styles.link} onPress={() => router.replace('/login')}>
          Log in
        </Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bars: { flexDirection: 'row', gap: 6, width: 120 },
  bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#D5DAD0' },
  step: { fontSize: 13, fontWeight: '700', color: colors.muted },
  h1: { fontFamily: fonts.serif, fontSize: 28, fontWeight: '600', color: colors.ink },
  p: { fontSize: 15, color: colors.muted },
  meter: { flexDirection: 'row', gap: 4 },
  meterBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#D5DAD0' },
  hint: { fontSize: 13, color: colors.muted },
  agree: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', minHeight: 44 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#B8BFB3', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  agreeText: { flex: 1, fontSize: 14, color: '#3A4640', lineHeight: 20 },
  link: { color: colors.primary, fontWeight: '800' },
  bottom: { textAlign: 'center', fontSize: 15, color: colors.muted },
});
