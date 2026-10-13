// The hero input on Thêm cây: how many days between waterings. Minus, the numeral at display size that
// swaps in place on every tap, plus, and the unit. The number pad is the fallback, with a Done bar on iOS.
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { DONE_ACCESSORY_ID } from './DoneAccessory';
import { SwapText } from './SwapText';

type Props = { value: number; onChange: (next: number) => void; min?: number; max?: number };

export function IntervalStepper({ value, onChange, min = 1, max = 90 }: Props) {
  const c = useTheme();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));

  const step = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) {
      void Haptics.selectionAsync();
      onChange(next);
    }
  };

  const stepButton = (label: string, delta: number, disabled: boolean) => (
    <Pressable
      onPress={() => step(delta)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={delta > 0 ? 'Thêm một ngày' : 'Bớt một ngày'}
      android_ripple={{ color: c.divider }}
      style={({ pressed }) => [styles.step, { borderColor: c.text, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }]}
    >
      <Text style={[styles.stepLabel, { color: c.text }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.row}>
      {stepButton('−', -1, value <= min)}
      <View style={styles.center}>
        {editing ? (
          <TextInput
            value={draft}
            onChangeText={(t) => setDraft(t.replace(/[^0-9]/g, ''))}
            onBlur={() => {
              const n = Number(draft);
              if (n >= min && n <= max) onChange(n);
              setEditing(false);
            }}
            autoFocus
            keyboardType="number-pad"
            returnKeyType="done"
            inputAccessoryViewID={DONE_ACCESSORY_ID}
            selectTextOnFocus
            maxLength={2}
            accessibilityLabel="Số ngày giữa hai lần tưới"
            style={[styles.value, { color: c.text }]}
          />
        ) : (
          <Pressable
            onPress={() => {
              setDraft(String(value));
              setEditing(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Mỗi ${value} ngày, chạm để nhập số`}
            hitSlop={spacing.s8}
          >
            <SwapText style={[styles.value, { color: c.text }]}>{String(value)}</SwapText>
          </Pressable>
        )}
        <Text style={[styles.unit, { color: c.textMuted }]}>ngày</Text>
      </View>
      {stepButton('+', 1, value >= max)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  step: {
    width: touch.row - spacing.s8,
    height: touch.row - spacing.s8,
    borderWidth: 2,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '500' },
  center: { flex: 1, alignItems: 'center' },
  value: { ...type.display, fontFamily: fontFamily.ui, fontWeight: '700', textAlign: 'center', minWidth: 96, padding: 0, fontVariant: ['tabular-nums'] },
  unit: { ...type.caption, fontFamily: fontFamily.ui },
});
