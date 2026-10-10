import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProtectedScreen } from '@/features/auth/components/protected-screen';
import { AppText, Avatar, CurrencySymbol, IconButton, LoadingView, Money, Notice, ScreenFrame, uiStyles } from '@/components/ui';
import { expenseDetailsScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import { formatExpenseDate } from '@/lib/format-date';
import { getExpense } from '@/features/expenses/api';
import { useApp } from '@/providers/app-provider';
import type { Expense } from '@/features/expenses/types';

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
    getExpense(session.token, Number(expenseId)).then((result) => {
      if (active) setExpense(result);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Could not load this expense.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [expenseId, session?.token]);

  if (loading) return <ScreenFrame><LoadingView label="Loading expense" /></ScreenFrame>;
  if (!expense) return <ScreenFrame><View style={styles.content}><IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} />{error ? <Notice message={error} /> : null}</View></ScreenFrame>;

  const group = groups.find((item) => item.groupId === expense.groupId);
  const payerId = typeof expense.paidBy === 'number' ? expense.paidBy : expense.paidBy.userId;
  const payer = typeof expense.paidBy === 'number'
    ? group?.members?.find((member) => member.userId === payerId)
    : expense.paidBy;
  const payerEmail = typeof expense.paidBy === 'number' ? undefined : expense.paidBy.email;
  const payerPhone = typeof expense.paidBy === 'number' ? undefined : expense.paidBy.phone;
  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topLine}><IconButton name="close" accessibilityLabel="Close" onPress={() => router.back()} /><AppText variant="section">Expense details</AppText><View style={styles.spacer} /></View>
        <View style={styles.amountBlock}>
          <Money amount={expense.amount} variant="display" />
          <AppText variant="body" color={Palette.muted}>{expense.description || 'Group expense'}</AppText>
          {expense.expenseDate ? <AppText variant="caption" color={Palette.muted}>
  {formatExpenseDate(expense.expenseDate)}
</AppText> : null}
        </View>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}><AppText variant="small" color={Palette.muted}>Paid by</AppText><AppText variant="small">{payerId === session?.user.userId ? 'You' : payer?.name ?? `User ${payerId}`}</AppText></View>
          {payerEmail ? <AppText variant="caption" color={Palette.muted}>{payerEmail}</AppText> : null}
          {payerPhone ? <AppText variant="caption" color={Palette.muted}>{payerPhone}</AppText> : null}
          <View style={uiStyles.divider} />
          <View style={styles.detailRow}><AppText variant="small" color={Palette.muted}>Expense ID</AppText><AppText variant="small">{expense.expenseId}</AppText></View>
        </View>
        {expense.participants?.length ? <>
          <AppText variant="section">Participants</AppText>
          <View>
            {expense.participants.map((participant) => (
              <View key={participant.userId} style={styles.splitRow}>
                <Avatar name={participant.name} size={38} />
                <View style={styles.splitText}>
                  <AppText variant="small">{participant.userId === session?.user.userId ? 'You' : participant.name}</AppText>
                  {participant.email ? <AppText variant="caption" color={Palette.muted}>{participant.email}</AppText> : null}
                  {participant.phone ? <AppText variant="caption" color={Palette.muted}>{participant.phone}</AppText> : null}
                </View>
              </View>
            ))}
          </View>
        </> : null}
        <AppText variant="section">Shares</AppText>
        {expense.splits?.length ? expense.splits.map((split) => {
          const splitUserId = split.user?.userId ?? split.userId;
          const splitUser = split.user ?? (splitUserId === undefined
            ? undefined
            : group?.members?.find((member) => member.userId === splitUserId));
          const splitUserName = splitUserId === session?.user.userId
            ? 'You'
            : splitUser?.name ?? (splitUserId === undefined ? 'Unknown user' : `User ${splitUserId}`);
          const splitAvatarName = session && splitUserId === session.user.userId
            ? session.user.name
            : splitUser?.name ?? splitUserName;

          return (
            <View key={split.splitId} style={styles.splitRow}>
              <Avatar name={splitAvatarName} size={38} />
              <View style={styles.splitText}>
                <AppText variant="small">{splitUserName}</AppText>
                <AppText variant="caption" color={Palette.muted}>{split.splitType.toLowerCase()}</AppText>
                {split.user?.email ? <AppText variant="caption" color={Palette.muted}>{split.user.email}</AppText> : null}
                {split.user?.phone ? <AppText variant="caption" color={Palette.muted}>{split.user.phone}</AppText> : null}
              </View>
              <Money amount={split.amount} variant="small" />
            </View>
          );
        }) : <AppText variant="small" color={Palette.muted}>No split details were returned.</AppText>}
      </ScrollView>
    </ScreenFrame>
  );
}

