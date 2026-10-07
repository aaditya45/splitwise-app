export interface AuthUser {
  userId: number;
  email: string;
  name: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
  type: string;
}

export interface GroupMember {
  userId: number;
  name: string;
}

export interface Group {
  groupId: number;
  name: string;
  description?: string;
  groupImage?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  members?: GroupMember[];
}

export type SplitType = "EQUAL" | "PERCENTAGE" | "ITEMIZE";

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

export interface SettlementParty {
  userId: number;
  name: string;
}

export interface Settlement {
  settlementId: number;
  groupId: number;
  debtor: SettlementParty;
  creditor: SettlementParty;
  amount: number;
  status: "PENDING" | "PAID" | "SETTLED";
  createdAt?: string;
  updatedAt?: string;
}

export interface SettlementSummary {
  settlements?: Settlement[];
  [key: string]: unknown;
}
