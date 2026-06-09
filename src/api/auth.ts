import type { LoginRequest, LoginResponse, RegisterRequest } from '../../types';
import { customFetch } from './client';

export const login = (data: LoginRequest): Promise<LoginResponse> =>
  customFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const register = (data: RegisterRequest): Promise<LoginResponse> =>
  customFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
