import type { ILead, PaginationMeta } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  leads: ILead[];
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function LeadTable({ leads, meta, onPageChange, isLoading }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!leads.length) {
    return <EmptyState icon={<Zap />} title="No leads found" description="Try adjusting your filters or create a new lead." />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="border-base-300">
              <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Name</th>
              <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Email</th>
              <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Status</th>
              <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Source</th>
              <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Created By</th>
              <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover cursor-pointer border-base-300 transition-colors"
                onClick={() => navigate(`/leads/${lead._id}`)}
              >
                <td className="font-medium">{lead.name}</td>
                <td className="text-base-content/60">{lead.email}</td>
                <td><StatusBadge status={lead.status} size="sm" /></td>
                <td><span className="badge badge-ghost badge-sm">{lead.source}</span></td>
                <td className="text-sm text-base-content/60">{lead.createdBy?.name ?? '—'}</td>
                <td className="text-sm text-base-content/50">{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-300">
          <span className="text-sm text-base-content/50">
            Showing page {meta.page} of {meta.totalPages} · {meta.total} total
          </span>
          <div className="join">
            <button
              className="join-item btn btn-sm btn-ghost"
              disabled={!meta.hasPrevPage}
              onClick={() => onPageChange(meta.page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="join-item btn btn-sm btn-ghost font-bold">{meta.page}</button>
            <button
              className="join-item btn btn-sm btn-ghost"
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange(meta.page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
