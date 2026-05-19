import { useQuery } from '@tanstack/react-query';
import { getLeadStatsApi, getLeadsApi } from '../api/leads.api';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import PageLoader from '../components/ui/PageLoader';
import { useAuth } from '../contexts/AuthContext';
import { Zap, CheckCircle, PhoneCall, XCircle, Users } from 'lucide-react';
import { LeadStatus } from '../types';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  New: '#38bdf8',
  Contacted: '#fbbf24',
  Qualified: '#4ade80',
  Lost: '#f87171',
};

const SOURCE_COLORS = ['#6366f1', '#06b6d4', '#8b5cf6'];

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: getLeadStatsApi,
    enabled: isAdmin,
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['leads-recent'],
    queryFn: () => getLeadsApi({ limit: 5, page: 1 }),
  });

  const statusCards = [
    { status: LeadStatus.NEW,       label: 'New Leads',  icon: <Zap size={20} />,         color: 'text-info' },
    { status: LeadStatus.CONTACTED, label: 'Contacted',  icon: <PhoneCall size={20} />,    color: 'text-warning' },
    { status: LeadStatus.QUALIFIED, label: 'Qualified',  icon: <CheckCircle size={20} />,  color: 'text-success' },
    { status: LeadStatus.LOST,      label: 'Lost',       icon: <XCircle size={20} />,      color: 'text-error' },
  ];

  // Custom label for pie chart that avoids the TS error
  const renderPieLabel = (entry: { name?: string; percent?: number }) => {
    const name = entry.name ?? '';
    const pct = entry.percent != null ? (entry.percent * 100).toFixed(0) : '0';
    return `${name} ${pct}%`;
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Overview</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/50 mt-1">
            Real-time pulse of your sales pipeline. Welcome back, <span className="text-base-content font-medium">{user?.name}</span>.
          </p>
        </div>

        {/* Stats cards (admin only) */}
        {isAdmin && (
          <>
            {statsLoading ? <PageLoader /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  title="Total Leads"
                  value={stats?.total ?? 0}
                  icon={<Users size={20} />}
                  colorClass="text-primary"
                />
                {statusCards.map(({ status, label, icon, color }) => (
                  <StatCard
                    key={status}
                    title={label}
                    value={stats?.byStatus.find((s) => s.status === status)?.count ?? 0}
                    icon={icon}
                    colorClass={color}
                  />
                ))}
              </div>
            )}

            {/* Charts row */}
            {!statsLoading && stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar chart – by source */}
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50 mb-4">Leads by Source</h2>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={stats.bySource} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.08)" />
                        <XAxis dataKey="source" tick={{ fontSize: 12, fill: 'oklch(var(--bc) / 0.5)' }} />
                        <YAxis tick={{ fontSize: 12, fill: 'oklch(var(--bc) / 0.5)' }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'oklch(var(--b2))', border: '1px solid oklch(var(--bc) / 0.1)', borderRadius: '8px', fontSize: '13px' }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                          {stats.bySource.map((s, i) => (
                            <Cell key={s.source} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie chart – by status */}
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50 mb-4">Leads by Status</h2>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={stats.byStatus.filter((s) => s.count > 0)}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={85}
                          innerRadius={45}
                          paddingAngle={3}
                          label={renderPieLabel}
                        >
                          {stats.byStatus.map((s) => (
                            <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? '#94a3b8'} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'oklch(var(--b2))', border: '1px solid oklch(var(--bc) / 0.1)', borderRadius: '8px', fontSize: '13px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Recent Leads */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50 mb-4">Recent Leads</h2>
            {recentLoading ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-base-300">
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Name</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Email</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Status</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Source</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recent?.leads ?? []).map((lead) => (
                      <tr key={lead._id} className="hover border-base-300">
                        <td className="font-medium">{lead.name}</td>
                        <td className="text-base-content/60">{lead.email}</td>
                        <td><StatusBadge status={lead.status} size="sm" /></td>
                        <td><span className="badge badge-ghost badge-sm">{lead.source}</span></td>
                        <td className="text-sm text-base-content/50">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
