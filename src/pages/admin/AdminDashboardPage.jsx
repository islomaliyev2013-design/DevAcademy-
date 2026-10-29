import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Settings,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function AdminDashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 145,
    studentsCount: 125,
    teachersCount: 18,
    totalCourses: 4,
    publishedCourses: 4,
    totalEnrollments: 840,
    totalSubmissions: 320,
  });

  const enrollmentTrendData = [
    { month: 'May', enrollments: 320, activeUsers: 450 },
    { month: 'Jun', enrollments: 450, activeUsers: 600 },
    { month: 'Jul', enrollments: 590, activeUsers: 780 },
    { month: 'Aug', enrollments: 710, activeUsers: 950 },
    { month: 'Sep', enrollments: 840, activeUsers: 1100 },
    { month: 'Oct', enrollments: 980, activeUsers: 1350 },
  ];

  useEffect(() => {
    async function load() {
      const s = await dataService.getAdminStats();
      setStats(s);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <Badge variant="rose" size="sm" className="bg-rose-500/20 text-rose-300 border-rose-500/30">
            System Administrator Console
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            DevAcademy Pro Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Real-time telemetry, user role authorization, curriculum moderation, and platform stability controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/users">
            <Button variant="primary" size="sm" icon={Users}>
              Manage Roles
            </Button>
          </Link>
          <Link to="/admin/courses">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Curriculum Moderation
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Courses</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalCourses}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrollments</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalEnrollments}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Code Submissions</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalSubmissions}</p>
          </div>
        </Card>
      </div>

      {/* Chart: Enrollment Growth */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            <span>Platform Growth & Enrollment Velocity</span>
          </h3>
          <span className="text-xs text-slate-500">Trailing 6 Months</span>
        </div>

        <Card className="p-6">
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrendData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="enrollments" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
