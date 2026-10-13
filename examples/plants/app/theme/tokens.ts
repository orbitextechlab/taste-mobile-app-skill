// Tokens from MOBILE-DESIGN.md (schema 3, direction "Bao hạt giống"). The only place hex values live.
import { Platform } from 'react-native';
import type { SpeciesId } from '../data/plants';

export type SpeciesTone = { field: string; ink: string };

export const colors = {
  light: {
    surface: '#F7F8F4',
    surfaceAlt: '#ECEEE6',
    text: '#1B1F17',
    textMuted: '#5F665A',
    accent: '#1A66C9',
    onAccent: '#FFFFFF',
    danger: '#B42318',
    divider: '#DDE0D6',
    species: {
      monstera: { field: '#B9DC4C', ink: '#2D4713' },
      pothos: { field: '#86D6B0', ink: '#0E4B32' },
      sansevieria: { field: '#E5C94F', ink: '#4A3B06' },
      cactus: { field: '#F0A8BA', ink: '#5C1730' },
      fig: { field: '#E6A47C', ink: '#552611' },
    } satisfies Record<SpeciesId, SpeciesTone>,
  },
  dark: {
    surface: '#121410',
    surfaceAlt: '#1C1F19',
    text: '#F1F3EC',
    textMuted: '#9DA496',
    accent: '#6FA8FF',
    onAccent: '#08172E',
    danger: '#F09A8E',
    divider: '#2A2E27',
    species: {
      monstera: { field: '#3E5A14', ink: '#D6F08A' },
      pothos: { field: '#1E5A41', ink: '#A9EBD0' },
      sansevieria: { field: '#5C4A0C', ink: '#F0DC80' },
      cactus: { field: '#6A2238', ink: '#F5BFCC' },
      fig: { field: '#6B3418', ink: '#F2C2A4' },
    } satisfies Record<SpeciesId, SpeciesTone>,
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];

// Five even sizes, line heights fixed. Display is the plant name on the field, the list root title and the
// interval numeral: one per screen.
export const type = {
  caption: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 14, lineHeight: 20 },
  bodyLg: { fontSize: 16, lineHeight: 22 },
  heading: { fontSize: 22, lineHeight: 28 },
  display: { fontSize: 34, lineHeight: 40 },
} as const;

export const fontFamily = {
  ui: Platform.select({ android: 'Roboto', ios: 'System', default: undefined }),
} as const;

export const spacing = { s4: 4, s8: 8, s12: 12, s16: 16, s20: 20, s24: 24, s32: 32, s48: 48 } as const;

// The field has no radius; buttons and the stepper 14; chips are pills; the snackbar 12.
export const radius = { field: 0, control: 14, chip: 999, snackbar: 12 } as const;

export const duration = { fast: 150, base: 200, slow: 250, settle: 400 } as const;

// Tap sizes: 44 on iOS, 48 on Android; rows are 64 at DENSITY 3; the silhouette glyph on rows is 32.
export const touch = { min: Platform.OS === 'android' ? 48 : 44, row: 64, glyph: 32, chipGlyph: 20 } as const;

// The thirsty tilt of a due plant's hero silhouette, in degrees; the settle brings it to 0.
export const tilt = { thirsty: -6 } as const;
