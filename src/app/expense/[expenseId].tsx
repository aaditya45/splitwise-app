import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProtectedScreen } from '@/components/protected-screen';
import { AppText, Avatar, CurrencySymbol, IconButton, LoadingView, Money, Notice, ScreenFrame, uiStyles } from '@/components/ui/primitives';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { useApp } from '@/providers/app-provider';
import type { Expense } from '@/types/api';

export default function ExpenseDetailsScreen() {
  return <ProtectedScreen><ExpenseDetailsContent /></ProtectedScreen>;
}

function ExpenseDetailsContent() {
  const { expenseId } = useLocalSearchParams<{ expenseId: string }>();
  const { session, groups } = useApp();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !expenseId) return;
    let active = true;
    api.getExpense(session.token, Number(expenseId)).then((result) => {
      if (active) setExpense(result);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Could not load this expense.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [expenseId, session?.token]);

  if (loading) return <ScreenFrame><LoadingView label="Loading expense" /></ScreenFrame>;
  if (!expense) return <ScreenFrame><View style={styles.content}><IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} />{error ? <Notice message={error} /> : null}</View></ScreenFrame>;

  const group = groups.find((item) => item.groupId === expense.groupId);
  const payer = group?.members?.find((member) => member.userId === expense.paidBy);
  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topLine}><IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} /><AppText variant="section">Expense details</AppText><View style={styles.spacer} /></View>
        <View style={styles.amountBlock}>
          <View style={styles.amountIcon}><CurrencySymbol /></View>
          <AppText variant="small" color={Palette.muted}>{group?.name ?? `Group ${expense.groupId}`}</AppText>
          <Money amount={expense.amount} variant="display" />
          <AppText variant="body" color={Palette.muted}>{expense.description || 'Group expense'}</AppText>
          {expense.expenseDate ? <AppText variant="caption" color={Palette.muted}>{expense.expenseDate}</AppText> : null}
        </View>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}><AppText variant="small" color={Palette.muted}>Paid by</AppText><AppText variant="small">{expense.paidBy === session?.user.userId ? 'You' : payer?.name ?? `User ${expense.paidBy}`}</AppText></View>
          <View style={uiStyles.divider} />
          <View style={styles.detailRow}><AppText variant="small" color={Palette.muted}>Expense ID</AppText><AppText variant="small">{expense.expenseId}</AppText></View>
        </View>
        <AppText variant="section">Shares</AppText>
        {expense.splits?.length ? expense.splits.map((split) => (
          <View key={split.splitId} style={styles.splitRow}>
            <Avatar name={split.userId === session?.user.userId ? session.user.name : group?.members?.find((member) => member.userId === split.userId)?.name ?? `User ${split.userId}`} size={38} />
            <View style={styles.splitText}><AppText variant="small">{split.userId === session?.user.userId ? 'You' : group?.members?.find((member) => member.userId === split.userId)?.name ?? `User ${split.userId}`}</AppText><AppText variant="caption" color={Palette.muted}>{split.splitType.toLowerCase()}</AppText></View>
            <Money amount={split.amount} variant="small" />
          </View>
        )) : <AppText variant="small" color={Palette.muted}>No split details were returned.</AppText>}
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 44 },
  amountBlock: { alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.four },
  amountIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.orangeSoft, borderRadius: Radius.pill, marginBottom: Spacing.two },
  detailCard: { borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.medium, paddingHorizontal: Spacing.three },
  detailRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  splitRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  splitText: { flex: 1, gap: 1 },
});
