import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    type ColorValue,
    type StyleProp,
    type TextInputProps,
    type TextStyle,
    type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENCY_CODE } from '@/constants/config';
import { Colors, Palette, Radius, Spacing, Typography } from '@/constants/theme';

const iconNames = {
  home: { ios: 'house.fill', android: 'home' },
  groups: { ios: 'person.2.fill', android: 'group' },
  settlements: { ios: 'arrow.left.arrow.right', android: 'sync_alt' },
  account: { ios: 'person.crop.circle', android: 'account_circle' },
  add: { ios: 'plus', android: 'add' },
  back: { ios: 'chevron.left', android: 'arrow_back' },
  chevron: { ios: 'chevron.right', android: 'chevron_right' },
  search: { ios: 'magnifyingglass', android: 'search' },
  close: { ios: 'xmark', android: 'close' },
} as const;

export type IconName = keyof typeof iconNames;

export function AppIcon({ name, color = Palette.ink, size = 20 }: { name: IconName; color?: ColorValue; size?: number }) {
  const icon = iconNames[name];
  return <SymbolView name={{ ios: icon.ios, android: icon.android, web: icon.android }} tintColor={color} size={size} />;
}

export function ScreenFrame({ children, style, ...props }: ViewProps) {
  return (
    <SafeAreaView edges={['top']} style={[styles.screen, style]} {...props}>
      {children}
    </SafeAreaView>
  );
}

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

export function PrimaryButton({ title, onPress, loading = false, disabled = false, icon }: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, (disabled || loading) && styles.disabledButton, pressed && styles.pressed]}>
      {loading ? <ActivityIndicator color={Palette.surface} /> : icon ? <AppIcon name={icon} color={Palette.surface} size={18} /> : null}
      <AppText variant="body" color={Palette.surface} style={styles.buttonText}>{loading ? 'Please wait' : title}</AppText>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, icon, disabled = false }: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, disabled && styles.disabledSecondary, pressed && styles.pressed]}>
      {icon ? <AppIcon name={icon} color={Palette.orangeDark} size={18} /> : null}
      <AppText variant="body" color={Palette.orangeDark} style={styles.buttonText}>{title}</AppText>
    </Pressable>
  );
}

export function IconButton({ name, onPress, accessibilityLabel }: { name: IconName; onPress: () => void; accessibilityLabel: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <AppIcon name={name} color={Palette.ink} size={20} />
    </Pressable>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldContainer}>
      <AppText variant="small" style={styles.fieldLabel}>{label}</AppText>
      <TextInput
        {...props}
        placeholderTextColor={Palette.muted}
        style={[styles.field, props.multiline && styles.multilineField, style]}
      />
    </View>
  );
}

export function Notice({ message, kind = 'error' }: { message: string; kind?: 'error' | 'success' }) {
  return (
    <View style={[styles.notice, kind === 'success' ? styles.successNotice : styles.errorNotice]}>
      <AppText variant="small" color={kind === 'success' ? Palette.green : Palette.red}>{message}</AppText>
    </View>
  );
}

export function LoadingView({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator color={Palette.orange} />
      <AppText variant="small" color={Palette.muted}>{label}</AppText>
    </View>
  );
}

export function Avatar({ name, size = 42 }: { name: string; size?: number }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
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
  const symbol = new Intl.NumberFormat(undefined, { style: 'currency', currency: CURRENCY_CODE, currencyDisplay: 'narrowSymbol' })
    .formatToParts(0)
    .find((part) => part.type === 'currency')?.value;
  return <AppText variant="heading" color={Palette.orangeDark}>{symbol ?? CURRENCY_CODE}</AppText>;
}

export const uiStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  spread: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Palette.border },
  card: { borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, backgroundColor: Palette.surface, padding: Spacing.three },
  smallGap: { gap: Spacing.two },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.light.background },
  pageHeader: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two, marginBottom: Spacing.four },
  pageHeaderText: { flex: 1, gap: Spacing.one },
  primaryButton: { minHeight: 52, borderRadius: Radius.medium, backgroundColor: Palette.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.four, gap: Spacing.two },
  secondaryButton: { minHeight: 48, borderRadius: Radius.medium, backgroundColor: Palette.orangeSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.three, gap: Spacing.two },
  disabledButton: { opacity: 0.6 },
  disabledSecondary: { opacity: 0.5 },
  pressed: { opacity: 0.78 },
  buttonText: { fontWeight: Typography.weight.semibold },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, backgroundColor: Palette.orangeSoft },
  fieldContainer: { gap: Spacing.one },
  fieldLabel: { color: Palette.ink, fontWeight: Typography.weight.medium },
  field: { minHeight: 50, paddingHorizontal: Spacing.three, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.small, backgroundColor: Palette.surface, color: Palette.ink, fontFamily: Typography.family, fontSize: Typography.size.body },
  multilineField: { minHeight: 88, paddingTop: Spacing.two, textAlignVertical: 'top' },
  notice: { padding: Spacing.three, borderRadius: Radius.small },
  errorNotice: { backgroundColor: Palette.errorSoft },
  successNotice: { backgroundColor: Palette.greenSoft },
  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  avatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft },
  avatarText: { fontWeight: Typography.weight.semibold },
});
