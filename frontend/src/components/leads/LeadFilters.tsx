import { LeadStatus, LeadSource, SortOrder } from '../../types';
import type { LeadQueryParams } from '../../types';
import { Search, RotateCcw } from 'lucide-react';

interface Props {
  filters: LeadQueryParams;
  onChange: (f: LeadQueryParams) => void;
}

export default function LeadFilters({ filters, onChange }: Props) {
  const set = (key: keyof LeadQueryParams, value: string | number) =>
    onChange({ ...filters, [key]: value, page: 1 });

  const reset = () => onChange({ page: 1, limit: 10, search: '', status: '', source: '', sort: SortOrder.LATEST });

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <label className="input input-bordered input-sm flex items-center gap-2 w-60">
        <Search size={14} className="opacity-50" />
        <input
          type="text"
          placeholder="Search name or email…"
          value={filters.search ?? ''}
          onChange={(e) => set('search', e.target.value)}
          className="grow"
        />
      </label>

      {/* Status */}
      <select
        className="select select-bordered select-sm"
        value={filters.status ?? ''}
        onChange={(e) => set('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        {Object.values(LeadStatus).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Source */}
      <select
        className="select select-bordered select-sm"
        value={filters.source ?? ''}
        onChange={(e) => set('source', e.target.value)}
      >
        <option value="">All Sources</option>
        {Object.values(LeadSource).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        className="select select-bordered select-sm"
        value={filters.sort ?? SortOrder.LATEST}
        onChange={(e) => set('sort', e.target.value)}
      >
        <option value={SortOrder.LATEST}>Newest First</option>
        <option value={SortOrder.OLDEST}>Oldest First</option>
      </select>

      {/* Reset */}
      <button className="btn btn-ghost btn-sm gap-1" onClick={reset}>
        <RotateCcw size={14} /> Reset
      </button>
    </div>
  );
}
