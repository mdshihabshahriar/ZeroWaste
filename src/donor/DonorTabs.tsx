import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import RoleGuard from '../common/components/RoleGuard';
import BottomTabBar, { TabItem } from '../common/components/BottomTabBar';

const TABS: TabItem[] = [
  { name: 'home', label: 'Home', icon: 'home-outline' },
  { name: 'create-post', label: 'Post', icon: 'add-circle-outline' },
  { name: 'history', label: 'History', icon: 'time-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const unstable_settings = { anchor: 'home' };

export default function DonorLayout() {
  return (
    <RoleGuard role="donor">
      <View style={{ flex: 1 }}>
        <Tabs backBehavior="history" screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} tabBar={() => null}>
          <Tabs.Screen name="home" />
          <Tabs.Screen name="create-post" />
          <Tabs.Screen name="history" />
          <Tabs.Screen name="profile" />
          <Tabs.Screen name="status" />
          <Tabs.Screen name="notifications" />
        </Tabs>
        <BottomTabBar base="/donor" items={TABS} hideOn={['create-post', 'status']} />
      </View>
    </RoleGuard>
  );
}