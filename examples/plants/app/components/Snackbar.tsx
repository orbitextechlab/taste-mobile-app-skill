// One line, one action, floating above the tab bar (the tab scene already ends above the bar) or above the
// home indicator on pushed screens. Never inserted into the layout, so nothing jumps when it leaves [R-DL6].
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { dismissSnack, useSnack } from '../data/snackbar';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function Snackbar({ bottom = spacing.s16 }: { bottom?: number }) {
  const snack = useSnack();
  const c = useTheme();
  if (!snack) return null;
  return (
    <View style={[styles.wrap, { bottom }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <View style={[styles.bar, { backgroundColor: c.text }]}>
        <Text style={[styles.message, { color: c.surface }]} numberOfLines={2}>
          {snack.message}
        </Text>
        {snack.actionLabel ? (
          <Pressable
            onPress={() => {
              snack.onAction?.();
              dismissSnack();
            }}
            accessibilityRole="button"
            hitSlop={spacing.s8}
            style={styles.action}
          >
            <Text style={[styles.actionLabel, { color: c.accent }]}>{snack.actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.s16, right: spacing.s16 },
  bar: {
    minHeight: touch.min + spacing.s4,
    paddingHorizontal: spacing.s16,
    borderRadius: radius.snackbar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s16,
  },
  message: { ...type.body, fontFamily: fontFamily.ui, flex: 1 },
  action: { minHeight: touch.min, justifyContent: 'center' },
  actionLabel: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '700' },
});
