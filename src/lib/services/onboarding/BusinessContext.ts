export interface BusinessContext {
  // User profile data
  industry: string | null;
  company_size: string | null;
  revenue_range: string | null;
  
  // Assessment scores (if available)
  score_strategy?: number;
  score_process?: number;
  score_technology?: number;
  
  // Current session data
  sessionId: string;
  currentSectionId: string;
  completedSections: string[];
  
  // Previous responses for context
  previousResponses: Record<string, any>;
  
  // Conversation state
  totalSections: number;
  currentSectionIndex: number;
}

export interface SectionContext {
  sectionId: string;
  sectionName: string;
  responses: Record<string, any>;
  businessContext: BusinessContext;
  isLastSection: boolean;
}

export function buildBusinessContext(
  userProfile: any,
  sessionData: any,
  previousResponses: Record<string, any> = {}
): BusinessContext {
  return {
    industry: userProfile?.industry || null,
    company_size: userProfile?.company_size || null,
    revenue_range: userProfile?.revenue_range || null,
    score_strategy: userProfile?.score_strategy,
    score_process: userProfile?.score_process,
    score_technology: userProfile?.score_technology,
    sessionId: sessionData?.sessionId || '',
    currentSectionId: sessionData?.currentSectionId || '',
    completedSections: sessionData?.completedSections || [],
    previousResponses,
    totalSections: sessionData?.totalSections || 6,
    currentSectionIndex: sessionData?.currentSectionIndex || 0
  };
}

export function extractUserProfileFromResponses(responses: Record<string, any>): Partial<BusinessContext> {
  return {
    industry: responses.industry || null,
    company_size: responses.company_size || null,
    revenue_range: responses.revenue_range || null
  };
} 