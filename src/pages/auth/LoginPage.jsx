import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validators';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { Code2, Mail, Lock, ArrowRight, UserCheck, ShieldCheck, GraduationCap } from 'lucide-react';

export function LoginPage() {
  const { login, role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.student@devacademy.pro',
      password: 'Password123!',
      rememberMe: true,
    },
  });

  const onSubmit = async (values) => {
    setAuthError('');
    try {
      const res = await login(values.email, values.password);
      addToast('Welcome back to DevAcademy Pro!', 'success');

      const userRole = res.user?.role || role || 'student';
      const redirectPath =
        location.state?.from?.pathname ||
        (userRole === 'teacher'
          ? '/teacher/dashboard'
          : userRole === 'admin'
          ? '/admin/dashboard'
          : '/student/dashboard');

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Failed to authenticate. Please verify your credentials.');
    }
  };

  const fillDemoAccount = (email, roleName) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    addToast(`Filled credentials for demo ${roleName}`, 'info');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to DevAcademy Pro
          </h2>
          <p className="text-xs text-slate-500">
            Continue your coding journey, track progress, and learn with AI.
          </p>
        </div>

        {/* Demo Fast-Login Pills */}
        <div className="bg-lavender-50 p-3.5 rounded-2xl border border-lavender-200 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
            Instant Demo Account Fill:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('alex.student@devacademy.pro', 'Student')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 text-[11px] font-semibold text-slate-700 flex flex-col items-center gap-1 transition"
            >
              <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('sarah.teacher@devacademy.pro', 'Teacher')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 text-[11px] font-semibold text-slate-700 flex flex-col items-center gap-1 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Teacher</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@devacademy.pro', 'Admin')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 text-[11px] font-semibold text-slate-700 flex flex-col items-center gap-1 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              startIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                startIcon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                Remember session
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-bold"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
