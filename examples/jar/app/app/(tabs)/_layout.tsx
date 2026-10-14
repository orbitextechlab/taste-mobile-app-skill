// Three tabs, three questions: what is left (Tuần này), what did I spend (Lịch sử), which jar has room (Hũ).
// Native tab bar and headers tinted with ink; the Hũ tab icon is the jar glyph, drawn in the tint color.
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Jar } from '../../components/Jar';
import { spacing, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function TabsLayout() {
  const c = useTheme();
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.text,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.divider },
        tabBarLabelStyle: { ...type.caption, fontWeight: '500' },
        headerStyle: { backgroundColor: c.surface },
        headerShadowVisible: false,
        headerTintColor: c.text,
        headerTitleStyle: { ...type.bodyLg, fontWeight: '600' },
        sceneStyle: { backgroundColor: c.surface },
      }}
    >
      <Tabs.Screen
        name="week"
        options={{
          title: 'Tuần này',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="calendar-clear-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color }) => <Ionicons name="time-outline" size={24} color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/log')}
              accessibilityRole="button"
              accessibilityLabel="Ghi chi tiêu"
              hitSlop={4}
              android_ripple={{ color: c.divider, borderless: true }}
              style={({ pressed }) => [styles.headerIcon, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="add" size={28} color={c.text} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="jars"
        options={{
          title: 'Hũ',
          tabBarIcon: ({ color }) => <Jar level={0.6} width={22} ink={color} coin={color} glass="transparent" accessibilityLabel="Hũ" />,
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/limits')}
              accessibilityRole="button"
              accessibilityLabel="Đặt hạn mức tuần"
              hitSlop={4}
              android_ripple={{ color: c.divider, borderless: true }}
              style={({ pressed }) => [styles.headerText, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.headerLabel, { color: c.text }]}>Hạn mức</Text>
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerIcon: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center', marginRight: spacing.s4 },
  headerText: { minHeight: touch.min, paddingHorizontal: spacing.s16, justifyContent: 'center' },
  headerLabel: { ...type.bodyLg, fontWeight: '500' },
});
