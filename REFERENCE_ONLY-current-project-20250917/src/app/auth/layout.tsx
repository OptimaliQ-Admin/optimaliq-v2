import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication - OptimaliQ',
  description: 'Sign in to your OptimaliQ account to access AI-powered business insights',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
            OptimaliQ
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
