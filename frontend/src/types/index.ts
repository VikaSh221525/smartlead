// ─── Const objects (replaces enums — compatible with erasableSyntaxOnly) ──────

export const UserRole = {
  ADMIN: 'admin',
  SALES: 'sales',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const LeadStatus = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  LOST: 'Lost',
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadSource = {
  WEBSITE: 'Website',
  INSTAGRAM: 'Instagram',
  REFERRAL: 'Referral',
} as const;
export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export const SortOrder = {
  LATEST: 'latest',
  OLDEST: 'oldest',
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: { id: string; name: string; email: string } | null;
  createdBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

// ─── Query Params ────────────────────────────────────────────────────────────

export interface LeadQueryParams {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  byStatus: { status: LeadStatus; count: number }[];
  bySource: { source: LeadSource; count: number }[];
}
