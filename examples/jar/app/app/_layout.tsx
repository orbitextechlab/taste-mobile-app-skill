// Root stack: the tabs, the Ghi chi tiêu modal, the Đặt hạn mức form sheet and the spend detail. Providers
// are set up once here. The budget store is read once at launch so every screen finds it loading or ready.
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { load } from '../data/budget';
import { colors, type } from '../theme/tokens';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = colors[scheme];
  useEffect(() => {
    load();
  }, []);
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: c.surface },
            headerStyle: { backgroundColor: c.surface },
            headerShadowVisible: false,
            headerTintColor: c.text,
            headerTitleStyle: { ...type.bodyLg, fontWeight: '600' },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="log" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen
            name="limits"
            options={{ presentation: 'formSheet', headerShown: false, sheetAllowedDetents: [0.8], sheetGrabberVisible: true }}
          />
          <Stack.Screen name="spend/[id]" options={{ title: 'Khoản chi' }} />
        </Stack>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
