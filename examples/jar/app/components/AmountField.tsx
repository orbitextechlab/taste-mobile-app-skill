// The hero input: a VND amount typed on the system number pad, shown at display size with grouping dots
// as it is typed, the ₫ sign beside it. On iOS the keyboard carries a 000 and Xong accessory bar [R-KB7];
// on Android, whose pad has Done and no accessory view, a 000 chip sits beside the numeral instead.
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { groupDigits } from '../data/format';
import { spacing, tabular, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Chip } from './Chip';

export const MAX_AMOUNT = 999_999_999;

type Props = {
  value: number;
  onChange: (next: number) => void;
  onTripleZero?: () => void;
  autoFocus?: boolean;
  tone?: 'text' | 'danger';
  /** The id of the screen's KeypadAccessory (useKeypadAccessoryId). */
  accessoryId?: string;
};

export function AmountField({ value, onChange, onTripleZero, autoFocus = false, tone = 'text', accessoryId }: Props) {
  const c = useTheme();
  const color = tone === 'danger' ? c.danger : c.text;
  const shown = value === 0 ? '' : groupDigits(value);
  // A single-line TextInput on iOS does not grow with its text, so a long amount scrolled inside a
  // 48 pt box and lost its first digits. Measure the same string with an invisible Text and size the
  // input to it, so the ₫ sign stays beside the last digit.
  const [width, setWidth] = useState(0);
  return (
    <View style={styles.row}>
      <Text
        style={[styles.value, tabular, styles.measure]}
        onLayout={(e) => setWidth(Math.ceil(e.nativeEvent.layout.width))}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {shown || '0'}
      </Text>
      <TextInput
        value={shown}
        onChangeText={(t) => onChange(Math.min(MAX_AMOUNT, Number(t.replace(/[^0-9]/g, '')) || 0))}
        placeholder="0"
        placeholderTextColor={c.textMuted}
        keyboardType="number-pad"
        returnKeyType="done"
        inputAccessoryViewID={accessoryId}
        autoFocus={autoFocus}
        selectTextOnFocus
        accessibilityLabel="Số tiền, đồng"
        style={[styles.value, tabular, { color, width: width ? width + spacing.s4 : undefined }]}
      />
      <Text style={[styles.sign, { color: c.textMuted }]}>₫</Text>
      {Platform.OS !== 'ios' && onTripleZero ? <Chip label="000" onPress={onTripleZero} disabled={value === 0} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s8 },
  value: { ...type.display, fontWeight: '700', padding: 0, minWidth: spacing.s48 },
  sign: { ...type.heading, fontWeight: '500', flex: 1 },
  measure: { position: 'absolute', opacity: 0, left: 0, top: 0 },
});
