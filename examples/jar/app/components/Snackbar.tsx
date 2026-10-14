// One snackbar, floating above the footer or the tab bar inside the tab scene, never inserted into the
// layout [R-DL6]. Ink bar, surface text, the action in bold. The only raised surface in the app.
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { dismissSnack, useSnack } from '../data/snackbar';
import { radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function Snackbar({ bottom = spacing.s16 }: { bottom?: number }) {
  const snack = useSnack();
  const c = useTheme();
  if (!snack) return null;
  return (
    <View style={[styles.wrap, { bottom }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <View style={[styles.bar, { backgroundColor: c.text }, Platform.OS === 'android' ? styles.raised : null]}>
        <Text style={[styles.message, { color: c.surface }]} numberOfLines={2}>{snack.message}</Text>
        {snack.actionLabel ? (
          <Pressable
            onPress={() => {
              snack.onAction?.();
              dismissSnack();
            }}
            accessibilityRole="button"
            hitSlop={8}
            style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.actionLabel, { color: c.surface }]}>{snack.actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.s16, right: spacing.s16 },
  bar: {
    minHeight: touch.min,
    paddingHorizontal: spacing.s16,
    borderRadius: radius.control,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s16,
  },
  raised: { elevation: 3 },
  message: { ...type.body, flex: 1 },
  action: { minHeight: touch.min, justifyContent: 'center' },
  actionLabel: { ...type.body, fontWeight: '700' },
});
