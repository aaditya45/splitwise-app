import { Tabs } from 'expo-router';

import { AppIcon } from '@/components/ui/primitives';
import { Palette, Typography } from '@/constants/theme';
import { useApp } from '@/providers/app-provider';

export default function TabLayout() {
  const { loading, session } = useApp();
  if (loading || !session) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.orangeDark,
        tabBarInactiveTintColor: Palette.muted,
        tabBarLabelStyle: { fontFamily: Typography.family, fontSize: Typography.size.caption, fontWeight: Typography.weight.medium },
        tabBarStyle: { backgroundColor: Palette.surface, borderTopColor: Palette.border, height: 64, paddingTop: 5, paddingBottom: 5 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <AppIcon name="home" color={color} size={21} /> }} />
      <Tabs.Screen name="groups" options={{ title: 'Groups', tabBarIcon: ({ color }) => <AppIcon name="groups" color={color} size={21} /> }} />
      <Tabs.Screen name="settlements" options={{ title: 'Settlements', tabBarIcon: ({ color }) => <AppIcon name="settlements" color={color} size={21} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color }) => <AppIcon name="account" color={color} size={21} /> }} />
    </Tabs>
  );
}
