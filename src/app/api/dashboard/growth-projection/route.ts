/**
 * Growth Projection API
 * Provides AI-powered growth forecasting and scenario modeling
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { GrowthPlanningAgent } from '@/lib/ai/agents/growth-planning-agent';

// Request schema
const GrowthProjectionSchema = z.object({
  timeframe: z.enum(['30days', '90days', '6months', '1year', '2years']).default('1year'),
  scenario: z.enum(['conservative', 'moderate', 'aggressive']).default('moderate'),
  includeMarketFactors: z.boolean().default(true),
  includeCompetitiveAnalysis: z.boolean().default(true),
  includeRiskAssessment: z.boolean().default(true),
  customFactors: z.array(z.object({
    factor: z.string(),
    impact: z.enum(['positive', 'negative', 'neutral']),
    magnitude: z.number().min(0).max(10),
    probability: z.number().min(0).max(1)
  })).optional()
});

// Response schema
const GrowthProjectionResponseSchema = z.object({
  success: z.boolean(),
  projection: z.object({
    timeframe: z.string(),
    scenario: z.string(),
    summary: z.object({
      projectedGrowth: z.number(),
      confidenceInterval: z.object({
        lower: z.number(),
        upper: z.number()
      }),
      keyDrivers: z.array(z.string()),
      majorRisks: z.array(z.string()),
      recommendedActions: z.array(z.string())
    }),
    monthlyProjections: z.array(z.object({
      month: z.string(),
      projectedRevenue: z.number(),
      projectedUsers: z.number(),
      projectedScore: z.number(),
      confidence: z.number(),
      factors: z.array(z.object({
        name: z.string(),
        impact: z.number(),
        description: z.string()
      }))
    })),
    scenarioComparison: z.object({
      conservative: z.object({
        projectedGrowth: z.number(),
        keyAssumptions: z.array(z.string())
      }),
      moderate: z.object({
        projectedGrowth: z.number(),
        keyAssumptions: z.array(z.string())
      }),
      aggressive: z.object({
        projectedGrowth: z.number(),
        keyAssumptions: z.array(z.string())
      })
    }),
    marketFactors: z.object({
      industryTrends: z.array(z.object({
        trend: z.string(),
        impact: z.enum(['positive', 'negative', 'neutral']),
        probability: z.number(),
        description: z.string()
      })),
      competitiveLandscape: z.object({
        threats: z.array(z.string()),
        opportunities: z.array(z.string()),
        marketShare: z.number(),
        competitiveAdvantage: z.array(z.string())
      }),
      economicFactors: z.array(z.object({
        factor: z.string(),
        impact: z.number(),
        trend: z.enum(['improving', 'declining', 'stable'])
      }))
    }).optional(),
    riskAssessment: z.object({
      highRiskFactors: z.array(z.object({
        factor: z.string(),
        probability: z.number(),
        impact: z.number(),
        mitigation: z.string()
      })),
      mediumRiskFactors: z.array(z.object({
        factor: z.string(),
        probability: z.number(),
        impact: z.number(),
        mitigation: z.string()
      })),
      overallRiskScore: z.number(),
      riskTrend: z.enum(['increasing', 'decreasing', 'stable'])
    }).optional(),
    recommendations: z.array(z.object({
      priority: z.enum(['high', 'medium', 'low']),
      category: z.string(),
      action: z.string(),
      expectedImpact: z.number(),
      timeline: z.string(),
      resources: z.array(z.string()),
      successMetrics: z.array(z.string())
    }))
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GrowthProjectionSchema.parse(body);

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's organization and historical data
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id, industry, company_size')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Fetch historical assessment data
    const { data: assessments, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .select('score, completed_at, type')
      .eq('organization_id', userProfile.organization_id)
      .order('completed_at', { ascending: true });

    if (assessmentError) {
      console.error('Failed to fetch assessment data:', assessmentError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch historical data' },
        { status: 500 }
      );
    }

    // Fetch growth lever data
    const { data: growthLevers, error: leverError } = await supabase
      .from('growth_levers')
      .select('name, category, impact_score, implementation_status, progress')
      .eq('organization_id', userProfile.organization_id);

    if (leverError) {
      console.error('Failed to fetch growth levers:', leverError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch growth data' },
        { status: 500 }
      );
    }

    // Fetch market intelligence data if requested
    let marketData;
    if (validatedData.includeMarketFactors) {
      const { data: marketTrends, error: marketError } = await supabase
        .from('realtime_market_trends')
        .select('trend_name, direction, magnitude, confidence, industry_relevance')
        .eq('industry', userProfile.industry)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (!marketError) {
        marketData = marketTrends;
      }
    }

    // Initialize Growth Planning Agent
    const growthAgent = new GrowthPlanningAgent();

    // Prepare data for AI analysis
    const analysisData = {
      organization: {
        id: userProfile.organization_id,
        industry: userProfile.industry,
        companySize: userProfile.company_size
      },
      historicalData: {
        assessments: assessments || [],
        growthLevers: growthLevers || [],
        marketTrends: marketData || []
      },
      projectionRequest: {
        timeframe: validatedData.timeframe,
        scenario: validatedData.scenario,
        customFactors: validatedData.customFactors || []
      }
    };

    // Generate growth projection using AI agent
    const projectionResult = await growthAgent.execute({
      type: 'growth_projection',
      data: analysisData,
      options: {
        includeMarketFactors: validatedData.includeMarketFactors,
        includeCompetitiveAnalysis: validatedData.includeCompetitiveAnalysis,
        includeRiskAssessment: validatedData.includeRiskAssessment
      }
    });

    if (!projectionResult.success) {
      console.error('Growth projection failed:', projectionResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to generate growth projection' },
        { status: 500 }
      );
    }

    // Process AI response and generate structured projection
    const projection = projectionResult.data;

    // Calculate monthly projections based on timeframe
    const monthlyProjections = generateMonthlyProjections(
      projection.summary.projectedGrowth,
      validatedData.timeframe,
      projection.summary.keyDrivers,
      projection.summary.majorRisks
    );

    // Generate scenario comparison
    const scenarioComparison = generateScenarioComparison(
      projection.summary.projectedGrowth,
      validatedData.scenario,
      userProfile.industry
    );

    // Process market factors if available
    let marketFactors;
    if (validatedData.includeMarketFactors && marketData) {
      marketFactors = processMarketFactors(marketData, userProfile.industry);
    }

    // Generate risk assessment
    let riskAssessment;
    if (validatedData.includeRiskAssessment) {
      riskAssessment = generateRiskAssessment(
        projection.summary.majorRisks,
        marketData,
        userProfile.industry
      );
    }

    // Generate actionable recommendations
    const recommendations = generateRecommendations(
      projection.summary.keyDrivers,
      projection.summary.majorRisks,
      growthLevers || [],
      validatedData.timeframe
    );

    const response = GrowthProjectionResponseSchema.parse({
      success: true,
      projection: {
        timeframe: validatedData.timeframe,
        scenario: validatedData.scenario,
        summary: projection.summary,
        monthlyProjections,
        scenarioComparison,
        marketFactors,
        riskAssessment,
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

    console.error('Growth projection error:', error);
    return NextResponse.json(
      { success: false, message: 'Growth projection failed' },
      { status: 500 }
    );
  }
}

// Helper functions for data processing
function generateMonthlyProjections(
  projectedGrowth: number,
  timeframe: string,
  keyDrivers: string[],
  majorRisks: string[]
): any[] {
  const months = getMonthsForTimeframe(timeframe);
  const baseGrowth = projectedGrowth / months.length;
  
  return months.map((month, index) => {
    // Apply growth curve (typically starts slower, accelerates)
    const growthMultiplier = 1 + (index / months.length) * 0.5;
    const monthlyGrowth = baseGrowth * growthMultiplier;
    
    // Apply risk factors
    const riskFactor = majorRisks.length > 0 ? 0.95 : 1.0;
    
    // Apply driver factors
    const driverFactor = keyDrivers.length > 0 ? 1.05 : 1.0;
    
    const finalGrowth = monthlyGrowth * riskFactor * driverFactor;
    
    return {
      month,
      projectedRevenue: Math.round(10000 * (1 + finalGrowth / 100) ** (index + 1)),
      projectedUsers: Math.round(100 * (1 + finalGrowth / 100) ** (index + 1)),
      projectedScore: Math.min(10, 7 + (finalGrowth / 10)),
      confidence: Math.max(0.6, 0.9 - (index * 0.02)),
      factors: keyDrivers.map(driver => ({
        name: driver,
        impact: 0.05,
        description: `Positive impact from ${driver}`
      }))
    };
  });
}

function generateScenarioComparison(
  projectedGrowth: number,
  currentScenario: string,
  industry: string
): any {
  const scenarios = {
    conservative: {
      projectedGrowth: projectedGrowth * 0.7,
      keyAssumptions: [
        'Market conditions remain stable',
        'Limited new competition',
        'Conservative resource allocation'
      ]
    },
    moderate: {
      projectedGrowth: projectedGrowth,
      keyAssumptions: [
        'Steady market growth',
        'Moderate competitive pressure',
        'Balanced resource allocation'
      ]
    },
    aggressive: {
      projectedGrowth: projectedGrowth * 1.4,
      keyAssumptions: [
        'Strong market expansion',
        'Innovation-driven growth',
        'Aggressive resource investment'
      ]
    }
  };

  return scenarios;
}

function processMarketFactors(marketData: any[], industry: string): any {
  const industryTrends = marketData.map(trend => ({
    trend: trend.trend_name,
    impact: trend.direction === 'up' ? 'positive' : 'negative',
    probability: trend.confidence / 100,
    description: `Market trend: ${trend.trend_name}`
  }));

  const competitiveLandscape = {
    threats: ['New market entrants', 'Price competition'],
    opportunities: ['Market expansion', 'Technology adoption'],
    marketShare: 15,
    competitiveAdvantage: ['Strong brand', 'Customer relationships']
  };

  const economicFactors = [
    {
      factor: 'Interest rates',
      impact: 0.1,
      trend: 'stable' as const
    },
    {
      factor: 'Economic growth',
      impact: 0.2,
      trend: 'improving' as const
    }
  ];

  return {
    industryTrends,
    competitiveLandscape,
    economicFactors
  };
}

function generateRiskAssessment(
  majorRisks: string[],
  marketData: any[],
  industry: string
): any {
  const highRiskFactors = majorRisks.slice(0, 2).map(risk => ({
    factor: risk,
    probability: 0.3,
    impact: 0.8,
    mitigation: `Develop contingency plan for ${risk}`
  }));

  const mediumRiskFactors = majorRisks.slice(2, 5).map(risk => ({
    factor: risk,
    probability: 0.2,
    impact: 0.5,
    mitigation: `Monitor and prepare for ${risk}`
  }));

  const overallRiskScore = (highRiskFactors.length * 0.8 + mediumRiskFactors.length * 0.5) / 10;
  const riskTrend = overallRiskScore > 0.6 ? 'increasing' : 'stable';

  return {
    highRiskFactors,
    mediumRiskFactors,
    overallRiskScore: Math.round(overallRiskScore * 100) / 100,
    riskTrend
  };
}

function generateRecommendations(
  keyDrivers: string[],
  majorRisks: string[],
  growthLevers: any[],
  timeframe: string
): any[] {
  const recommendations = [];

  // High priority: Address major risks
  majorRisks.slice(0, 2).forEach(risk => {
    recommendations.push({
      priority: 'high' as const,
      category: 'Risk Management',
      action: `Develop mitigation strategy for ${risk}`,
      expectedImpact: 0.8,
      timeline: '30 days',
      resources: ['Risk assessment team', 'External consultants'],
      successMetrics: ['Risk score reduction', 'Contingency plan completion']
    });
  });

  // Medium priority: Leverage key drivers
  keyDrivers.slice(0, 3).forEach(driver => {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Growth Optimization',
      action: `Maximize impact of ${driver}`,
      expectedImpact: 0.6,
      timeline: '60 days',
      resources: ['Growth team', 'Analytics tools'],
      successMetrics: ['Growth rate improvement', 'Driver effectiveness']
    });
  });

  // Low priority: Optimize existing levers
  growthLevers.slice(0, 2).forEach(lever => {
    recommendations.push({
      priority: 'low' as const,
      category: 'Process Improvement',
      action: `Optimize ${lever.name} implementation`,
      expectedImpact: 0.3,
      timeline: '90 days',
      resources: ['Process team', 'Training materials'],
      successMetrics: ['Efficiency improvement', 'Cost reduction']
    });
  });

  return recommendations;
}

function getMonthsForTimeframe(timeframe: string): string[] {
  const months = [];
  const now = new Date();
  
  let count = 0;
  switch (timeframe) {
    case '30days':
      count = 1;
      break;
    case '90days':
      count = 3;
      break;
    case '6months':
      count = 6;
      break;
    case '1year':
      count = 12;
      break;
    case '2years':
      count = 24;
      break;
    default:
      count = 12;
  }

  for (let i = 1; i <= count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }

  return months;
}
