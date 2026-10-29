import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { RoleSwitchBanner } from '../common/RoleSwitchBanner';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-lavender-100 font-sans selection:bg-brand-500 selection:text-white">
      <RoleSwitchBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
