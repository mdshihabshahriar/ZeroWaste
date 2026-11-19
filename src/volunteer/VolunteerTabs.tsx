import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import RoleGuard from '../common/components/RoleGuard';
import BottomTabBar, { TabItem } from '../common/components/BottomTabBar';

const TABS: TabItem[] = [
  { name: 'nearby', label: 'Nearby', icon: 'location-outline' },
  { name: 'active-pickup', label: 'Pickups', icon: 'bag-handle-outline' },
  { name: 'notifications', label: 'Alerts', icon: 'notifications-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

export const unstable_settings = { anchor: 'nearby' };

export default function VolunteerLayout() {
  return (
    <RoleGuard role="volunteer">
      <View style={{ flex: 1 }}>
        <Tabs
          backBehavior="history"
          screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
          tabBar={() => null}
        >
          <Tabs.Screen name="nearby" />
          <Tabs.Screen name="active-pickup" />
          <Tabs.Screen name="notifications" />
          <Tabs.Screen name="profile" />
          <Tabs.Screen name="donation-detail" />
        </Tabs>
        <BottomTabBar base="/volunteer" items={TABS} hideOn={['donation-detail']} />
      </View>
    </RoleGuard>
  );
}
