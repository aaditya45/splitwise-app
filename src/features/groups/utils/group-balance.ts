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