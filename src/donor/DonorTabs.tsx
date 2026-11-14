import React from 'react';
import { Tabs } from 'expo-router';
import RoleGuard from '../common/components/RoleGuard';
import BottomTabBar, { TabItem } from '../common/components/BottomTabBar';

const TABS: TabItem[] = [
  { name: 'home', label: 'Home', icon: 'home-outline' },
  { name: 'create-post', label: 'Post', icon: 'add-circle-outline' },
  { name: 'history', label: 'History', icon: 'time-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

const HIDE_TAB_BAR_ON = ['create-post', 'status'];

export const unstable_settings = { initialRouteName: 'home' };

export default function DonorLayout() {
  return (
    <RoleGuard role="donor">
      <Tabs
        backBehavior="history"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <BottomTabBar {...props} items={TABS} hideOn={HIDE_TAB_BAR_ON} />}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="create-post" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="status" />
        <Tabs.Screen name="notifications" />
      </Tabs>
    </RoleGuard>
  );
}