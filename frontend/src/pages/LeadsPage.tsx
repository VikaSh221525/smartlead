import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLeadsApi, exportLeadsCSVApi } from '../api/leads.api';
import { SortOrder } from '../types';
import type { LeadQueryParams } from '../types';
import AppLayout from '../components/layout/AppLayout';
import LeadTable from '../components/leads/LeadTable';
import LeadFilters from '../components/leads/LeadFilters';
import LeadModal from '../components/leads/LeadModal';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultFilters: LeadQueryParams = {
  page: 1, limit: 10, search: '', status: '', source: '', sort: SortOrder.LATEST,
};

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadQueryParams>(defaultFilters);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => getLeadsApi(filters),
  });

  const handleExport = async () => {
    try {
      await exportLeadsCSVApi(filters);
      toast.success('CSV downloaded!');
    } catch {
      toast.error('Export failed');
    }
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['leads'] });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Management</p>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-base-content/50 mt-1">
              {data?.meta?.total ?? 0} total leads in pipeline
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm gap-2 text-base-content/50" onClick={handleExport}>
              <Download size={15} /> Export CSV
            </button>
            <LeadModal mode="create" onSuccess={refresh} />
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body py-3 px-4">
            <LeadFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Table */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-0">
            <LeadTable
              leads={data?.leads ?? []}
              meta={data?.meta}
              isLoading={isLoading}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
