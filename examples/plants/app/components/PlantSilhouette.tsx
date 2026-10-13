// The five species silhouettes, drawn for this app: one or two paths each in a 100 x 100 box, flat fill.
// They are the imagery of the direction (MOBILE-DESIGN.md, Visual DNA, Imagery): large and clipped on the
// hero field, 32 pt as the row glyph, 20 pt inside species chips.
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SpeciesId } from '../data/plants';

const PATHS: Record<SpeciesId, string[]> = {
  // split leaf with two holes, stem at the bottom
  monstera: [
    'M47 98 L47 88 C40 87 32 86 26 82 L44 70 L40 66 L16 74 C10 64 8 52 10 44 L40 52 L40 47 L14 36 C16 26 24 16 34 12 L42 30 L46 28 L40 10 C44 8 48 7 50 7 C52 7 56 8 60 10 L54 28 L58 30 L66 12 C76 16 84 26 86 36 L60 47 L60 52 L90 44 C92 52 90 64 84 74 L60 66 L56 70 L74 82 C68 86 60 87 53 88 L53 98 Z M34 58 C34 54 37 52 40 54 C43 57 42 64 38 64 C35 64 34 61 34 58 Z M62 60 C62 56 65 54 68 56 C71 59 70 66 66 66 C63 66 62 63 62 60 Z',
  ],
  // heart leaf with a vine trailing to a second, smaller leaf
  pothos: [
    'M42 10 C52 2 72 8 74 26 C76 44 60 62 42 76 C24 62 8 44 10 26 C12 8 32 2 42 10 Z',
    'M41 75 C50 84 60 90 72 92 L71 95 C58 93 47 87 39 78 Z M74 84 C78 80 86 82 86 88 C86 93 79 97 74 99 C69 97 62 93 62 88 C62 82 70 80 74 84 Z',
  ],
  // five sword leaves from one base
  sansevieria: [
    'M50 4 C56 20 58 50 56 94 L44 94 C42 50 44 20 50 4 Z M28 18 C40 34 42 60 40 94 L30 94 C26 60 22 36 28 18 Z M72 18 C78 36 74 60 70 94 L60 94 C58 60 60 34 72 18 Z M12 40 C24 52 26 72 24 94 L16 94 C12 72 8 54 12 40 Z M88 40 C92 54 88 72 84 94 L76 94 C74 72 76 52 88 40 Z',
  ],
  // opuntia pad with two ears, in a pot
  cactus: [
    'M50 30 C62 30 72 42 72 58 C72 70 62 78 50 78 C38 78 28 70 28 58 C28 42 38 30 50 30 Z M30 14 C40 10 48 20 46 34 C40 38 34 36 30 30 C26 24 26 18 30 14 Z M70 14 C74 18 74 24 70 30 C66 36 60 38 54 34 C52 20 60 10 70 14 Z',
    'M26 80 L74 80 L70 98 L30 98 Z',
  ],
  // three fiddle leaves on a trunk, in a pot
  fig: [
    'M50 60 C46 52 40 46 40 36 C40 28 44 24 46 20 C48 14 44 8 50 6 C56 8 52 14 54 20 C56 24 60 28 60 36 C60 46 54 52 50 60 Z M47 66 C40 63 32 63 26 56 C22 51 22 46 21 42 C19 37 12 36 15 31 C20 28 21 35 26 37 C30 39 35 39 39 44 C45 51 45 58 47 66 Z M53 66 C55 58 55 51 61 44 C65 39 70 39 74 37 C79 35 80 28 85 31 C88 36 81 37 79 42 C78 46 78 51 74 56 C68 63 60 63 53 66 Z M48 56 L52 56 L52 80 L48 80 Z',
    'M32 80 L68 80 L64 98 L36 98 Z',
  ],
};

type Props = { species: SpeciesId; size: number; color: string; accessibilityLabel?: string };

export function PlantSilhouette({ species, size, color, accessibilityLabel }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel={accessibilityLabel} accessible={Boolean(accessibilityLabel)}>
      {PATHS[species].map((d, i) => (
        <Path key={i} d={d} fill={color} fillRule="evenodd" />
      ))}
    </Svg>
  );
}
