import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../lib/validators';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { Code2, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values) => {
    setAuthError('');
    try {
      await registerAuth({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      addToast('Registration complete! Welcome to DevAcademy Pro.', 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Your Student Account
          </h2>
          <p className="text-xs text-slate-500">
            Start learning to code, build real projects, and earn achievements.
          </p>
        </div>

        {/* Security badge notice */}
        <div className="flex items-center gap-2 p-3 bg-brand-50 border border-brand-200/80 rounded-xl text-[11px] text-brand-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>New accounts automatically receive verified Student permissions.</span>
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
              label="Full Name"
              placeholder="e.g. Maya Lin"
              startIcon={User}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              startIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              startIcon={Lock}
              error={errors.password?.message}
              helperText="Must be at least 8 characters with letters & numbers"
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              startIcon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  {...register('terms')}
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-tight cursor-pointer">
                  I accept the{' '}
                  <a href="#" className="text-brand-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-brand-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-rose-600 font-medium">{errors.terms.message}</p>
              )}
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
              Create Account
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
