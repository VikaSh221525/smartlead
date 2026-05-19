import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
            Sales Intelligence<br />Terminal
          </h2>
          <p className="text-neutral-content/50 text-sm leading-relaxed">
            Your high-performance CRM dashboard for managing leads,
            tracking conversions, and closing deals faster.
          </p>
        </div>
        <p className="text-neutral-content/30 text-xs">© 2026 SmartLead CRM</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap size={20} className="text-primary-content" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartLead</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-base-content/50 mb-8">Sign in to your sales intelligence terminal.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-base-content/30 hover:text-base-content/60 transition-colors shrink-0">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2 h-12 text-sm font-semibold" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/40 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
