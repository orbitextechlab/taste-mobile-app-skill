// Tuần này: Hero. The remaining amount is the one display element, the jar with today's tick sits under it on
// the leading side, today's spends are rows below, and the one filled button lives in a footer inside the thumb
// zone above the tab bar. After a spend changes, the coin level settles and the numeral rolls; nothing else moves.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { Jar } from '../../components/Jar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RollingAmount } from '../../components/RollingAmount';
import { Skeleton } from '../../components/Skeleton';
import { Snackbar } from '../../components/Snackbar';
import { SpendRow } from '../../components/SpendRow';
import { getStatus, load, spendsOnDay, totalLimit, useBudget, weekTotal, type Spend } from '../../data/budget';
import { daysLeftInWeek, formatVnd, weekRangeLabel, weekStart, weekdayIndex } from '../../data/format';
import { duration, spacing, tabular, touch, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

// Button height plus the footer's own padding; the list and the snackbar clear it by this much.
const FOOTER_HEIGHT = touch.min + spacing.s4 + spacing.s12 + spacing.s16;

export default function WeekScreen() {
  useBudget();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const status = getStatus();
  const now = new Date();
  const start = weekStart(now);
  const limit = totalLimit();
  const spent = weekTotal(start);
  const remaining = limit - spent;
  const today = spendsOnDay(now);
  const todayTotal = today.reduce((sum, s) => sum + s.amount, 0);
  const daysLeft = daysLeftInWeek(now);
  const ready = status === 'ready';
  const thisWeekHasSpends = ready && spent > 0;

  const header = (
    <View style={[styles.hero, { paddingTop: insets.top + spacing.s16 }]}>
      <Text style={[styles.eyebrow, { color: c.textMuted }]}>Tuần này, {weekRangeLabel(start)}</Text>
      {ready ? (
        <>
          <RollingAmount value={remaining} style={[styles.display, { color: remaining < 0 ? c.danger : c.text }]} accessibilityLabel="Còn lại tuần này" />
          <Text style={[styles.caption, { color: c.textMuted }]}>
            {remaining < 0 ? `vượt hạn mức tuần, còn ${daysLeft} ngày` : daysLeft === 1 ? 'còn lại đến Chủ nhật, hôm nay là ngày cuối' : `còn lại đến Chủ nhật, ${daysLeft} ngày`}
          </Text>
        </>
      ) : (
        <View style={styles.skeletonHero}>
          <Skeleton width={220} height={type.display.lineHeight} />
          <Skeleton width={160} height={type.caption.lineHeight} />
        </View>
      )}
      <View style={styles.jar}>
        <Jar level={ready && limit > 0 ? remaining / limit : 0} width={160} ticks={{ today: weekdayIndex(now) }} accessibilityLabel={ready ? `Hũ tuần này còn ${formatVnd(remaining)} trên ${formatVnd(limit)}` : 'Đang tải'} />
      </View>
      {status === 'error' ? (
        <EmptyState message="Không đọc được dữ liệu tuần này." actionLabel="Thử lại" onAction={() => load()} />
      ) : ready && !thisWeekHasSpends ? (
        <EmptyState message="Chưa có khoản chi nào tuần này. Khoản đầu tiên sẽ hiện ở đây." />
      ) : (
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Hôm nay</Text>
          {ready && today.length > 0 ? <Text style={[styles.sectionTotal, tabular, { color: c.textMuted }]}>tổng {formatVnd(todayTotal)}</Text> : null}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        data={ready ? today : []}
        keyExtractor={(s: Spend) => s.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => <SpendRow spend={item} />}
        ItemSeparatorComponent={Divider}
        itemLayoutAnimation={reduceMotion ? undefined : LinearTransition.duration(duration.slow - 50)}
        ListEmptyComponent={ready && thisWeekHasSpends ? <EmptyState message="Hôm nay chưa chi gì." /> : null}
        contentContainerStyle={{ paddingBottom: FOOTER_HEIGHT + spacing.s16 }}
        keyboardShouldPersistTaps="handled"
      />
      <View style={[styles.footer, { backgroundColor: c.surface, borderTopColor: c.divider }]}>
        <PrimaryButton label="Ghi chi tiêu" onPress={() => router.push('/log')} disabled={!ready} />
      </View>
      <Snackbar bottom={FOOTER_HEIGHT + spacing.s8} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { paddingHorizontal: spacing.s16, gap: spacing.s4 },
  eyebrow: { ...type.caption },
  display: { ...type.display, fontWeight: '700' },
  caption: { ...type.body },
  skeletonHero: { gap: spacing.s8, paddingVertical: spacing.s4 },
  jar: { paddingTop: spacing.s24, paddingBottom: spacing.s8, alignItems: 'flex-start' },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s12, paddingTop: spacing.s24, paddingBottom: spacing.s8 },
  sectionTitle: { ...type.bodyLg, fontWeight: '600', flex: 1 },
  sectionTotal: { ...type.body },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, paddingBottom: spacing.s16, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row' },
});
