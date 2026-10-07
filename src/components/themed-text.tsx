import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Palette, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: Typography.size.small,
    lineHeight: Typography.lineHeight.small,
    fontWeight: Typography.weight.medium,
    fontFamily: Typography.family,
  },
  smallBold: {
    fontSize: Typography.size.small,
    lineHeight: Typography.lineHeight.small,
    fontWeight: Typography.weight.bold,
    fontFamily: Typography.family,
  },
  default: {
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontWeight: Typography.weight.medium,
    fontFamily: Typography.family,
  },
  title: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.semibold,
    lineHeight: Typography.lineHeight.display,
    fontFamily: Typography.family,
  },
  subtitle: {
    fontSize: Typography.size.heading,
    lineHeight: Typography.lineHeight.heading,
    fontWeight: Typography.weight.semibold,
    fontFamily: Typography.family,
  },
  link: {
    lineHeight: Typography.lineHeight.body,
    fontSize: Typography.size.small,
    fontFamily: Typography.family,
  },
  linkPrimary: {
    lineHeight: Typography.lineHeight.body,
    fontSize: Typography.size.small,
    color: Palette.orangeDark,
    fontFamily: Typography.family,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Typography.weight.medium,
    fontSize: Typography.size.caption,
  },
});
