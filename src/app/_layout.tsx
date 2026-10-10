import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Palette } from '@/theme';
import { AppProvider, useApp } from '@/providers/app-provider';

export default function RootLayout() {
  const { loading, session } = useApp();

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.surface } }}>
          <Stack.Screen name="index" />
          <Stack.Protected guard={!loading && Boolean(session)}>
            <Stack.Screen name="groups" />
            <Stack.Screen name="account" />
            <Stack.Screen name="settlements" />
            <Stack.Screen name="group/[groupId]" />
            <Stack.Screen name="new-group" options={{ presentation: 'modal' }} />
            <Stack.Screen name="add-member" options={{ presentation: 'modal' }} />
            <Stack.Screen name="new-expense" options={{ presentation: 'modal' }} />
            <Stack.Screen name="expense/[expenseId]" options={{ presentation: 'modal' }} />
          </Stack.Protected>
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
