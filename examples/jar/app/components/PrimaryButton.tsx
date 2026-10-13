// The one filled button per screen (accent fill, ink label, radius 12) plus text variants for secondary
// and destructive actions. Pressed feedback keeps the app's one character: scale to 0.97 in 120 ms, back in
// 150 ms decelerating, no spring. Loading replaces the label and keeps the size.
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'text' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  grow?: boolean;
};

export function PrimaryButton({ label, onPress, variant = 'filled', disabled = false, loading = false, grow = true }: Props) {
  const c = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const filled = variant === 'filled';
  const labelColor = filled ? c.onAccent : variant === 'danger' ? c.danger : c.text;
  const inactive = disabled || loading;
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPressIn={() => {
        if (!reduceMotion) scale.value = withTiming(0.97, { duration: duration.fast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: duration.fast + 30, easing: Easing.out(Easing.cubic) });
      }}
      android_ripple={{ color: filled ? c.surfaceAlt : c.divider, foreground: true }}
      style={[styles.button, grow && styles.grow, filled && { backgroundColor: c.accent }, { opacity: disabled ? 0.4 : 1 }, pressStyle]}
    >
      {loading ? <ActivityIndicator color={labelColor} /> : <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touch.min + spacing.s4,
    paddingHorizontal: spacing.s24,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  grow: { flexGrow: 1 },
  label: { ...type.bodyLg, fontWeight: '600' },
});
