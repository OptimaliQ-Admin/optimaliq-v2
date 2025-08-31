/**
 * OptimaliQ Team Management System
 * Team member invitations, role-based permissions, and team hierarchy management
 */

// Team Member Roles and Permissions
export interface TeamRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
  level: number // Hierarchy level (1 = highest)
  isDefault: boolean
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
  scope: 'own' | 'team' | 'organization' | 'all'
}

// Team Member
export interface TeamMember {
  id: string
  userId: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: TeamRole
  department?: string
  managerId?: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  joinedAt: Date
  lastActiveAt?: Date
  permissions: Permission[]
  metadata?: Record<string, any>
}

// Team Invitation
export interface TeamInvitation {
  id: string
  email: string
  firstName?: string
  lastName?: string
  roleId: string
  department?: string
  invitedBy: string
  status: 'pending' | 'accepted' | 'expired' | 'declined'
  expiresAt: Date
  createdAt: Date
  acceptedAt?: Date
  token: string
  metadata?: Record<string, any>
}

// Department/Team Structure
export interface Department {
  id: string
  name: string
  description?: string
  managerId?: string
  parentDepartmentId?: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

// Team Management Service
export class TeamManagementService {
  private apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = '/api/team'
  }

  // Team Member Management
  async getTeamMembers(organizationId: string): Promise<TeamMember[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/members?organizationId=${organizationId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching team members:', error)
      throw error
    }
  }

  async getTeamMember(memberId: string): Promise<TeamMember> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/members/${memberId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching team member:', error)
      throw error
    }
  }

  async updateTeamMember(memberId: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating team member:', error)
      throw error
    }
  }

  async deactivateTeamMember(memberId: string, reason?: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/members/${memberId}/deactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
    } catch (error) {
      console.error('Error deactivating team member:', error)
      throw error
    }
  }

  async reactivateTeamMember(memberId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/members/${memberId}/reactivate`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error reactivating team member:', error)
      throw error
    }
  }

  // Team Invitations
  async sendInvitation(invitation: Omit<TeamInvitation, 'id' | 'status' | 'createdAt' | 'token'>): Promise<TeamInvitation> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invitation)
      })
      return await response.json()
    } catch (error) {
      console.error('Error sending invitation:', error)
      throw error
    }
  }

  async getInvitations(organizationId: string): Promise<TeamInvitation[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/invitations?organizationId=${organizationId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching invitations:', error)
      throw error
    }
  }

  async cancelInvitation(invitationId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/invitations/${invitationId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error canceling invitation:', error)
      throw error
    }
  }

  async resendInvitation(invitationId: string): Promise<TeamInvitation> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/invitations/${invitationId}/resend`, {
        method: 'POST'
      })
      return await response.json()
    } catch (error) {
      console.error('Error resending invitation:', error)
      throw error
    }
  }

  // Role Management
  async getRoles(organizationId: string): Promise<TeamRole[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/roles?organizationId=${organizationId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  }

  async createRole(role: Omit<TeamRole, 'id'>): Promise<TeamRole> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(role)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  }

  async updateRole(roleId: string, updates: Partial<TeamRole>): Promise<TeamRole> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/roles/${roleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating role:', error)
      throw error
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/roles/${roleId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error deleting role:', error)
      throw error
    }
  }

  // Department Management
  async getDepartments(organizationId: string): Promise<Department[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/departments?organizationId=${organizationId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  }

  async createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(department)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating department:', error)
      throw error
    }
  }

  async updateDepartment(departmentId: string, updates: Partial<Department>): Promise<Department> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/departments/${departmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating department:', error)
      throw error
    }
  }

  async deleteDepartment(departmentId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/departments/${departmentId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error deleting department:', error)
      throw error
    }
  }

  // Team Analytics
  async getTeamAnalytics(organizationId: string, dateRange?: { start: Date; end: Date }): Promise<any> {
    try {
      let url = `${this.apiBaseUrl}/analytics?organizationId=${organizationId}`
      if (dateRange) {
        url += `&startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching team analytics:', error)
      throw error
    }
  }

  async getMemberPerformance(memberId: string, dateRange?: { start: Date; end: Date }): Promise<any> {
    try {
      let url = `${this.apiBaseUrl}/members/${memberId}/performance`
      if (dateRange) {
        url += `?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching member performance:', error)
      throw error
    }
  }

  // Permission Management
  async checkPermission(userId: string, resource: string, action: string, scope?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/permissions/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          resource,
          action,
          scope
        })
      })
      const result = await response.json()
      return result.hasPermission
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/permissions/${userId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching user permissions:', error)
      throw error
    }
  }

  async updateUserPermissions(userId: string, permissions: Permission[]): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/permissions/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissions })
      })
    } catch (error) {
      console.error('Error updating user permissions:', error)
      throw error
    }
  }
}

// Default Roles and Permissions
export const DEFAULT_ROLES: TeamRole[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all features and settings',
    level: 1,
    isDefault: false,
    permissions: [
      { id: 'all', name: 'All Permissions', description: 'Full access', resource: '*', action: 'manage', scope: 'all' }
    ]
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manage team members, settings, and organization',
    level: 2,
    isDefault: false,
    permissions: [
      { id: 'team_manage', name: 'Manage Team', description: 'Manage team members', resource: 'team', action: 'manage', scope: 'organization' },
      { id: 'settings_manage', name: 'Manage Settings', description: 'Manage organization settings', resource: 'settings', action: 'manage', scope: 'organization' },
      { id: 'assessments_manage', name: 'Manage Assessments', description: 'Manage all assessments', resource: 'assessments', action: 'manage', scope: 'organization' },
      { id: 'reports_view', name: 'View Reports', description: 'View all reports', resource: 'reports', action: 'read', scope: 'organization' }
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manage team members and view team reports',
    level: 3,
    isDefault: false,
    permissions: [
      { id: 'team_view', name: 'View Team', description: 'View team members', resource: 'team', action: 'read', scope: 'team' },
      { id: 'assessments_manage', name: 'Manage Assessments', description: 'Manage team assessments', resource: 'assessments', action: 'manage', scope: 'team' },
      { id: 'reports_view', name: 'View Reports', description: 'View team reports', resource: 'reports', action: 'read', scope: 'team' }
    ]
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Participate in assessments and view own data',
    level: 4,
    isDefault: true,
    permissions: [
      { id: 'assessments_participate', name: 'Participate in Assessments', description: 'Take assessments', resource: 'assessments', action: 'read', scope: 'own' },
      { id: 'reports_view_own', name: 'View Own Reports', description: 'View own reports', resource: 'reports', action: 'read', scope: 'own' },
      { id: 'profile_manage', name: 'Manage Profile', description: 'Manage own profile', resource: 'profile', action: 'manage', scope: 'own' }
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'View-only access to reports and data',
    level: 5,
    isDefault: false,
    permissions: [
      { id: 'reports_view', name: 'View Reports', description: 'View reports', resource: 'reports', action: 'read', scope: 'team' },
      { id: 'profile_view', name: 'View Profile', description: 'View own profile', resource: 'profile', action: 'read', scope: 'own' }
    ]
  }
]

// Export service instance
export const teamManagementService = new TeamManagementService()
