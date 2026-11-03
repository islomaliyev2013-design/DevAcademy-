import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, courseSchema } from '../lib/validators';

describe('Zod Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login inputs', () => {
      const valid = {
        email: 'student@devacademy.pro',
        password: 'Password123!',
      };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should allow username like admin', () => {
      const valid = {
        email: 'admin',
        password: 'admin123',
      };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject empty username/email', () => {
      const invalid = {
        email: '',
        password: 'admin123',
      };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues || result.error.errors;
        expect(issues[0].path).toContain('email');
      }
    });

    it('should reject empty password', () => {
      const invalid = {
        email: 'student@devacademy.pro',
        password: '',
      };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate valid student registration', () => {
      const valid = {
        fullName: 'Maya Lin',
        email: 'maya@devacademy.pro',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
        terms: true,
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject password mismatch', () => {
      const mismatch = {
        fullName: 'Maya Lin',
        email: 'maya@devacademy.pro',
        password: 'SecurePass123',
        confirmPassword: 'DifferentPass123',
        terms: true,
      };
      const result = registerSchema.safeParse(mismatch);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues || result.error.errors;
        expect(issues[0].message).toBe('Parollar bir xil emas');
      }
    });

    it('should reject unaccepted terms', () => {
      const noTerms = {
        fullName: 'Maya Lin',
        email: 'maya@devacademy.pro',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
        terms: false,
      };
      const result = registerSchema.safeParse(noTerms);
      expect(result.success).toBe(false);
    });
  });

  describe('courseSchema', () => {
    it('should validate valid course creation', () => {
      const validCourse = {
        title: 'Modern TypeScript Systems',
        description: 'Comprehensive deep dive into TypeScript generics and interfaces.',
        level: 'Intermediate',
        category: 'Web Development',
        language: 'typescript',
        durationHours: 15,
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800',
      };
      const result = courseSchema.safeParse(validCourse);
      expect(result.success).toBe(true);
    });
  });
});
