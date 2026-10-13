// A group title above rows: body weight 600 in text, sentence case. Space above separates groups.
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function GroupHeading({ children, muted = false }: { children: string; muted?: boolean }) {
  const c = useTheme();
  return (
    <Text style={[styles.heading, { color: muted ? c.textMuted : c.text, backgroundColor: c.surface }]} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '600', paddingHorizontal: spacing.s20, paddingTop: spacing.s24, paddingBottom: spacing.s8 },
});
