// Login — Member 1 (Mahir)
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Banner } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../services/authService';
import { colors, fonts } from '../constants/theme';

const DEMO = [
  { label: 'Donor', email: 'donor@frn.com' },
  { label: 'Volunteer', email: 'volunteer@frn.com' },
  { label: 'Receiver', email: 'receiver@frn.com' },
  { label: 'Admin', email: 'admin@frn.com' },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      router.replace(homeFor(user.role) as any);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="" back fallback="/" />
      <View style={{ gap: 6, marginTop: 8 }}>
        <Text style={styles.h1}>Welcome back</Text>
        <Text style={styles.p}>Log in to post, pick up or receive food.</Text>
      </View>

      {error ? <Banner type="error" text={error} /> : null}

      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="Your password" password />

      <Button title="Log in" onPress={submit} loading={loading} />

      <Card style={{ gap: 10 }}>
        <Text style={styles.demoTitle}>Demo accounts (password: 123456)</Text>
        <View style={styles.demoRow}>
          {DEMO.map((d) => (
            <Pressable
              key={d.email}
              style={styles.demoBtn}
              onPress={() => {
                setEmail(d.email);
                setPassword('123456');
              }}
            >
              <Text style={styles.demoText}>{d.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Text style={styles.bottom}>
        New here?{' '}
        <Text style={styles.link} onPress={() => router.replace('/signup')}>
          Create an account
        </Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: fonts.serif, fontSize: 30, fontWeight: '600', color: colors.ink },
  p: { fontSize: 15, color: colors.muted },
  demoTitle: { fontSize: 13, fontWeight: '700', color: colors.muted },
  demoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  demoBtn: { minHeight: 38, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.primarySoft, justifyContent: 'center' },
  demoText: { fontSize: 13, fontWeight: '800', color: colors.primaryDark },
  bottom: { textAlign: 'center', fontSize: 15, color: colors.muted, marginTop: 8 },
  link: { color: colors.primary, fontWeight: '800' },
});
