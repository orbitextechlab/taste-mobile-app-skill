// Hũ: Dashboard. The headline is one figure, the week against last week through the same weekday, with one
// line of context; under it the four jars as rows with a small jar glyph carrying each level, name, remaining
// and spent; then one total line. No chart, no cards. The glyph levels settle when a limit or a spend changes.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { Jar } from '../../components/Jar';
import { RollingAmount } from '../../components/RollingAmount';
import { Skeleton } from '../../components/Skeleton';
import { Snackbar } from '../../components/Snackbar';
import { comparedToLastWeek, getStatus, listJars, load, spentByJar, totalLimit, useBudget, weekTotal } from '../../data/budget';
import { WEEKDAY_LONG, formatVnd, weekStart, weekdayIndex } from '../../data/format';
import { spacing, tabular, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function JarsScreen() {
  useBudget();
  const c = useTheme();
  const status = getStatus();
  const ready = status === 'ready';
  const now = new Date();
  const start = weekStart(now);
  const jars = listJars();
  const spent = spentByJar(start);
  const spentTotal = weekTotal(start);
  const limit = totalLimit();
  const diff = comparedToLastWeek(now);
  const weekday = WEEKDAY_LONG[weekdayIndex(now)];
  const comparison = diff < 0 ? `ít hơn tuần trước, tính đến ${weekday}` : diff > 0 ? `nhiều hơn tuần trước, tính đến ${weekday}` : `bằng tuần trước, tính đến ${weekday}`;

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headline}>
          {ready ? (
            <>
              <RollingAmount value={Math.abs(diff)} style={[styles.display, { color: c.text }]} accessibilityLabel="So với tuần trước" />
              <Text style={[styles.caption, { color: c.textMuted }]}>{comparison}</Text>
              <Text style={[styles.spent, tabular, { color: c.text }]}>
                đã chi {formatVnd(spentTotal)} <Text style={{ color: c.textMuted }}>trên {formatVnd(limit)}</Text>
              </Text>
            </>
          ) : (
            <View style={styles.skeletonHead}>
              <Skeleton width={200} height={type.display.lineHeight} />
              <Skeleton width={240} height={type.caption.lineHeight} />
            </View>
          )}
        </View>

        {status === 'error' ? <EmptyState message="Không đọc được dữ liệu. Các hũ dưới đây là bản đã lưu." actionLabel="Thử lại" onAction={() => load()} /> : null}
        {ready && spentTotal === 0 ? <EmptyState message="Chưa chi gì tuần này. Các hũ còn nguyên." /> : null}

        <View style={styles.rows}>
          {(ready ? jars : []).map((jar, i) => {
            const used = spent[jar.id];
            const remaining = jar.limit - used;
            const over = remaining < 0;
            return (
              <React.Fragment key={jar.id}>
                {i > 0 ? <Divider /> : null}
                <View style={styles.row} accessibilityLabel={`${jar.name}, còn ${formatVnd(remaining)}, đã chi ${formatVnd(used)} trên ${formatVnd(jar.limit)}`}>
                  <Jar level={jar.limit > 0 ? remaining / jar.limit : 0} width={28} />
                  <View style={styles.rowText}>
                    <Text style={[styles.rowName, { color: c.text }]}>{jar.name}</Text>
                    <Text style={[styles.rowMeta, tabular, { color: c.textMuted }]}>
                      đã chi {formatVnd(used)} trên {formatVnd(jar.limit)}
                    </Text>
                  </View>
                  <Text style={[styles.rowRemaining, tabular, { color: over ? c.danger : c.text }]}>{over ? `vượt ${formatVnd(-remaining)}` : formatVnd(remaining)}</Text>
                </View>
              </React.Fragment>
            );
          })}
          {!ready
            ? [0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.row}>
                  <Jar level={0} width={28} />
                  <Skeleton width="60%" height={type.bodyLg.lineHeight} />
                </View>
              ))
            : null}
        </View>

        {ready ? (
          <Text style={[styles.total, tabular, { color: c.textMuted }]}>
            Tổng hạn mức tuần {formatVnd(limit)}, còn {formatVnd(limit - spentTotal)}
          </Text>
        ) : null}
      </ScrollView>
      <Snackbar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s24 },
  headline: { paddingHorizontal: spacing.s16, paddingTop: spacing.s16, gap: spacing.s4 },
  display: { ...type.display, fontWeight: '700' },
  caption: { ...type.body },
  spent: { ...type.body, paddingTop: spacing.s8 },
  skeletonHead: { gap: spacing.s8 },
  rows: { paddingTop: spacing.s24 },
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s16, paddingVertical: spacing.s8 },
  rowText: { flex: 1, gap: 2 },
  rowName: { ...type.bodyLg, fontWeight: '600' },
  rowMeta: { ...type.caption },
  rowRemaining: { ...type.bodyLg, textAlign: 'right' },
  total: { ...type.body, paddingHorizontal: spacing.s16, paddingTop: spacing.s24 },
});
