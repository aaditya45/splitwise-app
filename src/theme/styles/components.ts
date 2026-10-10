import { StyleSheet } from 'react-native';

import { Palette, Radius, Spacing, Typography } from '@/theme';

export const actionStyles = StyleSheet.create({
  primaryButton: { minHeight: 52, borderRadius: Radius.medium, backgroundColor: Palette.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.four, gap: Spacing.two },
  secondaryButton: { minHeight: 48, borderRadius: Radius.medium, backgroundColor: Palette.orangeSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.three, gap: Spacing.two },
  disabledButton: { opacity: 0.6 },
  disabledSecondary: { opacity: 0.5 },
  pressed: { opacity: 0.78 },
  buttonText: { fontWeight: Typography.weight.semibold },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, backgroundColor: Palette.orangeSoft },
});

export const displayStyles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft },
  avatarText: { fontWeight: Typography.weight.semibold },
});

export const feedbackStyles = StyleSheet.create({
  notice: { padding: Spacing.three, borderRadius: Radius.small },
  errorNotice: { backgroundColor: Palette.errorSoft },
  successNotice: { backgroundColor: Palette.greenSoft },
  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
});

export const fieldStyles = StyleSheet.create({
  fieldContainer: { gap: Spacing.one },
  fieldLabel: { color: Palette.ink, fontWeight: Typography.weight.medium },
  field: { minHeight: 50, paddingHorizontal: Spacing.three, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.small, backgroundColor: Palette.surface, color: Palette.ink, fontFamily: Typography.family, fontSize: Typography.size.body },
  multilineField: { minHeight: 88, paddingTop: Spacing.two, textAlignVertical: 'top' },
});

export const screenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.surface },
});

export const uiStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  spread: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Palette.border },
  card: { borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, backgroundColor: Palette.surface, padding: Spacing.three },
  smallGap: { gap: Spacing.two },
});

export const textStyles = StyleSheet.create({
  pageHeader: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two, marginBottom: Spacing.four },
  pageHeaderText: { flex: 1, gap: Spacing.one },
});