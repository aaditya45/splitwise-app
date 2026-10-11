import { Platform } from 'react-native';

export const Palette = {
  // Brand orange
  orange: '#F07835',
  orangeDark: '#D95D20',
  orangeDeep: '#B84A17',   // pressed state, strong emphasis
  orangeLight: '#F9A66F',  // illustrations, progress bars, disabled primary
  orangeSoft: '#FFF0E5',
  orangeTint: '#FFF8F2',   // faintest orange, for highlighted rows or banners
  // Green (money received, success)
  green: '#357B59',
  greenDark: '#2A634A',
  greenSoft: '#EAF5EE',
  // Red (errors, destructive actions)
  red: '#B7463D',
  errorSoft: '#FFF0EE',
  // Amber (warnings, pending states)
  amber: '#C98A12',
  amberSoft: '#FFF6DD',
  // Blue (info, links)
  blue: '#3F6FA6',
  blueSoft: '#EAF1F9',
  // Teal (secondary accent)
  teal: '#2F8A8A',
  tealSoft: '#E6F4F3',
  // Plum (secondary accent)
  plum: '#8A5A86',
  plumSoft: '#F5ECF4',
  // Warm neutrals
  surface: '#FFFFFF',
  canvas: '#FFFCFA',
  sand: '#F6F1EC',        // filled cards, input backgrounds, chips
  border: '#EEEAE6',
  sandDark: '#E1D9D1',    // stronger dividers, inactive tracks
  stone: '#A39B94',       // placeholders, disabled text, inactive icons
  muted: '#77716C',
  inkSoft: '#4A443E',     // secondary body text
  ink: '#26231F',
  // Overlays
  overlay: 'rgba(38, 35, 31, 0.45)',  // modal backdrops
} as const;

export const Typography = {
  family: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  size: {
    caption: 12,
    small: 14,
    body: 16,
    section: 18,
    heading: 24,
    display: 32,
  },
  lineHeight: {
    caption: 16,
    small: 20,
    body: 24,
    section: 24,
    heading: 30,
    display: 38,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 14,
  large: 20,
  pill: 999,
} as const;