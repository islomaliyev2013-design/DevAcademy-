import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { Sparkles, UserCheck, ShieldCheck, GraduationCap, Database } from 'lucide-react';

export function RoleSwitchBanner() {
  const { role, switchDemoRole, isSupabaseConfigured, profile } = useAuth();

  return (
    <div className="bg-gradient-to-r from-navy-950 via-brand-950 to-navy-950 text-white text-xs py-2 px-4 border-b border-brand-900/60 sticky top-0 z-50 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">
            {isSupabaseConfigured ? 'Connected to Supabase PostgreSQL' : 'Interactive Demo Environment'}
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Active Persona: <strong className="text-brand-300 uppercase font-mono tracking-wider">{role}</strong> ({profile?.full_name})
          </span>
        </div>

        {/* Quick persona switcher buttons */}
        <div className="flex items-center gap-1.5 bg-navy-900/80 p-0.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 px-2 text-[11px] hidden md:inline">Test Roles:</span>
          <button
            onClick={() => switchDemoRole('student')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
              role === 'student'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            onClick={() => switchDemoRole('teacher')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
              role === 'teacher'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>
          <button
            onClick={() => switchDemoRole('admin')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
              role === 'admin'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
