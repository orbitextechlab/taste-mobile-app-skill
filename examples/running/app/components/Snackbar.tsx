// One message, one action, above the tab bar inside the tab scene (the scene already ends above the
// bar, so only the gap is added). Never inserted into the layout.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { dismissSnack, useSnack } from '../data/snackbar';
import { spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

/** offset: the height of a sticky footer the bar must clear, derived from tokens, never a literal. */
export function Snackbar({ offset = 0 }: { offset?: number }) {
  const snack = useSnack();
  const c = useTheme();
  if (!snack) return null;
  return (
    <View style={[styles.wrap, { bottom: spacing.s16 + offset }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <View style={[styles.bar, { backgroundColor: c.text }]}>
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
  bar: { minHeight: touch.min + spacing.s4, paddingHorizontal: spacing.s16, flexDirection: 'row', alignItems: 'center', gap: spacing.s16 },
  message: { ...type.body, flex: 1 },
  action: { minHeight: touch.min, justifyContent: 'center' },
  actionLabel: { ...type.body, fontWeight: '700' },
});
