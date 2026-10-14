// A numeral that rolls to its new value in place (200 ms, decelerating, UI thread). Digits travel in the
// direction of the change; the text is tabular so the row never changes width. Reduced motion swaps.
import React, { useEffect, useRef } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { formatVnd } from '../data/format';
import { duration, tabular } from '../theme/tokens';

type Props = {
  value: number;
  format?: (n: number) => string;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

export function RollingAmount({ value, format = formatVnd, style, accessibilityLabel }: Props) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value && !reduceMotion) {
      // An increase arrives from below and settles up; a decrease arrives from above and settles down.
      const from = value > prev.current ? 8 : -8;
      const easing = Easing.out(Easing.cubic);
      offset.value = withSequence(withTiming(from, { duration: 0 }), withTiming(0, { duration: duration.base, easing }));
      opacity.value = withSequence(withTiming(0.3, { duration: 0 }), withTiming(1, { duration: duration.base, easing }));
    }
    prev.current = value;
  }, [value, reduceMotion, offset, opacity]);

  const roll = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }], opacity: opacity.value }));

  return (
    <Animated.Text style={[tabular, style, roll]} accessibilityLabel={accessibilityLabel} accessibilityLiveRegion="polite">
      {format(value)}
    </Animated.Text>
  );
}
