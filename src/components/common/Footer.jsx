import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { Code2, Globe, Share2, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-violet-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                DevAcademy<span className="text-brand-600">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              {t('footer.about', 'An interactive, AI-powered developer education platform designed to transform curious minds into industry-ready software engineers.')}
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 hover:text-brand-600 transition" aria-label="Global Community">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 hover:text-brand-600 transition" aria-label="Share platform">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 1: Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('footer.curriculum', 'Curriculum')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/courses" className="hover:text-brand-600 transition">
                  Full-Stack JavaScript
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-600 transition">
                  Modern React 19 Architecture
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-600 transition">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-600 transition">
                  Tailwind CSS UI Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('footer.platform', 'Platform')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/student/playground" className="hover:text-brand-600 transition">
                  {t('footer.codePlayground', 'Code Playground')}
                </Link>
              </li>
              <li>
                <Link to="/student/achievements" className="hover:text-brand-600 transition">
                  {t('footer.gamification', 'Gamification & Badges')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 transition">
                  {t('footer.teacherPortal', 'Teacher Portal')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 transition">
                  {t('footer.adminAnalytics', 'Admin Analytics')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('footer.resources', 'Resources')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#faq" className="hover:text-brand-600 transition">
                  {t('faq.badge', 'Savol-javoblar')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full font-medium">
                  <Sparkles className="w-3 h-3" /> AI Mentor Ready
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DevAcademy Pro. {t('footer.rights', 'All rights reserved.')}</p>
          <p className="flex items-center gap-1">
            {t('footer.builtWith', 'Built with React, Supabase & Tailwind.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
