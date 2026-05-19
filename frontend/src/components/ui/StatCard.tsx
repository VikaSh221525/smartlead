import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  colorClass?: string;
}

export default function StatCard({ title, value, icon, trend, colorClass = 'text-primary' }: Props) {
  const isPositive = (trend?.value ?? 0) >= 0;
  return (
    <div className="card bg-base-100 border border-base-300 hover:border-primary/30 transition-colors duration-200">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-base-content/40 font-semibold uppercase tracking-wider">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{value}</p>
          </div>
          <div className={`p-2.5 rounded-lg bg-base-200/50 ${colorClass} opacity-60`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm mt-3 ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
