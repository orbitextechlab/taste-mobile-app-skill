// The one number per screen, set like a bib number: display size, weight 800, tabular figures, the
// unit quiet beside it. With roll, the numeral rolls 180 ms in the direction of the change on the UI
// thread; with settleOnMount it performs that roll once as it arrives (the end of a run). Reduced
// motion swaps instead of rolling.
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { duration, spacing, tabular, type } from '../theme/tokens';

type Props = {
  value: string;
  unit?: string;
  color: string;
  unitColor: string;
  roll?: boolean;
  settleOnMount?: boolean;
  muted?: boolean;
};

const TRAVEL = 8;

function toNumber(s: string): number {
  return Number(s.replace(',', '.')) || 0;
}

export function BibNumeral({ value, unit, color, unitColor, roll = false, settleOnMount = false, muted = false }: Props) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const prev = useRef(value);

  useEffect(() => {
    if (settleOnMount && !reduceMotion) {
      offset.value = withSequence(withTiming(TRAVEL, { duration: 0 }), withTiming(0, { duration: duration.base, easing: Easing.out(Easing.cubic) }));
      opacity.value = withSequence(withTiming(0.3, { duration: 0 }), withTiming(1, { duration: duration.base }));
    }
    // Runs once: the settle belongs to arrival, never to a later change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roll && prev.current !== value && !reduceMotion) {
      const dir = toNumber(value) >= toNumber(prev.current) ? 1 : -1;
      offset.value = withSequence(withTiming(TRAVEL * dir, { duration: 0 }), withTiming(0, { duration: duration.base, easing: Easing.out(Easing.cubic) }));
      opacity.value = withSequence(withTiming(0.3, { duration: 0 }), withTiming(1, { duration: duration.base }));
    }
    prev.current = value;
  }, [value, roll, reduceMotion, offset, opacity]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }], opacity: opacity.value }));

  return (
    <View style={styles.row} accessibilityRole="text" accessibilityLabel={unit ? `${value} ${unit}` : value}>
      <Animated.View style={animated}>
        <Text style={[styles.value, { color, opacity: muted ? 0.5 : 1 }]} maxFontSizeMultiplier={1.3} numberOfLines={1}>
          {value}
        </Text>
      </Animated.View>
      {unit ? (
        <Text style={[styles.unit, { color: unitColor }]} maxFontSizeMultiplier={1.3}>
          {unit}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s8 },
  value: { ...type.display, ...tabular, fontWeight: '800', letterSpacing: -2 },
  unit: { ...type.heading, fontWeight: '500', marginBottom: spacing.s12 },
});
