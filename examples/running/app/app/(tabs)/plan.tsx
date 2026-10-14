// Kế hoạch: Dashboard. The week strip is the headline module (seven columns, done days filled, today
// marked), with the week's total line under it; then a plain list of the week's sessions. Done rows
// show the actual distance and push the run. No cards, no stat triplet.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../../components/Divider';
import { SectionLabel } from '../../components/SectionLabel';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { Snackbar } from '../../components/Snackbar';
import { StateMessage } from '../../components/StateMessage';
import { WeekStrip } from '../../components/WeekStrip';
import { kindLabel, retryPlan, useDefaultPlan, usePlan, weekDays, weekTotalKm } from '../../data/plan';
import { formatKm, formatPlanKm, retryRuns, runsOn, startOfWeek, useRuns, type Run } from '../../data/runs';
import { spacing, tabular, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function PlanScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const plan = usePlan();
  const runs = useRuns();
  const now = new Date();
  const monday = startOfWeek(now);

  const loading = plan.status === 'loading' || runs.status === 'loading';
  const failed = plan.status === 'error' || runs.status === 'error';
  const sessions = plan.value ?? [];
  const days = weekDays(sessions, now);
  const done: Record<string, Run> = {};
  for (const d of days) {
    const run = runsOn(d.key)[0];
    if (run) done[d.key] = run;
  }
  const doneMeters = Object.fromEntries(Object.entries(done).map(([k, r]) => [k, r.distanceM]));
  const doneTotal = Object.values(done).reduce((a, r) => a + r.distanceM, 0);
  const sessionDays = days.filter((d) => d.session);

  function retry() {
    if (plan.status === 'error') void retryPlan();
    if (runs.status === 'error') void retryRuns();
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.s8 }]}>
        <View style={styles.title}>
          <Text style={[styles.heading, { color: c.text }]}>Kế hoạch</Text>
          <Text style={[styles.date, { color: c.textMuted }]}>Tuần từ {monday.getDate()}/{monday.getMonth() + 1}</Text>
        </View>

        {loading ? (
          <View style={styles.skeleton}>
            <SkeletonBlock width="100%" height={spacing.s64} />
            <SkeletonBlock width={160} height={type.bodyLg.lineHeight} />
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonBlock key={i} width="100%" height={touch.row} />
            ))}
          </View>
        ) : failed ? (
          <StateMessage message="Không đọc được kế hoạch." actionLabel="Thử lại" onAction={retry} />
        ) : sessions.length === 0 ? (
          <StateMessage message="Tuần này chưa có kế hoạch. Kế hoạch 4 buổi gồm ba buổi chạy dễ và một buổi chạy dài." actionLabel="Dùng kế hoạch 4 buổi" onAction={useDefaultPlan} />
        ) : (
          <>
            <View style={styles.module}>
              <WeekStrip days={days} doneMeters={doneMeters} />
              <View style={styles.total} accessibilityLabel={`Đã chạy ${formatKm(doneTotal)} trên ${formatPlanKm(weekTotalKm(sessions))} km`}>
                <Text style={[styles.totalValue, { color: c.text }]}>
                  {formatKm(doneTotal)} <Text style={{ color: c.textMuted }}>/ {formatPlanKm(weekTotalKm(sessions))} km</Text>
                </Text>
                <Text style={[styles.totalLabel, { color: c.textMuted }]}>đã chạy tuần này</Text>
              </View>
            </View>
            <SectionLabel>Các buổi</SectionLabel>
            {sessionDays.map((d, i) => {
              const run = done[d.key];
              const session = d.session!;
              const row = (
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={[styles.rowDay, { color: c.text }]}>
                      {d.label} {d.date.getDate()}/{d.date.getMonth() + 1}
                      {d.isToday ? <Text style={{ color: c.accent }}> hôm nay</Text> : null}
                    </Text>
                    <Text style={[styles.rowMeta, { color: c.textMuted }]}>{kindLabel(session.kind)}, {formatPlanKm(session.km)} km</Text>
                  </View>
                  {run ? (
                    <View style={styles.rowRight}>
                      <Text style={[styles.rowKm, { color: c.text }]}>
                        {formatKm(run.distanceM)} <Text style={[styles.rowUnit, { color: c.textMuted }]}>km</Text>
                      </Text>
                      <Text style={[styles.rowMeta, { color: c.textMuted }]}>đã chạy</Text>
                    </View>
                  ) : (
                    <Text style={[styles.rowMeta, { color: c.textMuted }]}>{d.date.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() ? 'bỏ lỡ' : 'chưa chạy'}</Text>
                  )}
                </View>
              );
              return (
                <React.Fragment key={d.key}>
                  {i > 0 ? <Divider /> : null}
                  {run ? (
                    <Pressable
                      onPress={() => router.push({ pathname: '/run/[id]', params: { id: run.id } })}
                      accessibilityRole="button"
                      accessibilityLabel={`${d.label}, ${formatKm(run.distanceM)} km đã chạy`}
                      android_ripple={{ color: c.divider }}
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                      {row}
                    </Pressable>
                  ) : (
                    row
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </ScrollView>
      <Snackbar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s24 },
  title: { paddingHorizontal: spacing.s16, gap: spacing.s4 },
  heading: { ...type.heading, fontWeight: '700' },
  date: { ...type.body },
  skeleton: { padding: spacing.s16, paddingTop: spacing.s32, gap: spacing.s12 },
  module: { paddingTop: spacing.s32, gap: spacing.s16 },
  total: { paddingHorizontal: spacing.s16, gap: spacing.s4 },
  totalValue: { ...type.bodyLg, ...tabular, fontWeight: '600' },
  totalLabel: { ...type.caption },
  row: { minHeight: touch.row, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s16, paddingVertical: spacing.s8 },
  rowLeft: { flex: 1, gap: spacing.s4 },
  rowRight: { alignItems: 'flex-end', gap: spacing.s4 },
  rowDay: { ...type.body, fontWeight: '600' },
  rowMeta: { ...type.caption },
  rowKm: { ...type.bodyLg, ...tabular, fontWeight: '600' },
  rowUnit: { ...type.body, fontWeight: '400' },
});
