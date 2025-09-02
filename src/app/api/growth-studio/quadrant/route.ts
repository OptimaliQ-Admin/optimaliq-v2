import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const quadrantRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
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
      userId: searchParams.get('userId') || user.id,
      industry: searchParams.get('industry'),
      companySize: searchParams.get('companySize'),
      includeRecommendations: searchParams.get('includeRecommendations') === 'true'
    };

    const validatedQuery = quadrantRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get growth quadrant data
    const { data: quadrantData, error: quadrantError } = await supabase
      .from('growth_quadrant_data')
      .select('*')
      .eq('industry', validatedQuery.industry || profile?.industry || 'general')
      .eq('company_size', validatedQuery.companySize || profile?.company_size || 'general');

    if (quadrantError) {
      console.error('Error fetching quadrant data:', quadrantError);
      return NextResponse.json({ error: 'Failed to fetch quadrant data' }, { status: 500 });
    }

    // Get user's current growth levers
    const { data: userLevers } = await supabase
      .from('growth_levers')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .order('created_at', { ascending: false });

    // Calculate user's position in each quadrant
    const userQuadrantPosition = calculateUserQuadrantPosition(userLevers || [], quadrantData || []);

    // Get recommendations for each quadrant
    const recommendations = validatedQuery.includeRecommendations 
      ? await generateQuadrantRecommendations(userQuadrantPosition, profile)
      : null;

    // Get industry benchmarks for quadrants
    const industryBenchmarks = await getIndustryQuadrantBenchmarks(
      validatedQuery.industry || profile?.industry,
      validatedQuery.companySize || profile?.company_size
    );

    return NextResponse.json({
      quadrants: {
        highImpact: {
          name: 'High Impact, Low Effort',
          description: 'Quick wins that can drive significant growth',
          levers: quadrantData?.filter(q => q.quadrant === 'high_impact') || [],
          userPosition: userQuadrantPosition.highImpact,
          recommendations: recommendations?.highImpact || []
        },
        strategic: {
          name: 'High Impact, High Effort',
          description: 'Strategic initiatives requiring significant investment',
          levers: quadrantData?.filter(q => q.quadrant === 'strategic') || [],
          userPosition: userQuadrantPosition.strategic,
          recommendations: recommendations?.strategic || []
        },
        optimization: {
          name: 'Low Impact, Low Effort',
          description: 'Optimization opportunities for efficiency gains',
          levers: quadrantData?.filter(q => q.quadrant === 'optimization') || [],
          userPosition: userQuadrantPosition.optimization,
          recommendations: recommendations?.optimization || []
        },
        avoid: {
          name: 'Low Impact, High Effort',
          description: 'Areas to avoid or deprioritize',
          levers: quadrantData?.filter(q => q.quadrant === 'avoid') || [],
          userPosition: userQuadrantPosition.avoid,
          recommendations: recommendations?.avoid || []
        }
      },
      userLevers: userLevers || [],
      industryBenchmarks,
      summary: {
        totalLevers: userLevers?.length || 0,
        activeLevers: userLevers?.filter(l => l.status === 'active').length || 0,
        completedLevers: userLevers?.filter(l => l.status === 'completed').length || 0,
        averageImpact: userLevers?.reduce((sum, l) => sum + (l.impact_score || 0), 0) / (userLevers?.length || 1),
        averageEffort: userLevers?.reduce((sum, l) => sum + (l.effort_score || 0), 0) / (userLevers?.length || 1)
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Growth quadrant API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateUserQuadrantPosition(userLevers: any[], quadrantData: any[]) {
  const position = {
    highImpact: { x: 0, y: 0, count: 0 },
    strategic: { x: 0, y: 0, count: 0 },
    optimization: { x: 0, y: 0, count: 0 },
    avoid: { x: 0, y: 0, count: 0 }
  };

  userLevers.forEach(lever => {
    const quadrant = determineQuadrant(lever.impact_score || 0, lever.effort_score || 0);
    if (position[quadrant as keyof typeof position]) {
      position[quadrant as keyof typeof position].x += lever.impact_score || 0;
      position[quadrant as keyof typeof position].y += lever.effort_score || 0;
      position[quadrant as keyof typeof position].count += 1;
    }
  });

  // Calculate averages
  Object.keys(position).forEach(quadrant => {
    const pos = position[quadrant as keyof typeof position];
    if (pos.count > 0) {
      pos.x = pos.x / pos.count;
      pos.y = pos.y / pos.count;
    }
  });

  return position;
}

function determineQuadrant(impact: number, effort: number): string {
  if (impact >= 7 && effort <= 5) return 'highImpact';
  if (impact >= 7 && effort > 5) return 'strategic';
  if (impact < 7 && effort <= 5) return 'optimization';
  return 'avoid';
}

async function generateQuadrantRecommendations(userPosition: any, profile: any) {
  const recommendations = {
    highImpact: [],
    strategic: [],
    optimization: [],
    avoid: []
  };

  // Generate recommendations based on user position and profile
  if (userPosition.highImpact.count === 0) {
    recommendations.highImpact.push({
      title: 'Focus on Quick Wins',
      description: 'Prioritize high-impact, low-effort initiatives to build momentum',
      priority: 'high',
      estimatedImpact: 8,
      estimatedEffort: 3
    });
  }

  if (userPosition.strategic.count > 2) {
    recommendations.strategic.push({
      title: 'Resource Allocation Review',
      description: 'Consider if you have sufficient resources for all strategic initiatives',
      priority: 'medium',
      estimatedImpact: 6,
      estimatedEffort: 4
    });
  }

  if (userPosition.optimization.count < 2) {
    recommendations.optimization.push({
      title: 'Process Optimization',
      description: 'Look for efficiency gains in existing processes',
      priority: 'medium',
      estimatedImpact: 4,
      estimatedEffort: 2
    });
  }

  if (userPosition.avoid.count > 0) {
    recommendations.avoid.push({
      title: 'Deprioritize Low-Value Work',
      description: 'Consider stopping or reducing effort on low-impact initiatives',
      priority: 'high',
      estimatedImpact: 2,
      estimatedEffort: 1
    });
  }

  return recommendations;
}

async function getIndustryQuadrantBenchmarks(industry?: string, companySize?: string) {
  const supabase = createClient();
  
  const { data: benchmarks } = await supabase
    .from('growth_quadrant_data')
    .select('*')
    .eq('industry', industry || 'general')
    .eq('company_size', companySize || 'general')
    .order('impact_score', { ascending: false });

  if (!benchmarks || benchmarks.length === 0) {
    return null;
  }

  // Calculate industry averages for each quadrant
  const quadrantAverages = {
    highImpact: { impact: 0, effort: 0, count: 0 },
    strategic: { impact: 0, effort: 0, count: 0 },
    optimization: { impact: 0, effort: 0, count: 0 },
    avoid: { impact: 0, effort: 0, count: 0 }
  };

  benchmarks.forEach(benchmark => {
    const quadrant = benchmark.quadrant;
    if (quadrantAverages[quadrant as keyof typeof quadrantAverages]) {
      quadrantAverages[quadrant as keyof typeof quadrantAverages].impact += benchmark.impact_score || 0;
      quadrantAverages[quadrant as keyof typeof quadrantAverages].effort += benchmark.effort_score || 0;
      quadrantAverages[quadrant as keyof typeof quadrantAverages].count += 1;
    }
  });

  // Calculate averages
  Object.keys(quadrantAverages).forEach(quadrant => {
    const avg = quadrantAverages[quadrant as keyof typeof quadrantAverages];
    if (avg.count > 0) {
      avg.impact = avg.impact / avg.count;
      avg.effort = avg.effort / avg.count;
    }
  });

  return quadrantAverages;
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
    const { action, leverId, quadrant, position } = body;

    switch (action) {
      case 'add_lever':
        // Add a new growth lever to a quadrant
        const { data: newLever, error: leverError } = await supabase
          .from('growth_levers')
          .insert({
            user_id: user.id,
            name: body.name,
            description: body.description,
            quadrant: quadrant,
            impact_score: body.impactScore,
            effort_score: body.effortScore,
            status: 'active',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (leverError) {
          console.error('Error adding growth lever:', leverError);
          return NextResponse.json({ error: 'Failed to add growth lever' }, { status: 500 });
        }

        return NextResponse.json({ 
          message: 'Growth lever added successfully',
          lever: newLever 
        });

      case 'update_position':
        // Update lever position in quadrant
        const { error: updateError } = await supabase
          .from('growth_levers')
          .update({
            impact_score: position.impact,
            effort_score: position.effort,
            quadrant: determineQuadrant(position.impact, position.effort),
            updated_at: new Date().toISOString()
          })
          .eq('id', leverId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating lever position:', updateError);
          return NextResponse.json({ error: 'Failed to update lever position' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Lever position updated successfully' });

      case 'prioritize_quadrant':
        // Set priority for a quadrant
        const { error: priorityError } = await supabase
          .from('user_quadrant_priorities')
          .upsert({
            user_id: user.id,
            quadrant: quadrant,
            priority_level: body.priorityLevel,
            created_at: new Date().toISOString()
          });

        if (priorityError) {
          console.error('Error setting quadrant priority:', priorityError);
          return NextResponse.json({ error: 'Failed to set quadrant priority' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Quadrant priority set successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Quadrant action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

