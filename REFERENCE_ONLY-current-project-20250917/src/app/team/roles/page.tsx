'use client';

import React from 'react';
import RoleManagement from '@/components/team-management/role-management';

export default function RoleManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        <p className="text-gray-600 mt-1">
          Manage team roles, permissions, and organizational structure
        </p>
      </div>
      <RoleManagement />
    </div>
  );
}
