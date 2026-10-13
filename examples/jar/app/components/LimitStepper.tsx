// One jar's weekly limit: name on the left, then − / rolling amount / + in 50.000 ₫ steps. The buttons never
// move or change size; only the numeral rolls (200 ms). No keyboard: limits are round amounts.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { RollingAmount } from './RollingAmount';

export const LIMIT_STEP = 50_000;
const LIMIT_MAX = 50_000_000;

type Props = { name: string; value: number; onChange: (next: number) => void };

export function LimitStepper({ name, value, onChange }: Props) {
  const c = useTheme();
  const button = (label: string, delta: number, disabled: boolean) => (
    <Pressable
      onPress={() => onChange(Math.min(LIMIT_MAX, Math.max(0, value + delta)))}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${delta > 0 ? 'Tăng' : 'Giảm'} hạn mức ${name}`}
      android_ripple={{ color: c.divider }}
      style={({ pressed }) => [styles.step, { borderColor: c.text, backgroundColor: pressed ? c.surfaceAlt : c.surface, opacity: disabled ? 0.4 : 1 }]}
    >
      <Text style={[styles.stepLabel, { color: c.text }]}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={styles.row}>
      <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{name}</Text>
      {button('−', -LIMIT_STEP, value <= 0)}
      <RollingAmount value={value} style={[styles.value, { color: c.text }]} accessibilityLabel={`Hạn mức ${name}`} />
      {button('+', LIMIT_STEP, value >= LIMIT_MAX)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.s8 },
  name: { ...type.bodyLg, fontWeight: '600', flex: 1 },
  step: { width: touch.min - spacing.s4, height: touch.min - spacing.s4, borderWidth: 1, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { ...type.heading, fontWeight: '500' },
  // Wide enough for 50.000.000 ₫ so the buttons never move when the numeral grows.
  value: { ...type.bodyLg, fontWeight: '600', minWidth: 120, textAlign: 'right' },
});
