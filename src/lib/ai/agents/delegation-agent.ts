import { z } from 'zod';
import { BaseAgent, AgentRequest, AgentResponse, AgentTool } from './base-agent';
import { supabaseService } from '@/lib/supabase';
import { AITask } from '@/lib/ai-router';

// Delegation Response Schema
const DelegationResponseSchema = z.object({
  assignments: z.array(z.object({
    assigneeId: z.string(),
    assigneeName: z.string(),
    assigneeEmail: z.string(),
    assessmentType: z.string(),
    customizedQuestions: z.array(z.object({
      id: z.string(),
      text: z.string(),
      type: z.string(),
      options: z.array(z.string()).optional(),
      weight: z.number()
    })),
    dueDate: z.string(),
    estimatedDuration: z.number(),
    priority: z.number(),
    context: z.string()
  })),
  teamAnalysis: z.object({
    teamStrengths: z.array(z.string()),
    skillGaps: z.array(z.string()),
    workloadDistribution: z.record(z.number()),
    collaborationOpportunities: z.array(z.string())
  }),
  communicationPlan: z.object({
    kickoffMessage: z.string(),
    reminderSchedule: z.array(z.object({
      daysBefore: z.number(),
      messageType: z.string(),
      content: z.string()
    })),
    completionActions: z.array(z.string())
  })
});

type DelegationResponse = z.infer<typeof DelegationResponseSchema>;

export interface DelegationRequest extends AgentRequest {
  organizationId: string;
  assessmentType: string;
  selectedMembers?: string[];
  dueDate: string;
  customInstructions?: string;
}

export class DelegationAgent extends BaseAgent {
  constructor() {
    super('DelegationAgent', 'Manages team assessment delegation and collaboration workflows');
    this.registerTools();
  }

  private registerTools(): void {
    // Team data tool
    const teamDataTool: AgentTool = {
      name: 'getTeamData',
      description: 'Retrieve team member information and capabilities',
      parameters: z.object({
        organizationId: z.string(),
        includeInactive: z.boolean().default(false)
      }),
      execute: async (params) => {
        try {
          return await supabaseService.getTeamMembers(params.organizationId);
        } catch (error) {
          return [];
        }
      }
    };

    // Assessment template tool
    const assessmentTemplateTool: AgentTool = {
      name: 'getAssessmentTemplate',
      description: 'Get assessment template for customization',
      parameters: z.object({
        assessmentType: z.string(),
        industry: z.string().optional()
      }),
      execute: async (params) => {
        // Placeholder - would query assessment_templates table
        return this.getDefaultAssessmentTemplate(params.assessmentType);
      }
    };

    // Workload analysis tool
    const workloadTool: AgentTool = {
      name: 'analyzeWorkload',
      description: 'Analyze current team workload and capacity',
      parameters: z.object({
        organizationId: z.string(),
        timeframe: z.string().default('30d')
      }),
      execute: async (params) => {
        return this.analyzeTeamWorkload(params.organizationId);
      }
    };

    // Communication tool
    const communicationTool: AgentTool = {
      name: 'generateCommunication',
      description: 'Generate personalized communication content',
      parameters: z.object({
        messageType: z.string(),
        recipient: z.object({
          name: z.string(),
          role: z.string(),
          department: z.string()
        }),
        context: z.record(z.any())
      }),
      execute: async (params) => {
        return this.generatePersonalizedMessage(params.messageType, params.recipient, params.context);
      }
    };

    this.registerTool(teamDataTool);
    this.registerTool(assessmentTemplateTool);
    this.registerTool(workloadTool);
    this.registerTool(communicationTool);
  }

  async plan(request: DelegationRequest): Promise<string[]> {
    const plan = [
      'Retrieve team member data and capabilities',
      'Analyze current workload and capacity',
      'Get assessment template for customization',
      'Match team members to assessment requirements',
      'Customize assessment questions per role/department',
      'Generate personalized communication content',
      'Create assignment timeline and reminders',
      'Format delegation plan with tracking'
    ];

    this.setMemory('organizationId', request.organizationId);
    this.setMemory('assessmentType', request.assessmentType);
    this.setMemory('dueDate', request.dueDate);

    return plan;
  }

