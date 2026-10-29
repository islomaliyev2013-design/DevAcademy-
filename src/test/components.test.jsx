import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

describe('UI Component Primitives', () => {
  describe('Button', () => {
    it('renders text and responds to click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Start Learning</Button>);

      const btn = screen.getByRole('button', { name: /start learning/i });
      expect(btn).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when disabled or loading', () => {
      render(<Button disabled>Disabled Action</Button>);
      const btn = screen.getByRole('button', { name: /disabled action/i });
      expect(btn).toBeDisabled();
    });
  });

  describe('Badge', () => {
    it('renders badge with correct level label', () => {
      render(<Badge variant="emerald">Beginner</Badge>);
      expect(screen.getByText('Beginner')).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('renders structured card headers and content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Lesson syllabus details</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Course Overview')).toBeInTheDocument();
      expect(screen.getByText('Lesson syllabus details')).toBeInTheDocument();
    });
  });

  describe('Input', () => {
    it('renders input with label and captures typed text', () => {
      render(<Input label="Your Name" placeholder="Jane Doe" />);
      expect(screen.getByText(/your name/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText('Jane Doe');
      fireEvent.change(input, { target: { value: 'Alex Rivera' } });
      expect(input.value).toBe('Alex Rivera');
    });

    it('renders error message when error prop is passed', () => {
      render(<Input label="Email" error="Invalid email address" />);
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });
});
