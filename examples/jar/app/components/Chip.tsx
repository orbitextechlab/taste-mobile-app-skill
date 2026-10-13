// Pill chip for the jar choice and recent places. 1 pt ink border; selected fills with surface-alt, or with
// the accent when the chip is the chosen jar (tone="accent"). Pressed feedback is a tint, never a bounce.
// The label keeps one weight so selecting a chip never changes its width under the thumb.
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  tone?: 'ink' | 'accent';
};

export function Chip({ label, selected = false, onPress, disabled = false, tone = 'ink' }: Props) {
  const c = useTheme();
  const fill = selected ? (tone === 'accent' ? c.accent : c.surfaceAlt) : c.surface;
  const textColor = selected && tone === 'accent' ? c.onAccent : c.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      hitSlop={6}
      android_ripple={{ color: c.divider, borderless: false }}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: selected && tone === 'accent' ? c.accent : c.text, backgroundColor: pressed && !selected ? c.surfaceAlt : fill, opacity: disabled ? 0.4 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: spacing.s40,
    minWidth: touch.min,
    paddingHorizontal: spacing.s16,
    borderWidth: 1,
    borderRadius: radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...type.body, fontWeight: '500' },
});
