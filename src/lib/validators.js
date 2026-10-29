import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service & Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
});

// Course schema
export const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(15, 'Short description must be at least 15 characters'),
  longDescription: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  category: z.string().min(2, 'Category is required'),
  language: z.string().min(2, 'Language or tech is required'),
  durationHours: z.coerce.number().min(1, 'Duration must be at least 1 hour'),
  thumbnailUrl: z.string().url('Must be a valid URL').or(z.literal('')),
});

// Assignment schema
export const assignmentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  instructions: z.string().min(20, 'Provide clear instructions for students'),
  starterCode: z.string().optional(),
  testCriteria: z.string().min(5, 'Define grading criteria'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxPoints: z.coerce.number().min(10).max(100),
});

// Submission schema
export const submissionSchema = z.object({
  codeContent: z.string().min(10, 'Submission code cannot be empty'),
});

// Review / Grade schema
export const gradeSchema = z.object({
  score: z.coerce.number().min(0).max(100, 'Score must be between 0 and 100'),
  feedback: z.string().min(5, 'Please provide constructive feedback'),
});
