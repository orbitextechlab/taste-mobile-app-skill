// Tokens from MOBILE-DESIGN.md (schema 3, direction "Số bib"). The only place hex values live.
import type { TextStyle } from 'react-native';
export const colors = {
  light: {
    surface: '#FFFFFF',
    surfaceAlt: '#F2F1EC',
    text: '#121212',
    textMuted: '#6B6964',
    accent: '#E3262C',
    onAccent: '#FFFFFF',
    onField: '#FFFFFF',
    fieldInk: '#121212',
    danger: '#8E1B1F',
    divider: '#E6E5E0',
    fieldDivider: 'rgba(255,255,255,0.45)',
  },
  dark: {
    surface: '#121212',
    surfaceAlt: '#1E1D1A',
    text: '#F4F3EE',
    textMuted: '#A3A19B',
    accent: '#E3262C',
    onAccent: '#FFFFFF',
    onField: '#FFFFFF',
    fieldInk: '#121212',
    danger: '#F2B8B5',
    divider: '#2C2B28',
    fieldDivider: 'rgba(255,255,255,0.45)',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];

// Five even sizes, line heights fixed. Display is the one number per screen; heading the tab-root titles.
export const type = {
  caption: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 14, lineHeight: 20 },
  bodyLg: { fontSize: 16, lineHeight: 22 },
  heading: { fontSize: 24, lineHeight: 30 },
  display: { fontSize: 96, lineHeight: 104 },
} as const;

// Tabular figures everywhere a number is set, so a rolling digit never moves its neighbours.
export const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const spacing = { s4: 4, s8: 8, s12: 12, s16: 16, s24: 24, s32: 32, s48: 48, s64: 64 } as const;

// The pill is the track oval: run controls, the start pill, place chips. Everything from the lane world is square.
export const radius = { control: 999, lane: 0 } as const;

export const duration = { fast: 120, base: 180, slow: 400 } as const;

// Targets: 44 pt icon buttons, a 56 pt start pill, 64 pt run controls and rows.
export const touch = { min: 44, pill: 56, control: 64, row: 64 } as const;

export const lane = { height: 40, stroke: 2, tick: 12 } as const;
