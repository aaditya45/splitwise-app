import type { Settlement } from '@/features/settlements/types';

export interface GroupBalanceBreakdown {
  youOwe: number;
  owedToYou: number;
  net: number;
}

export function getGroupBalanceBreakdown(
  settlements: Settlement[],
  userId: number,
): GroupBalanceBreakdown {
  const youOwe = settlements.reduce((sum, item) => {
    if (item.debtor.userId === userId) return sum + Number(item.amount ?? 0);
    return sum;
  }, 0);

  const owedToYou = settlements.reduce((sum, item) => {
    if (item.creditor.userId === userId) return sum + Number(item.amount ?? 0);
    return sum;
  }, 0);

  return { youOwe, owedToYou, net: youOwe - owedToYou };
}

export interface SettleUpLists {
  /** Pending settlements where the current user is the debtor: money they need to pay. */
  toPay: Settlement[];
  /** Pending settlements where the current user is the creditor: money others owe them. */
  toReceive: Settlement[];
}

export function getSettleUpLists(settlements: Settlement[], userId: number): SettleUpLists {
  const pending = settlements.filter((item) => item.status === 'PENDING');
  return {
    toPay: pending.filter((item) => item.debtor.userId === userId),
    toReceive: pending.filter((item) => item.creditor.userId === userId),
  };
}