  async execute(plan: string[], request: DelegationRequest): Promise<any> {
    const results: any = {};

    try {
      // Get team data
      const teamMembers = await this.executeTool('getTeamData', {
        organizationId: request.organizationId
      });

      // Analyze workload
      const workloadAnalysis = await this.executeTool('analyzeWorkload', {
        organizationId: request.organizationId
      });

      // Get assessment template
      const assessmentTemplate = await this.executeTool('getAssessmentTemplate', {
        assessmentType: request.assessmentType
      });

      // Generate delegation strategy using AI
      const delegationPrompt = this.buildDelegationPrompt(
        teamMembers,
        workloadAnalysis,
        assessmentTemplate,
        request
      );

      const aiResponse = await this.generateContent(delegationPrompt, AITask.REASONING);
      
      const parsedResponse = await this.validateAndRepairJSON(aiResponse, z.object({
        assignments: z.array(z.any()),
        teamAnalysis: z.object({
          teamStrengths: z.array(z.string()),
          skillGaps: z.array(z.string()),
          workloadDistribution: z.record(z.number()),
          collaborationOpportunities: z.array(z.string())
        }),
        communicationPlan: z.object({
          kickoffMessage: z.string(),
          reminderSchedule: z.array(z.any()),
          completionActions: z.array(z.string())
        })
      }));

      results.delegation = parsedResponse;
      results.teamMembers = teamMembers;

      return results;

    } catch (error) {
      throw new Error(`Delegation execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validate(result: any): Promise<AgentResponse<DelegationResponse>> {
    try {
      const formattedResponse: DelegationResponse = {
        assignments: result.delegation.assignments.map((assignment: any) => ({
          assigneeId: assignment.assigneeId,
          assigneeName: assignment.assigneeName,
          assigneeEmail: assignment.assigneeEmail,
          assessmentType: assignment.assessmentType,
          customizedQuestions: assignment.customizedQuestions || [],
          dueDate: assignment.dueDate,
          estimatedDuration: assignment.estimatedDuration || 30,
          priority: assignment.priority || 5,
          context: assignment.context || ''
        })),
        teamAnalysis: result.delegation.teamAnalysis,
        communicationPlan: result.delegation.communicationPlan
      };

      const validatedResponse = DelegationResponseSchema.parse(formattedResponse);

      return {
        success: true,
        data: validatedResponse,
        citations: []
      };

    } catch (error) {
      return {
        success: false,
        data: {} as DelegationResponse,
        errors: [error instanceof Error ? error.message : 'Delegation validation failed']
      };
    }
  }

  // Helper methods
  private getDefaultAssessmentTemplate(assessmentType: string): any {
    // Placeholder - would query actual templates
    return {
      type: assessmentType,
      questions: [
        {
          id: '1',
          text: 'Sample question for ' + assessmentType,
          type: 'scale',
          weight: 1.0
        }
      ]
    };
  }

  private analyzeTeamWorkload(organizationId: string): any {
    // Placeholder - would analyze actual workload data
    return {
      averageCapacity: 0.75,
      overloadedMembers: [],
      availableMembers: [],
      skillDistribution: {}
    };
  }

  private generatePersonalizedMessage(messageType: string, recipient: any, context: any): string {
    return `Personalized ${messageType} message for ${recipient.name}`;
  }

  private buildDelegationPrompt(
    teamMembers: any[],
    workloadAnalysis: any,
    assessmentTemplate: any,
    request: DelegationRequest
  ): string {
    return `
      You are an expert team management consultant creating an optimal delegation strategy.
      
      Team Members: ${JSON.stringify(teamMembers, null, 2)}
      Workload Analysis: ${JSON.stringify(workloadAnalysis, null, 2)}
      Assessment Template: ${JSON.stringify(assessmentTemplate, null, 2)}
      
      Assessment Type: ${request.assessmentType}
      Due Date: ${request.dueDate}
      Custom Instructions: ${request.customInstructions || 'None'}
      
      Create an optimal delegation plan in JSON format:
      
      {
        "assignments": [
          {
            "assigneeId": "team_member_id",
            "assigneeName": "Full Name",
            "assigneeEmail": "email@example.com",
            "assessmentType": "${request.assessmentType}",
            "customizedQuestions": [/* Customized questions based on role */],
            "dueDate": "${request.dueDate}",
            "estimatedDuration": 30, // minutes
            "priority": 1-10,
            "context": "Personalized context for this team member"
          }
        ],
        "teamAnalysis": {
          "teamStrengths": ["Identified team strengths"],
          "skillGaps": ["Areas needing development"], 
          "workloadDistribution": {"member1": 0.8, "member2": 0.6},
          "collaborationOpportunities": ["Ways to improve collaboration"]
        },
        "communicationPlan": {
          "kickoffMessage": "Engaging message to launch the assessment campaign",
          "reminderSchedule": [
            {"daysBefore": 7, "messageType": "gentle_reminder", "content": "Reminder content"},
            {"daysBefore": 1, "messageType": "final_reminder", "content": "Final reminder content"}
          ],
          "completionActions": ["Actions to take when assessments are complete"]
        }
      }
      
      Optimize for:
      - Balanced workload distribution
      - Role-appropriate question customization
      - Clear communication and expectations
      - Maximum participation and engagement
    `;
  }
}

// Export singleton instance
export const delegationAgent = new DelegationAgent();
