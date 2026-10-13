// One spend as a row: place (or the jar name when there is no place), jar and time muted, amount tabular on
// the right. Pushes the spend detail. Pressed feedback is a surface tint; no icon, no chevron, no card.
// Wrapped in an Animated.View so a deleted row fades out in place; there is no entering animation.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut, useReducedMotion } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getJar, type Spend } from '../data/budget';
import { formatTime, formatVnd } from '../data/format';
import { duration, spacing, tabular, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function SpendRow({ spend, showTime = true }: { spend: Spend; showTime?: boolean }) {
  const c = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const jar = getJar(spend.jarId);
  const title = spend.place || jar?.name || '';
  const meta = [spend.place ? jar?.name : undefined, showTime ? formatTime(spend.at) : undefined].filter(Boolean).join(', ');
  return (
    <Animated.View exiting={reduceMotion ? undefined : FadeOut.duration(duration.fast + 30)}>
      <Pressable
        onPress={() => router.push({ pathname: '/spend/[id]', params: { id: spend.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${meta}, ${formatVnd(spend.amount)}`}
        android_ripple={{ color: c.divider }}
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? c.surfaceAlt : c.surface }]}
      >
        <View style={styles.text}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{title}</Text>
          {meta ? <Text style={[styles.meta, { color: c.textMuted }]} numberOfLines={1}>{meta}</Text> : null}
        </View>
        <Text style={[styles.amount, tabular, { color: c.text }]}>{formatVnd(spend.amount)}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s16, paddingVertical: spacing.s8 },
  text: { flex: 1, gap: 2 },
  title: { ...type.body, fontWeight: '600' },
  meta: { ...type.caption },
  amount: { ...type.bodyLg, textAlign: 'right' },
});
