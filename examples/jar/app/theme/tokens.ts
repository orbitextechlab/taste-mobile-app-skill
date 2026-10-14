// Tokens from MOBILE-DESIGN.md (schema 3, direction "Hũ thủy tinh"). The only place hex values live.
import type { TextStyle } from 'react-native';

export const colors = {
  light: {
    surface: '#F3F4F0', // pale bottle glass
    surfaceAlt: '#E6E8E1', // the jar's glass body, selected chips, skeletons
    text: '#1B1D1A',
    textMuted: '#6A6E66',
    accent: '#C9922E', // coin brass: fills only, never text
    onAccent: '#1B1D1A',
    danger: '#B5412F',
    divider: '#DADDD4',
  },
  dark: {
    surface: '#141614',
    surfaceAlt: '#222521',
    text: '#F1F2EE',
    textMuted: '#9A9E96',
    accent: '#D9A441',
    onAccent: '#141614',
    danger: '#E06B59',
    divider: '#2E322D',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];

// Five even sizes, line heights fixed. Display is for the one amount per screen only.
export const type = {
  caption: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 14, lineHeight: 20 },
  bodyLg: { fontSize: 16, lineHeight: 22 },
  heading: { fontSize: 20, lineHeight: 26 },
  display: { fontSize: 40, lineHeight: 48 },
} as const;

// Every amount is tabular so columns align and the rolling numeral never changes width.
export const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const spacing = { s4: 4, s8: 8, s12: 12, s16: 16, s24: 24, s32: 32, s40: 40, s48: 48 } as const;

// Controls 12, chips pill, the jar's glass corners 16 inside the SVG. The sheet keeps the platform radius.
export const radius = { control: 12, chip: 999, jar: 16 } as const;

// settle: decelerate, no overshoot. dismiss is the platform modal transition the success moment waits for.
export const duration = { fast: 120, base: 200, slow: 300, dismiss: 350 } as const;

// 44 pt targets on iOS, 48 dp on Android; one value keeps both.
export const touch = { min: 48 } as const;
