// The lane line: a hairline with one tick per km and a cap at each end, drawn in the text color of
// its surface. Static on Hôm nay; on Kết thúc it draws from start to end in 400 ms (the signature
// motion) on the UI thread. The ticks are laid out before the line draws: the course is known.
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { duration, lane } from '../theme/tokens';

type Props = {
  km: number;
  color: string;
  animate?: boolean;
  delayMs?: number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function LaneLine({ km, color, animate = false, delayMs = 0 }: Props) {
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(animate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (width > 0 && animate && !reduceMotion) {
      progress.value = withDelay(delayMs, withTiming(1, { duration: duration.slow, easing: Easing.out(Easing.cubic) }));
    }
  }, [width, animate, reduceMotion, delayMs, progress]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: width * (1 - progress.value) }));

  const y = lane.height / 2;
  const ticks = km >= 1 ? Array.from({ length: Math.floor(km) }, (_, i) => (width * (i + 1)) / km) : [];

  return (
    <View
      style={styles.wrap}
      onLayout={(e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width))}
      accessibilityRole="image"
      accessibilityLabel={`Đường chạy ${km} km`}
    >
      {width > 0 ? (
        <Svg width={width} height={lane.height}>
          <Line x1={1} y1={y - lane.tick} x2={1} y2={y + lane.tick} stroke={color} strokeWidth={lane.stroke} />
          {ticks.map((x, i) => (
            <Line key={i} x1={x} y1={y - lane.tick / 2} x2={x} y2={y + lane.tick / 2} stroke={color} strokeWidth={lane.stroke} />
          ))}
          <Line x1={width - 1} y1={y - lane.tick} x2={width - 1} y2={y + lane.tick} stroke={color} strokeWidth={lane.stroke} />
          <AnimatedPath
            d={`M0 ${y} H${width}`}
            stroke={color}
            strokeWidth={lane.stroke}
            strokeDasharray={[width, width]}
            animatedProps={animatedProps}
          />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: lane.height, width: '100%' },
});
