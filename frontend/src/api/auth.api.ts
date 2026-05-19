import api from './axios';
import type { ApiResponse } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const loginApi = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
  return res.data.data!;
};

export const registerApi = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
  return res.data.data!;
};

export const getMeApi = async (): Promise<AuthUser> => {
  const res = await api.get<ApiResponse<AuthUser>>('/api/auth/me');
  return res.data.data!;
};
