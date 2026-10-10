import { request } from '@/lib/api-client';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const login = (body: LoginRequest) =>
  request<AuthResponse>('/api/auth/login', { method: 'POST', body });

export const register = (body: RegisterRequest) =>
  request<AuthResponse>('/api/auth/register', { method: 'POST', body });