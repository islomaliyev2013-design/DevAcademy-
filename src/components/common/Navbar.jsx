import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Code2,
  Terminal,
  BookOpen,
  Sparkles,
  LogOut,
  Menu,
  X,
  User,
  LayoutDashboard,
  Flame,
  Award,
} from 'lucide-react';

export function Navbar() {
  const { user, profile, role, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-violet-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              DevAcademy<span className="text-brand-600 ml-0.5">Pro</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
              {t('nav.subtitle', 'AI Code Academy')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/courses"
            className="text-sm font-medium text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('nav.courses', 'Courses')}</span>
          </Link>
          <Link
            to="/student/playground"
            className="text-sm font-medium text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5"
          >
            <Terminal className="w-4 h-4" />
            <span>{t('nav.playground', 'Playground')}</span>
          </Link>
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              className="text-sm font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200/60 hover:bg-brand-100 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('nav.dashboard', 'Dashboard')}</span>
            </Link>
          )}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Gamification stats pill */}
              {role === 'student' && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1 text-amber-600" title="Learning Streak">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{profile?.streak_days || 1}d</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1 text-brand-600" title="XP Points">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{profile?.xp || 0} XP</span>
                  </div>
                  <Badge variant="violet" size="sm">
                    Lvl {profile?.level || 1}
                  </Badge>
                </div>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={profile?.full_name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-brand-400"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{profile?.email}</p>
                      <Badge variant="navy" size="sm" className="mt-1 uppercase text-[10px]">
                        {role}
                      </Badge>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t('nav.myDashboard', 'My Dashboard')}</span>
                    </Link>

                    {role === 'student' && (
                      <>
                        <Link
                          to="/student/my-courses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{t('nav.myCourses', 'My Enrolled Courses')}</span>
                        </Link>
                        <Link
                          to="/student/achievements"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <Award className="w-4 h-4" />
                          <span>{t('nav.achievements', 'Badges & Leaderboard')}</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('nav.login', 'Log in')}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  {t('nav.startLearning', 'Start Learning')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
          >
            {t('nav.courses', 'Courses Catalog')}
          </Link>
          <Link
            to="/student/playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
          >
            {t('nav.playground', 'Code Playground')}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-brand-600 py-2 border-b border-slate-100"
              >
                {t('nav.dashboard', 'Dashboard')} ({role.toUpperCase()})
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm font-medium text-rose-600 py-2"
              >
                {t('nav.logout', 'Sign Out')}
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('nav.login', 'Log in')}
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  {t('nav.startLearning', 'Start Learning')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
