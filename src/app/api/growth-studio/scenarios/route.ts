import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GrowthPlanningAgent } from '@/lib/ai/agents/growth-planning-agent';
import { z } from 'zod';

const scenarioRequestSchema = z.object({
  userId: z.string().uuid(),
  scenarioType: z.enum(['optimistic', 'realistic', 'pessimistic', 'custom']).optional(),
  timeHorizon: z.enum(['3months', '6months', '1year', '2years']).default('1year'),
  includeRoadmap: z.boolean().default(true),
  includeResourceAllocation: z.boolean().default(true)
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
      userId: searchParams.get('userId') || user.id,
      scenarioType: searchParams.get('scenarioType'),
      timeHorizon: searchParams.get('timeHorizon') || '1year',
      includeRoadmap: searchParams.get('includeRoadmap') === 'true',
      includeResourceAllocation: searchParams.get('includeResourceAllocation') === 'true'
    };

    const validatedQuery = scenarioRequestSchema.parse(queryData);

    // Get user profile and current state
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get user's current growth levers
    const { data: currentLevers } = await supabase
      .from('growth_levers')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .eq('status', 'active');

    // Get existing scenarios
    const { data: existingScenarios } = await supabase
      .from('scenarios')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .order('created_at', { ascending: false });

    // Generate new scenarios if requested
    let newScenarios = [];
    if (validatedQuery.scenarioType) {
      const growthPlanningAgent = new GrowthPlanningAgent();
      
      const scenarioData = await growthPlanningAgent.generateScenarios({
        userProfile: profile,
        currentLevers: currentLevers || [],
        scenarioType: validatedQuery.scenarioType,
        timeHorizon: validatedQuery.timeHorizon,
        includeRoadmap: validatedQuery.includeRoadmap,
        includeResourceAllocation: validatedQuery.includeResourceAllocation
      });

      newScenarios = scenarioData.scenarios || [];
    }

    // Combine existing and new scenarios
    const allScenarios = [...(existingScenarios || []), ...newScenarios];

    // Calculate scenario comparisons
    const scenarioComparisons = calculateScenarioComparisons(allScenarios);

    // Get scenario recommendations
    const recommendations = await generateScenarioRecommendations(
      allScenarios,
      profile,
      currentLevers || []
    );

    return NextResponse.json({
      scenarios: allScenarios,
      comparisons: scenarioComparisons,
      recommendations,
      summary: {
        totalScenarios: allScenarios.length,
        byType: allScenarios.reduce((acc, scenario) => {
          acc[scenario.scenario_type] = (acc[scenario.scenario_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageRevenue: allScenarios.reduce((sum, s) => sum + (s.expected_revenue || 0), 0) / allScenarios.length,
        averageGrowth: allScenarios.reduce((sum, s) => sum + (s.growth_rate || 0), 0) / allScenarios.length
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scenario planning API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateScenarioComparisons(scenarios: any[]) {
  if (scenarios.length < 2) {
    return null;
  }

  const comparisons = {
    revenue: {
      min: Math.min(...scenarios.map(s => s.expected_revenue || 0)),
      max: Math.max(...scenarios.map(s => s.expected_revenue || 0)),
      range: Math.max(...scenarios.map(s => s.expected_revenue || 0)) - Math.min(...scenarios.map(s => s.expected_revenue || 0)),
      variance: calculateVariance(scenarios.map(s => s.expected_revenue || 0))
    },
    growth: {
      min: Math.min(...scenarios.map(s => s.growth_rate || 0)),
      max: Math.max(...scenarios.map(s => s.growth_rate || 0)),
      range: Math.max(...scenarios.map(s => s.growth_rate || 0)) - Math.min(...scenarios.map(s => s.growth_rate || 0)),
      variance: calculateVariance(scenarios.map(s => s.growth_rate || 0))
    },
    risk: {
      lowRisk: scenarios.filter(s => s.risk_level === 'low').length,
      mediumRisk: scenarios.filter(s => s.risk_level === 'medium').length,
      highRisk: scenarios.filter(s => s.risk_level === 'high').length
    },
    resourceRequirements: {
      low: scenarios.filter(s => s.resource_intensity === 'low').length,
      medium: scenarios.filter(s => s.resource_intensity === 'medium').length,
      high: scenarios.filter(s => s.resource_intensity === 'high').length
    }
  };

  return comparisons;
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
}

async function generateScenarioRecommendations(scenarios: any[], profile: any, currentLevers: any[]) {
  const recommendations = [];

  // Analyze scenario distribution
  const scenarioTypes = scenarios.map(s => s.scenario_type);
  const typeCounts = scenarioTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recommend missing scenario types
  const allTypes = ['optimistic', 'realistic', 'pessimistic'];
  const missingTypes = allTypes.filter(type => !typeCounts[type] || typeCounts[type] < 1);

  missingTypes.forEach(type => {
    recommendations.push({
      type: 'missing_scenario',
      title: `Generate ${type} scenario`,
      description: `Create a ${type} scenario to complete your planning framework`,
      priority: 'medium',
      scenarioType: type
    });
  });

  // Analyze risk distribution
  const highRiskScenarios = scenarios.filter(s => s.risk_level === 'high');
  if (highRiskScenarios.length > scenarios.length * 0.5) {
    recommendations.push({
      type: 'risk_balance',
      title: 'Balance Risk Profile',
      description: 'Consider adding more conservative scenarios to balance your risk profile',
      priority: 'high',
      action: 'add_conservative_scenarios'
    });
  }

  // Check resource alignment
  const highResourceScenarios = scenarios.filter(s => s.resource_intensity === 'high');
  if (highResourceScenarios.length > 0) {
    recommendations.push({
      type: 'resource_planning',
      title: 'Resource Planning Review',
      description: 'Review resource requirements for high-intensity scenarios',
      priority: 'medium',
      action: 'review_resources'
    });
  }

  // Growth lever alignment
  if (currentLevers.length === 0) {
    recommendations.push({
      type: 'growth_levers',
      title: 'Define Growth Levers',
      description: 'Define specific growth levers before creating detailed scenarios',
      priority: 'high',
      action: 'define_levers'
    });
  }

  return recommendations;
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
    const { action, scenarioData } = body;

    switch (action) {
      case 'create_scenario':
        // Create a new scenario
        const { data: newScenario, error: createError } = await supabase
          .from('scenarios')
          .insert({
            user_id: user.id,
            name: scenarioData.name,
            description: scenarioData.description,
            scenario_type: scenarioData.scenarioType,
            time_horizon: scenarioData.timeHorizon,
            expected_revenue: scenarioData.expectedRevenue,
            growth_rate: scenarioData.growthRate,
            risk_level: scenarioData.riskLevel,
            resource_intensity: scenarioData.resourceIntensity,
            assumptions: scenarioData.assumptions,
            roadmap: scenarioData.roadmap,
            resource_allocation: scenarioData.resourceAllocation,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating scenario:', createError);
          return NextResponse.json({ error: 'Failed to create scenario' }, { status: 500 });
        }

        return NextResponse.json({ 
          message: 'Scenario created successfully',
          scenario: newScenario 
        });

      case 'update_scenario':
        // Update an existing scenario
        const { error: updateError } = await supabase
          .from('scenarios')
          .update({
            name: scenarioData.name,
            description: scenarioData.description,
            expected_revenue: scenarioData.expectedRevenue,
            growth_rate: scenarioData.growthRate,
            risk_level: scenarioData.riskLevel,
            resource_intensity: scenarioData.resourceIntensity,
            assumptions: scenarioData.assumptions,
            roadmap: scenarioData.roadmap,
            resource_allocation: scenarioData.resourceAllocation,
            updated_at: new Date().toISOString()
          })
          .eq('id', scenarioData.id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating scenario:', updateError);
          return NextResponse.json({ error: 'Failed to update scenario' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Scenario updated successfully' });

      case 'delete_scenario':
        // Delete a scenario
        const { error: deleteError } = await supabase
          .from('scenarios')
          .delete()
          .eq('id', scenarioData.id)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting scenario:', deleteError);
          return NextResponse.json({ error: 'Failed to delete scenario' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Scenario deleted successfully' });

      case 'set_primary_scenario':
        // Set a scenario as primary
        const { error: primaryError } = await supabase
          .from('scenarios')
          .update({ is_primary: false })
          .eq('user_id', user.id);

        if (primaryError) {
          console.error('Error resetting primary scenarios:', primaryError);
          return NextResponse.json({ error: 'Failed to reset primary scenarios' }, { status: 500 });
        }

        const { error: setPrimaryError } = await supabase
          .from('scenarios')
          .update({ is_primary: true })
          .eq('id', scenarioData.id)
          .eq('user_id', user.id);

        if (setPrimaryError) {
          console.error('Error setting primary scenario:', setPrimaryError);
          return NextResponse.json({ error: 'Failed to set primary scenario' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Primary scenario set successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Scenario action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

