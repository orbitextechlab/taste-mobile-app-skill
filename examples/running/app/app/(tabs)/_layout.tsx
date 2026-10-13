import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function TabsLayout() {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.text,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.divider },
        tabBarLabelStyle: { ...type.caption, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{ title: 'Hôm nay', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'today' : 'today-outline'} size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'Lịch sử', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'list' : 'list-outline'} size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="plan"
        options={{ title: 'Kế hoạch', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} /> }}
      />
    </Tabs>
  );
}
