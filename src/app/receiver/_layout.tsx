import React from 'react';
import { Tabs } from 'expo-router';
import RoleGuard from '../../components/RoleGuard';
import BottomTabBar, { TabItem } from '../../components/BottomTabBar';

const TABS: TabItem[] = [
  { name: 'browse', label: 'Browse', icon: 'search-outline' },
  { name: 'confirm', label: 'Requests', icon: 'receipt-outline' },
  { name: 'notifications', label: 'Alerts', icon: 'notifications-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const unstable_settings = { initialRouteName: 'browse' };

export default function ReceiverLayout() {
  return (
    <RoleGuard role="receiver">
      <Tabs backBehavior="history" screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} items={TABS} />}>
        <Tabs.Screen name="browse" />
        <Tabs.Screen name="confirm" />
        <Tabs.Screen name="notifications" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </RoleGuard>
  );
}