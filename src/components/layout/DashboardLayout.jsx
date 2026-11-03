import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import {
  Code2,
  LayoutDashboard,
  BookOpen,
  Terminal,
  FileCheck,
  HelpCircle,
  TrendingUp,
  Award,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function DashboardLayout() {
  const { role, profile, logout } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Student Navigation Items
  const studentLinks = [
    { name: t('dashboard.overview', 'Dashboard'), to: '/student/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.myCourses', 'My Courses'), to: '/student/my-courses', icon: BookOpen },
    { name: t('dashboard.playground', 'Coding Playground'), to: '/student/playground', icon: Terminal },
    { name: t('dashboard.assignments', 'Assignments'), to: '/student/assignments', icon: FileCheck },
    { name: t('dashboard.quizzes', 'Quizzes'), to: '/student/quizzes', icon: HelpCircle },
    { name: t('dashboard.recentProgress', 'Learning Progress'), to: '/student/progress', icon: TrendingUp },
    { name: t('dashboard.achievements', 'Badges & XP'), to: '/student/achievements', icon: Award },
  ];

  // Teacher Navigation Items
  const teacherLinks = [
    { name: t('dashboard.overview', 'Teacher Overview'), to: '/teacher/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.manageCourses', 'Manage Courses'), to: '/teacher/courses', icon: BookOpen },
    { name: t('dashboard.lessonContent', 'Lesson Content'), to: '/teacher/lessons', icon: Terminal },
    { name: t('dashboard.assignments', 'Assignments'), to: '/teacher/assignments', icon: FileCheck },
    { name: t('dashboard.studentSubmissions', 'Student Submissions'), to: '/teacher/submissions', icon: Award },
    { name: t('dashboard.enrolledStudents', 'Enrolled Students'), to: '/teacher/students', icon: Users },
  ];

  // Admin Navigation Items
  const adminLinks = [
    { name: t('dashboard.adminOverview', 'Admin Overview'), to: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.userManagement', 'User Management'), to: '/admin/users', icon: Users },
    { name: t('dashboard.courseModeration', 'Course Moderation'), to: '/admin/courses', icon: BookOpen },
    { name: t('dashboard.platformSettings', 'Platform Settings'), to: '/admin/settings', icon: Settings },
  ];

  const currentLinks =
    role === 'teacher' ? teacherLinks : role === 'admin' ? adminLinks : studentLinks;

  const roleLabel =
    role === 'teacher'
      ? t('dashboard.instructorPortal', 'Instructor Portal')
      : role === 'admin'
      ? t('dashboard.adminPanel', 'Admin Panel')
      : t('dashboard.studentWorkspace', 'Student Workspace');

  return (
    <div className="min-h-screen bg-lavender-100 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo Header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                DevAcademy<span className="text-brand-600">Pro</span>
              </span>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info card */}
          <div className="p-4 mx-3 my-3 bg-lavender-50 rounded-2xl border border-lavender-200/80">
            <div className="flex items-center gap-3">
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={profile?.full_name || 'Profile'}
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-400"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name}</p>
                <Badge variant={role === 'admin' ? 'rose' : role === 'teacher' ? 'amber' : 'violet'} size="sm" className="mt-0.5 uppercase text-[10px]">
                  {role}
                </Badge>
              </div>
            </div>

            {role === 'student' && (
              <div className="mt-3 pt-3 border-t border-lavender-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-brand-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{profile?.xp || 0} XP</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{profile?.streak_days || 1}d Streak</span>
                </div>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {roleLabel}
          </div>
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {currentLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-500/20'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom user / sign out */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout', 'Log Out')}</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Dashboard Header Bar */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
                {roleLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <NavLink
                to="/courses"
                className="text-xs font-medium text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition hidden md:inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('nav.courseCatalog', 'Course Catalog')}</span>
              </NavLink>
              <NavLink
                to="/student/playground"
                className="text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition inline-flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{t('nav.playground', 'Playground')}</span>
              </NavLink>
              <LanguageSwitcher />
            </div>
          </header>

          {/* Page body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
