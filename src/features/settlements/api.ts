import { request } from '@/lib/api-client';
import type { Settlement, SettlementSummary } from './types';

export const getPendingSettlements = (token: string, groupId: number) =>
  request<Settlement[]>(`/api/settlements/group/${groupId}/user/pending`, { token });

export const getSettlementSummary = (token: string, groupId: number) =>
  request<Settlement[] | SettlementSummary>(`/api/settlements/group/${groupId}/summary`, { token });

export const paySettlement = (token: string, settlementId: number) =>
  request<Settlement>(`/api/settlements/${settlementId}/pay`, { method: 'POST', token });