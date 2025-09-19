/**
 * OptimaliQ Assessment Delegation System
 * Assessment assignment workflow, due date management, and progress tracking
 */

// Assessment Assignment
export interface AssessmentAssignment {
  id: string
  assessmentId: string
  assigneeId: string
  assignedBy: string
  assignedAt: Date
  dueDate: Date
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  instructions?: string
  estimatedDuration?: number // in minutes
  actualDuration?: number // in minutes
  startedAt?: Date
  completedAt?: Date
  score?: number
  feedback?: string
  metadata?: Record<string, any>
}

// Assessment Template
export interface AssessmentTemplate {
  id: string
  name: string
  description: string
  category: string
  estimatedDuration: number
  questions: AssessmentQuestion[]
  scoringMethod: 'percentage' | 'points' | 'rating'
  passingScore?: number
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

// Assessment Question
export interface AssessmentQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'rating' | 'text' | 'boolean' | 'matrix'
  required: boolean
  options?: string[]
  scoring?: {
    correctAnswer?: string | number
    points?: number
    weight?: number
  }
  category?: string
  order: number
}

// Assessment Response
export interface AssessmentResponse {
  id: string
  assignmentId: string
  questionId: string
  answer: any
  score?: number
  feedback?: string
  answeredAt: Date
  timeSpent?: number // in seconds
}

// Reminder System
export interface AssessmentReminder {
  id: string
  assignmentId: string
  type: 'due_date' | 'follow_up' | 'completion' | 'custom'
  scheduledAt: Date
  sentAt?: Date
  status: 'scheduled' | 'sent' | 'cancelled'
  message: string
  channel: 'email' | 'notification' | 'sms'
  metadata?: Record<string, any>
}

