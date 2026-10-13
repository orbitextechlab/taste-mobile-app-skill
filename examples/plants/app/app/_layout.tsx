import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { colors, fontFamily, type } from '../theme/tokens';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = colors[scheme];
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
            headerTitleStyle: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600' },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="plant/[id]" />
          <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: '' }} />
        </Stack>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
