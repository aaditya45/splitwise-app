import { ActivityIndicator, View } from 'react-native';

import { feedbackStyles as styles } from '@/theme/styles/components';
import { Palette } from '@/theme';
import { AppText } from './text';

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

