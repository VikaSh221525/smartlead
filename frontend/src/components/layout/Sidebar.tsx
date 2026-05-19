import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/leads',     icon: <Zap size={18} />,             label: 'Leads' },
];

const adminItems = [
  { to: '/users', icon: <Users size={18} />, label: 'Users' },
];

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-neutral text-neutral-content shrink-0 border-r border-neutral-content/5">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-neutral-content/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={16} className="text-primary-content" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight block leading-tight">SmartLead</span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-content/30 font-semibold">Sales Intelligence</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <p className="text-[10px] uppercase tracking-widest text-neutral-content/25 font-semibold px-3 mb-3">Main</p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/15 text-primary border-l-3 border-primary'
                      : 'text-neutral-content/50 hover:bg-neutral-content/5 hover:text-neutral-content/80'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-neutral-content/25 font-semibold px-3 mb-3 mt-8">Admin</p>
            <ul className="flex flex-col gap-1">
              {adminItems.map(({ to, icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary/15 text-primary border-l-3 border-primary'
                          : 'text-neutral-content/50 hover:bg-neutral-content/5 hover:text-neutral-content/80'
                      }`
                    }
                  >
                    {icon}
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-neutral-content/5">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="avatar placeholder">
            <div className="bg-primary/20 text-primary rounded-full w-9">
              <span className="text-sm font-bold">{user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-[10px] text-neutral-content/30 uppercase tracking-wider font-semibold">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn btn-sm btn-ghost text-neutral-content/40 hover:text-error w-full justify-start gap-2 text-xs"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
