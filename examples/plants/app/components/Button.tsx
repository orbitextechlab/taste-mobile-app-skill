// Three weights: filled (the one decision on a screen, accent), outlined and text (secondary, in the
// color the surface calls for: the species ink on a field, text on the canvas). Pressed feedback by opacity
// and ripple; no scale bounce (character settle).
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined' | 'text';
  /** Label and border color for outlined and text variants. Defaults to the text color. */
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  grow?: boolean;
};

export function Button({ label, onPress, variant = 'filled', color, disabled = false, loading = false, grow = false }: Props) {
  const c = useTheme();
  const filled = variant === 'filled';
  const ink = color ?? c.text;
  const labelColor = filled ? c.onAccent : ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      android_ripple={{ color: filled ? c.onAccent : c.divider, foreground: true }}
      hitSlop={variant === 'text' ? spacing.s8 : undefined}
      style={({ pressed }) => [
        styles.base,
        grow && styles.grow,
        filled ? { backgroundColor: c.accent } : variant === 'outlined' ? { borderWidth: 2, borderColor: ink } : styles.text,
        { opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
      ]}
    >
      {loading ? <ActivityIndicator color={labelColor} /> : <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.min + spacing.s4,
    paddingHorizontal: spacing.s24,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grow: { flexGrow: 1 },
  text: { paddingHorizontal: spacing.s12 },
  label: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '700' },
});
