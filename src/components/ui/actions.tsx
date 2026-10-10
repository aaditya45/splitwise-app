import { ActivityIndicator, Pressable } from 'react-native';

import { actionStyles as styles } from '@/theme/styles/components';
import { Palette } from '@/theme';
import { AppIcon, type IconName } from './icons';
import { AppText } from './text';

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

