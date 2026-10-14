import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { fontFamily, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function TabsLayout() {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.divider },
        tabBarLabelStyle: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '500' },
      }}
    >
      <Tabs.Screen name="today" options={{ title: 'Hôm nay', tabBarIcon: ({ color }) => <MaterialIcons name="water-drop" size={24} color={color} /> }} />
      <Tabs.Screen name="plants" options={{ title: 'Cây của tôi', tabBarIcon: ({ color }) => <MaterialIcons name="yard" size={24} color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: 'Lịch', tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} /> }} />
    </Tabs>
  );
}
