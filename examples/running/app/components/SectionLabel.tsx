// Sentence-case label for a group of content. Muted, weight 600; never uppercase.
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function SectionLabel({ children, onField = false }: { children: string; onField?: boolean }) {
  const c = useTheme();
  return <Text style={[styles.label, { color: onField ? c.onField : c.textMuted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: { ...type.body, fontWeight: '600', paddingHorizontal: spacing.s16, paddingTop: spacing.s32, paddingBottom: spacing.s8 },
});
