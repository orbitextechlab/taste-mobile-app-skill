// Lịch sử: List. Spends grouped by week, each week header carrying its total; inside a week, a muted day
// caption precedes the day's rows. Amounts are a tabular column on the right. A deleted row leaves in place
// while its siblings close the gap; nothing enters.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { Snackbar } from '../../components/Snackbar';
import { SpendRow } from '../../components/SpendRow';
import { getStatus, load, spendsInWeek, useBudget, weeksWithSpends, type Spend } from '../../data/budget';
import { dayLabel, formatVnd, sameDay, weekLabel } from '../../data/format';
import { duration, spacing, tabular, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

type Item =
  | { type: 'week'; key: string; label: string; total: number }
  | { type: 'day'; key: string; label: string }
  | { type: 'spend'; key: string; spend: Spend };

function buildItems(now: Date): Item[] {
  const items: Item[] = [];
  for (const start of weeksWithSpends()) {
    const spends = spendsInWeek(start);
    items.push({ type: 'week', key: `week-${start.getTime()}`, label: weekLabel(start, now), total: spends.reduce((sum, s) => sum + s.amount, 0) });
    let lastDay: Date | null = null;
    for (const spend of spends) {
      const day = new Date(spend.at);
      if (!lastDay || !sameDay(day, lastDay)) {
        items.push({ type: 'day', key: `day-${spend.at.slice(0, 10)}`, label: dayLabel(spend.at, now) });
        lastDay = day;
      }
      items.push({ type: 'spend', key: spend.id, spend });
    }
  }
  return items;
}

export default function HistoryScreen() {
  useBudget();
  const c = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const status = getStatus();
  const items = status === 'ready' ? buildItems(new Date()) : [];

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <View style={styles.skeletons}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width="100%" height={40} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <Animated.FlatList
        data={items}
        keyExtractor={(item: Item) => item.key}
        renderItem={({ item }) => {
          if (item.type === 'week') {
            return (
              <View style={styles.weekHeader}>
                <Text style={[styles.weekLabel, { color: c.text }]}>{item.label}</Text>
                <Text style={[styles.weekTotal, tabular, { color: c.text }]}>{formatVnd(item.total)}</Text>
              </View>
            );
          }
          if (item.type === 'day') return <Text style={[styles.dayLabel, { color: c.textMuted }]}>{item.label}</Text>;
          return <SpendRow spend={item.spend} />;
        }}
        ItemSeparatorComponent={({ leadingItem }: { leadingItem: Item }) => (leadingItem.type === 'spend' ? <Divider /> : null)}
        itemLayoutAnimation={reduceMotion ? undefined : LinearTransition.duration(duration.slow - 50)}
        ListHeaderComponent={
          status === 'error' ? <EmptyState message="Không đọc được dữ liệu. Danh sách dưới đây là bản đã lưu." actionLabel="Thử lại" onAction={() => load()} /> : null
        }
        ListEmptyComponent={
          status === 'error' ? null : <EmptyState message="Chưa có khoản chi nào. Khoản đầu tiên sẽ hiện ở đây." actionLabel="Ghi chi tiêu" onAction={() => router.push('/log')} />
        }
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
      <Snackbar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  skeletons: { padding: spacing.s16, gap: spacing.s12 },
  weekHeader: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s12, paddingHorizontal: spacing.s16, paddingTop: spacing.s24, paddingBottom: spacing.s4 },
  weekLabel: { ...type.bodyLg, fontWeight: '600', flex: 1 },
  weekTotal: { ...type.bodyLg, fontWeight: '600' },
  dayLabel: { ...type.caption, paddingHorizontal: spacing.s16, paddingTop: spacing.s12, paddingBottom: spacing.s4 },
});
