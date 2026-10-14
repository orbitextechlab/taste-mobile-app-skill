// Loading placeholder laid out at the content's size. Static: no shimmer, no pulse (M-AI-06).
import React from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Props = { width: DimensionValue; height: number; onField?: boolean };

export function SkeletonBlock({ width, height, onField = false }: Props) {
  const c = useTheme();
  return <View style={[styles.block, { width, height, backgroundColor: onField ? c.fieldDivider : c.surfaceAlt }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

const styles = StyleSheet.create({ block: {} });
