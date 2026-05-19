import { useRef, useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { ILead } from '../../types';
import { LeadStatus, LeadSource } from '../../types';
import { createLeadApi, updateLeadApi } from '../../api/leads.api';
import type { CreateLeadPayload } from '../../api/leads.api';
import toast from 'react-hot-toast';
import { User, Mail, FileText, Globe, Activity, ChevronDown, Check } from 'lucide-react';

/* ── Custom themed dropdown ───────────────────────────────────────────────── */
interface DropdownProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function ThemedSelect({ label, icon, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <span className="text-xs uppercase tracking-wider font-semibold text-base-content/50">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`
            w-full h-12 flex items-center gap-3 px-4 rounded-lg cursor-pointer
            bg-base-300 border transition-colors duration-150
            ${open ? 'border-primary' : 'border-base-content/10 hover:border-base-content/20'}
          `}
        >
          {icon}
          <span className="grow text-left text-sm">{value}</span>
          <ChevronDown size={14} className={`text-base-content/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <ul className="absolute z-50 mt-1 w-full rounded-lg bg-base-300 border border-base-content/10 shadow-xl overflow-hidden py-1">
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer
                    transition-colors duration-100
                    ${opt === value
                      ? 'bg-primary/15 text-primary font-medium'
                      : 'text-base-content/70 hover:bg-base-content/5 hover:text-base-content'
                    }
                  `}
                >
                  {opt}
                  {opt === value && <Check size={14} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface Props {
  mode: 'create' | 'edit';
  lead?: ILead;
  onSuccess: () => void;
}

const defaultForm: CreateLeadPayload = {
  name: '', email: '', source: LeadSource.WEBSITE, status: LeadStatus.NEW, notes: '',
};

export default function LeadModal({ mode, lead, onSuccess }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<CreateLeadPayload>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && lead) {
      setForm({ name: lead.name, email: lead.email, source: lead.source, status: lead.status, notes: lead.notes ?? '' });
    } else {
      setForm(defaultForm);
    }
  }, [mode, lead]);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const set = (k: keyof CreateLeadPayload, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'create') {
        await createLeadApi(form);
        toast.success('Lead created!');
      } else if (lead) {
        await updateLeadApi(lead._id, form);
        toast.success('Lead updated!');
      }
      onSuccess();
      close();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={open}>
        {mode === 'create' ? '+ New Lead' : 'Edit Lead'}
      </button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-lg bg-base-200 border border-base-content/10">
          <h3 className="font-bold text-xl mb-6">{mode === 'create' ? 'Create New Lead' : 'Edit Lead'}</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-base-content/50">Full Name</span>
              <label className="input input-bordered w-full flex items-center gap-3 bg-base-300 border-base-content/10 focus-within:border-primary focus-within:outline-none">
                <User size={16} className="text-base-content/30 shrink-0" />
                <input
                  className="grow bg-transparent outline-none"
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="John Doe"
                />
              </label>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-base-content/50">Email</span>
              <label className="input input-bordered w-full flex items-center gap-3 bg-base-300 border-base-content/10 focus-within:border-primary focus-within:outline-none">
                <Mail size={16} className="text-base-content/30 shrink-0" />
                <input
                  type="email"
                  className="grow bg-transparent outline-none"
                  required
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </label>
            </div>

            {/* Source & Status row */}
            <div className="grid grid-cols-2 gap-3">
              <ThemedSelect
                label="Source"
                icon={<Globe size={16} className="text-base-content/30 shrink-0" />}
                value={form.source}
                options={Object.values(LeadSource)}
                onChange={(val) => set('source', val)}
              />
              <ThemedSelect
                label="Status"
                icon={<Activity size={16} className="text-base-content/30 shrink-0" />}
                value={form.status ?? LeadStatus.NEW}
                options={Object.values(LeadStatus)}
                onChange={(val) => set('status', val)}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-base-content/50">Notes</span>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-base-content/30" />
                <textarea
                  className="textarea textarea-bordered w-full h-24 bg-base-300 border-base-content/10 focus:border-primary focus:outline-none pl-9 resize-none"
                  value={form.notes ?? ''}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Optional notes…"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-base-content/10">
              <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : mode === 'create' ? 'Create Lead' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </>
  );
}
