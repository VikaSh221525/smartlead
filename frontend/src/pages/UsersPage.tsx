import { useQuery } from '@tanstack/react-query';
import { getUsersApi } from '../api/users.api';
import AppLayout from '../components/layout/AppLayout';
import PageLoader from '../components/ui/PageLoader';
import EmptyState from '../components/ui/EmptyState';
import { Users } from 'lucide-react';

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsersApi,
  });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Admin</p>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-base-content/50 mt-1">{users.length} registered users</p>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-0">
            {isLoading ? (
              <div className="p-8"><PageLoader /></div>
            ) : !users.length ? (
              <EmptyState icon={<Users />} title="No users yet" />
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-base-300">
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Name</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Email</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Role</th>
                      <th className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-base-300">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-primary/15 text-primary rounded-full w-9">
                                <span className="text-sm font-bold">{u.name?.[0]?.toUpperCase()}</span>
                              </div>
                            </div>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="text-base-content/60">{u.email}</td>
                        <td>
                          <span className={`badge badge-sm capitalize ${u.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="text-sm text-base-content/50">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
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
