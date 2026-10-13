// Lịch sử: List grouped by week. Rows: weekday and date with the place, the distance tabular on the
// right with pace and time under it. Hairlines, no cards, no chevrons. Pressed only.
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../../components/Divider';
import { RunRow } from '../../components/RunRow';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { Snackbar } from '../../components/Snackbar';
import { StateMessage } from '../../components/StateMessage';
import { startRun } from '../../data/live';
import { dateKey, formatKm, listRuns, retryRuns, startOfWeek, useRuns, weekLabel, type Run } from '../../data/runs';
import { spacing, tabular, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function HistoryScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const runs = useRuns();
  const all = listRuns();
  const sections = groupByWeek(all);
  const totalM = all.reduce((a, r) => a + r.distanceM, 0);

  function start() {
    startRun();
    router.push('/live');
  }

  const header = (
    <View style={[styles.title, { paddingTop: insets.top + spacing.s8 }]}>
      <Text style={[styles.heading, { color: c.text }]}>Lịch sử</Text>
      {runs.status === 'ready' && all.length > 0 ? (
        <Text style={[styles.summary, { color: c.textMuted }]}>
          {all.length} buổi, {formatKm(totalM)} km
        </Text>
      ) : null}
    </View>
  );

  if (runs.status !== 'ready') {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        {header}
        {runs.status === 'loading' ? (
          <View style={styles.skeleton}>
            <SkeletonBlock width={96} height={type.body.lineHeight} />
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBlock key={i} width="100%" height={touch.row} />
            ))}
          </View>
        ) : (
          <StateMessage message="Không đọc được dữ liệu buổi chạy." actionLabel="Thử lại" onAction={() => void retryRuns()} />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <SectionList
        sections={sections}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={header}
        renderSectionHeader={({ section }) => <Text style={[styles.section, { color: c.textMuted, backgroundColor: c.surface }]}>{section.title}</Text>}
        renderItem={({ item }) => <RunRow run={item} />}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={<StateMessage message="Chưa có buổi chạy nào. Buổi đầu tiên sẽ hiện ở đây." actionLabel="Bắt đầu chạy" actionVariant="accent" onAction={start} />}
        contentContainerStyle={[styles.content, sections.length === 0 && styles.fill]}
        stickySectionHeadersEnabled
      />
      <Snackbar />
    </View>
  );
}

function groupByWeek(runs: Run[]) {
  const map = new Map<string, { monday: Date; data: Run[] }>();
  for (const r of runs) {
    const monday = startOfWeek(new Date(r.startedAt));
    const key = dateKey(monday);
    const entry = map.get(key) ?? { monday, data: [] };
    entry.data.push(r);
    map.set(key, entry);
  }
  return Array.from(map.values()).map(({ monday, data }) => ({ title: weekLabel(monday), data }));
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s24 },
  fill: { flexGrow: 1 },
  title: { paddingHorizontal: spacing.s16, gap: spacing.s4 },
  heading: { ...type.heading, fontWeight: '700' },
  summary: { ...type.body, ...tabular },
  section: { ...type.body, fontWeight: '600', paddingHorizontal: spacing.s16, paddingTop: spacing.s32, paddingBottom: spacing.s8 },
  skeleton: { padding: spacing.s16, paddingTop: spacing.s32, gap: spacing.s12 },
});
