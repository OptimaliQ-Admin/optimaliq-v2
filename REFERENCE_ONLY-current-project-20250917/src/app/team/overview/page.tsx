'use client';

import React from 'react';
import TeamOverview from '@/components/team-management/team-overview';

export default function TeamOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive view of your team structure and performance
        </p>
      </div>
      <TeamOverview />
    </div>
  );
}
