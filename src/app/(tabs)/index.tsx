import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon, AppText, Avatar, LoadingView, Money, Notice, ScreenFrame } from '@/components/ui/primitives';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { api } from '@/lib/api';
import { useApp } from '@/providers/app-provider';
import type { Expense, Settlement } from '@/types/api';

export default function HomeScreen() {
  const { session, groups, groupsLoading, groupsError } = useApp();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    if (groupsLoading) {
      setLoading(true);
      return;
    }
    if (!session || groups.length === 0) {
      setExpenses([]);
      setSettlements([]);
      setError(groupsError ?? '');
      setLoading(false);
      setRefreshing(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    Promise.all(groups.map(async (group) => {
      const [expensesResult, settlementsResult] = await Promise.allSettled([
        api.getGroupExpenses(session.token, group.groupId),
        api.getPendingSettlements(session.token, group.groupId),
      ]);
      return { expensesResult, settlementsResult };
    })).then((results) => {
      if (!active) return;
      const failures = results.reduce((count, result) => count + Number(result.expensesResult.status === 'rejected') + Number(result.settlementsResult.status === 'rejected'), 0);
      setExpenses(results.flatMap((result) => result.expensesResult.status === 'fulfilled' ? result.expensesResult.value : []).sort((a, b) => (b.expenseDate ?? '').localeCompare(a.expenseDate ?? '')).slice(0, 4));
      setSettlements(results.flatMap((result) => result.settlementsResult.status === 'fulfilled' ? result.settlementsResult.value : []));
      setError(failures ? `Could not load ${failures} part${failures === 1 ? '' : 's'} of your group activity.` : '');
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Could not load your latest activity.');
    }).finally(() => {
      if (active) {
        setLoading(false);
        setRefreshing(false);
      }
    });
    return () => { active = false; };
  }, [groups, groupsError, groupsLoading, refreshVersion, session]));

  const owedByYou = settlements.filter((item) => item.debtor.userId === session?.user.userId).reduce((sum, item) => sum + item.amount, 0);
  const owedToYou = settlements.filter((item) => item.creditor.userId === session?.user.userId).reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScreenFrame>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setRefreshVersion((version) => version + 1); }} tintColor={Palette.orange} />}
        >
        <View style={styles.topLine}>
          <View style={styles.greeting}>
            <AppText variant="small" color={Palette.muted}>Good to see you</AppText>
            <AppText variant="heading">{session?.user.name}</AppText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open account" onPress={() => router.push('/(tabs)/account')}>
            <Avatar name={session?.user.name ?? ''} size={46} />
          </Pressable>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View style={styles.balanceMark}><AppIcon name="settlements" color={Palette.orangeDark} size={18} /></View>
            <AppText variant="small" color={Palette.muted}>Your balances</AppText>
          </View>
          <View style={styles.balanceAmounts}>
            <View style={styles.balanceColumn}>
              <AppText variant="caption" color={Palette.muted}>YOU OWE</AppText>
              <Money amount={owedByYou} variant="heading" color={Palette.ink} />
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceColumn}>
              <AppText variant="caption" color={Palette.muted}>OWED TO YOU</AppText>
              <Money amount={owedToYou} variant="heading" color={Palette.green} />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/new-expense')} style={styles.actionButton}>
            <View style={styles.actionIcon}><AppIcon name="add" color={Palette.surface} size={20} /></View>
            <AppText variant="small" style={styles.actionLabel}>Add expense</AppText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/new-group')} style={styles.actionButton}>
            <View style={styles.actionIconLight}><AppIcon name="groups" color={Palette.orangeDark} size={20} /></View>
            <AppText variant="small" style={styles.actionLabel}>Create group</AppText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/settlements')} style={styles.actionButton}>
            <View style={styles.actionIconLight}><AppIcon name="settlements" color={Palette.orangeDark} size={20} /></View>
            <AppText variant="small" style={styles.actionLabel}>Settle up</AppText>
          </Pressable>
        </View>

        {error ? <Notice message={error} /> : null}

        <View style={styles.sectionHead}>
          <AppText variant="section">Your groups</AppText>
          <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/groups')}>
            <AppText variant="small" color={Palette.orangeDark} style={styles.link}>See all</AppText>
          </Pressable>
        </View>
        {groupsLoading ? <LoadingView label="Loading your groups" /> : groups.length ? groups.slice(0, 3).map((group) => (
          <Pressable key={group.groupId} accessibilityRole="button" onPress={() => router.push({ pathname: '/group/[groupId]', params: { groupId: String(group.groupId) } })} style={({ pressed }) => [styles.groupRow, pressed && styles.pressed]}>
            <View style={styles.groupInitial}><AppText variant="body" color={Palette.orangeDark} style={styles.groupInitialText}>{group.name.charAt(0).toUpperCase()}</AppText></View>
            <View style={styles.groupText}><AppText variant="body" style={styles.groupName}>{group.name}</AppText><AppText variant="caption" color={Palette.muted}>{group.members?.length ?? 0} members</AppText></View>
            <AppIcon name="chevron" color={Palette.muted} size={18} />
          </Pressable>
        )) : (
          <View style={styles.emptyBlock}>
            <AppText variant="small" color={Palette.muted}>Your groups will show up here.</AppText>
            <Pressable accessibilityRole="button" onPress={() => router.push('/new-group')}><AppText variant="small" color={Palette.orangeDark} style={styles.link}>Create your first group</AppText></Pressable>
          </View>
        )}

        <View style={styles.sectionHead}>
          <AppText variant="section">Recent expenses</AppText>
          {loading ? <AppText variant="caption" color={Palette.muted}>Updating</AppText> : null}
        </View>
        {loading && !expenses.length ? <LoadingView label="Loading activity" /> : expenses.length ? expenses.map((expense) => {
          const group = groups.find((item) => item.groupId === expense.groupId);
          return (
            <Pressable key={expense.expenseId} accessibilityRole="button" onPress={() => router.push({ pathname: '/expense/[expenseId]', params: { expenseId: String(expense.expenseId) } })} style={({ pressed }) => [styles.expenseRow, pressed && styles.pressed]}>
              <View style={styles.expenseIcon}><AppIcon name="add" color={Palette.orangeDark} size={18} /></View>
              <View style={styles.expenseText}><AppText variant="body" style={styles.groupName}>{expense.description || 'Group expense'}</AppText><AppText variant="caption" color={Palette.muted}>{group?.name ?? `Group ${expense.groupId}`}</AppText></View>
              <Money amount={expense.amount} variant="small" />
            </Pressable>
          );
        }) : <View style={styles.emptyBlock}><AppText variant="small" color={Palette.muted}>No expenses to show yet.</AppText></View>}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three, gap: Spacing.three },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.one },
  greeting: { gap: Spacing.one },
  balanceCard: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, padding: Spacing.three, gap: Spacing.three },
  balanceTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  balanceMark: { width: 34, height: 34, borderRadius: Radius.small, backgroundColor: Palette.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  balanceAmounts: { flexDirection: 'row', alignItems: 'center' },
  balanceColumn: { flex: 1, gap: Spacing.one },
  balanceDivider: { width: 1, height: 44, backgroundColor: Palette.border, marginHorizontal: Spacing.three },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.two },
  actionButton: { flex: 1, alignItems: 'center', gap: Spacing.one },
  actionIcon: { width: 48, height: 48, borderRadius: Radius.pill, backgroundColor: Palette.orange, alignItems: 'center', justifyContent: 'center' },
  actionIconLight: { width: 48, height: 48, borderRadius: Radius.pill, backgroundColor: Palette.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: Typography.size.caption, textAlign: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.one },
  link: { fontWeight: Typography.weight.semibold },
  groupRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  groupInitial: { width: 44, height: 44, borderRadius: Radius.small, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft },
  groupInitialText: { fontWeight: Typography.weight.semibold },
  groupText: { flex: 1, gap: 1 },
  groupName: { fontWeight: Typography.weight.medium },
  emptyBlock: { minHeight: 76, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.small, padding: Spacing.three, gap: Spacing.one, justifyContent: 'center' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  expenseIcon: { width: 38, height: 38, borderRadius: Radius.small, backgroundColor: Palette.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  expenseText: { flex: 1, gap: 1 },
  pressed: { opacity: 0.7 },
  bottomSpace: { height: Spacing.two },
});
