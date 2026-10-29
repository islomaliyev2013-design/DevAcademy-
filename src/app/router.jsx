import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

// Public pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { CoursesCatalogPage } from '../pages/courses/CoursesCatalogPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Student pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { MyCoursesPage } from '../pages/student/MyCoursesPage';
import { LessonPlayerPage } from '../pages/student/LessonPlayerPage';
import { PlaygroundPage } from '../pages/student/PlaygroundPage';
import { AssignmentsPage } from '../pages/student/AssignmentsPage';
import { QuizzesPage } from '../pages/student/QuizzesPage';
import { ProgressPage } from '../pages/student/ProgressPage';
import { AchievementsPage } from '../pages/student/AchievementsPage';

// Teacher pages
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { TeacherCoursesPage } from '../pages/teacher/TeacherCoursesPage';
import { TeacherLessonsPage } from '../pages/teacher/TeacherLessonsPage';
import { TeacherAssignmentsPage } from '../pages/teacher/TeacherAssignmentsPage';
import { TeacherSubmissionsPage } from '../pages/teacher/TeacherSubmissionsPage';
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCoursesPage } from '../pages/admin/AdminCoursesPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const router = createBrowserRouter([
  // Public Routes (wrapped in AppLayout)
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'courses', element: <CoursesCatalogPage /> },
      { path: 'courses/:courseId', element: <CourseDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Student Workspace
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/student/dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboardPage /> },
      { path: 'my-courses', element: <MyCoursesPage /> },
      { path: 'lessons/:lessonId', element: <LessonPlayerPage /> },
      { path: 'playground', element: <PlaygroundPage /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'quizzes', element: <QuizzesPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
    ],
  },

  // Teacher Portal
  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/teacher/dashboard" replace /> },
      { path: 'dashboard', element: <TeacherDashboardPage /> },
      { path: 'courses', element: <TeacherCoursesPage /> },
      { path: 'lessons', element: <TeacherLessonsPage /> },
      { path: 'assignments', element: <TeacherAssignmentsPage /> },
      { path: 'submissions', element: <TeacherSubmissionsPage /> },
      { path: 'students', element: <TeacherStudentsPage /> },
    ],
  },

  // Admin Console
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'courses', element: <AdminCoursesPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
]);
