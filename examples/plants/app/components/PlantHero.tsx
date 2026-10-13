// The hero band on Hôm nay and Chi tiết cây: the field, a top line, the plant's name at display size,
// the care line that swaps in place, and the actions. Đã tưới is the only filled button on the screen
// and is filled only when the plant is due; Để tối nay is text and appears only when due.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { careLine, isDue, postponeTarget, wateredToday, type Plant } from '../data/plants';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Button } from './Button';
import { PlantField, useSpeciesTone } from './PlantField';
import { SwapText } from './SwapText';

type Props = {
  plant: Plant;
  height: number;
  topInset: number;
  topLine?: string;
  onWater: () => void;
  onPostpone: () => void;
  busy?: boolean;
  error?: string | null;
  now?: Date;
};

export function PlantHero({ plant, height, topInset, topLine, onWater, onPostpone, busy = false, error = null, now = new Date() }: Props) {
  const c = useTheme();
  const tone = useSpeciesTone(plant.species);
  const due = isDue(plant, now);
  const done = wateredToday(plant, now);
  return (
    <PlantField species={plant.species} height={height} tilted={due}>
      <View style={[styles.content, { paddingTop: topInset + spacing.s16 }]}>
        {topLine ? <Text style={[styles.topLine, { color: tone.ink }]}>{topLine}</Text> : null}
        <Text style={[styles.name, { color: tone.ink }]} numberOfLines={2} accessibilityRole="header">
          {plant.name}
        </Text>
        <SwapText style={[styles.care, { color: tone.ink }]} accessibilityLiveRegion="polite">
          {careLine(plant, now)}
        </SwapText>
        <View style={styles.spacer} />
        <View style={styles.actions}>
          <Button label="Đã tưới" onPress={onWater} variant={due ? 'filled' : 'outlined'} color={tone.ink} loading={busy} disabled={done} />
          {due ? <Button label={postponeTarget(now).label} onPress={onPostpone} variant="text" color={tone.ink} disabled={busy} /> : null}
        </View>
        {error ? (
          <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">
            {error}
          </Text>
        ) : null}
      </View>
    </PlantField>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.s20, paddingBottom: spacing.s24 },
  topLine: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '600', opacity: 0.72, marginBottom: spacing.s8 },
  name: { ...type.display, fontFamily: fontFamily.ui, fontWeight: '700', maxWidth: '78%' },
  care: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600', fontVariant: ['tabular-nums'], marginTop: spacing.s8 },
  spacer: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  error: { ...type.body, fontFamily: fontFamily.ui, marginTop: spacing.s8 },
});
