// Lịch: List. The next two weeks of waterings grouped by day, projected from each plant's interval. Days
// without a watering are skipped; overdue plants land under Hôm nay with how late they are.
import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { GroupHeading } from '../../components/GroupHeading';
import { PlantRow } from '../../components/PlantRow';
import { ScreenTitle } from '../../components/ScreenTitle';
import { SkeletonRows } from '../../components/Skeleton';
import { Snackbar } from '../../components/Snackbar';
import { daysUntilDue, formatDayHeading, formatMl, retryHydrate, schedule, toDayKey, usePlants, type Plant } from '../../data/plants';
import { spacing } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function ScheduleScreen() {
  const { status, plants } = usePlants();
  const c = useTheme();
  const router = useRouter();
  const now = new Date();
  const today = toDayKey(now);
  const sections = schedule(plants, 14, now).map((d) => ({ title: formatDayHeading(d.day, now), day: d.day, data: d.plants }));

  const line = (p: Plant, day: string) => {
    const late = day === today ? -daysUntilDue(p, now) : 0;
    return late > 0 ? `Quá hạn ${late} ngày · ${formatMl(p.amountMl)}` : formatMl(p.amountMl);
  };

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ScreenTitle title="Lịch" />
      {status === 'error' ? (
        <EmptyState message="Không đọc được dữ liệu cây." actionLabel="Thử lại" onAction={retryHydrate} />
      ) : status !== 'ready' ? (
        <SkeletonRows />
      ) : (
        <SectionList<Plant, { title: string; day: string }>
          sections={sections}
          keyExtractor={(p, i) => `${p.id}-${i}`}
          renderSectionHeader={({ section }) => <GroupHeading>{section.title}</GroupHeading>}
          renderItem={({ item, section }) => <PlantRow plant={item} line={line(item, section.day)} now={now} />}
          ItemSeparatorComponent={Divider}
          ListEmptyComponent={<EmptyState message="Không có lịch tưới. Thêm cây để thấy lịch ở đây." actionLabel="Thêm cây" onAction={() => router.push('/add')} primary />}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.content}
        />
      )}
      <Snackbar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s24 },
});
