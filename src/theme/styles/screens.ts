import { StyleSheet } from 'react-native';

import { Palette, Radius, Spacing, Typography } from '@/theme';

export const accountScreenStyles = StyleSheet.create({
  content: { padding: Spacing.five, gap: Spacing.three, flexGrow: 1 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium },
  profileText: { flex: 1, gap: Spacing.one },
  infoCard: { borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, paddingHorizontal: Spacing.three },
  infoRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Palette.border },
  signOut: { marginTop: 'auto', paddingTop: Spacing.two },
});

export const addMemberScreenStyles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.two },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.four },
  spacer: { width: 44 },
  form: { gap: Spacing.three, marginTop: Spacing.four },
});

export const expenseDetailsScreenStyles = StyleSheet.create({
  content: { padding: Spacing.five, gap: Spacing.three },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 44 },
  amountBlock: { alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.four },
  amountIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft, borderRadius: Radius.pill, marginBottom: Spacing.two },
  detailCard: { borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, paddingHorizontal: Spacing.three },
  detailRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  splitRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  splitText: { flex: 1, gap: 1 },
});

export const groupsScreenStyles = StyleSheet.create({
  content: { padding: Spacing.five, gap: Spacing.three },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  list: { gap: Spacing.two },
  groupRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two, paddingHorizontal: Spacing.two, borderRadius: Radius.medium, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  groupDetails: { flex: 1, gap: 2 },
  groupName: { fontWeight: '600' },
  emptyState: { alignItems: 'center', gap: Spacing.two, padding: Spacing.four, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium },
  emptyIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft, borderRadius: Radius.pill },
  emptyCopy: { textAlign: 'center', marginBottom: Spacing.two },
  pressed: { opacity: 0.72 },
});

export const newExpenseScreenStyles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.two },
  headerSpacer: { width: 44 },
  fieldBlock: { gap: Spacing.two },
  noGroups: { gap: Spacing.two },
  label: { fontWeight: Typography.weight.medium },
  groupOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  groupOption: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.pill, backgroundColor: Palette.surface },
  selectedGroup: { borderColor: Palette.orange, backgroundColor: Palette.orangeSoft },
  splitOptions: { flexDirection: 'row', borderRadius: Radius.small, borderWidth: 1, borderColor: Palette.border, overflow: 'hidden' },
  splitOption: { flex: 1, minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.one, backgroundColor: Palette.surface },
  selectedSplit: { backgroundColor: Palette.orangeSoft },
  splitText: { textAlign: 'center' },
  contractHint: { padding: Spacing.two, borderRadius: Radius.small, backgroundColor: Palette.orangeSoft },
  memberList: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.border },
  splitPreview: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.two, borderRadius: Radius.small, backgroundColor: Palette.canvas },
  memberRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  memberName: { flex: 1, gap: 1 },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.small, alignItems: 'center', justifyContent: 'center' },
  checked: { borderColor: Palette.orange, backgroundColor: Palette.orange },
  checkMark: { fontWeight: Typography.weight.bold },
});

export const newGroupScreenStyles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.two },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.four },
  spacer: { width: 44 },
  form: { gap: Spacing.three, marginTop: Spacing.four },
});

export const settlementsScreenStyles = StyleSheet.create({
  content: { padding: Spacing.five, gap: Spacing.three },
  groupSelector: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  noGroups: { gap: Spacing.two },
  groupChip: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.pill },
  groupChipSelected: { backgroundColor: Palette.orangeSoft, borderColor: Palette.orange },
  modeSwitch: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Palette.border },
  modeButton: { flex: 1, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  modeSelected: { borderBottomWidth: 2, borderBottomColor: Palette.orange },
  settlementCard: { padding: Spacing.three, borderRadius: Radius.medium, borderWidth: 1, borderColor: Palette.border, gap: Spacing.three },
  settlementTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  partyLine: { flex: 1, alignItems: 'center', gap: Spacing.one },
  partyName: { fontWeight: Typography.weight.medium, textAlign: 'center' },
  settlementBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.border, paddingTop: Spacing.two },
  statusBadge: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.two, borderRadius: Radius.pill },
  pendingBadge: { backgroundColor: Palette.orangeSoft },
  paidBadge: { backgroundColor: Palette.greenSoft },
  emptyState: { alignItems: 'center', gap: Spacing.two, padding: Spacing.four, borderRadius: Radius.medium, backgroundColor: Palette.canvas },
});

export const authScreenStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Palette.surface },
  content: { width: '100%', maxWidth: 520, alignSelf: 'center', flexGrow: 1, padding: Spacing.four, paddingTop: Spacing.six, justifyContent: 'center' },
  brandMark: { width: 58, height: 58, borderRadius: Radius.medium, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft, marginBottom: Spacing.two },
  brand: { fontWeight: Typography.weight.bold },
  intro: { marginTop: Spacing.one },
  formHeader: { gap: Spacing.one, marginTop: Spacing.six, marginBottom: Spacing.four },
  form: { gap: Spacing.three },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.four },
  switchText: { fontWeight: Typography.weight.semibold },
});

export const groupDetailsScreenStyles = StyleSheet.create({
  content: { padding: Spacing.five, gap: Spacing.three },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.one },
  headerText: { flex: 1, gap: Spacing.one },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  summaryCard: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  summaryText: { flex: 1, gap: Spacing.one },
  badge: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.pill },
  badgeDebt: { backgroundColor: Palette.orangeSoft },
  badgeCredit: { backgroundColor: Palette.greenSoft },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.one },
  expenseDateGroup: { gap: Spacing.one },
  dateHeading: { marginTop: Spacing.one,fontWeight: Typography.weight.regular,fontSize: Typography.size.small,color: Palette.muted },
  expenseRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  expenseIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, backgroundColor: Palette.orangeSoft },
  expenseText: { flex: 1, gap: 1 },
  expenseTitle: { fontWeight: Typography.weight.medium },
  emptyExpenses: { padding: Spacing.three, borderRadius: Radius.small, backgroundColor: Palette.canvas },
  pressed: { opacity: 0.72 },
});