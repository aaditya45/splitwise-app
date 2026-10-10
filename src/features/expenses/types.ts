export type SplitType = 'EQUAL' | 'PERCENTAGE' | 'ITEMIZE';

export interface ExpenseParty {
  userId: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface ExpenseSplit {
  splitId: number;
  userId?: number;
  user?: ExpenseParty;
  amount: number;
  splitType: SplitType;
}

export interface Expense {
  expenseId: number;
  groupId: number;
  paidBy: number | ExpenseParty;
  amount: number;
  description?: string;
  expenseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  participants?: ExpenseParty[];
  splits?: ExpenseSplit[];
}

export interface CreateExpenseRequest {
  groupId: number;
  amount: number;
  description?: string;
  participantIds: number[];
  splitType: SplitType;
}