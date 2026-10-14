// A plant as a row: the 32 pt silhouette in the species field color as a naked glyph, the name, and one
// line (the next date, or what the screen passes). Pushes Chi tiết cây. Due rows show the date in the accent.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { rowLine, type Plant } from '../data/plants';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { PlantSilhouette } from './PlantSilhouette';

type Props = { plant: Plant; line?: string; now?: Date };

export function PlantRow({ plant, line, now = new Date() }: Props) {
  const c = useTheme();
  const router = useRouter();
  const next = rowLine(plant, now);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/plant/[id]', params: { id: plant.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${plant.name}, ${line ?? next.date}`}
      android_ripple={{ color: c.divider }}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.glyph}>
        <PlantSilhouette species={plant.species} size={touch.glyph} color={c.species[plant.species].field} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={[styles.line, { color: c.textMuted }]} numberOfLines={1}>
          {line ?? (
            <>
              <Text style={{ color: next.due ? c.accent : c.textMuted, fontWeight: next.due ? '600' : '400' }}>{next.date}</Text>
              {` · ${new Intl.NumberFormat('vi-VN').format(plant.amountMl)} ml`}
            </>
          )}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: touch.row, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s20 },
  glyph: { width: touch.glyph, alignItems: 'center' },
  text: { flex: 1, gap: spacing.s4 },
  name: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '500' },
  line: { ...type.body, fontFamily: fontFamily.ui, fontVariant: ['tabular-nums'] },
});
