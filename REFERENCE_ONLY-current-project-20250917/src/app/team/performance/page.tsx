'use client';

import React from 'react';
import PerformanceTracking from '@/components/team-management/performance-tracking';

export default function PerformanceTrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Tracking</h1>
        <p className="text-gray-600 mt-1">
          Track and analyze team performance metrics and individual contributions
        </p>
      </div>
      <PerformanceTracking />
    </div>
  );
}
