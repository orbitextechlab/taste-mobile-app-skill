// The title of a list root, set in content inside the top inset (the navigator header is hidden on tabs),
// with at most one trailing action [R-NV3].
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Action = { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress: () => void };

export function ScreenTitle({ title, action }: { title: string; action?: Action }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.s8 }]}>
      <Text style={[styles.title, { color: c.text }]} accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          android_ripple={{ color: c.divider, borderless: true }}
          hitSlop={spacing.s4}
          style={({ pressed }) => [styles.action, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name={action.icon} size={24} color={c.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.s20, paddingBottom: spacing.s8 },
  title: { ...type.display, fontFamily: fontFamily.ui, fontWeight: '700', flex: 1 },
  action: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center', marginRight: -spacing.s8 },
});
