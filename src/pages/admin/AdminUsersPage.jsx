import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { Users, ShieldCheck, UserCheck, GraduationCap, Search } from 'lucide-react';

export function AdminUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await dataService.getAllUsers();
        setUsers(list);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await dataService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      addToast(`Updated user permissions to ${newRole.toUpperCase()}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update role', 'error');
    }
  };

  const filtered = users.filter((u) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Role Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign verified teacher or administrator privileges through trusted governance.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">User Profile</th>
                <th className="px-6 py-3.5">Current Role</th>
                <th className="px-6 py-3.5">Level & XP</th>
                <th className="px-6 py-3.5">Member Since</th>
                <th className="px-6 py-3.5 text-right">Assign Trusted Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={user.full_name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{user.full_name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'rose'
                          : user.role === 'teacher'
                          ? 'amber'
                          : 'violet'
                      }
                      size="sm"
                      className="uppercase text-[10px]"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800">Lvl {user.level || 1}</span>{' '}
                    <span className="text-slate-400">({user.xp || 0} XP)</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => handleChangeRole(user.id, 'student')}
                        disabled={user.role === 'student'}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                          user.role === 'student'
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Student
                      </button>
                      <button
                        onClick={() => handleChangeRole(user.id, 'teacher')}
                        disabled={user.role === 'teacher'}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                          user.role === 'teacher'
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Teacher
                      </button>
                      <button
                        onClick={() => handleChangeRole(user.id, 'admin')}
                        disabled={user.role === 'admin'}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                          user.role === 'admin'
                            ? 'bg-rose-600 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
