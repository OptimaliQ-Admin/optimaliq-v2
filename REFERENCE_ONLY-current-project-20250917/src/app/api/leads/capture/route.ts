/**
 * Lead Capture API
 * Provides lead capture, scoring, and qualification management
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schemas
const LeadCaptureSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().min(1).max(200),
  jobTitle: z.string().min(1).max(100),
  phone: z.string().optional(),
  industry: z.string().min(1).max(100),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  source: z.enum(['website', 'social_media', 'referral', 'advertising', 'event', 'content', 'other']),
  campaign: z.string().optional(),
  utmParams: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional()
  }).optional(),
  interests: z.array(z.string()).optional(),
  assessmentScore: z.number().finite().min(0).max(10).optional(),
  budget: z.enum(['under_10k', '10k_50k', '50k_100k', '100k_500k', '500k+']).optional(),
  timeline: z.enum(['immediate', '1_3_months', '3_6_months', '6_12_months', '12_months+']).optional(),
  painPoints: z.array(z.string()).optional(),
  additionalInfo: z.string().optional()
});

const LeadUpdateSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).optional(),
  score: z.number().finite().min(0).max(100).optional(),
  notes: z.string().optional(),
  nextAction: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  tags: z.array(z.string()).optional()
});

// Response schemas
const LeadCaptureResponseSchema = z.object({
  success: z.boolean(),
  lead: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    company: z.string(),
    jobTitle: z.string(),
    phone: z.string().optional(),
    industry: z.string(),
    companySize: z.string(),
    source: z.string(),
    campaign: z.string().optional(),
    status: z.string(),
    score: z.number().finite(),
    createdAt: z.string(),
    updatedAt: z.string(),
    qualification: z.object({
      isQualified: z.boolean(),
      confidence: z.number().finite(),
      reasons: z.array(z.string()),
      nextSteps: z.array(z.string())
    }),
    recommendations: z.array(z.object({
      type: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(['high', 'medium', 'low'])
    }))
  }).optional(),
  message: z.string().optional()
});

const LeadListResponseSchema = z.object({
  success: z.boolean(),
  leads: z.array(z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    company: z.string(),
    jobTitle: z.string(),
    industry: z.string(),
    companySize: z.string(),
    source: z.string(),
    status: z.string(),
    score: z.number().finite(),
    createdAt: z.string(),
    lastContacted: z.string().optional(),
    assignedTo: z.string().optional()
  })),
  pagination: z.object({
    page: z.number().finite(),
    limit: z.number().finite(),
    total: z.number().finite(),
    totalPages: z.number().finite()
  }).optional(),
  analytics: z.object({
    totalLeads: z.number().finite(),
    qualifiedLeads: z.number().finite(),
    conversionRate: z.number().finite(),
    averageScore: z.number().finite(),
    topSources: z.array(z.object({
      source: z.string(),
      count: z.number().finite(),
      conversionRate: z.number().finite()
    }))
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = LeadCaptureSchema.parse(body);

    // Check if lead already exists
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, status, score')
      .eq('email', validatedData.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing lead:', checkError);
      return NextResponse.json(
        { success: false, message: 'Error checking existing lead' },
        { status: 500 }
      );
    }

    if (existingLead) {
      // Update existing lead
      const updatedData = {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        company: validatedData.company,
        job_title: validatedData.jobTitle,
        phone: validatedData.phone,
        industry: validatedData.industry,
        company_size: validatedData.companySize,
        source: validatedData.source,
        campaign: validatedData.campaign,
        utm_params: validatedData.utmParams,
        interests: validatedData.interests,
        assessment_score: validatedData.assessmentScore,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        pain_points: validatedData.painPoints,
        additional_info: validatedData.additionalInfo,
        updated_at: new Date().toISOString()
      };

      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update(updatedData)
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update lead:', updateError);
        return NextResponse.json(
          { success: false, message: 'Failed to update lead' },
          { status: 500 }
        );
      }

      // Re-score the lead
      const qualification = await qualifyLead(updatedLead);
      const recommendations = await generateLeadRecommendations(updatedLead);

      const response = LeadCaptureResponseSchema.parse({
        success: true,
        lead: {
          id: updatedLead.id,
          firstName: updatedLead.first_name,
          lastName: updatedLead.last_name,
          email: updatedLead.email,
          company: updatedLead.company,
          jobTitle: updatedLead.job_title,
          phone: updatedLead.phone,
          industry: updatedLead.industry,
          companySize: updatedLead.company_size,
          source: updatedLead.source,
          campaign: updatedLead.campaign,
          status: updatedLead.status,
          score: updatedLead.score,
          createdAt: updatedLead.created_at,
          updatedAt: updatedLead.updated_at,
          qualification,
          recommendations
        }
      });

      return NextResponse.json(response);
    }

    // Create new lead
    const leadData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      company: validatedData.company,
      job_title: validatedData.jobTitle,
      phone: validatedData.phone,
      industry: validatedData.industry,
      company_size: validatedData.companySize,
      source: validatedData.source,
      campaign: validatedData.campaign,
      utm_params: validatedData.utmParams,
      interests: validatedData.interests,
      assessment_score: validatedData.assessmentScore,
      budget: validatedData.budget,
      timeline: validatedData.timeline,
      pain_points: validatedData.painPoints,
      additional_info: validatedData.additionalInfo,
      status: 'new',
      score: 0
    };

    const { data: newLead, error: createError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (createError) {
      console.error('Failed to create lead:', createError);
      return NextResponse.json(
        { success: false, message: 'Failed to create lead' },
        { status: 500 }
      );
    }

    // Score and qualify the lead
    const score = await calculateLeadScore(newLead);
    const qualification = await qualifyLead(newLead);
    const recommendations = await generateLeadRecommendations(newLead);

    // Update lead with score
    const { error: scoreError } = await supabase
      .from('leads')
      .update({ score })
      .eq('id', newLead.id);

    if (scoreError) {
      console.error('Failed to update lead score:', scoreError);
    }

    // Track conversion event
    await trackConversionEvent(newLead, validatedData.source, validatedData.campaign);

    const response = LeadCaptureResponseSchema.parse({
      success: true,
      lead: {
        id: newLead.id,
        firstName: newLead.first_name,
        lastName: newLead.last_name,
        email: newLead.email,
        company: newLead.company,
        jobTitle: newLead.job_title,
        phone: newLead.phone,
        industry: newLead.industry,
        companySize: newLead.company_size,
        source: newLead.source,
        campaign: newLead.campaign,
        status: newLead.status,
        score,
        createdAt: newLead.created_at,
        updatedAt: newLead.updated_at,
        qualification,
        recommendations
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Lead capture error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const industry = searchParams.get('industry');
    const minScore = searchParams.get('minScore');
    const assignedTo = searchParams.get('assignedTo');

    // Build query
    let query = supabase
      .from('leads')
      .select(`
        id,
        first_name,
        last_name,
        email,
        company,
        job_title,
        industry,
        company_size,
        source,
        status,
        score,
        created_at,
        updated_at,
        last_contacted,
        assigned_to,
        tier2_profiles!leads_assigned_to_fkey(
          first_name,
          last_name
        )
      `);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('source', source);
    }
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (minScore) {
      query = query.gte('score', parseInt(minScore));
    }
    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo);
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Failed to get lead count:', countError);
      return NextResponse.json(
        { success: false, message: 'Failed to get lead count' },
        { status: 500 }
      );
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    query = query.order('created_at', { ascending: false });

    // Execute query
    const { data: leads, error: leadError } = await query;

    if (leadError) {
      console.error('Failed to fetch leads:', leadError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    // Process lead data
    const processedLeads = leads.map(lead => ({
      id: lead.id,
      firstName: lead.first_name,
      lastName: lead.last_name,
      email: lead.email,
      company: lead.company,
      jobTitle: lead.job_title,
      industry: lead.industry,
      companySize: lead.company_size,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      createdAt: lead.created_at,
      lastContacted: lead.last_contacted,
      assignedTo: lead.tier2_profiles ? 
        `${lead.tier2_profiles.first_name} ${lead.tier2_profiles.last_name}` : 
        undefined
    }));

    // Calculate analytics
    const analytics = await calculateLeadAnalytics();

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const response = LeadListResponseSchema.parse({
      success: true,
      leads: processedLeads,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages
      },
      analytics
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// Helper functions
async function calculateLeadScore(lead: any): Promise<number> {
  let score = 0;

  // Company size scoring
  const companySizeScores = {
    '1-10': 20,
    '11-50': 30,
    '51-200': 40,
    '201-1000': 50,
    '1000+': 60
  };
  score += companySizeScores[lead.company_size] || 0;

  // Industry scoring (mock industry scores)
  const industryScores = {
    'Technology': 25,
    'Healthcare': 20,
    'Finance': 30,
    'Manufacturing': 15,
    'Retail': 10,
    'Education': 15
  };
  score += industryScores[lead.industry] || 10;

  // Source scoring
  const sourceScores = {
    'website': 15,
    'social_media': 10,
    'referral': 25,
    'advertising': 15,
    'event': 20,
    'content': 15,
    'other': 5
  };
  score += sourceScores[lead.source] || 5;

  // Assessment score
  if (lead.assessment_score) {
    score += lead.assessment_score * 2;
  }

  // Budget scoring
  const budgetScores = {
    'under_10k': 5,
    '10k_50k': 15,
    '50k_100k': 25,
    '100k_500k': 35,
    '500k+': 45
  };
  score += budgetScores[lead.budget] || 0;

  // Timeline scoring
  const timelineScores = {
    'immediate': 30,
    '1_3_months': 25,
    '3_6_months': 20,
    '6_12_months': 15,
    '12_months+': 10
  };
  score += timelineScores[lead.timeline] || 0;

  // Cap score at 100
  return Math.min(100, Math.max(0, score));
}

async function qualifyLead(lead: any): Promise<any> {
  const isQualified = lead.score >= 60;
  const confidence = Math.min(100, lead.score + (Math.random() * 20));

  const reasons = [];
  if (lead.score >= 60) {
    reasons.push('High lead score');
  }
  if (lead.company_size === '201-1000' || lead.company_size === '1000+') {
    reasons.push('Target company size');
  }
  if (lead.source === 'referral') {
    reasons.push('Referral source');
  }
  if (lead.assessment_score && lead.assessment_score >= 7) {
    reasons.push('Strong assessment performance');
  }

  const nextSteps = [];
  if (isQualified) {
    nextSteps.push('Schedule discovery call');
    nextSteps.push('Send personalized demo');
    nextSteps.push('Create proposal');
  } else {
    nextSteps.push('Nurture with content');
    nextSteps.push('Follow up in 30 days');
    nextSteps.push('Monitor engagement');
  }

  return {
    isQualified,
    confidence: Math.round(confidence * 10) / 10,
    reasons,
    nextSteps
  };
}

async function generateLeadRecommendations(lead: any): Promise<any[]> {
  const recommendations = [];

  if (lead.score >= 70) {
    recommendations.push({
      type: 'high_priority',
      title: 'High-Value Lead',
      description: 'This lead shows strong qualification signals and should be prioritized for immediate follow-up.',
      priority: 'high' as const
    });
  }

  if (lead.source === 'referral') {
    recommendations.push({
      type: 'referral',
      title: 'Referral Lead',
      description: 'Referral leads have higher conversion rates. Consider offering referral incentives.',
      priority: 'high' as const
    });
  }

  if (lead.assessment_score && lead.assessment_score >= 8) {
    recommendations.push({
      type: 'assessment',
      title: 'Strong Assessment Performance',
      description: 'Lead performed well on assessment, indicating high engagement and need.',
      priority: 'medium' as const
    });
  }

  if (lead.company_size === '1000+') {
    recommendations.push({
      type: 'enterprise',
      title: 'Enterprise Opportunity',
      description: 'Large company size indicates potential for significant deal value.',
      priority: 'high' as const
    });
  }

  if (lead.score < 40) {
    recommendations.push({
      type: 'nurture',
      title: 'Lead Nurturing Required',
      description: 'Low score indicates need for nurturing campaign before sales engagement.',
      priority: 'low' as const
    });
  }

  return recommendations;
}

async function trackConversionEvent(lead: any, source: string, campaign?: string): Promise<void> {
  try {
    const { error: eventError } = await supabase
      .from('conversion_events')
      .insert({
        lead_id: lead.id,
        event_type: 'lead_captured',
        source,
        campaign,
        metadata: {
          company: lead.company,
          industry: lead.industry,
          companySize: lead.company_size
        }
      });

    if (eventError) {
      console.error('Failed to track conversion event:', eventError);
    }
  } catch (error) {
    console.error('Error tracking conversion event:', error);
  }
}

async function calculateLeadAnalytics(): Promise<any> {
  try {
    // Get total leads
    const { count: totalLeads, error: totalError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get qualified leads
    const { count: qualifiedLeads, error: qualifiedError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('score', 60);

    if (qualifiedError) throw qualifiedError;

    // Get average score
    const { data: scoreData, error: scoreError } = await supabase
      .from('leads')
      .select('score')
      .not('score', 'is', null);

    if (scoreError) throw scoreError;

    const averageScore = scoreData.length > 0 ? 
      scoreData.reduce((sum, lead) => sum + (lead.score || 0), 0) / scoreData.length : 0;

    // Get top sources
    const { data: sourceData, error: sourceError } = await supabase
      .from('leads')
      .select('source, status')
      .not('source', 'is', null);

    if (sourceError) throw sourceError;

    const sourceStats = sourceData.reduce((acc, lead) => {
      if (!acc[lead.source]) {
        acc[lead.source] = { count: 0, converted: 0 };
      }
      acc[lead.source].count++;
      if (lead.status === 'closed_won') {
        acc[lead.source].converted++;
      }
      return acc;
    }, {} as Record<string, { count: number; converted: number }>);

    const topSources = Object.entries(sourceStats)
      .map(([source, stats]) => ({
        source,
        count: stats.count,
        conversionRate: stats.count > 0 ? (stats.converted / stats.count) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads: totalLeads || 0,
      qualifiedLeads: qualifiedLeads || 0,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageScore: Math.round(averageScore * 10) / 10,
      topSources
    };

  } catch (error) {
    console.error('Error calculating lead analytics:', error);
    return {
      totalLeads: 0,
      qualifiedLeads: 0,
      conversionRate: 0,
      averageScore: 0,
      topSources: []
    };
  }
}
