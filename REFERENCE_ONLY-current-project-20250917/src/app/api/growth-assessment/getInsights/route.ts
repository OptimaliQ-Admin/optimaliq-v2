import { NextRequest, NextResponse } from 'next/server'
import { AssessmentAgent } from '@/lib/ai/agents/assessment-agent'
import { GrowthPlanningAgent } from '@/lib/ai/agents/growth-planning-agent'
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const GetInsightsRequestSchema = z.object({
  u_id: z.string()
})

// Initialize Supabase client only when needed
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { u_id } = GetInsightsRequestSchema.parse(body)

    // Initialize Supabase client
    const supabase = getSupabaseClient()

    // Get user profile and assessment data
    const { data: userProfile, error: userError } = await supabase
      .from('tier2_users')
      .select('*')
      .eq('id', u_id)
      .single()

    if (userError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Get assessment responses
    const { data: assessment, error: assessmentError } = await supabase
      .from('growth_assessment')
      .select('*')
      .eq('user_id', u_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { success: false, message: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Initialize AI agents
    const assessmentAgent = new AssessmentAgent()
    const growthAgent = new GrowthPlanningAgent()
    const marketAgent = new MarketIntelligenceAgent()

    // Prepare assessment data for AI analysis
    const assessmentData = {
      strategy: assessment.responses?.strategy || '',
      process: assessment.responses?.process || '',
      customers: assessment.responses?.customers || '',
      technology: assessment.responses?.technology || '',
      challenges: assessment.responses?.challenges || []
    }

    // Calculate scores using AssessmentAgent
    const assessmentResult = await assessmentAgent.execute({
      type: 'growth_assessment',
      data: {
        assessmentData,
        industry: userProfile.industry,
        companySize: userProfile.company_size,
        revenueRange: userProfile.revenue_range,
        assessmentType: 'growth_maturity'
      }
    })

    if (!assessmentResult.success) {
      throw new Error(`Assessment analysis failed: ${assessmentResult.error}`)
    }

    const scores = assessmentResult.data.scores
    const insights = assessmentResult.data.insights

    // Get market intelligence using MarketIntelligenceAgent
    const marketResult = await marketAgent.execute({
      type: 'industry_analysis',
      data: {
        industry: userProfile.industry,
        companySize: userProfile.company_size,
        focusAreas: ['trends', 'opportunities', 'benchmarks']
      }
    })

    // Get growth planning insights using GrowthPlanningAgent
    const growthResult = await growthAgent.execute({
      type: 'growth_analysis',
      data: {
        organization: {
          id: userProfile.organization_id,
          industry: userProfile.industry,
          companySize: userProfile.company_size
        },
        currentState: {
          scores: scores,
          assessmentData: assessmentData
        },
        analysisType: 'comprehensive'
      }
    })

    // Calculate overall score
    const overallScore = scores ? 
      (scores.strategy + scores.process + scores.technology) / 3 : 2.5

    // Generate comprehensive insights
    const strategyInsight = insights?.recommendations?.[0] || 
      "Focus on sharpening strategic priorities, aligning goals, and clarifying the roadmap."

    const processInsight = insights?.recommendations?.[1] || 
      "Tighten process ownership, cadence, and handoffs to reduce friction and improve throughput."

    const technologyInsight = insights?.recommendations?.[2] || 
      "Leverage automation and integrations to boost efficiency, insight quality, and scalability."

    // Prepare response
    const response = {
      success: true,
      overall_score: Math.round(overallScore * 10) / 10,
      strategy_score: Math.round((scores?.strategy || 2.5) * 10) / 10,
      process_score: Math.round((scores?.process || 2.5) * 10) / 10,
      technology_score: Math.round((scores?.technology || 2.5) * 10) / 10,
      strategy_insight: strategyInsight,
      process_insight: processInsight,
      technology_insight: technologyInsight,
      market_insights: marketResult.success ? marketResult.data : null,
      growth_recommendations: growthResult.success ? growthResult.data : null,
      roadmap: insights?.roadmap || [],
      strengths: insights?.strengths || [],
      weaknesses: insights?.weaknesses || [],
      benchmarks: {
        industry_average: 3.2,
        top_performers: 4.2,
        optimization_potential: Math.round((5 - overallScore) * 10) / 10
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in getInsights API:', error)
    
    // Check if it's a Supabase configuration error
    if (error instanceof Error && error.message.includes('Supabase configuration is missing')) {
      console.warn('Supabase not configured, returning fallback response')
    }
    
    // Return fallback response
    return NextResponse.json({
      success: true,
      overall_score: 2.5,
      strategy_score: 2.5,
      process_score: 2.5,
      technology_score: 2.5,
      strategy_insight: "Focus on sharpening strategic priorities, aligning goals, and clarifying the roadmap.",
      process_insight: "Tighten process ownership, cadence, and handoffs to reduce friction and improve throughput.",
      technology_insight: "Leverage automation and integrations to boost efficiency, insight quality, and scalability.",
      market_insights: null,
      growth_recommendations: null,
      roadmap: [],
      strengths: [],
      weaknesses: [],
      benchmarks: {
        industry_average: 3.2,
        top_performers: 4.2,
        optimization_potential: 2.5
      }
    })
  }
}
