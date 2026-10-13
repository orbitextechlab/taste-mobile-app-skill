// The jar: the domain element that carries the identity. A 2 pt ink outline, a glass body, the coin level
// as one accent rect clipped to the body, and optional weekly tick marks on the right side (the ideal level
// at the start of each day; today's tick is drawn in ink with its label). The level settles to a new value
// in 300 ms, decelerating, on the UI thread; with reduced motion it swaps.
import React, { useEffect, useId } from 'react';
import type { ColorValue } from 'react-native';
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { duration, radius } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { WEEKDAY_SHORT } from '../data/format';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Geometry in viewBox units. The body is 96 wide; ticks and the label add 30 on the right when present.
const JAR_W = 120;
const TICK_W = 30;
const VB_H = 150;
const BODY = { x: 12, y: 22, w: 96, h: 122 };
const INNER = { x: 13, y: 23, w: 94, h: 120 };
const RIM = { x: 30, y: 6, w: 60, h: 14 };
const STROKE = 2;
const LABEL_PT = 12;

type Props = {
  /** 0 = empty, 1 = full; values outside are clamped. */
  level: number;
  width: number;
  /** Draw the seven weekday ticks and label today's. */
  ticks?: { today: number };
  /** Overrides for monochrome contexts such as the tab bar. */
  ink?: ColorValue;
  coin?: ColorValue;
  glass?: ColorValue;
  accessibilityLabel?: string;
};

function clamp(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function Jar({ level, width, ticks, ink, coin, glass, accessibilityLabel }: Props) {
  const c = useTheme();
  const reduceMotion = useReducedMotion();
  const strokeColor = ink ?? c.text;
  const coinColor = coin ?? c.accent;
  const glassColor = glass ?? c.surfaceAlt;
  const vbW = ticks ? JAR_W + TICK_W : JAR_W;
  const height = (width * VB_H) / vbW;
  const scale = vbW / width; // viewBox units per screen point
  // Several jars can share a screen (Hũ rows), so the clip id is unique per instance.
  const clipId = `jar-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const top = useSharedValue(INNER.y + INNER.h * (1 - clamp(level)));
  useEffect(() => {
    top.value = withTiming(INNER.y + INNER.h * (1 - clamp(level)), {
      duration: reduceMotion ? 0 : duration.slow,
      easing: Easing.out(Easing.cubic),
    });
  }, [level, reduceMotion, top]);
  const coinProps = useAnimatedProps(() => ({ y: top.value }));

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${VB_H}`}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `Hũ còn ${Math.round(clamp(level) * 100)} phần trăm`}
    >
      <Defs>
        <ClipPath id={clipId}>
          <Rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={radius.jar - 1} />
        </ClipPath>
      </Defs>
      <Rect x={RIM.x} y={RIM.y} width={RIM.w} height={RIM.h} rx={4} fill={glassColor} stroke={strokeColor} strokeWidth={STROKE} />
      <Rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} rx={radius.jar} fill={glassColor} />
      <G clipPath={`url(#${clipId})`}>
        <AnimatedRect x={INNER.x} width={INNER.w} height={INNER.h} fill={coinColor} animatedProps={coinProps} />
      </G>
      <Rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} rx={radius.jar} fill="none" stroke={strokeColor} strokeWidth={STROKE} />
      {ticks
        ? WEEKDAY_SHORT.map((label, i) => {
            const y = INNER.y + (INNER.h * i) / 7;
            const isToday = i === ticks.today;
            const x1 = BODY.x + BODY.w + 4;
            return (
              <G key={label}>
                <Line x1={x1} y1={y} x2={x1 + (isToday ? 10 : 6)} y2={y} stroke={isToday ? strokeColor : c.textMuted} strokeWidth={isToday ? STROKE : 1} />
                {isToday ? (
                  <SvgText x={x1 + 14} y={y + (LABEL_PT * scale) / 3} fontSize={LABEL_PT * scale} fontWeight="600" fill={strokeColor}>
                    {label}
                  </SvgText>
                ) : null}
              </G>
            );
          })
        : null}
    </Svg>
  );
}
