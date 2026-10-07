/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#26231F",
    background: "#FFFFFF",
    backgroundElement: "#FFF7F1",
    backgroundSelected: "#FFE7D6",
    textSecondary: "#77716C",
  },
  dark: {
    text: "#26231F",
    background: "#FFFFFF",
    backgroundElement: "#FFF7F1",
    backgroundSelected: "#FFE7D6",
    textSecondary: "#77716C",
  },
} as const;

export const Palette = {
  orange: "#F07835",
  orangeDark: "#D95D20",
  orangeSoft: "#FFF0E5",
  errorSoft: "#FFF0EE",
  green: "#357B59",
  greenSoft: "#EAF5EE",
  red: "#B7463D",
  border: "#EEEAE6",
  surface: "#FFFFFF",
  canvas: "#FFFCFA",
  muted: "#77716C",
  ink: "#26231F",
} as const;

export const Typography = {
  family: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "sans-serif",
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
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

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

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
