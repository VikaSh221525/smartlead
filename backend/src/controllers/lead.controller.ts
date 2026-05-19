import { Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import Lead, { ILeadDocument } from '../models/Lead';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource, SortOrder, UserRole } from '../types';
import { sendSuccess, sendError, buildPaginationMeta } from '../utils/response';
import { createError } from '../middleware/errorHandler';

const DEFAULT_LIMIT = 10;

// ─── Build filter query from query params ─────────────────────────────────────
const buildFilterQuery = (
  query: LeadQueryParams,
  userId: string,
  role: UserRole
): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  // Sales users can only see their own leads
  if (role === UserRole.SALES) {
    filter.createdBy = userId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search && query.search.trim()) {
    const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
    ];
  }

  return filter;
};

// ─── GET /api/leads ───────────────────────────────────────────────────────────
export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const query = req.query as LeadQueryParams;
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? String(DEFAULT_LIMIT), 10)));
    const skip = (page - 1) * limit;
    const sortOrder = query.sort === SortOrder.OLDEST ? 1 : -1;

    const filter = buildFilterQuery(query, req.user.id, req.user.role);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, page, limit);

    sendSuccess(res, 200, 'Leads retrieved successfully.', leads, meta);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 403, 'Access forbidden.');
      return;
    }

    sendSuccess(res, 200, 'Lead retrieved successfully.', lead);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/leads ──────────────────────────────────────────────────────────
export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populated = await lead.populate('createdBy', 'name email');

    sendSuccess(res, 201, 'Lead created successfully.', populated);
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/leads/:id ─────────────────────────────────────────────────────
export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 403, 'Access forbidden.');
      return;
    }

    // Prevent updating createdBy
    const { createdBy, ...updateData } = req.body as Record<string, unknown>;
    void createdBy; // intentionally ignored

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    sendSuccess(res, 200, 'Lead updated successfully.', updated);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // Only admins or the creator can delete
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 403, 'Access forbidden.');
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);

    sendSuccess(res, 200, 'Lead deleted successfully.');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/export/csv ────────────────────────────────────────────────
export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      next(createError('Not authenticated.', 401));
      return;
    }

    const query = req.query as LeadQueryParams;
    const filter = buildFilterQuery(query, req.user.id, req.user.role);

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    // Build CSV manually (no extra dependency needed)
    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Assigned To', 'Created At'];

    const rows = leads.map((lead) => {
      const createdBy = lead.createdBy as { name?: string; email?: string } | null;
      const assignedTo = lead.assignedTo as { name?: string; email?: string } | null;

      return [
        lead._id?.toString() ?? '',
        `"${(lead.name ?? '').replace(/"/g, '""')}"`,
        lead.email ?? '',
        lead.status ?? '',
        lead.source ?? '',
        `"${(lead.notes ?? '').replace(/"/g, '""')}"`,
        createdBy ? `${createdBy.name ?? ''} <${createdBy.email ?? ''}>` : '',
        assignedTo ? `${assignedTo.name ?? ''} <${assignedTo.email ?? ''}>` : '',
        lead.createdAt ? new Date(lead.createdAt).toISOString() : '',
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/stats (admin only) ───────────────────────────────────────
export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [statusStats, sourceStats, totalLeads] = await Promise.all([
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(),
    ]);

    const stats = {
      total: totalLeads,
      byStatus: Object.values(LeadStatus).map((status) => ({
        status,
        count: (statusStats.find((s) => s._id === status)?.count as number) ?? 0,
      })),
      bySource: Object.values(LeadSource).map((source) => ({
        source,
        count: (sourceStats.find((s) => s._id === source)?.count as number) ?? 0,
      })),
    };

    sendSuccess(res, 200, 'Lead statistics retrieved.', stats);
  } catch (error) {
    next(error);
  }
};
