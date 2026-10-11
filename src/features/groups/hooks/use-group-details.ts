import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { getGroupExpenses } from '@/features/expenses/api';
import type { Expense } from '@/features/expenses/types';
import { getPendingSettlements, paySettlement } from '@/features/settlements/api';
import type { Settlement } from '@/features/settlements/types';
import { getSettleUpLists } from '@/features/groups/utils/group-balance';
import type { Group } from '@/features/groups/types';
import { useApp } from '@/providers/app-provider';

export function useGroupDetails(groupId: string) {
  const { session, groups, loadGroups } = useApp();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const userId = session?.user.userId ?? 0;

  const loadGroup = useCallback(async (refreshMembership = false) => {
    if (!session?.token || !groupId) return;
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const id = Number(groupId);
      const cachedGroup = groups.find((item) => item.groupId === id);
      const userGroups = refreshMembership || !cachedGroup ? await loadGroups() : groups;
      const nextGroup = userGroups.find((item) => item.groupId === id);
      if (!nextGroup) throw new Error(`Group ${id} is not available in this account.`);
      setGroup(nextGroup);

      const [nextExpenses, nextSettlements] = await Promise.all([
        getGroupExpenses(session.token, id),
        getPendingSettlements(session.token, id),
      ]);
      setExpenses(nextExpenses);
      setSettlements(nextSettlements);
    } catch (cause) {
      setIsError(true);
      setMessage(cause instanceof Error ? cause.message : 'Could not load this group.');
    } finally {
      setLoading(false);
    }
  }, [groupId, groups, loadGroups, session?.token]);

  useFocusEffect(useCallback(() => {
    void loadGroup();
  }, [loadGroup]));

  const { toPay, toReceive } = useMemo(() => getSettleUpLists(settlements, userId), [settlements, userId]);

  const markPaid = useCallback(async (settlementId: number) => {
    if (!session?.token) return;
    setPayingId(settlementId);
    setMessage('');
    setIsError(false);
    try {
      await paySettlement(session.token, settlementId);
    } catch (cause) {
      setIsError(true);
      setMessage(cause instanceof Error ? cause.message : 'Could not mark this payment as paid.');
      setPayingId(null);
      return;
    }
    try {
      setSettlements(await getPendingSettlements(session.token, Number(groupId)));
      setMessage('Payment marked as paid.');
    } catch {
      setMessage('Payment was marked as paid. Refresh to see the latest list.');
    } finally {
      setPayingId(null);
    }
  }, [groupId, session?.token]);

  return {
    group,
    expenses,
    loading,
    message,
    isError,
    toPay,
    toReceive,
    payingId,
    markPaid,
    loadGroup,
    userId,
  };
}