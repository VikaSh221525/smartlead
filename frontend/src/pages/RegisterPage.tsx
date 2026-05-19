import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { Zap, Eye, EyeOff, Mail, Lock, User, TrendingUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: UserRole }>({ name: '', email: '', password: '', role: UserRole.SALES });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: UserRole.SALES, label: 'Sales', icon: TrendingUp },
    { value: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-base-300 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-neutral p-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap size={20} className="text-primary-content" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-content">SmartLead</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-neutral-content leading-tight mb-3">
            Start Managing<br />Your Pipeline
          </h2>
          <p className="text-neutral-content/50 text-sm leading-relaxed">
            Join SmartLead and get access to a high-performance
            CRM designed for modern sales teams.
          </p>
        </div>
        <p className="text-neutral-content/30 text-xs">© 2026 SmartLead CRM</p>
      </div>

      {/* Right registration form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap size={20} className="text-primary-content" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartLead</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-base-content/50 mb-8">Start managing leads with SmartLead.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs uppercase tracking-wider font-semibold text-base-content/50">Full Name</span></label>
              <label className="input input-bordered w-full flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:outline-none">
                <User size={16} className="text-base-content/30 shrink-0" />
                <input
                  type="text" required minLength={2}
                  className="grow bg-transparent outline-none"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
            </div>

            {/* Email Address */}
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs uppercase tracking-wider font-semibold text-base-content/50">Email Address</span></label>
              <label className="input input-bordered w-full flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:outline-none">
                <Mail size={16} className="text-base-content/30 shrink-0" />
                <input
                  type="email" required
                  className="grow bg-transparent outline-none"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs uppercase tracking-wider font-semibold text-base-content/50">Password</span></label>
              <label className="input input-bordered w-full flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:outline-none">
                <Lock size={16} className="text-base-content/30 shrink-0" />
                <input
                  type={showPw ? 'text' : 'password'} required
                  className="grow bg-transparent outline-none"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-base-content/30 hover:text-base-content/60 transition-colors shrink-0">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            {/* Role selector — card tiles */}
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs uppercase tracking-wider font-semibold text-base-content/50">Select Role</span></label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(({ value, label, icon: Icon }) => {
                  const isSelected = form.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, role: value })}
                      className={`
                        relative flex flex-col items-center justify-center gap-2 rounded-xl p-5 cursor-pointer
                        border-2 transition-all duration-200
                        ${isSelected
                          ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--p)/0.15)]'
                          : 'border-base-content/10 bg-base-200 hover:border-base-content/25 hover:bg-base-200/80'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200
                        ${isSelected ? 'bg-primary/20 text-primary' : 'bg-base-content/5 text-base-content/40'}
                      `}>
                        <Icon size={22} />
                      </div>
                      <span className={`
                        text-sm font-semibold transition-colors duration-200
                        ${isSelected ? 'text-primary' : 'text-base-content/60'}
                      `}>
                        {label}
                      </span>
                      {/* Selection indicator dot */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2 h-12 text-sm font-semibold" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/40 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
