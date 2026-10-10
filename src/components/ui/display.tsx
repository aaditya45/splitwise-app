import { View, type ColorValue } from 'react-native';

import { CURRENCY_CODE } from '@/constants/config';
import { displayStyles as styles } from '@/theme/styles/components';
import { Palette } from '@/theme';
import { AppText } from './text';

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export function Avatar({ name, size = 42 }: { name?: string | null; size?: number }) {
  const initials = (name ?? '').trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <AppText variant="small" color={Palette.orangeDark} style={styles.avatarText}>{initials || '?'}</AppText>
    </View>
  );
}

export function Money({ amount, variant = 'body', color = Palette.ink }: { amount: number; variant?: 'small' | 'body' | 'section' | 'heading' | 'display'; color?: ColorValue }) {
  const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: CURRENCY_CODE, maximumFractionDigits: 2 }).format(amount);
  return <AppText variant={variant} color={color}>{formatted}</AppText>;
}

export function CurrencySymbol() {
  const symbol = CURRENCY_SYMBOLS[CURRENCY_CODE] ?? CURRENCY_CODE;
  return (
    <AppText variant="heading" color={Palette.orangeDark}>
      {symbol}
    </AppText>
  );
}

