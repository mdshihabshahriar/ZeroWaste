import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodType } from '../data/types';

export default function FoodPhoto({ uri, type, size = 64, radius = 14 }: { uri?: string | null; type?: FoodType; size?: number; radius?: number }) {
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} />;
  const veg = type === 'Veg';
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: radius, backgroundColor: veg ? '#BBD8A5' : '#E4B37E' }]}>
      <View style={[styles.shine, { backgroundColor: veg ? '#E6F1DB' : '#F7E1C2', borderRadius: size }]} />
      <Ionicons name="restaurant" size={size * 0.38} color={veg ? '#2E4A28' : '#5A3714'} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  shine: { position: 'absolute', top: '-30%', left: '-30%', width: '90%', height: '90%', opacity: 0.8 },
});