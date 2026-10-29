import React from 'react';

export function Badge({ children, variant = 'violet', size = 'sm', className = '', ...props }) {
  const variants = {
    violet: 'bg-brand-50 text-brand-700 border-brand-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    sky: 'bg-sky-50 text-sky-700 border-sky-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    navy: 'bg-navy-900 text-slate-100 border-navy-800',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.violet} ${sizes[size] || sizes.sm} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
