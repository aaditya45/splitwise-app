import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { getGroupExpenses } from '@/features/expenses/api';
import type { Expense } from '@/features/expenses/types';
import { getPendingSettlements } from '@/features/settlements/api';
import type { Settlement } from '@/features/settlements/types';
import { getGroupBalanceBreakdown } from '@/features/groups/utils/group-balance';
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

  const balance = useMemo(() => getGroupBalanceBreakdown(settlements, userId), [settlements, userId]);

  return {
    group,
    expenses,
    loading,
    message,
    isError,
    balance,
    balanceDirection: balance.net > 0 ? 'You owe' : balance.net < 0 ? 'You are owed' : 'Settled',
    balanceAmount: Math.abs(balance.net),
    loadGroup,
    userId,
  };
}