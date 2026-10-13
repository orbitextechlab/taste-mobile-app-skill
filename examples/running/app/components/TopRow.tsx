// The top row of the run group: inset by the top safe area (a full-screen modal covers the status
// bar on both platforms), an optional leading 44 pt icon button, and the screen's figures.
import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, touch } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export type TopAction = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void };

type Props = { leading?: TopAction; children?: ReactNode; onField?: boolean; insetTop?: boolean };

export function TopRow({ leading, children, onField = false, insetTop = true }: Props) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const tint = onField ? c.onField : c.text;
  return (
    <View style={{ paddingTop: insetTop ? insets.top : 0 }}>
      <View style={styles.row}>
        {leading ? (
          <Pressable
            onPress={leading.onPress}
            accessibilityRole="button"
            accessibilityLabel={leading.label}
            hitSlop={8}
            android_ripple={{ color: onField ? c.fieldDivider : c.divider, borderless: true }}
            style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name={leading.icon} size={24} color={tint} />
          </Pressable>
        ) : null}
        <View style={[styles.content, { paddingLeft: leading ? 0 : spacing.s16 }]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: touch.min + spacing.s4, flexDirection: 'row', alignItems: 'center', paddingRight: spacing.s16 },
  action: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.s4 },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
