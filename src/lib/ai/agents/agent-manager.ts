import { BaseAgent, AgentRequest, AgentResponse } from './base-agent';
import { assessmentAgent } from './assessment-agent';
import { growthPlanningAgent } from './growth-planning-agent';
import { marketIntelligenceAgent } from './market-intelligence-agent';
import { delegationAgent } from './delegation-agent';
import { aiRouter } from '@/lib/ai-router';
import { ragPipeline } from '@/lib/ai/rag-pipeline';
import { AppError } from '@/utils';

export enum AgentType {
  ASSESSMENT = 'assessment',
  GROWTH_PLANNING = 'growth_planning',
  MARKET_INTELLIGENCE = 'market_intelligence',
  DELEGATION = 'delegation'
}

export interface AgentManagerRequest {
  agentType: AgentType;
  request: AgentRequest;
}

export class AgentManager {
  private static instance: AgentManager;
  private agents: Map<AgentType, BaseAgent> = new Map();
  private executionQueue: Map<string, Promise<AgentResponse>> = new Map();

  private constructor() {
    this.registerAgents();
  }

  public static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  private registerAgents(): void {
    this.agents.set(AgentType.ASSESSMENT, assessmentAgent);
    this.agents.set(AgentType.GROWTH_PLANNING, growthPlanningAgent);
    this.agents.set(AgentType.MARKET_INTELLIGENCE, marketIntelligenceAgent);
    this.agents.set(AgentType.DELEGATION, delegationAgent);
  }

  // Execute agent with queue management
  async execute(agentType: AgentType, request: AgentRequest): Promise<AgentResponse> {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new AppError(`Agent type ${agentType} not found`, 'AGENT_NOT_FOUND', 404);
    }

    // Create unique execution ID for queue management
    const executionId = `${agentType}_${request.userId || 'anonymous'}_${Date.now()}`;

    try {
      // Check if similar request is already in queue
      const existingExecution = this.findSimilarExecution(agentType, request);
      if (existingExecution) {
        return await existingExecution;
      }

      // Execute agent
      const executionPromise = agent.process(request);
      this.executionQueue.set(executionId, executionPromise);

      const result = await executionPromise;

      // Clean up queue
      this.executionQueue.delete(executionId);

      return result;

    } catch (error) {
      // Clean up queue on error
      this.executionQueue.delete(executionId);
      throw error;
    }
  }

  // Execute multiple agents in parallel
  async executeParallel(requests: AgentManagerRequest[]): Promise<AgentResponse[]> {
    const promises = requests.map(({ agentType, request }) => 
      this.execute(agentType, request)
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      // Handle partial failures
      const results = await Promise.allSettled(promises);
      return results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            data: null,
            errors: [result.reason?.message || 'Agent execution failed']
          };
        }
      });
    }
  }

  // Find similar execution in queue to avoid duplicate work
  private findSimilarExecution(agentType: AgentType, request: AgentRequest): Promise<AgentResponse> | null {
    for (const [executionId, promise] of this.executionQueue) {
      if (executionId.startsWith(agentType) && executionId.includes(request.userId || 'anonymous')) {
        // Found similar execution - return existing promise
        return promise;
      }
    }
    return null;
  }

  // Get agent status and performance metrics
  getAgentStatus(agentType?: AgentType): Record<string, any> {
    if (agentType) {
      const agent = this.agents.get(agentType);
      return agent ? agent.getStatus() : {};
    }

    const status: Record<string, any> = {};
    for (const [type, agent] of this.agents) {
      status[type] = agent.getStatus();
    }
    return status;
  }

  // Get execution queue status
  getQueueStatus(): {
    activeExecutions: number;
    queuedRequests: string[];
    averageExecutionTime: number;
  } {
    return {
      activeExecutions: this.executionQueue.size,
      queuedRequests: Array.from(this.executionQueue.keys()),
      averageExecutionTime: 0 // Would be calculated from historical data
    };
  }

  // Cancel execution
  cancelExecution(executionId: string): boolean {
    if (this.executionQueue.has(executionId)) {
      this.executionQueue.delete(executionId);
      return true;
    }
    return false;
  }

  // Health check for all agents
  async healthCheck(): Promise<Record<AgentType, boolean>> {
    const health: Record<string, boolean> = {};

    for (const [type, agent] of this.agents) {
      try {
        // Simple health check - try to get agent status
        const status = agent.getStatus();
        health[type] = status.name !== undefined;
      } catch (error) {
        health[type] = false;
      }
    }

    return health as Record<AgentType, boolean>;
  }
}

// Export singleton instance
export const agentManager = AgentManager.getInstance();

// Convenience functions for common agent operations
export const agents = {
  // Process assessment and generate insights
  processAssessment: async (
    assessmentData: Record<string, any>,
    assessmentType: string,
    userId: string,
    industry?: string
  ) => {
    return agentManager.execute(AgentType.ASSESSMENT, {
      task: 'process_assessment',
      context: { assessmentData, assessmentType, industry },
      userId,
      priority: 'high'
    });
  },

  // Generate growth plan
  createGrowthPlan: async (
    currentScores: any,
    industry: string,
    companySize: string,
    revenueRange: string,
    userId: string
  ) => {
    return agentManager.execute(AgentType.GROWTH_PLANNING, {
      task: 'create_growth_plan',
      context: { currentScores, industry, companySize, revenueRange },
      userId,
      priority: 'high'
    });
  },

  // Analyze market intelligence
  analyzeMarket: async (
    industry: string,
    timeframe: '7d' | '30d' | '90d' = '30d',
    focusAreas?: string[]
  ) => {
    return agentManager.execute(AgentType.MARKET_INTELLIGENCE, {
      task: 'analyze_market',
      context: { industry, timeframe, focusAreas },
      priority: 'medium'
    });
  },

  // Delegate assessments to team
  delegateAssessment: async (
    organizationId: string,
    assessmentType: string,
    selectedMembers: string[],
    dueDate: string,
    ownerId: string
  ) => {
    return agentManager.execute(AgentType.DELEGATION, {
      task: 'delegate_assessment',
      context: { organizationId, assessmentType, selectedMembers, dueDate },
      userId: ownerId,
      priority: 'medium'
    });
  }
};
