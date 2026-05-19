import { LeadStatus } from '../../types';


const config: Record<LeadStatus, { label: string; className: string }> = {
  [LeadStatus.NEW]:       { label: 'New',       className: 'badge-info' },
  [LeadStatus.CONTACTED]: { label: 'Contacted', className: 'badge-warning' },
  [LeadStatus.QUALIFIED]: { label: 'Qualified', className: 'badge-success' },
  [LeadStatus.LOST]:      { label: 'Lost',      className: 'badge-error' },
};

interface Props {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { label, className } = config[status] ?? { label: status, className: 'badge-neutral' };
  return (
    <span className={`badge ${className} ${size === 'sm' ? 'badge-sm' : ''}`}>
      {label}
    </span>
  );
}
