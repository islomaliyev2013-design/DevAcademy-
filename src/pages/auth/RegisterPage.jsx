import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../lib/validators';
import { useAuth } from '../../features/auth/AuthContext';
import { useToast } from '../../components/ui/Toast';
import authIllustration from '../../assets/auth_illustration.jpg';
import {
  Code2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      addToast('Muvaffaqiyatli ro‘yxatdan o‘tdingiz! Xush kelibsiz.', 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#EDE9FE] to-[#F0FDFA] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Split Glass Card */}
      <div className="max-w-5xl w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(59,130,246,0.18)] border border-white/80 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        
        {/* Ambient subtle glow inside card */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Register Form */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Top Pill Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 shadow-inner max-w-full">
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-brand-600 shadow-sm transition"
              >
                Sign Up
              </Link>
              <Link
                to="/forgot-password"
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition hidden sm:inline-block"
              >
                Password recovery
              </Link>
            </div>

            {/* Brand Logo & Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
                  <Code2 className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  DevAcademy<span className="text-brand-600">Pro</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
                Sign Up
              </h2>
              <p className="text-xs text-slate-500">
                O‘quvchi sifatida ro‘yxatdan o‘ting va darslarni boshlang.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in">
                {authError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative rounded-2xl border border-slate-200 hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 bg-slate-50/50 transition">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Jasur Aliyev"
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-600 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Email
                </label>
                <div className="relative rounded-2xl border border-slate-200 hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 bg-slate-50/50 transition">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative rounded-2xl border border-slate-200 hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 bg-slate-50/50 transition">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Kamida 8 belgi, 1 ta katta harf, 1 ta raqam"
                    className="w-full bg-transparent pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative rounded-2xl border border-slate-200 hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 bg-slate-50/50 transition">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Parolni qayta kiriting"
                    className="w-full bg-transparent pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-1 pt-1">
                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    {...register('terms')}
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 leading-tight cursor-pointer select-none">
                    Foydalanish shartlari va Maxfiylik siyosatiga roziman
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-rose-600 font-medium">{errors.terms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-500 via-brand-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Illustration & Welcome Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center space-y-6 lg:border-l lg:border-slate-100 lg:pl-10">
            {/* Top Brand Emblem */}
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-brand-600 to-cyan-400 p-0.5 mx-auto shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                  <Code2 className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Welcome to the DevAcademy Pro{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-brand-600">
                  digital academy
                </span>
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Write code, complete assignments, pass quizzes, and earn verifiable XP certificates.
              </p>
            </div>

            {/* 3D Illustration Image */}
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-slate-100 group">
              <img
                src={authIllustration}
                alt="DevAcademy Pro AI Learning Platform"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
            </div>

            {/* Pagination indicator like image 2 */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="w-6 h-1.5 rounded-full bg-blue-600"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </div>
          </div>

        </div>

        {/* Floating Right Navigation Arrow like Image 2 */}
        <button
          onClick={() => navigate('/courses')}
          title="Browse Courses"
          className="hidden md:flex absolute top-1/2 -right-1 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-600 shadow-xl border border-slate-100 items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
