import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: 'OptimaliQ Dashboard - AI-Powered Business Intelligence',
  description: 'Access your personalized business insights, growth recommendations, and strategic planning tools powered by AI.',
};

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
