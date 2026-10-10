export type SplitType = 'EQUAL' | 'PERCENTAGE' | 'ITEMIZE';

export interface ExpenseSplit {
  splitId: number;
  userId: number;
  amount: number;
  splitType: SplitType;
}

export interface Expense {
  expenseId: number;
  groupId: number;
  paidBy: number;
  amount: number;
  description?: string;
  expenseDate?: string;
  splits?: ExpenseSplit[];
}

export interface CreateExpenseRequest {
  groupId: number;
  amount: number;
  description?: string;
  participantIds: number[];
  splitType: SplitType;
}