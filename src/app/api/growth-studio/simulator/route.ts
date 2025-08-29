/**
 * Growth Simulator API
 * Provides interactive growth scenario modeling and impact simulation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { GrowthPlanningAgent } from '@/lib/ai/agents/growth-planning-agent';

// Request schema
const GrowthSimulatorSchema = z.object({
  scenario: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    timeframe: z.enum(['30days', '90days', '6months', '1year', '2years']).default('1year'),
    levers: z.array(z.object({
      leverId: z.string().uuid(),
      action: z.enum(['activate', 'deactivate', 'modify']),
      modifications: z.object({
        investment: z.number().min(0).optional(),
        timeline: z.number().min(1).optional(),
        teamSize: z.number().min(1).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        riskLevel: z.enum(['low', 'medium', 'high']).optional()
      }).optional()
    })),
    marketConditions: z.object({
      economicGrowth: z.enum(['recession', 'stable', 'growth']).default('stable'),
      competitivePressure: z.enum(['low', 'medium', 'high']).default('medium'),
      marketSize: z.enum(['declining', 'stable', 'expanding']).default('stable'),
      regulatoryEnvironment: z.enum(['favorable', 'neutral', 'challenging']).default('neutral')
    }).optional(),
    customFactors: z.array(z.object({
      name: z.string(),
      impact: z.enum(['positive', 'negative', 'neutral']),
      magnitude: z.number().min(0).max(10),
      probability: z.number().min(0).max(1)
    })).optional()
  }),
  includeDetailedAnalysis: z.boolean().default(true),
  includeRiskAssessment: z.boolean().default(true),
  includeResourceRequirements: z.boolean().default(true)
});

// Response schema
const GrowthSimulatorResponseSchema = z.object({
  success: z.boolean(),
  simulation: z.object({
    scenario: z.object({
      name: z.string(),
      description: z.string().optional(),
      timeframe: z.string(),
      totalInvestment: z.number(),
      expectedROI: z.number(),
      riskScore: z.number(),
      confidence: z.number()
    }),
    projections: z.object({
      revenue: z.object({
        baseline: z.number(),
        projected: z.number(),
        growth: z.number(),
        monthly: z.array(z.object({
          month: z.string(),
          revenue: z.number(),
          growth: z.number()
        }))
      }),
      users: z.object({
        baseline: z.number(),
        projected: z.number(),
        growth: z.number(),
        monthly: z.array(z.object({
          month: z.string(),
          users: z.number(),
          growth: z.number()
        }))
      }),
      marketShare: z.object({
        baseline: z.number(),
        projected: z.number(),
        growth: z.number()
      }),
      profitability: z.object({
        baseline: z.number(),
        projected: z.number(),
        improvement: z.number()
      })
    }),
    leverAnalysis: z.array(z.object({
      leverId: z.string(),
      name: z.string(),
      category: z.string(),
      impact: z.object({
        revenue: z.number(),
        users: z.number(),
        marketShare: z.number(),
        profitability: z.number(),
        timeline: z.number()
      }),
      investment: z.number(),
      risk: z.enum(['low', 'medium', 'high']),
      confidence: z.number(),
      dependencies: z.array(z.string()),
      blockers: z.array(z.string())
    })),
    riskAssessment: z.object({
      overallRisk: z.number(),
      riskFactors: z.array(z.object({
        factor: z.string(),
        probability: z.number(),
        impact: z.number(),
        mitigation: z.string(),
        cost: z.number()
      })),
      riskCategories: z.object({
        operational: z.number(),
        financial: z.number(),
        market: z.number(),
        competitive: z.number(),
        regulatory: z.number()
      })
    }).optional(),
    resourceRequirements: z.object({
      financial: z.object({
        totalInvestment: z.number(),
        breakdown: z.record(z.number()),
        fundingSources: z.array(z.object({
          source: z.string(),
          amount: z.number(),
          terms: z.string()
        }))
      }),
      human: z.object({
        totalFTE: z.number(),
        breakdown: z.record(z.number()),
        skills: z.array(z.object({
          skill: z.string(),
          level: z.enum(['entry', 'mid', 'senior', 'expert']),
          quantity: z.number(),
          availability: z.enum(['readily_available', 'moderate', 'scarce'])
        }))
      }),
      technology: z.object({
        infrastructure: z.array(z.object({
          component: z.string(),
          cost: z.number(),
          timeline: z.number()
        })),
        software: z.array(z.object({
          tool: z.string(),
          cost: z.number(),
          subscription: z.boolean()
        }))
      })
    }).optional(),
    sensitivityAnalysis: z.object({
      bestCase: z.object({
        revenue: z.number(),
        users: z.number(),
        roi: z.number(),
        probability: z.number()
      }),
      worstCase: z.object({
        revenue: z.number(),
        users: z.number(),
        roi: z.number(),
        probability: z.number()
      }),
      mostLikely: z.object({
        revenue: z.number(),
        users: z.number(),
        roi: z.number(),
        probability: z.number()
      })
    }),
    recommendations: z.array(z.object({
      priority: z.enum(['critical', 'high', 'medium', 'low']),
      category: z.string(),
      action: z.string(),
      impact: z.number(),
      effort: z.enum(['low', 'medium', 'high']),
      timeline: z.string(),
      dependencies: z.array(z.string()),
      successMetrics: z.array(z.string())
    })),
    timeline: z.object({
      phases: z.array(z.object({
        phase: z.string(),
        duration: z.number(),
        milestones: z.array(z.object({
          name: z.string(),
          date: z.string(),
          status: z.enum(['pending', 'in_progress', 'completed']),
          dependencies: z.array(z.string>)
        })),
        deliverables: z.array(z.string()),
        resources: z.array(z.string>)
      })),
      criticalPath: z.array(z.string()),
      totalDuration: z.number()
    })
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GrowthSimulatorSchema.parse(body);

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

    // Get user's organization
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

    // Fetch current growth levers
    const { data: currentLevers, error: leverError } = await supabase
      .from('growth_levers')
      .select('id, name, category, impact_score, implementation_status, progress, investment, timeline')
      .eq('organization_id', userProfile.organization_id);

    if (leverError) {
      console.error('Failed to fetch growth levers:', leverError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch growth levers' },
        { status: 500 }
      );
    }

    // Fetch historical performance data
    const { data: assessments, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .select('score, completed_at')
      .eq('organization_id', userProfile.organization_id)
      .order('completed_at', { ascending: false })
      .limit(10);

    if (assessmentError) {
      console.error('Failed to fetch assessment data:', assessmentError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch historical data' },
        { status: 500 }
      );
    }

    // Initialize Growth Planning Agent
    const growthAgent = new GrowthPlanningAgent();

    // Prepare simulation data
    const simulationData = {
      organization: {
        id: userProfile.organization_id,
        industry: userProfile.industry,
        companySize: userProfile.company_size
      },
      currentState: {
        levers: currentLevers || [],
        assessments: assessments || [],
        baselineMetrics: calculateBaselineMetrics(assessments || [], currentLevers || [])
      },
      scenario: validatedData.scenario
    };

    // Run simulation using AI agent
    const simulationResult = await growthAgent.execute({
      type: 'growth_simulation',
      data: simulationData,
      options: {
        includeDetailedAnalysis: validatedData.includeDetailedAnalysis,
        includeRiskAssessment: validatedData.includeRiskAssessment,
        includeResourceRequirements: validatedData.includeResourceRequirements
      }
    });

    if (!simulationResult.success) {
      console.error('Growth simulation failed:', simulationResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to run growth simulation' },
        { status: 500 }
      );
    }

    // Process simulation results
    const simulation = simulationResult.data;

    // Calculate projections
    const projections = calculateProjections(
      simulation.baselineMetrics,
      validatedData.scenario,
      currentLevers || [],
      validatedData.scenario.levers
    );

    // Analyze lever impacts
    const leverAnalysis = analyzeLeverImpacts(
      validatedData.scenario.levers,
      currentLevers || [],
      projections
    );

    // Calculate resource requirements
    let resourceRequirements;
    if (validatedData.includeResourceRequirements) {
      resourceRequirements = calculateResourceRequirements(
        validatedData.scenario.levers,
        validatedData.scenario.timeframe,
        userProfile.company_size
      );
    }

    // Generate risk assessment
    let riskAssessment;
    if (validatedData.includeRiskAssessment) {
      riskAssessment = generateRiskAssessment(
        validatedData.scenario,
        leverAnalysis,
        userProfile.industry
      );
    }

    // Generate sensitivity analysis
    const sensitivityAnalysis = generateSensitivityAnalysis(projections, validatedData.scenario);

    // Generate recommendations
    const recommendations = generateSimulationRecommendations(
      leverAnalysis,
      riskAssessment,
      projections
    );

    // Generate timeline
    const timeline = generateSimulationTimeline(
      validatedData.scenario.levers,
      validatedData.scenario.timeframe
    );

    // Calculate overall metrics
    const totalInvestment = leverAnalysis.reduce((sum, lever) => sum + lever.investment, 0);
    const expectedROI = calculateROI(projections.revenue.projected, projections.revenue.baseline, totalInvestment);
    const riskScore = riskAssessment ? riskAssessment.overallRisk : 0.5;
    const confidence = calculateConfidence(leverAnalysis, riskAssessment);

    const response = GrowthSimulatorResponseSchema.parse({
      success: true,
      simulation: {
        scenario: {
          name: validatedData.scenario.name,
          description: validatedData.scenario.description,
          timeframe: validatedData.scenario.timeframe,
          totalInvestment,
          expectedROI,
          riskScore,
          confidence
        },
        projections,
        leverAnalysis,
        riskAssessment,
        resourceRequirements,
        sensitivityAnalysis,
        recommendations,
        timeline
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

    console.error('Growth simulation error:', error);
    return NextResponse.json(
      { success: false, message: 'Growth simulation failed' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateBaselineMetrics(assessments: any[], levers: any[]): any {
  const averageScore = assessments.length > 0 ? 
    assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length : 7.0;
  
  const activeLevers = levers.filter(l => l.implementation_status === 'active').length;
  const totalInvestment = levers.reduce((sum, l) => sum + (l.investment || 0), 0);
  
  return {
    revenue: 100000, // Mock baseline revenue
    users: 100, // Mock baseline users
    marketShare: 5, // Mock baseline market share
    profitability: 15, // Mock baseline profitability percentage
    assessmentScore: averageScore,
    activeLevers,
    totalInvestment
  };
}

function calculateProjections(baseline: any, scenario: any, currentLevers: any[], scenarioLevers: any[]): any {
  const months = getMonthsForTimeframe(scenario.timeframe);
  const baseGrowth = 0.05; // 5% base growth
  
  // Calculate lever impacts
  const leverImpacts = scenarioLevers.map(lever => {
    const currentLever = currentLevers.find(cl => cl.id === lever.leverId);
    const baseImpact = currentLever?.impact_score || 0.5;
    
    let multiplier = 1.0;
    if (lever.action === 'activate') multiplier = 1.2;
    else if (lever.action === 'deactivate') multiplier = 0.8;
    else if (lever.action === 'modify') multiplier = 1.1;
    
    return {
      revenue: baseImpact * multiplier * 0.1,
      users: baseImpact * multiplier * 0.15,
      marketShare: baseImpact * multiplier * 0.05,
      profitability: baseImpact * multiplier * 0.08
    };
  });
  
  // Aggregate impacts
  const totalImpact = leverImpacts.reduce((sum, impact) => ({
    revenue: sum.revenue + impact.revenue,
    users: sum.users + impact.users,
    marketShare: sum.marketShare + impact.marketShare,
    profitability: sum.profitability + impact.profitability
  }), { revenue: 0, users: 0, marketShare: 0, profitability: 0 });
  
  // Apply market conditions
  const marketMultiplier = getMarketMultiplier(scenario.marketConditions);
  
  // Generate monthly projections
  const monthlyRevenue = months.map((month, index) => {
    const growthRate = baseGrowth + totalImpact.revenue + (index * 0.01);
    const revenue = baseline.revenue * Math.pow(1 + growthRate * marketMultiplier, index + 1);
    return {
      month,
      revenue: Math.round(revenue),
      growth: Math.round((growthRate * 100) * 10) / 10
    };
  });
  
  const monthlyUsers = months.map((month, index) => {
    const growthRate = baseGrowth + totalImpact.users + (index * 0.015);
    const users = baseline.users * Math.pow(1 + growthRate * marketMultiplier, index + 1);
    return {
      month,
      users: Math.round(users),
      growth: Math.round((growthRate * 100) * 10) / 10
    };
  });
  
  const projectedRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || baseline.revenue;
  const projectedUsers = monthlyUsers[monthlyUsers.length - 1]?.users || baseline.users;
  const projectedMarketShare = baseline.marketShare * (1 + totalImpact.marketShare * marketMultiplier);
  const projectedProfitability = baseline.profitability * (1 + totalImpact.profitability * marketMultiplier);
  
  return {
    revenue: {
      baseline: baseline.revenue,
      projected: projectedRevenue,
      growth: ((projectedRevenue - baseline.revenue) / baseline.revenue) * 100,
      monthly: monthlyRevenue
    },
    users: {
      baseline: baseline.users,
      projected: projectedUsers,
      growth: ((projectedUsers - baseline.users) / baseline.users) * 100,
      monthly: monthlyUsers
    },
    marketShare: {
      baseline: baseline.marketShare,
      projected: projectedMarketShare,
      growth: ((projectedMarketShare - baseline.marketShare) / baseline.marketShare) * 100
    },
    profitability: {
      baseline: baseline.profitability,
      projected: projectedProfitability,
      improvement: ((projectedProfitability - baseline.profitability) / baseline.profitability) * 100
    }
  };
}

function analyzeLeverImpacts(scenarioLevers: any[], currentLevers: any[], projections: any): any[] {
  return scenarioLevers.map(lever => {
    const currentLever = currentLevers.find(cl => cl.id === lever.leverId);
    const baseImpact = currentLever?.impact_score || 0.5;
    
    let multiplier = 1.0;
    let investment = currentLever?.investment || 10000;
    
    if (lever.action === 'activate') {
      multiplier = 1.2;
      investment = 15000;
    } else if (lever.action === 'deactivate') {
      multiplier = 0.8;
      investment = 0;
    } else if (lever.action === 'modify') {
      multiplier = 1.1;
      investment = 12000;
    }
    
    // Apply modifications if specified
    if (lever.modifications) {
      if (lever.modifications.investment) investment = lever.modifications.investment;
      if (lever.modifications.priority === 'high') multiplier *= 1.2;
      if (lever.modifications.riskLevel === 'high') multiplier *= 0.9;
    }
    
    const impact = {
      revenue: baseImpact * multiplier * 0.1,
      users: baseImpact * multiplier * 0.15,
      marketShare: baseImpact * multiplier * 0.05,
      profitability: baseImpact * multiplier * 0.08,
      timeline: lever.modifications?.timeline || 6
    };
    
    const risk = lever.modifications?.riskLevel || 'medium';
    const confidence = 0.7 + (Math.random() * 0.2); // Mock confidence calculation
    
    return {
      leverId: lever.leverId,
      name: currentLever?.name || 'Unknown Lever',
      category: currentLever?.category || 'General',
      impact,
      investment,
      risk,
      confidence: Math.round(confidence * 100) / 100,
      dependencies: [], // Mock dependencies
      blockers: [] // Mock blockers
    };
  });
}

function calculateResourceRequirements(scenarioLevers: any[], timeframe: string, companySize: string): any {
  const totalInvestment = scenarioLevers.reduce((sum, lever) => {
    const baseInvestment = 10000;
    let multiplier = 1.0;
    
    if (lever.action === 'activate') multiplier = 1.5;
    else if (lever.action === 'modify') multiplier = 1.2;
    
    return sum + (baseInvestment * multiplier);
  }, 0);
  
  const fteRequirements = scenarioLevers.length * 0.5; // Mock FTE calculation
  
  return {
    financial: {
      totalInvestment,
      breakdown: {
        'Technology Infrastructure': totalInvestment * 0.4,
        'Marketing & Sales': totalInvestment * 0.3,
        'Operations': totalInvestment * 0.2,
        'Training & Development': totalInvestment * 0.1
      },
      fundingSources: [
        { source: 'Internal Budget', amount: totalInvestment * 0.6, terms: 'Immediate' },
        { source: 'External Funding', amount: totalInvestment * 0.4, terms: '3-6 months' }
      ]
    },
    human: {
      totalFTE: Math.ceil(fteRequirements),
      breakdown: {
        'Product Development': Math.ceil(fteRequirements * 0.4),
        'Sales & Marketing': Math.ceil(fteRequirements * 0.3),
        'Operations': Math.ceil(fteRequirements * 0.2),
        'Support': Math.ceil(fteRequirements * 0.1)
      },
      skills: [
        { skill: 'Project Management', level: 'senior', quantity: 1, availability: 'moderate' },
        { skill: 'Data Analysis', level: 'mid', quantity: 2, availability: 'readily_available' },
        { skill: 'Sales', level: 'mid', quantity: 1, availability: 'moderate' }
      ]
    },
    technology: {
      infrastructure: [
        { component: 'Cloud Services', cost: totalInvestment * 0.2, timeline: 1 },
        { component: 'Analytics Platform', cost: totalInvestment * 0.15, timeline: 2 },
        { component: 'CRM System', cost: totalInvestment * 0.1, timeline: 1 }
      ],
      software: [
        { tool: 'Analytics Suite', cost: 5000, subscription: true },
        { tool: 'Project Management', cost: 3000, subscription: true },
        { tool: 'Communication Tools', cost: 2000, subscription: true }
      ]
    }
  };
}

function generateRiskAssessment(scenario: any, leverAnalysis: any[], industry: string): any {
  const riskFactors = [];
  
  // Lever-specific risks
  leverAnalysis.forEach(lever => {
    if (lever.risk === 'high') {
      riskFactors.push({
        factor: `High risk in ${lever.name}`,
        probability: 0.3,
        impact: 0.8,
        mitigation: `Implement risk mitigation plan for ${lever.name}`,
        cost: lever.investment * 0.2
      });
    }
  });
  
  // Market condition risks
  if (scenario.marketConditions?.competitivePressure === 'high') {
    riskFactors.push({
      factor: 'High competitive pressure',
      probability: 0.4,
      impact: 0.6,
      mitigation: 'Strengthen competitive positioning and differentiation',
      cost: 20000
    });
  }
  
  if (scenario.marketConditions?.economicGrowth === 'recession') {
    riskFactors.push({
      factor: 'Economic recession',
      probability: 0.2,
      impact: 0.9,
      mitigation: 'Focus on cost optimization and cash flow management',
      cost: 15000
    });
  }
  
  // Calculate overall risk
  const overallRisk = riskFactors.length > 0 ? 
    riskFactors.reduce((sum, factor) => sum + (factor.probability * factor.impact), 0) / riskFactors.length : 0.3;
  
  return {
    overallRisk: Math.round(overallRisk * 100) / 100,
    riskFactors,
    riskCategories: {
      operational: 0.4,
      financial: 0.3,
      market: 0.5,
      competitive: 0.6,
      regulatory: 0.2
    }
  };
}

function generateSensitivityAnalysis(projections: any, scenario: any): any {
  const baseRevenue = projections.revenue.projected;
  const baseUsers = projections.users.projected;
  const baseROI = calculateROI(baseRevenue, projections.revenue.baseline, 100000);
  
  return {
    bestCase: {
      revenue: Math.round(baseRevenue * 1.3),
      users: Math.round(baseUsers * 1.25),
      roi: Math.round(baseROI * 1.4 * 100) / 100,
      probability: 0.2
    },
    worstCase: {
      revenue: Math.round(baseRevenue * 0.7),
      users: Math.round(baseUsers * 0.75),
      roi: Math.round(baseROI * 0.6 * 100) / 100,
      probability: 0.2
    },
    mostLikely: {
      revenue: baseRevenue,
      users: baseUsers,
      roi: baseROI,
      probability: 0.6
    }
  };
}

function generateSimulationRecommendations(leverAnalysis: any[], riskAssessment: any, projections: any): any[] {
  const recommendations = [];
  
  // High-impact levers
  leverAnalysis
    .sort((a, b) => b.impact.revenue - a.impact.revenue)
    .slice(0, 3)
    .forEach(lever => {
      recommendations.push({
        priority: 'high' as const,
        category: 'Growth Optimization',
        action: `Prioritize implementation of ${lever.name}`,
        impact: lever.impact.revenue,
        effort: 'medium' as const,
        timeline: `${lever.impact.timeline} months`,
        dependencies: lever.dependencies,
        successMetrics: [`${lever.impact.revenue * 100}% revenue growth`, 'Market share increase']
      });
    });
  
  // Risk mitigation
  if (riskAssessment && riskAssessment.overallRisk > 0.6) {
    recommendations.push({
      priority: 'critical' as const,
      category: 'Risk Management',
      action: 'Implement comprehensive risk mitigation strategy',
      impact: 0.8,
      effort: 'high' as const,
      timeline: '3 months',
      dependencies: ['Risk assessment team', 'External consultants'],
      successMetrics: ['Risk score reduction', 'Contingency plan completion']
    });
  }
  
  return recommendations;
}

function generateSimulationTimeline(scenarioLevers: any[], timeframe: string): any {
  const months = getMonthsForTimeframe(timeframe);
  const phases = [
    {
      phase: 'Planning & Setup',
      duration: 1,
      milestones: [
        { name: 'Project kickoff', date: months[0], status: 'pending' as const, dependencies: [] },
        { name: 'Resource allocation', date: months[0], status: 'pending' as const, dependencies: ['Project kickoff'] }
      ],
      deliverables: ['Project plan', 'Resource allocation plan'],
      resources: ['Project Manager', 'Stakeholders']
    },
    {
      phase: 'Implementation',
      duration: Math.max(1, months.length - 2),
      milestones: scenarioLevers.map((lever, index) => ({
        name: `Implement ${lever.leverId}`,
        date: months[Math.min(index + 1, months.length - 1)],
        status: 'pending' as const,
        dependencies: index === 0 ? ['Resource allocation'] : [`Implement ${scenarioLevers[index - 1].leverId}`]
      })),
      deliverables: ['Lever implementations', 'Progress reports'],
      resources: ['Implementation team', 'Technical resources']
    },
    {
      phase: 'Optimization',
      duration: 1,
      milestones: [
        { name: 'Performance review', date: months[months.length - 1], status: 'pending' as const, dependencies: scenarioLevers.map(l => `Implement ${l.leverId}`) },
        { name: 'Adjustments', date: months[months.length - 1], status: 'pending' as const, dependencies: ['Performance review'] }
      ],
      deliverables: ['Performance report', 'Optimization recommendations'],
      resources: ['Analytics team', 'Management']
    }
  ];
  
  return {
    phases,
    criticalPath: ['Project kickoff', 'Resource allocation', ...scenarioLevers.map(l => `Implement ${l.leverId}`), 'Performance review'],
    totalDuration: months.length
  };
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

function getMarketMultiplier(marketConditions: any): number {
  if (!marketConditions) return 1.0;
  
  let multiplier = 1.0;
  
  if (marketConditions.economicGrowth === 'growth') multiplier *= 1.2;
  else if (marketConditions.economicGrowth === 'recession') multiplier *= 0.8;
  
  if (marketConditions.competitivePressure === 'low') multiplier *= 1.1;
  else if (marketConditions.competitivePressure === 'high') multiplier *= 0.9;
  
  if (marketConditions.marketSize === 'expanding') multiplier *= 1.15;
  else if (marketConditions.marketSize === 'declining') multiplier *= 0.85;
  
  if (marketConditions.regulatoryEnvironment === 'favorable') multiplier *= 1.1;
  else if (marketConditions.regulatoryEnvironment === 'challenging') multiplier *= 0.9;
  
  return multiplier;
}

function calculateROI(projectedRevenue: number, baselineRevenue: number, investment: number): number {
  const additionalRevenue = projectedRevenue - baselineRevenue;
  return investment > 0 ? (additionalRevenue / investment) * 100 : 0;
}

function calculateConfidence(leverAnalysis: any[], riskAssessment: any): number {
  const leverConfidence = leverAnalysis.reduce((sum, lever) => sum + lever.confidence, 0) / leverAnalysis.length;
  const riskFactor = riskAssessment ? (1 - riskAssessment.overallRisk) : 0.7;
  
  return Math.round((leverConfidence * 0.7 + riskFactor * 0.3) * 100) / 100;
}
