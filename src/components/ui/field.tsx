import { TextInput, View, type TextInputProps } from 'react-native';

import { fieldStyles as styles } from '@/theme/styles/components';
import { Palette } from '@/theme';
import { AppText } from './text';

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

