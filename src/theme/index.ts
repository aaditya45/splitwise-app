import { Platform } from 'react-native';

export const Palette = {
  orange: '#F07835',
  orangeDark: '#D95D20',
  orangeSoft: '#FFF0E5',
  errorSoft: '#FFF0EE',
  green: '#357B59',
  greenSoft: '#EAF5EE',
  red: '#B7463D',
  border: '#EEEAE6',
  surface: '#FFFFFF',
  canvas: '#FFFCFA',
  muted: '#77716C',
  ink: '#26231F',
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