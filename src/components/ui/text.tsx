import type { ReactNode } from 'react';
import { Text, View, type ColorValue, type StyleProp, type TextStyle } from 'react-native';

import { textStyles as styles } from '@/theme/styles/components';
import { Palette, Typography } from '@/theme';

export function AppText({ children, variant = 'body', color = Palette.ink, style, ...props }: {
  children: ReactNode;
  variant?: 'caption' | 'small' | 'body' | 'section' | 'heading' | 'display';
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: 'header' | 'text';
}) {
  const fontSize = Typography.size[variant];
  const lineHeight = Typography.lineHeight[variant];
  return (
    <Text
      {...props}
      style={[
        { color, fontFamily: Typography.family, fontSize, lineHeight, fontWeight: variant === 'heading' || variant === 'display' || variant === 'section' ? Typography.weight.semibold : Typography.weight.regular },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderText}>
        <AppText variant="heading">{title}</AppText>
        {subtitle ? <AppText variant="small" color={Palette.muted}>{subtitle}</AppText> : null}
      </View>
      {right}
    </View>
  );
}

