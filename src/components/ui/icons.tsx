import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { Palette } from '@/theme';

const iconNames = {
  home: { ios: 'house.fill', android: 'home' },
  groups: { ios: 'person.2.fill', android: 'group' },
  settlements: { ios: 'arrow.left.arrow.right', android: 'sync_alt' },
  account: { ios: 'person.crop.circle', android: 'account_circle' },
  add: { ios: 'plus', android: 'add' },
  addUser: { ios: 'person.badge.plus', android: 'person_add' },
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