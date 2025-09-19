'use client';

import React from 'react';
import TeamAnalytics from '@/components/team-management/team-analytics';

export default function TeamAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Analytics</h1>
        <p className="text-gray-600 mt-1">
          Advanced analytics and insights for team performance and collaboration
        </p>
      </div>
      <TeamAnalytics />
    </div>
  );
}
