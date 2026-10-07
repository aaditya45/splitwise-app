import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ProtectedScreen } from '@/components/protected-screen';
import { AppIcon, AppText, Avatar, IconButton, LoadingView, Money, Notice, PrimaryButton, ScreenFrame, SecondaryButton } from '@/components/ui/primitives';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { api } from '@/lib/api';
import { useApp } from '@/providers/app-provider';
import type { Expense, Group } from '@/types/api';

export default function GroupDetailsScreen() {
  return <ProtectedScreen><GroupDetailsContent /></ProtectedScreen>;
}

function GroupDetailsContent() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { session, loadGroups } = useApp();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const token = session?.token;

  const loadGroup = useCallback(async () => {
    if (!token || !groupId) return;
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const id = Number(groupId);
      const userGroups = await loadGroups();
      const nextGroup = userGroups.find((item) => item.groupId === id);
      if (!nextGroup) throw new Error(`Group ${id} is not available in this account.`);
      setGroup(nextGroup);
      try {
        const nextExpenses = await api.getGroupExpenses(token, id);
        setExpenses(nextExpenses);
      } catch {
        setExpenses([]);
        setIsError(true);
        setMessage('Group information loaded, but expenses could not be retrieved.');
      }
    } catch (cause) {
      setIsError(true);
      setMessage(cause instanceof Error ? cause.message : 'Could not load this group.');
    } finally {
      setLoading(false);
    }
  }, [groupId, loadGroups, token]);

  useFocusEffect(useCallback(() => {
    void loadGroup();
  }, [loadGroup]));

  async function addMember() {
    const parsedId = Number(memberId.trim());
    if (!session || !group || !Number.isInteger(parsedId) || parsedId <= 0) {
      setIsError(true);
      setMessage('Enter a valid user ID.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      await api.addMember(session.token, group.groupId, parsedId);
      setMemberId('');
      setIsError(false);
      setMessage('Member added to the group.');
      await loadGroup();
    } catch (cause) {
      setIsError(true);
      setMessage(cause instanceof Error ? cause.message : 'Could not add this member.');
    } finally {
      setBusy(false);
    }
  }

  if (loading && !group) return <ScreenFrame><LoadingView label="Loading group" /></ScreenFrame>;
  if (!group) return <ScreenFrame><View style={styles.content}><IconButton name="back" accessibilityLabel="Go back" onPress={() => router.back()} />{message ? <Notice message={message} /> : null}<SecondaryButton title="Back to groups" onPress={() => router.back()} /></View></ScreenFrame>;

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topLine}>
          <IconButton name="back" accessibilityLabel="Go back" onPress={() => router.back()} />
          <View style={styles.headerText}><AppText variant="caption" color={Palette.muted}>GROUP · {group.groupId}</AppText><AppText variant="heading">{group.name}</AppText></View>
          <IconButton name="add" accessibilityLabel="Add an expense" onPress={() => router.push({ pathname: '/new-expense', params: { groupId: String(group.groupId) } })} />
        </View>
        {group.description ? <AppText variant="small" color={Palette.muted}>{group.description}</AppText> : null}
        <PrimaryButton title="Add an expense" icon="add" onPress={() => router.push({ pathname: '/new-expense', params: { groupId: String(group.groupId) } })} />

        <View style={styles.sectionHead}><AppText variant="section">Members</AppText><AppText variant="caption" color={Palette.muted}>{group.members?.length ?? 0}</AppText></View>
        {group.members?.length ? group.members.map((member) => (
          <View key={member.userId} style={styles.memberRow}><Avatar name={member.name} size={38} /><View style={styles.memberText}><AppText variant="small" style={styles.memberName}>{member.name}</AppText><AppText variant="caption" color={Palette.muted}>Member ID {member.userId}</AppText></View></View>
        )) : <AppText variant="small" color={Palette.muted}>No members were returned for this group.</AppText>}

        <View style={styles.addMemberBlock}>
          <AppText variant="section">Add a member</AppText>
          <AppText variant="small" color={Palette.muted}>They need a registered account. Add their user ID.</AppText>
          <View style={styles.lookupRow}>
            <TextInput value={memberId} onChangeText={setMemberId} keyboardType="number-pad" placeholder="User ID" placeholderTextColor={Palette.muted} accessibilityLabel="User ID" style={styles.lookupInput} />
            <Pressable accessibilityRole="button" onPress={addMember} disabled={busy} style={({ pressed }) => [styles.addMemberButton, pressed && styles.pressed]}>
              <AppIcon name="add" color={Palette.surface} size={20} />
            </Pressable>
          </View>
          {message ? <Notice message={message} kind={isError ? 'error' : 'success'} /> : null}
        </View>

        <View style={styles.sectionHead}><AppText variant="section">Expenses</AppText><AppText variant="caption" color={Palette.muted}>{expenses.length}</AppText></View>
        {loading ? <AppText variant="caption" color={Palette.muted}>Refreshing…</AppText> : null}
        {expenses.length ? expenses.map((expense) => (
          <Pressable key={expense.expenseId} accessibilityRole="button" onPress={() => router.push({ pathname: '/expense/[expenseId]', params: { expenseId: String(expense.expenseId) } })} style={({ pressed }) => [styles.expenseRow, pressed && styles.pressed]}>
            <View style={styles.expenseMark}><AppIcon name="add" color={Palette.orangeDark} size={18} /></View>
            <View style={styles.expenseInfo}><AppText variant="body" style={styles.memberName}>{expense.description || 'Group expense'}</AppText><AppText variant="caption" color={Palette.muted}>{expense.expenseDate ?? `Expense ${expense.expenseId}`}</AppText></View>
            <Money amount={expense.amount} variant="small" />
            <AppIcon name="chevron" color={Palette.muted} size={18} />
          </Pressable>
        )) : <View style={styles.emptyExpenses}><AppText variant="small" color={Palette.muted}>No expenses yet. Add the first one when your group is ready.</AppText></View>}
        <SecondaryButton title="Refresh group" onPress={() => void loadGroup()} />
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.one },
  headerText: { flex: 1, gap: Spacing.one },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.two },
  memberRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  memberText: { flex: 1, gap: 1 },
  memberName: { fontWeight: Typography.weight.medium },
  addMemberBlock: { padding: Spacing.three, gap: Spacing.two, borderRadius: Radius.medium, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.canvas },
  lookupRow: { flexDirection: 'row', gap: Spacing.two },
  lookupInput: { height: 48, flex: 1, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.small, paddingHorizontal: Spacing.three, backgroundColor: Palette.surface, color: Palette.ink, fontFamily: Typography.family, fontSize: Typography.size.body },
  addMemberButton: { width: 48, height: 48, borderRadius: Radius.small, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orange },
  expenseRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  expenseMark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.small, backgroundColor: Palette.orangeSoft },
  expenseInfo: { flex: 1, gap: 1 },
  emptyExpenses: { padding: Spacing.three, borderRadius: Radius.small, backgroundColor: Palette.canvas },
  pressed: { opacity: 0.72 },
});
