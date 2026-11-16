import { Tabs } from 'expo-router';
import { View } from 'react-native';
import BottomTabBar, { TabItem } from '../common/components/BottomTabBar';
import RoleGuard from '../common/components/RoleGuard';

const TABS: TabItem[] = [
  { name: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { name: 'verify', label: 'Verify', icon: 'shield-checkmark-outline' },
  { name: 'moderate', label: 'Posts', icon: 'flag-outline' },
  { name: 'audit-logs', label: 'Logs', icon: 'document-text-outline' },
];

export const unstable_settings = { anchor: 'dashboard' };

export default function AdminLayout() {
  return (
    <RoleGuard role="admin">
      <View style={{ flex: 1 }}>
        <Tabs backBehavior="history" screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} tabBar={() => null}>
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="verify" />
          <Tabs.Screen name="moderate" />
          <Tabs.Screen name="audit-logs" />
          <Tabs.Screen name="notifications" />
          <Tabs.Screen name="profile" />
        </Tabs>
        <BottomTabBar base="/admin" items={TABS} />
      </View>
    </RoleGuard>
  );
}
