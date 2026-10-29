import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Code2, ArrowLeft, Terminal } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-100 text-brand-700 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/10">
          <Terminal className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-brand-600 font-mono">404</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            The page you are looking for has been moved or does not exist in this curriculum.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={ArrowLeft}>
              Back to Home
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" size="md">
              View Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
