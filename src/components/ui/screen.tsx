import type { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenStyles as styles, uiStyles } from '@/theme/styles/components';

export { uiStyles };

export function ScreenFrame({ children, style, ...props }: ViewProps) {
  return (
    <SafeAreaView edges={['top']} style={[styles.screen, style]} {...props}>
      {children}
    </SafeAreaView>
  );
}

