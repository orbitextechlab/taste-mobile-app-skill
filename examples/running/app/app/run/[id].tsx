// Chi tiết buổi chạy: Hero under the native header (title = the place). The distance numeral in the
// top third, the figures row, then Từng km as a hairline table with the fastest km in weight. Quiet:
// no field, no lane. Xóa buổi chạy is destructive text at the end, confirmed by a system alert.
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BibNumeral } from '../../components/BibNumeral';
import { Divider } from '../../components/Divider';
import { FiguresRow } from '../../components/FiguresRow';
import { PillButton } from '../../components/PillButton';
import { SectionLabel } from '../../components/SectionLabel';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { StateMessage } from '../../components/StateMessage';
import { averagePace, deleteRun, fastestSplit, formatDayLong, formatDuration, formatKm, formatPace, formatTime, getRun, retryRuns, useRuns } from '../../data/runs';
import { showSnack } from '../../data/snackbar';
import { lane, spacing, tabular, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function RunDetailScreen() {
  const c = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const runs = useRuns();
  const run = getRun(id);

  if (runs.status === 'loading') {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.skeleton}>
          <SkeletonBlock width={200} height={type.body.lineHeight} />
          <SkeletonBlock width={220} height={type.display.lineHeight} />
          <SkeletonBlock width={180} height={lane.height} />
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonBlock key={i} width="100%" height={touch.min} />
          ))}
        </View>
      </View>
    );
  }

  if (runs.status === 'error') {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: 'Buổi chạy' }} />
        <StateMessage message="Không đọc được dữ liệu buổi chạy." actionLabel="Thử lại" onAction={() => void retryRuns()} />
      </View>
    );
  }

  if (!run) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: 'Buổi chạy' }} />
        <StateMessage message="Không tìm thấy buổi chạy này. Có thể nó đã bị xóa." actionLabel="Về Lịch sử" onAction={() => router.replace('/history')} />
      </View>
    );
  }

  const started = new Date(run.startedAt);
  const fastest = fastestSplit(run);
  const partialPace = run.lastPartial.meters > 0 ? run.lastPartial.seconds / (run.lastPartial.meters / 1000) : null;
  let elapsed = 0;

  function confirmDelete() {
    Alert.alert('Xóa buổi chạy này?', `Buổi chạy ${formatKm(run!.distanceM)} km ở ${run!.place} sẽ bị xóa. Không hoàn tác được.`, [
      { text: 'Giữ lại', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          if (deleteRun(run!.id)) {
            showSnack({ message: `Đã xóa buổi chạy ${formatKm(run!.distanceM)} km` });
            router.back();
          }
        },
      },
    ]);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={[styles.screen, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: run.place }} />
      <View style={styles.hero}>
        <Text style={[styles.date, { color: c.textMuted }]}>
          {formatDayLong(started)}, {formatTime(started)}
        </Text>
        <BibNumeral value={formatKm(run.distanceM)} unit="km" color={c.text} unitColor={c.textMuted} />
        <FiguresRow
          items={[
            { value: formatPace(averagePace(run)), label: 'mỗi km' },
            { value: formatDuration(run.durationS), label: 'thời gian' },
          ]}
          color={c.text}
          mutedColor={c.textMuted}
        />
      </View>

      <SectionLabel>Từng km</SectionLabel>
      {run.splits.length === 0 ? (
        <StateMessage inline message="Chưa đủ 1 km để tách từng km." />
      ) : (
        <>
          <View style={styles.tableHead}>
            <Text style={[styles.headCell, styles.kmCol, { color: c.textMuted }]}>km</Text>
            <Text style={[styles.headCell, styles.paceCol, { color: c.textMuted }]}>mỗi km</Text>
            <Text style={[styles.headCell, styles.timeCol, { color: c.textMuted }]}>cộng dồn</Text>
          </View>
          {run.splits.map((s, i) => {
            elapsed += s;
            const best = i === fastest;
            return (
              <React.Fragment key={i}>
                <Divider />
                <View style={styles.tableRow} accessibilityLabel={`Km ${i + 1}, ${formatPace(s)} mỗi km, cộng dồn ${formatDuration(elapsed)}${best ? ', nhanh nhất' : ''}`}>
                  <Text style={[styles.cell, styles.kmCol, { color: c.text }]}>{i + 1}</Text>
                  <Text style={[styles.cell, styles.paceCol, { color: c.text }, best && styles.best]}>
                    {formatPace(s)}
                    {best ? <Text style={[styles.note, { color: c.textMuted }]}>  nhanh nhất</Text> : null}
                  </Text>
                  <Text style={[styles.cell, styles.timeCol, { color: c.textMuted }]}>{formatDuration(elapsed)}</Text>
                </View>
              </React.Fragment>
            );
          })}
          {run.lastPartial.meters > 0 && partialPace !== null ? (
            <>
              <Divider />
              <View style={styles.tableRow} accessibilityLabel={`${run.lastPartial.meters} m cuối, ${formatPace(partialPace)} mỗi km`}>
                <Text style={[styles.cell, styles.kmCol, { color: c.text }]} numberOfLines={1}>{run.lastPartial.meters} m</Text>
                <Text style={[styles.cell, styles.paceCol, { color: c.text }]}>{formatPace(partialPace)}</Text>
                <Text style={[styles.cell, styles.timeCol, { color: c.textMuted }]}>{formatDuration(run.durationS)}</Text>
              </View>
            </>
          ) : null}
        </>
      )}

      <View style={styles.actions}>
        <PillButton label="Xóa buổi chạy" variant="text" labelColor={c.danger} onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s48 },
  skeleton: { padding: spacing.s16, gap: spacing.s12 },
  hero: { paddingHorizontal: spacing.s16, paddingTop: spacing.s16, gap: spacing.s8 },
  date: { ...type.body },
  tableHead: { flexDirection: 'row', paddingHorizontal: spacing.s16, paddingBottom: spacing.s8 },
  headCell: { ...type.caption },
  tableRow: { minHeight: touch.min, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s16 },
  cell: { ...type.bodyLg, ...tabular },
  kmCol: { width: spacing.s48 },
  paceCol: { flex: 1 },
  timeCol: { minWidth: spacing.s64 + spacing.s16, textAlign: 'right' },
  best: { fontWeight: '700' },
  note: { ...type.caption, fontWeight: '400' },
  actions: { paddingHorizontal: spacing.s16, paddingTop: spacing.s32, flexDirection: 'row' },
});
