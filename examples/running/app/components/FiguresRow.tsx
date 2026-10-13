// Level 2: a row of figures (pace, time) at body-lg 600 with caption labels under them. Tabular so
// the live values never shift their neighbours.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, tabular, type } from '../theme/tokens';

export type Figure = { value: string; label: string };

type Props = { items: Figure[]; color: string; mutedColor: string };

export function FiguresRow({ items, color, mutedColor }: Props) {
  return (
    <View style={styles.row}>
      {items.map((f) => (
        <View key={f.label} accessibilityLabel={`${f.label} ${f.value}`}>
          <Text style={[styles.value, { color }]}>{f.value}</Text>
          <Text style={[styles.label, { color: mutedColor }]}>{f.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.s32 },
  value: { ...type.bodyLg, ...tabular, fontWeight: '600' },
  label: { ...type.caption },
});
