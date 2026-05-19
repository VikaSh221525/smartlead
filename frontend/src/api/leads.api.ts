import api from './axios';
import type { ApiResponse, ILead, LeadQueryParams, LeadStats, PaginationMeta } from '../types';

export interface CreateLeadPayload {
  name: string;
  email: string;
  source: string;
  status?: string;
  notes?: string;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface LeadsResponse {
  leads: ILead[];
  meta: PaginationMeta;
}

export const getLeadsApi = async (params: LeadQueryParams = {}): Promise<LeadsResponse> => {
  // Remove empty strings from params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );
  const res = await api.get<ApiResponse<ILead[]>>('/api/leads', { params: cleanParams });
  return { leads: res.data.data ?? [], meta: res.data.meta! };
};

export const getLeadByIdApi = async (id: string): Promise<ILead> => {
  const res = await api.get<ApiResponse<ILead>>(`/api/leads/${id}`);
  return res.data.data!;
};

export const createLeadApi = async (data: CreateLeadPayload): Promise<ILead> => {
  const res = await api.post<ApiResponse<ILead>>('/api/leads', data);
  return res.data.data!;
};

export const updateLeadApi = async (id: string, data: UpdateLeadPayload): Promise<ILead> => {
  const res = await api.patch<ApiResponse<ILead>>(`/api/leads/${id}`, data);
  return res.data.data!;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/api/leads/${id}`);
};

export const exportLeadsCSVApi = async (params: LeadQueryParams = {}): Promise<void> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );
  const res = await api.get('/api/leads/export/csv', {
    params: cleanParams,
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const getLeadStatsApi = async (): Promise<LeadStats> => {
  const res = await api.get<ApiResponse<LeadStats>>('/api/leads/stats');
  return res.data.data!;
};
