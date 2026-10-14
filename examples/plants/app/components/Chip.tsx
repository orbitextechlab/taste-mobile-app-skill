// Pill chip for species and locations. Selected is the accent border; a species chip leads with its
// silhouette in the species field color.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = { label: string; selected?: boolean; onPress?: () => void; disabled?: boolean; leading?: React.ReactNode };

export function Chip({ label, selected = false, onPress, disabled = false, leading }: Props) {
  const c = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      hitSlop={spacing.s4}
      android_ripple={{ color: c.divider, borderless: false }}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? c.accent : c.divider,
          borderWidth: selected ? 2 : 1,
          backgroundColor: selected ? c.surfaceAlt : c.surface,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <Text style={[styles.label, { color: c.text, fontWeight: selected ? '700' : '500' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touch.min - spacing.s4,
    paddingHorizontal: spacing.s16,
    borderRadius: radius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s8,
  },
  leading: { marginLeft: -spacing.s4 },
  label: { ...type.body, fontFamily: fontFamily.ui },
});