// Assessment Delegation Service
export class AssessmentDelegationService {
  private apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = '/api/assessments/delegation'
  }

  // Assignment Management
  async createAssignment(assignment: Omit<AssessmentAssignment, 'id' | 'assignedAt' | 'status'>): Promise<AssessmentAssignment> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignment)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating assignment:', error)
      throw error
    }
  }

  async getAssignments(filters?: {
    assigneeId?: string
    status?: string
    priority?: string
    dueDateFrom?: Date
    dueDateTo?: Date
  }): Promise<AssessmentAssignment[]> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (value instanceof Date) {
              params.append(key, value.toISOString())
            } else {
              params.append(key, value.toString())
            }
          }
        })
      }
      
      const response = await fetch(`${this.apiBaseUrl}/assignments?${params.toString()}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching assignments:', error)
      throw error
    }
  }

  async getAssignment(assignmentId: string): Promise<AssessmentAssignment> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching assignment:', error)
      throw error
    }
  }

  async updateAssignment(assignmentId: string, updates: Partial<AssessmentAssignment>): Promise<AssessmentAssignment> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating assignment:', error)
      throw error
    }
  }

  async startAssessment(assignmentId: string): Promise<AssessmentAssignment> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}/start`, {
        method: 'POST'
      })
      return await response.json()
    } catch (error) {
      console.error('Error starting assessment:', error)
      throw error
    }
  }

  async completeAssessment(assignmentId: string, responses: AssessmentResponse[]): Promise<AssessmentAssignment> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ responses })
      })
      return await response.json()
    } catch (error) {
      console.error('Error completing assessment:', error)
      throw error
    }
  }

  async cancelAssignment(assignmentId: string, reason?: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
    } catch (error) {
      console.error('Error canceling assignment:', error)
      throw error
    }
  }

  // Bulk Assignment
  async bulkAssign(assignments: Omit<AssessmentAssignment, 'id' | 'assignedAt' | 'status'>[]): Promise<AssessmentAssignment[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignments })
      })
      return await response.json()
    } catch (error) {
      console.error('Error bulk assigning assessments:', error)
      throw error
    }
  }

  // Progress Tracking
  async getProgress(assignmentId: string): Promise<{
    assignment: AssessmentAssignment
    progress: number
    timeSpent: number
    questionsAnswered: number
    totalQuestions: number
    estimatedTimeRemaining: number
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}/progress`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching progress:', error)
      throw error
    }
  }

  async getTeamProgress(teamId: string, assessmentId?: string): Promise<{
    totalAssignments: number
    completedAssignments: number
    inProgressAssignments: number
    overdueAssignments: number
    averageScore: number
    averageCompletionTime: number
    assignments: AssessmentAssignment[]
  }> {
    try {
      let url = `${this.apiBaseUrl}/progress/team/${teamId}`
      if (assessmentId) {
        url += `?assessmentId=${assessmentId}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching team progress:', error)
      throw error
    }
  }

  // Reminder System
  async scheduleReminder(reminder: Omit<AssessmentReminder, 'id' | 'status'>): Promise<AssessmentReminder> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reminder)
      })
      return await response.json()
    } catch (error) {
      console.error('Error scheduling reminder:', error)
      throw error
    }
  }

  async getReminders(assignmentId?: string): Promise<AssessmentReminder[]> {
    try {
      let url = `${this.apiBaseUrl}/reminders`
      if (assignmentId) {
        url += `?assignmentId=${assignmentId}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching reminders:', error)
      throw error
    }
  }

  async cancelReminder(reminderId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/reminders/${reminderId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error canceling reminder:', error)
      throw error
    }
  }

  // Quality Assurance
  async reviewAssessment(assignmentId: string, review: {
    score?: number
    feedback?: string
    approved: boolean
    reviewerId: string
    comments?: string
  }): Promise<AssessmentAssignment> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/assignments/${assignmentId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      })
      return await response.json()
    } catch (error) {
      console.error('Error reviewing assessment:', error)
      throw error
    }
  }

  async getQualityMetrics(teamId: string, dateRange?: { start: Date; end: Date }): Promise<{
    totalAssessments: number
    averageScore: number
    completionRate: number
    averageCompletionTime: number
    qualityScore: number
    improvementTrend: number
  }> {
    try {
      let url = `${this.apiBaseUrl}/quality/${teamId}`
      if (dateRange) {
        url += `?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching quality metrics:', error)
      throw error
    }
  }

  // Template Management
  async getTemplates(category?: string): Promise<AssessmentTemplate[]> {
    try {
      let url = `${this.apiBaseUrl}/templates`
      if (category) {
        url += `?category=${category}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  }

  async createTemplate(template: Omit<AssessmentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssessmentTemplate> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  async updateTemplate(templateId: string, updates: Partial<AssessmentTemplate>): Promise<AssessmentTemplate> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/templates/${templateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  async deleteTemplate(templateId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/templates/${templateId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  // Reporting
  async generateAssignmentReport(filters?: {
    teamId?: string
    assessmentId?: string
    status?: string
    dateRange?: { start: Date; end: Date }
  }): Promise<{
    summary: {
      totalAssignments: number
      completedAssignments: number
      averageScore: number
      averageCompletionTime: number
    }
    assignments: AssessmentAssignment[]
    trends: {
      completionRate: number[]
      averageScores: number[]
      dates: string[]
    }
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/reports/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      })
      return await response.json()
    } catch (error) {
      console.error('Error generating assignment report:', error)
      throw error
    }
  }

  async exportAssignments(filters?: {
    teamId?: string
    assessmentId?: string
    status?: string
    dateRange?: { start: Date; end: Date }
  }, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/export/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...filters, format })
      })
      return await response.blob()
    } catch (error) {
      console.error('Error exporting assignments:', error)
      throw error
    }
  }
}

// Default Assessment Templates
export const DEFAULT_TEMPLATES: AssessmentTemplate[] = [
  {
    id: 'team-collaboration',
    name: 'Team Collaboration Assessment',
    description: 'Evaluate team collaboration effectiveness and communication patterns',
    category: 'team',
    estimatedDuration: 15,
    scoringMethod: 'percentage',
    passingScore: 70,
    isActive: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: '1',
        question: 'How effectively does your team communicate on a daily basis?',
        type: 'rating',
        required: true,
        order: 1,
        category: 'communication'
      },
      {
        id: '2',
        question: 'How well does your team collaborate on projects?',
        type: 'rating',
        required: true,
        order: 2,
        category: 'collaboration'
      },
      {
        id: '3',
        question: 'How satisfied are you with the level of support from your team members?',
        type: 'rating',
        required: true,
        order: 3,
        category: 'support'
      }
    ]
  },
  {
    id: 'leadership-effectiveness',
    name: 'Leadership Effectiveness Assessment',
    description: 'Assess leadership skills and management effectiveness',
    category: 'leadership',
    estimatedDuration: 20,
    scoringMethod: 'percentage',
    passingScore: 75,
    isActive: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: '1',
        question: 'How clear are the goals and objectives set by leadership?',
        type: 'rating',
        required: true,
        order: 1,
        category: 'clarity'
      },
      {
        id: '2',
        question: 'How effectively does leadership provide feedback and guidance?',
        type: 'rating',
        required: true,
        order: 2,
        category: 'feedback'
      },
      {
        id: '3',
        question: 'How well does leadership support professional development?',
        type: 'rating',
        required: true,
        order: 3,
        category: 'development'
      }
    ]
  }
]

// Export service instance
export const assessmentDelegationService = new AssessmentDelegationService()
