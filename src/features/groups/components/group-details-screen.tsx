import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppIcon, AppText, IconButton, LoadingView, Money, Notice, PrimaryButton, ScreenFrame, SecondaryButton } from '@/components/ui';
import { groupDetailsScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import type { Expense } from '@/features/expenses/types';
import { useGroupDetails } from '@/features/groups/hooks/use-group-details';

interface ExpenseDateGroup {
  dateKey: string;
  label: string;
  sortKey: string;
  expenses: Expense[];
}

function groupExpensesByDate(expenses: Expense[]): ExpenseDateGroup[] {
  const groups = new Map<string, ExpenseDateGroup>();

  for (const expense of expenses) {
    const rawDate = expense.expenseDate?.trim();
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
    const isoDate = rawDate?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    const dateKey = isValidDate
      ? isoDate ?? `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`
      : 'undated';
    const date = isValidDate ? new Date(`${dateKey}T00:00:00.000Z`) : null;
    const label = date
      ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
      : 'Date unavailable';

    let group = groups.get(dateKey);
    if (!group) {
      group = { dateKey, label, sortKey: dateKey, expenses: [] };
      groups.set(dateKey, group);
    }
    group.expenses.push(expense);
  }

  return [...groups.values()].sort((left, right) => {
    if (left.dateKey === 'undated') return 1;
    if (right.dateKey === 'undated') return -1;
    return right.sortKey.localeCompare(left.sortKey);
  });
}

export function GroupDetailsScreen({ groupId }: { groupId: string }) {
  const { group, expenses, loading, message, isError, balance, balanceDirection, balanceAmount, loadGroup, userId } = useGroupDetails(groupId);
  const expenseGroups = useMemo(() => groupExpensesByDate(expenses), [expenses]);

  if (loading && !group) return <ScreenFrame><LoadingView label="Loading group" /></ScreenFrame>;
  if (!group) return <ScreenFrame><View style={styles.content}><IconButton name="back" accessibilityLabel="Go back" onPress={() => router.back()} />{message ? <Notice message={message} /> : null}<SecondaryButton title="Back to groups" onPress={() => router.back()} /></View></ScreenFrame>;

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topLine}>
          <IconButton name="back" accessibilityLabel="Go back" onPress={() => router.back()} />
          <View style={styles.headerText}>
            <AppText variant="caption" color={Palette.muted}>GROUP · {group.groupId}</AppText>
            <AppText variant="heading">{group.name}</AppText>
          </View>
          <View style={styles.headerActions}>
            <IconButton name="addUser" accessibilityLabel="Add a user" onPress={() => router.push({ pathname: '/add-member', params: { groupId: String(group.groupId) } })} />
          </View>
        </View>

        {group.description ? <AppText variant="small" color={Palette.muted}>{group.description}</AppText> : null}
        <PrimaryButton title="Add an expense" icon="add" onPress={() => router.push({ pathname: '/new-expense', params: { groupId: String(group.groupId) } })} />

        <View style={styles.summaryCard}>
          <AppText variant="small" color={Palette.muted}>Your total</AppText>
          <View style={styles.summaryRow}>
            <View style={styles.summaryText}>
              <AppText variant="caption" color={Palette.muted}>{balanceDirection}</AppText>
              <Money amount={balanceAmount} variant="display" color={balance.net > 0 ? Palette.ink : Palette.green} />
            </View>
            <View style={[styles.badge, balance.net > 0 ? styles.badgeDebt : styles.badgeCredit]}>
              <AppText variant="small" color={balance.net > 0 ? Palette.ink : Palette.green}>{balance.net > 0 ? 'Debt' : balance.net < 0 ? 'Receivable' : 'Even'}</AppText>
            </View>
          </View>
          <AppText variant="caption" color={Palette.muted}>
            {balance.net > 0 ? `You need to pay ${balance.youOwe - balance.owedToYou} in total.` : balance.net < 0 ? `You are owed ${Math.abs(balance.net)} in total.` : 'Your balance is fully settled for this group.'}
          </AppText>
        </View>

        {message ? <Notice message={message} kind={isError ? 'error' : 'success'} /> : null}

        <View style={styles.sectionHead}>
          <AppText variant="section">Expenses</AppText>
          <AppText variant="caption" color={Palette.muted}>{expenses.length}</AppText>
        </View>

        {loading ? <AppText variant="caption" color={Palette.muted}>Refreshing…</AppText> : null}

        {expenseGroups.length ? expenseGroups.map((dateGroup) => (
          <View key={dateGroup.dateKey} style={styles.expenseDateGroup}>
            <AppText variant="section" style={styles.dateHeading}>{dateGroup.label}</AppText>
            {dateGroup.expenses.map((expense) => (
              <Pressable key={expense.expenseId} accessibilityRole="button" onPress={() => router.push({ pathname: '/expense/[expenseId]', params: { expenseId: String(expense.expenseId) } })} style={({ pressed }) => [styles.expenseRow, pressed && styles.pressed]}>
                <View style={styles.expenseIcon}><AppIcon name="add" color={Palette.orangeDark} size={18} /></View>
                <View style={styles.expenseText}>
                  <AppText variant="body" style={styles.expenseTitle}>{expense.description || 'Group expense'}</AppText>
                </View>
                <Money amount={expense.amount} variant="small" color={expense.paidBy === userId ? Palette.ink : Palette.orangeDark} />
                <AppIcon name="chevron" color={Palette.muted} size={18} />
              </Pressable>
            ))}
          </View>
        )) : <View style={styles.emptyExpenses}><AppText variant="small" color={Palette.muted}>No expenses yet. Add the first one when your group is ready.</AppText></View>}

        <SecondaryButton title="Refresh group" onPress={() => void loadGroup(true)} />
      </ScrollView>
    </ScreenFrame>
  );
}

