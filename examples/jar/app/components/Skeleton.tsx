// A surface-alt block laid out at the content's size, replaced by content without a layout jump. No shimmer:
// the first read takes a quarter of a second, far under the 1.5 s where a shimmer would be allowed.
import React from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function Skeleton({ width, height }: { width: DimensionValue; height: number }) {
  const c = useTheme();
  return <View style={[styles.block, { width, height, backgroundColor: c.surfaceAlt }]} accessibilityLabel="Đang tải" />;
}

const styles = StyleSheet.create({ block: { borderRadius: radius.control } });
