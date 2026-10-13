// Cây của tôi: List. All plants grouped by where they live, each row with its silhouette glyph and the
// next watering date; due rows carry the date in the accent. + in the title adds a plant.
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
import { locations, retryHydrate, usePlants, type Plant } from '../../data/plants';
import { spacing } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function PlantsScreen() {
  const { status, plants } = usePlants();
  const c = useTheme();
  const router = useRouter();
  const now = new Date();
  const sections = locations
    .map((title) => ({ title, data: plants.filter((p) => p.location === title).sort((a, b) => a.name.localeCompare(b.name, 'vi')) }))
    .filter((s) => s.data.length > 0);

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ScreenTitle title="Cây của tôi" action={{ icon: 'add', label: 'Thêm cây', onPress: () => router.push('/add') }} />
      {status === 'error' ? (
        <EmptyState message="Không đọc được dữ liệu cây." actionLabel="Thử lại" onAction={retryHydrate} />
      ) : status !== 'ready' ? (
        <SkeletonRows />
      ) : (
        <SectionList<Plant>
          sections={sections}
          keyExtractor={(p) => p.id}
          renderSectionHeader={({ section }) => <GroupHeading>{section.title}</GroupHeading>}
          renderItem={({ item }) => <PlantRow plant={item} now={now} />}
          ItemSeparatorComponent={Divider}
          ListEmptyComponent={<EmptyState message="Chưa có cây nào. Thêm cây đầu tiên để Cây nhắc bạn tưới." actionLabel="Thêm cây" onAction={() => router.push('/add')} primary />}
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
