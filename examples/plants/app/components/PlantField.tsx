// The species field: the signature surface. One flat fill in the species color, the silhouette anchored
// bottom-right and clipped by the field, content laid over it top-left. The silhouette is drawn tilted
// while the plant is thirsty and settles upright on Đã tưới (the signature motion, 400 ms, decelerate).
// A change of species (the Thêm cây preview) swaps the fill in place over 150 ms.
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SpeciesId } from '../data/plants';
import { duration, tilt, type SpeciesTone } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { PlantSilhouette } from './PlantSilhouette';

type Props = {
  species: SpeciesId | null;
  height: number;
  /** Thirsty tilt while true; when it turns false the silhouette settles upright. */
  tilted?: boolean;
  /** Silhouette size as a fraction of the field height. */
  silhouette?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function useSpeciesTone(species: SpeciesId | null): SpeciesTone {
  const c = useTheme();
  return species ? c.species[species] : { field: c.surfaceAlt, ink: c.text };
}

export function PlantField({ species, height, tilted = false, silhouette = 0.72, style, children }: Props) {
  const tone = useSpeciesTone(species);
  const reduceMotion = useReducedMotion();
  const size = Math.round(height * silhouette);
  const angle = useSharedValue(tilted ? tilt.thirsty : 0);
  const wasTilted = useRef(tilted);
  const fill = useSharedValue(tone.field);

  useEffect(() => {
    // a species change on the preview swaps the field color in place (motion_system.change)
    fill.value = reduceMotion ? tone.field : withTiming(tone.field, { duration: duration.fast, easing: Easing.out(Easing.cubic) });
  }, [tone.field, reduceMotion, fill]);

  useEffect(() => {
    if (wasTilted.current && !tilted) {
      // the settle: the only place the character of the app is spent
      angle.value = reduceMotion ? 0 : withTiming(0, { duration: duration.settle, easing: Easing.out(Easing.cubic) });
    } else if (!wasTilted.current && tilted) {
      // undo brought the thirst back: a change in place, not a celebration
      angle.value = reduceMotion ? tilt.thirsty : withTiming(tilt.thirsty, { duration: duration.base, easing: Easing.out(Easing.cubic) });
    }
    wasTilted.current = tilted;
  }, [tilted, reduceMotion, angle]);

  // rotate about the silhouette's base: shift the pivot down by half the height, rotate, shift back
  const settle = useAnimatedStyle(() => ({
    transform: [{ translateY: size / 2 }, { rotate: `${angle.value}deg` }, { translateY: -size / 2 }],
  }));
  const background = useAnimatedStyle(() => ({ backgroundColor: fill.value }));

  return (
    <Animated.View style={[styles.field, { height }, background, style]}>
      {species ? (
        <Animated.View style={[styles.silhouette, { width: size, height: size, right: -Math.round(size * 0.12), bottom: -Math.round(size * 0.06) }, settle]} pointerEvents="none">
          <PlantSilhouette species={species} size={size} color={tone.ink} />
        </Animated.View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  field: { overflow: 'hidden', width: '100%' },
  silhouette: { position: 'absolute' },
  content: { flex: 1 },
});
