// Loading states laid out at the content's size so content replaces them without a jump. No shimmer.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, spacing, touch } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function SkeletonField({ height, topInset }: { height: number; topInset: number }) {
  const c = useTheme();
  return (
    <View style={[styles.field, { height, backgroundColor: c.surfaceAlt, paddingTop: topInset + spacing.s48 }]} accessibilityLabel="Đang tải" accessible>
      <View style={[styles.bar, { backgroundColor: c.divider, width: '60%', height: spacing.s32 }]} />
      <View style={[styles.bar, { backgroundColor: c.divider, width: '40%', height: spacing.s16 }]} />
    </View>
  );
}

export function SkeletonRows({ count = 6 }: { count?: number }) {
  const c = useTheme();
  return (
    <View accessibilityLabel="Đang tải" accessible>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.glyph, { backgroundColor: c.surfaceAlt }]} />
          <View style={styles.lines}>
            <View style={[styles.bar, { backgroundColor: c.surfaceAlt, width: '55%', height: spacing.s16 }]} />
            <View style={[styles.bar, { backgroundColor: c.surfaceAlt, width: '35%', height: spacing.s12 }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { paddingHorizontal: spacing.s20, gap: spacing.s12 },
  bar: { borderRadius: radius.control / 2 },
  row: { minHeight: touch.row, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s20 },
  glyph: { width: touch.glyph, height: touch.glyph, borderRadius: touch.glyph / 2 },
  lines: { flex: 1, gap: spacing.s8 },
});
