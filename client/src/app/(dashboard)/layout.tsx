"use client";

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
} 