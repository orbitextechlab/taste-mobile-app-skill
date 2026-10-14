// One past run: weekday and date with the place on the left, the distance tabular on the right with
// pace and time under it. 64 pt, hairline-separated, pushes Chi tiết buổi chạy. No chevron, no icon.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { averagePace, formatDayShort, formatDuration, formatKm, formatPace, type Run } from '../data/runs';
import { spacing, tabular, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function RunRow({ run, dateLabel }: { run: Run; dateLabel?: string }) {
  const c = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/run/[id]', params: { id: run.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${dateLabel ?? formatDayShort(run.startedAt)}, ${run.place}, ${formatKm(run.distanceM)} km`}
      android_ripple={{ color: c.divider }}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      <View style={styles.left}>
        <Text style={[styles.day, { color: c.text }]}>{dateLabel ?? formatDayShort(run.startedAt)}</Text>
        <Text style={[styles.place, { color: c.textMuted }]} numberOfLines={1}>{run.place}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.km, { color: c.text }]}>
          {formatKm(run.distanceM)} <Text style={[styles.unit, { color: c.textMuted }]}>km</Text>
        </Text>
        <Text style={[styles.meta, { color: c.textMuted }]}>{formatPace(averagePace(run))} /km · {formatDuration(run.durationS)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: touch.row, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s16, paddingVertical: spacing.s8 },
  left: { flex: 1, gap: spacing.s4 },
  right: { alignItems: 'flex-end', gap: spacing.s4 },
  day: { ...type.body, fontWeight: '600' },
  place: { ...type.caption },
  km: { ...type.bodyLg, ...tabular, fontWeight: '600' },
  unit: { ...type.body, fontWeight: '400' },
  meta: { ...type.caption, ...tabular },
});
