// Hôm nay: Hero. The one number (today's planned km, or the run saved today, or the last run) in the
// top third over the lane line, the week line and the last run under it, and the single Bắt đầu chạy
// pill in the thumb zone. Nothing counts up; the number is present at paint.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BibNumeral } from '../../components/BibNumeral';
import { Divider } from '../../components/Divider';
import { LaneLine } from '../../components/LaneLine';
import { PillButton } from '../../components/PillButton';
import { RunRow } from '../../components/RunRow';
import { SectionLabel } from '../../components/SectionLabel';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { Snackbar } from '../../components/Snackbar';
import { StateMessage } from '../../components/StateMessage';
import { startRun } from '../../data/live';
import { kindLabel, retryPlan, sessionOn, usePlan, weekTotalKm } from '../../data/plan';
import { dateKey, formatDayLong, formatKm, formatPlanKm, formatTime, listRuns, relativeDay, retryRuns, runsOn, startOfWeek, useRuns } from '../../data/runs';
import { lane, spacing, tabular, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

const FOOTER_HEIGHT = touch.pill + spacing.s8 + spacing.s16;

export default function TodayScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const runs = useRuns();
  const plan = usePlan();
  const now = new Date();

  const loading = runs.status === 'loading' || plan.status === 'loading';
  const failed = runs.status === 'error' || plan.status === 'error';

  const todayRun = runsOn(dateKey(now))[0];
  const session = plan.value ? sessionOn(plan.value, now) : undefined;
  const all = listRuns();
  const previous = all.find((r) => r.id !== todayRun?.id);
  // When the hero already shows the last run (no plan, nothing today), the row would repeat it.
  const showPrevious = Boolean(previous && (todayRun || session));
  const monday = startOfWeek(now).getTime();
  const weekMeters = all.filter((r) => new Date(r.startedAt).getTime() >= monday).reduce((a, r) => a + r.distanceM, 0);
  const weekPlanKm = plan.value ? weekTotalKm(plan.value) : 0;

  const hero = todayRun
    ? { value: formatKm(todayRun.distanceM), km: todayRun.distanceM / 1000, label: `Đã chạy ${formatTime(todayRun.startedAt)}, ${todayRun.place}` }
    : session
      ? { value: formatPlanKm(session.km), km: session.km, label: `Kế hoạch hôm nay, ${kindLabel(session.kind)}` }
      : previous
        ? { value: formatKm(previous.distanceM), km: previous.distanceM / 1000, label: `Buổi gần nhất, ${relativeDay(previous.startedAt)}` }
        : null;

  function start() {
    startRun();
    router.push('/live');
  }

  function retry() {
    if (runs.status === 'error') void retryRuns();
    if (plan.status === 'error') void retryPlan();
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.s8 }]}>
        <View style={styles.title}>
          <Text style={[styles.heading, { color: c.text }]}>Hôm nay</Text>
          <Text style={[styles.date, { color: c.textMuted }]}>{formatDayLong(now)}</Text>
        </View>

        {loading ? (
          <View style={styles.hero}>
            <SkeletonBlock width={160} height={type.body.lineHeight} />
            <SkeletonBlock width={220} height={type.display.lineHeight} />
            <SkeletonBlock width="100%" height={lane.height} />
          </View>
        ) : failed ? (
          <StateMessage message="Không đọc được dữ liệu buổi chạy." actionLabel="Thử lại" onAction={retry} />
        ) : !hero ? (
          <StateMessage message="Chưa có buổi chạy nào. Buổi đầu tiên sẽ hiện ở đây." />
        ) : (
          <>
            <View style={styles.hero}>
              <Text style={[styles.label, { color: c.textMuted }]}>{hero.label}</Text>
              <BibNumeral value={hero.value} unit="km" color={c.text} unitColor={c.textMuted} />
              <LaneLine km={hero.km} color={c.text} />
            </View>
            {weekPlanKm > 0 ? (
              <>
                <Divider />
                <View style={styles.line} accessibilityLabel={`Tuần này ${formatKm(weekMeters)} trên ${formatPlanKm(weekPlanKm)} km`}>
                  <Text style={[styles.lineLabel, { color: c.textMuted }]}>Tuần này</Text>
                  <Text style={[styles.lineValue, { color: c.text }]}>
                    {formatKm(weekMeters)} <Text style={{ color: c.textMuted }}>/ {formatPlanKm(weekPlanKm)} km</Text>
                  </Text>
                </View>
              </>
            ) : null}
            {showPrevious && previous ? (
              <>
                <SectionLabel>Buổi gần nhất</SectionLabel>
                <RunRow run={previous} dateLabel={relativeDay(previous.startedAt)} />
              </>
            ) : null}
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <PillButton label="Bắt đầu chạy" onPress={start} />
      </View>
      <Snackbar offset={FOOTER_HEIGHT} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: spacing.s24 },
  title: { paddingHorizontal: spacing.s16, gap: spacing.s4 },
  heading: { ...type.heading, fontWeight: '700' },
  date: { ...type.body },
  hero: { paddingHorizontal: spacing.s16, paddingTop: spacing.s48, paddingBottom: spacing.s24, gap: spacing.s8 },
  label: { ...type.body },
  line: { minHeight: spacing.s48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.s16 },
  lineLabel: { ...type.body },
  lineValue: { ...type.bodyLg, ...tabular, fontWeight: '600' },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s8, paddingBottom: spacing.s16, flexDirection: 'row' },
});
