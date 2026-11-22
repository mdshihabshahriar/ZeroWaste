import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import RoleGuard from '../common/components/RoleGuard';
import BottomTabBar, { TabItem } from '../common/components/BottomTabBar';

const TABS: TabItem[] = [
  { name: 'browse', label: 'Browse', icon: 'search-outline' },
  { name: 'confirm', label: 'Requests', icon: 'receipt-outline' },
  { name: 'notifications', label: 'Alerts', icon: 'notifications-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const unstable_settings = { anchor: 'browse' };

export default function ReceiverLayout() {
  return (
    <RoleGuard role="receiver">
      <View style={{ flex: 1 }}>
        <Tabs backBehavior="history" screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} tabBar={() => null}>
          <Tabs.Screen name="browse" />
          <Tabs.Screen name="confirm" />
          <Tabs.Screen name="notifications" />
          <Tabs.Screen name="profile" />
        </Tabs>
        <BottomTabBar base="/receiver" items={TABS} />
      </View>
    </RoleGuard>
  );
}