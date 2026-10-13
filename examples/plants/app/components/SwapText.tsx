// A text whose value changes in place: on change it drops 4 pt and dims, then settles back over 150 ms
// (motion_system.change). The row never changes height. Reduced motion swaps instantly.
import React, { useEffect, useRef } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { duration } from '../theme/tokens';

type Props = { children: string; style?: StyleProp<TextStyle>; accessibilityLiveRegion?: 'none' | 'polite' | 'assertive' };

export function SwapText({ children, style, accessibilityLiveRegion }: Props) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const prev = useRef(children);

  useEffect(() => {
    if (prev.current !== children && !reduceMotion) {
      offset.value = withSequence(withTiming(4, { duration: 0 }), withTiming(0, { duration: duration.fast, easing: Easing.out(Easing.cubic) }));
      opacity.value = withSequence(withTiming(0.3, { duration: 0 }), withTiming(1, { duration: duration.fast, easing: Easing.out(Easing.cubic) }));
    }
    prev.current = children;
  }, [children, reduceMotion, offset, opacity]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }], opacity: opacity.value }));

  return (
    <Animated.Text style={[style, animated]} accessibilityLiveRegion={accessibilityLiveRegion}>
      {children}
    </Animated.Text>
  );
}
