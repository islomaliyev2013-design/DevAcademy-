import React from 'react';
import { AuthProvider } from '../features/auth/AuthContext';
import { ToastProvider } from '../components/ui/Toast';
import { LanguageProvider } from '../lib/i18n/LanguageContext';

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
