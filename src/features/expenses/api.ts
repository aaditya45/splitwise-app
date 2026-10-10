import { request } from '@/lib/api-client';
import type { CreateExpenseRequest, Expense } from './types';

export const createExpense = (token: string, body: CreateExpenseRequest) =>
  request<Expense>('/api/expenses', { method: 'POST', token, body });

export const getExpense = (token: string, expenseId: number) =>
  request<Expense>(`/api/expenses/${expenseId}`, { token });

export const getGroupExpenses = (token: string, groupId: number) =>
  request<Expense[]>(`/api/expenses/group/${groupId}`, { token });