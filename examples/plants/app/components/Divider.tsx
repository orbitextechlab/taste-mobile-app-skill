import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing, touch } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

/** Hairline between rows, inset past the row glyph so the glyph column reads as one. */
export function Divider({ inset = true }: { inset?: boolean }) {
  const c = useTheme();
  return <View style={[styles.line, { backgroundColor: c.divider, marginLeft: inset ? spacing.s20 + touch.glyph + spacing.s16 : 0 }]} />;
}

const styles = StyleSheet.create({ line: { height: StyleSheet.hairlineWidth } });
