// AI Agents Export Module
export { BaseAgent } from './base-agent';
export { AssessmentAgent, assessmentAgent } from './assessment-agent';
export { GrowthPlanningAgent, growthPlanningAgent } from './growth-planning-agent';
export { MarketIntelligenceAgent, marketIntelligenceAgent } from './market-intelligence-agent';
export { DelegationAgent, delegationAgent } from './delegation-agent';
export { AgentManager, agentManager, agents, AgentType } from './agent-manager';

// Enhanced agent functions using new ML/RAG infrastructure
import { ragPipeline } from '@/lib/ai/rag-pipeline';
import { aiRouter, AITask } from '@/lib/ai-router';
import { AssessmentAgent } from './assessment-agent';
import { MarketIntelligenceAgent } from './market-intelligence-agent';

// Enhanced assessment processing with RAG and multi-provider AI
export async function processAssessmentEnhanced(
  responses: Record<string, any>,
  assessmentType: string,
  userId: string,
  industry: string,
  options?: {
    useRAG?: boolean;
    useMultiProvider?: boolean;
    includeMarketContext?: boolean;
  }
) {
  try {
    const agent = new AssessmentAgent();
    
    // Get market context using RAG if requested
    let marketContext = {};
    if (options?.includeMarketContext && options?.useRAG) {
      const ragResult = await ragPipeline.retrieveAndGenerate(
        `${industry} industry benchmarks and performance metrics`,
        { limit: 5, threshold: 0.7 }
      );
      marketContext = {
        industryInsights: ragResult.answer,
        citations: ragResult.citations,
      };
    }

    // Process assessment with enhanced context
    return await agent.processRequest({
      task: `Process ${assessmentType} assessment for ${industry} industry`,
      context: {
        assessmentData: responses,
        assessmentType,
        industry,
        marketContext,
        useMultiProvider: options?.useMultiProvider,
      },
      userId,
      organizationId: 'assessment-processing',
    });
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: [error instanceof Error ? error.message : 'Assessment processing failed'],
    };
  }
}

// Enhanced market analysis with RAG
export async function analyzeMarketEnhanced(
  industry: string,
  timeframe: string,
  focusAreas?: string[]
) {
  try {
    const agent = new MarketIntelligenceAgent();
    
    // Use RAG for market intelligence
    const ragQuery = `${industry} industry market trends and analysis for ${timeframe}`;
    const ragResult = await ragPipeline.retrieveAndGenerate(ragQuery, {
      limit: 10,
      threshold: 0.7,
      includeContext: true,
    });

    return await agent.processRequest({
      task: `Analyze ${industry} market trends`,
      context: {
        industry,
        timeframe,
        focusAreas,
        ragContext: ragResult.context,
        ragAnswer: ragResult.answer,
        citations: ragResult.citations,
      },
      userId: 'market-analysis',
      organizationId: 'market-intelligence',
    });
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: [error instanceof Error ? error.message : 'Market analysis failed'],
    };
  }
}

// Re-export types
export type { AgentTool, AgentMemory, AgentResponse, AgentRequest } from './base-agent';
