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
  status: 'PENDING' | 'PAID' | 'SETTLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface SettlementSummary {
  settlements?: Settlement[];
  [key: string]: unknown;
}