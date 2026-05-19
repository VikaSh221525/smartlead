import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLeadByIdApi, deleteLeadApi } from '../api/leads.api';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/ui/StatusBadge';
import LeadModal from '../components/leads/LeadModal';
import PageLoader from '../components/ui/PageLoader';
import { ArrowLeft, Trash2, Mail, Tag, Globe, Calendar, FileText, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLeadByIdApi(id!),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    try {
      await deleteLeadApi(id!);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['lead', id] });
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        {/* Back */}
        <button
          className="btn btn-ghost btn-sm gap-2 text-base-content/50 -ml-2"
          onClick={() => navigate('/leads')}
        >
          <ArrowLeft size={16} /> Back to Leads
        </button>

        {isLoading ? (
          <PageLoader />
        ) : !lead ? (
          <div className="alert alert-error"><span>Lead not found.</span></div>
        ) : (
          <>
            {/* Header card */}
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Lead Details</p>
                    <h1 className="text-2xl font-bold">{lead.name}</h1>
                    <p className="text-base-content/50 flex items-center gap-2 mt-1 text-sm">
                      <Mail size={14} /> {lead.email}
                    </p>
                    <div className="mt-3">
                      <StatusBadge status={lead.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeadModal mode="edit" lead={lead} onSuccess={refresh} />
                    <button className="btn btn-error btn-outline btn-sm gap-1" onClick={handleDelete}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Details card */}
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50 mb-5">Information</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex gap-3">
                    <Tag size={16} className="text-base-content/30 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-base-content/40 uppercase tracking-wider font-semibold mb-1">Source</dt>
                      <dd><span className="badge badge-ghost">{lead.source}</span></dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <User size={16} className="text-base-content/30 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-base-content/40 uppercase tracking-wider font-semibold mb-1">Created By</dt>
                      <dd className="text-sm">{lead.createdBy?.name ?? '—'}</dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Globe size={16} className="text-base-content/30 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-base-content/40 uppercase tracking-wider font-semibold mb-1">Assigned To</dt>
                      <dd className="text-sm">{lead.assignedTo?.name ?? 'Unassigned'}</dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar size={16} className="text-base-content/30 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs text-base-content/40 uppercase tracking-wider font-semibold mb-1">Created</dt>
                      <dd className="text-sm">{new Date(lead.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</dd>
                    </div>
                  </div>

                  {lead.notes && (
                    <div className="sm:col-span-2 flex gap-3">
                      <FileText size={16} className="text-base-content/30 mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-xs text-base-content/40 uppercase tracking-wider font-semibold mb-1">Notes</dt>
                        <dd className="text-sm whitespace-pre-line">{lead.notes}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
