// The track oval: the pill is the shape of every run control. One filled pill per screen.
// Press feedback is a 120 ms scale on the UI thread; the spring runs on release only.
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { duration, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export type PillVariant = 'accent' | 'ink' | 'outline' | 'text';

type Props = {
  label: string;
  onPress: () => void;
  variant?: PillVariant;
  /** On the red field: ink fills, white outlines and text. */
  onField?: boolean;
  /** pill: the 56 pt start and save pill; control: the 64 pt run controls; chip: a 44 pt place chip that does not stretch. */
  size?: 'pill' | 'control' | 'chip';
  disabled?: boolean;
  loading?: boolean;
  labelColor?: string;
  accessibilityLabel?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PillButton({ label, onPress, variant = 'accent', onField = false, size = 'pill', disabled = false, loading = false, labelColor, accessibilityLabel }: Props) {
  const c = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const line = onField ? c.onField : c.text;
  const fill = variant === 'accent' ? c.accent : variant === 'ink' ? (onField ? c.fieldInk : c.text) : 'transparent';
  const text = labelColor ?? (variant === 'accent' ? c.onAccent : variant === 'ink' ? (onField ? c.onField : c.surface) : line);
  const border = variant === 'outline' ? line : 'transparent';
  const inactive = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      android_ripple={{ color: onField ? c.fieldDivider : c.divider, foreground: true }}
      onPressIn={() => {
        if (!reduceMotion) scale.value = withTiming(0.97, { duration: duration.fast });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.base,
        size === 'control' ? styles.control : size === 'chip' ? styles.chip : styles.pill,
        variant === 'text' && styles.text,
        { backgroundColor: fill, borderColor: border, opacity: disabled ? 0.4 : 1 },
        animated,
      ]}
    >
      {loading ? <ActivityIndicator color={text} /> : <Text style={[styles.label, size === 'chip' && styles.chipLabel, { color: text }]}>{label}</Text>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexGrow: 1,
    paddingHorizontal: spacing.s24,
    borderRadius: radius.control,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pill: { minHeight: touch.pill },
  control: { minHeight: touch.control },
  chip: { minHeight: touch.min, paddingHorizontal: spacing.s16, flexGrow: 0 },
  text: { borderWidth: 0, minHeight: touch.min },
  label: { ...type.bodyLg, fontWeight: '700' },
  chipLabel: { ...type.body, fontWeight: '600' },
});
