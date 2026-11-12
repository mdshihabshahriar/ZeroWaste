// Create food post — Member 2 (Shihab)
// Uses two device APIs: image picker (camera / gallery) and location.
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Chip, { ChipRow } from '../../components/Chip';
import Stepper from '../../components/Stepper';
import Card from '../../components/Card';
import { Banner } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { createDonation } from '../../services/donationService';
import { FoodType } from '../../data/types';
import { addHours, formatTime } from '../../utils/format';
import { colors } from '../../constants/theme';

const TYPES: FoodType[] = ['Veg', 'Non-veg', 'Dry food', 'Dessert'];
const HOURS = [1, 3, 6];

export default function CreatePost() {
  const { user } = useAuth();
  const [photo, setPhoto] = useState<string | null>(null);
  const [food, setFood] = useState('');
  const [type, setType] = useState<FoodType>('Non-veg');
  const [portions, setPortions] = useState(10);
  const [hours, setHours] = useState(3);
  const [address, setAddress] = useState(user?.area ?? '');
  const [locLoading, setLocLoading] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickPhoto = async (camera: boolean) => {
    setError(null);
    try {
      const perm = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setError('Permission was denied. You can still post without a photo.');
        return;
      }
      const res = camera
        ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
      if (!res.canceled) setPhoto(res.assets[0].uri);
    } catch {
      setError('Could not open the camera or gallery.');
    }
  };

  const useMyLocation = async () => {
    setLocLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission was denied.');
      const pos = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(pos.coords);
      const text = place
        ? [place.name, place.street, place.district ?? place.city].filter(Boolean).join(', ')
        : `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
      setAddress(text);
    } catch (e: any) {
      setError(e.message ?? 'Could not get your location.');
    } finally {
      setLocLoading(false);
    }
  };

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const d = await createDonation(
        { food, type, portions, cookedAt: formatTime(), collectWithinHours: hours, address, photo, note: note.trim() || undefined },
        user!
      );
      // reset form for next time
      setFood('');
      setPhoto(null);
      setNote('');
      router.push({ pathname: '/donor/status', params: { id: d.id, created: '1' } });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      footer={<Button title="Post donation" onPress={submit} loading={loading} disabled={!user?.verified} />}
    >
      <Header title="Post surplus food" back fallback="/donor/home" />

      {!user?.verified ? <Banner type="warning" text="Your account is waiting for admin verification." /> : null}
      {error ? <Banner type="error" text={error} /> : null}

      <View style={styles.photoRow}>
        {photo ? (
          <View>
            <Image source={{ uri: photo }} style={styles.photo} />
            <Pressable style={styles.remove} onPress={() => setPhoto(null)} accessibilityLabel="Remove photo">
              <Ionicons name="close" size={14} color={colors.white} />
            </Pressable>
          </View>
        ) : null}
        <Pressable style={styles.addPhoto} onPress={() => pickPhoto(true)} accessibilityRole="button">
          <Ionicons name="camera-outline" size={24} color={colors.primary} />
          <Text style={styles.addText}>Camera</Text>
        </Pressable>
        <Pressable style={styles.addPhoto} onPress={() => pickPhoto(false)} accessibilityRole="button">
          <Ionicons name="images-outline" size={24} color={colors.primary} />
          <Text style={styles.addText}>Gallery</Text>
        </Pressable>
      </View>

      <Input label="What food is it?" value={food} onChangeText={setFood} placeholder="e.g. Chicken biryani" />

      <Text style={styles.label}>Type</Text>
      <ChipRow>
        {TYPES.map((t) => (
          <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
        ))}
      </ChipRow>

      <Text style={styles.label}>Portions</Text>
      <Stepper value={portions} onChange={setPortions} suffix="portions" />

      <Text style={styles.label}>Collect within</Text>
      <ChipRow>
        {HOURS.map((h) => (
          <Chip key={h} label={`${h} h`} selected={hours === h} onPress={() => setHours(h)} style={{ minWidth: 72 }} />
        ))}
      </ChipRow>
      <Text style={styles.hint}>Post expires automatically at {addHours(hours)} if nobody accepts.</Text>

      <Text style={styles.label}>Pickup location</Text>
      <Card style={styles.loc}>
        <Ionicons name="location-outline" size={22} color={colors.primary} />
        <Text style={styles.locText} numberOfLines={2}>
          {address || 'No address yet'}
        </Text>
        <Button title="Use GPS" variant="ghost" small onPress={useMyLocation} loading={locLoading} />
      </Card>

      <Input label="Note for volunteer (optional)" value={note} onChangeText={setNote} placeholder="e.g. Come to the back gate" multiline />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: 'row', gap: 10 },
  photo: { width: 92, height: 92, borderRadius: 16 },
  remove: { position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  addPhoto: { flex: 1, height: 92, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#9AA595', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 4 },
  addText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: -6 },
  hint: { fontSize: 13, color: colors.muted, marginTop: -6 },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  locText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.ink },
});