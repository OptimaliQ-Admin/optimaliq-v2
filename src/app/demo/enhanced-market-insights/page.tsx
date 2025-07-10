import React from 'react';
import EnhancedMarketInsightDemo from '@/components/dashboard/EnhancedMarketInsightDemo';
import { ModalProvider } from '@/components/modals/ModalProvider';

export default function EnhancedMarketInsightsDemoPage() {
  return (
    <ModalProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedMarketInsightDemo />
        </div>
      </div>
    </ModalProvider>
  );
} 