import type { LoginRequest, RegisterRequest } from '../types/index';
import { customFetch } from './client';

// Backend returns snake_case: { access_token, token_type, expires_in }
interface RawLoginResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthResult {
  accessToken: string | null;
}

const normalize = (raw: RawLoginResponse): AuthResult => ({
  accessToken: raw.access_token ?? null,
});

export const login = (data: LoginRequest): Promise<AuthResult> =>
  customFetch<RawLoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(normalize);

export const register = (data: RegisterRequest): Promise<AuthResult> =>
  customFetch<RawLoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(normalize);
