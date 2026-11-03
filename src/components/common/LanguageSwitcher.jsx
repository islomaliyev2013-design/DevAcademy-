import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

export function LanguageSwitcher({ variant = 'default', className = '' }) {
  const { language, setLanguage, languages, currentLanguageMeta } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
          isDark
            ? 'bg-navy-900/80 hover:bg-navy-800 text-slate-200 border-slate-700/60 shadow-sm'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Change Language"
      >
        <span className="text-base leading-none">{currentLanguageMeta.flag}</span>
        <span className="tracking-wide uppercase font-mono text-[11px] font-bold">
          {currentLanguageMeta.short}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-40 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95"
          role="menu"
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Til / Язык / Language
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="text-xs">{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-600 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
