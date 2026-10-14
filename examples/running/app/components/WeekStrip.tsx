// The week as the headline module of Kế hoạch: seven columns, the planned km in each, a filled bar
// under a done day, a hairline under a planned one, nothing under a rest day; today's label in red.
// Type and hairlines, not a chart.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PlanDay } from '../data/plan';
import { formatKm, formatPlanKm } from '../data/runs';
import { spacing, tabular, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = { days: PlanDay[]; doneMeters: Record<string, number> };

export function WeekStrip({ days, doneMeters }: Props) {
  const c = useTheme();
  return (
    <View style={styles.row} accessibilityRole="summary">
      {days.map((d) => {
        const done = doneMeters[d.key];
        const figure = done !== undefined ? formatKm(done) : d.session ? formatPlanKm(d.session.km) : null;
        const state = done !== undefined ? 'đã chạy' : d.session ? 'kế hoạch' : 'nghỉ';
        return (
          <View key={d.key} style={styles.col} accessibilityLabel={`${d.label}${d.isToday ? ', hôm nay' : ''}, ${figure ? `${figure} km` : 'nghỉ'}, ${state}`}>
            <Text style={[styles.label, { color: d.isToday ? c.accent : c.textMuted }, d.isToday && styles.today]}>{d.label}</Text>
            {figure ? (
              <Text style={[styles.figure, { color: c.text, fontWeight: done !== undefined ? '800' : '600' }]}>{figure}</Text>
            ) : (
              <Text style={[styles.rest, { color: c.textMuted }]}>nghỉ</Text>
            )}
            <View style={[styles.bar, { backgroundColor: done !== undefined ? c.text : d.session ? c.divider : 'transparent' }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.s4, paddingHorizontal: spacing.s16 },
  col: { flex: 1, gap: spacing.s8, alignItems: 'flex-start' },
  label: { ...type.caption },
  today: { fontWeight: '700' },
  figure: { ...type.heading, ...tabular },
  rest: { ...type.heading, fontWeight: '400', fontSize: type.body.fontSize, lineHeight: type.heading.lineHeight },
  bar: { alignSelf: 'stretch', height: spacing.s4 },
});
