import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const scoringRequestSchema = z.object({
  leadId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  scoringCriteria: z.record(z.number().finite()).optional(),
  includeRecommendations: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      leadId: searchParams.get('leadId'),
      userId: searchParams.get('userId') || user.id,
      scoringCriteria: searchParams.get('scoringCriteria') ? JSON.parse(searchParams.get('scoringCriteria')!) : undefined,
      includeRecommendations: searchParams.get('includeRecommendations') === 'true'
    };

    const validatedQuery = scoringRequestSchema.parse(queryData);

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', validatedQuery.leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Calculate lead score
    const leadScore = calculateLeadScore(lead, validatedQuery.scoringCriteria);

    // Get lead scoring history
    const { data: scoringHistory } = await supabase
      .from('lead_scoring_history')
      .select('*')
      .eq('lead_id', validatedQuery.leadId)
      .order('created_at', { ascending: false });

    // Generate recommendations
    const recommendations = validatedQuery.includeRecommendations 
      ? await generateLeadRecommendations(lead, leadScore)
      : null;

    // Get lead qualification status
    const qualificationStatus = determineQualificationStatus(leadScore.totalScore);

    // Update lead with new score
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        score: leadScore.totalScore,
        score_breakdown: leadScore.breakdown,
        qualification_status: qualificationStatus,
        last_scored_at: new Date().toISOString()
      })
      .eq('id', validatedQuery.leadId);

    if (updateError) {
      console.error('Error updating lead score:', updateError);
    }

    // Record scoring event
    const { error: historyError } = await supabase
      .from('lead_scoring_history')
      .insert({
        lead_id: validatedQuery.leadId,
        score: leadScore.totalScore,
        score_breakdown: leadScore.breakdown,
        scoring_criteria: validatedQuery.scoringCriteria,
        created_at: new Date().toISOString()
      });

    if (historyError) {
      console.error('Error recording scoring history:', historyError);
    }

    return NextResponse.json({
      leadId: validatedQuery.leadId,
      score: leadScore.totalScore,
      breakdown: leadScore.breakdown,
      qualificationStatus,
      recommendations,
      scoringHistory: scoringHistory || [],
      summary: {
        totalScore: leadScore.totalScore,
        maxPossibleScore: 100,
        scorePercentage: leadScore.totalScore,
        qualificationLevel: qualificationStatus,
        scoreTrend: calculateScoreTrend(scoringHistory || [])
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Lead scoring API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateLeadScore(lead: any, customCriteria?: Record<string, number>) {
  const defaultCriteria = {
    companySize: 20,
    industry: 15,
    title: 15,
    engagement: 20,
    budget: 15,
    timeline: 15
  };

  const criteria = customCriteria || defaultCriteria;
  const breakdown: Record<string, number> = {};

  // Company size scoring
  const companySizeScore = scoreCompanySize(lead.company_size);
  breakdown.companySize = (companySizeScore / 100) * criteria.companySize;

  // Industry scoring
  const industryScore = scoreIndustry(lead.industry);
  breakdown.industry = (industryScore / 100) * criteria.industry;

  // Title scoring
  const titleScore = scoreTitle(lead.title);
  breakdown.title = (titleScore / 100) * criteria.title;

  // Engagement scoring
  const engagementScore = scoreEngagement(lead);
  breakdown.engagement = (engagementScore / 100) * criteria.engagement;

  // Budget scoring
  const budgetScore = scoreBudget(lead.budget_range);
  breakdown.budget = (budgetScore / 100) * criteria.budget;

  // Timeline scoring
  const timelineScore = scoreTimeline(lead.timeline);
  breakdown.timeline = (timelineScore / 100) * criteria.timeline;

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  return {
    totalScore: Math.round(totalScore),
    breakdown
  };
}

function scoreCompanySize(companySize?: string): number {
  const sizeScores = {
    '1-10': 60,
    '11-50': 80,
    '51-200': 90,
    '201-500': 85,
    '501-1000': 75,
    '1000+': 70
  };
  return sizeScores[companySize as keyof typeof sizeScores] || 50;
}

function scoreIndustry(industry?: string): number {
  const industryScores = {
    'technology': 90,
    'healthcare': 85,
    'finance': 80,
    'manufacturing': 75,
    'retail': 70,
    'education': 65,
    'consulting': 80,
    'real_estate': 60
  };
  return industryScores[industry as keyof typeof industryScores] || 50;
}

function scoreTitle(title?: string): number {
  if (!title) return 50;
  
  const titleScores = {
    'CEO': 100,
    'CTO': 95,
    'CFO': 90,
    'VP': 85,
    'Director': 80,
    'Manager': 70,
    'Coordinator': 60,
    'Analyst': 50
  };

  for (const [key, score] of Object.entries(titleScores)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return score;
    }
  }
  return 50;
}

function scoreEngagement(lead: any): number {
  let score = 50;

  // Website visits
  if (lead.website_visits > 10) score += 20;
  else if (lead.website_visits > 5) score += 10;

  // Email opens
  if (lead.email_opens > 5) score += 15;
  else if (lead.email_opens > 2) score += 8;

  // Email clicks
  if (lead.email_clicks > 2) score += 15;
  else if (lead.email_clicks > 0) score += 7;

  return Math.min(100, score);
}

function scoreBudget(budgetRange?: string): number {
  const budgetScores = {
    'Under $10K': 40,
    '$10K-$50K': 60,
    '$50K-$100K': 80,
    '$100K-$500K': 90,
    '$500K+': 100
  };
  return budgetScores[budgetRange as keyof typeof budgetScores] || 50;
}

function scoreTimeline(timeline?: string): number {
  const timelineScores = {
    'Immediate': 100,
    '1-3 months': 90,
    '3-6 months': 70,
    '6-12 months': 50,
    '12+ months': 30
  };
  return timelineScores[timeline as keyof typeof timelineScores] || 50;
}

function determineQualificationStatus(score: number): string {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'lukewarm';
  return 'cold';
}

async function generateLeadRecommendations(lead: any, leadScore: any) {
  const recommendations = [];

  // Low company size score
  if (leadScore.breakdown.companySize < 10) {
    recommendations.push({
      type: 'qualification',
      title: 'Verify Company Size',
      description: 'Consider verifying the company size through additional research',
      priority: 'medium',
      action: 'research_company'
    });
  }

  // Low engagement score
  if (leadScore.breakdown.engagement < 10) {
    recommendations.push({
      type: 'engagement',
      title: 'Increase Engagement',
      description: 'Focus on increasing engagement through targeted content and outreach',
      priority: 'high',
      action: 'increase_engagement'
    });
  }

  // Low budget score
  if (leadScore.breakdown.budget < 10) {
    recommendations.push({
      type: 'qualification',
      title: 'Clarify Budget',
      description: 'Work to understand the actual budget constraints and requirements',
      priority: 'high',
      action: 'clarify_budget'
    });
  }

  // High score but no recent activity
  if (leadScore.totalScore > 70 && (!lead.last_activity || new Date(lead.last_activity) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))) {
    recommendations.push({
      type: 'follow_up',
      title: 'Follow Up',
      description: 'High-scoring lead with no recent activity - prioritize follow-up',
      priority: 'critical',
      action: 'immediate_follow_up'
    });
  }

  return recommendations;
}

function calculateScoreTrend(scoringHistory: any[]): string {
  if (scoringHistory.length < 2) return 'stable';

  const recentScores = scoringHistory.slice(0, 3).map(h => h.score);
  const trend = recentScores.reduce((sum, score, index) => {
    if (index === 0) return 0;
    return sum + (score - recentScores[index - 1]);
  }, 0) / (recentScores.length - 1);

  if (trend > 5) return 'increasing';
  if (trend < -5) return 'decreasing';
  return 'stable';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, leadId, scoringData } = body;

    switch (action) {
      case 'update_criteria':
        // Update scoring criteria for a lead
        const { error: criteriaError } = await supabase
          .from('lead_scoring_criteria')
          .upsert({
            lead_id: leadId,
            criteria: scoringData.criteria,
            updated_by: user.id,
            updated_at: new Date().toISOString()
          });

        if (criteriaError) {
          console.error('Error updating scoring criteria:', criteriaError);
          return NextResponse.json({ error: 'Failed to update scoring criteria' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Scoring criteria updated successfully' });

      case 'manual_score':
        // Manually override lead score
        const { error: manualError } = await supabase
          .from('leads')
          .update({
            score: scoringData.score,
            manual_score: true,
            manual_score_reason: scoringData.reason,
            last_scored_at: new Date().toISOString()
          })
          .eq('id', leadId);

        if (manualError) {
          console.error('Error setting manual score:', manualError);
          return NextResponse.json({ error: 'Failed to set manual score' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Manual score set successfully' });

      case 'qualify_lead':
        // Manually qualify/disqualify lead
        const { error: qualifyError } = await supabase
          .from('leads')
          .update({
            qualification_status: scoringData.status,
            qualification_reason: scoringData.reason,
            qualified_by: user.id,
            qualified_at: new Date().toISOString()
          })
          .eq('id', leadId);

        if (qualifyError) {
          console.error('Error qualifying lead:', qualifyError);
          return NextResponse.json({ error: 'Failed to qualify lead' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Lead qualification updated successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Lead scoring action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

