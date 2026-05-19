import api from './axios';
import type { ApiResponse, IUser } from '../types';

export const getUsersApi = async (): Promise<IUser[]> => {
  const res = await api.get<ApiResponse<IUser[]>>('/api/users');
  return res.data.data ?? [];
};
