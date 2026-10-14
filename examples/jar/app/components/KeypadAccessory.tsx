// iOS number pads have no return key, so the amount input gets a bar attached to the keyboard itself with the
// two controls the task needs: 000 (append three zeros) and Xong [R-KB7]. Being part of the keyboard frame it
// never overlaps the keyboard-sticky footer. Android pads carry Done; the 000 chip lives in AmountField there.
import { useRef } from 'react';
import React from 'react';
import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

// One id per mounted screen. A second InputAccessoryView mounted with an id that an unmounted one used
// before is not registered again on iOS, so a reopened modal got the system Done bar instead of this one.
let counter = 0;
export function useKeypadAccessoryId(): string {
  const id = useRef<string | null>(null);
  if (id.current === null) id.current = `keypad-${++counter}`;
  return id.current;
}

export function KeypadAccessory({ id, onTripleZero }: { id: string; onTripleZero?: () => void }) {
  const c = useTheme();
  if (Platform.OS !== 'ios') return null;
  return (
    <InputAccessoryView nativeID={id} backgroundColor={c.surfaceAlt}>
      <View style={[styles.bar, { borderTopColor: c.divider }]}>
        {onTripleZero ? (
          <Pressable onPress={onTripleZero} accessibilityRole="button" accessibilityLabel="Thêm ba số không" hitSlop={8} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}>
            <Text style={[styles.label, { color: c.text }]}>000</Text>
          </Pressable>
        ) : null}
        <View style={styles.spacer} />
        <Pressable onPress={Keyboard.dismiss} accessibilityRole="button" hitSlop={8} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}>
          <Text style={[styles.label, { color: c.text }]}>Xong</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s8, borderTopWidth: StyleSheet.hairlineWidth },
  spacer: { flex: 1 },
  button: { minHeight: touch.min - spacing.s4, minWidth: touch.min, paddingHorizontal: spacing.s12, justifyContent: 'center', alignItems: 'center' },
  label: { ...type.bodyLg, fontWeight: '600' },
});
