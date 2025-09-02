import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const riskAssessmentRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  riskType: z.enum(['market', 'operational', 'financial', 'regulatory', 'competitive', 'comprehensive']).default('comprehensive'),
  timeHorizon: z.enum(['1month', '3months', '6months', '1year', '2years']).default('1year'),
  includeMitigation: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      industry: searchParams.get('industry'),
      riskType: searchParams.get('riskType') || 'comprehensive',
      timeHorizon: searchParams.get('timeHorizon') || '1year',
      includeMitigation: searchParams.get('includeMitigation') === 'true'
    };

    const validatedQuery = riskAssessmentRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    const targetIndustry = validatedQuery.industry || profile?.industry || 'general';

    // Get risk assessment data
    const { data: riskData } = await supabase
      .from('risk_assessment_data')
      .select('*')
      .eq('industry', targetIndustry)
      .order('created_at', { ascending: false })
      .limit(100);

    // Get market trends for risk analysis
    const { data: trends } = await supabase
      .from('market_trends')
      .select('*')
      .eq('industry', targetIndustry)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get regulatory changes
    const { data: regulatoryChanges } = await supabase
      .from('regulatory_changes')
      .select('*')
      .eq('industry', targetIndustry)
      .order('effective_date', { ascending: false })
      .limit(20);

    // Get economic indicators for risk assessment
    const { data: economicIndicators } = await supabase
      .from('economic_indicators')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    // Generate risk assessment using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const riskAssessment = await marketIntelligenceAgent.generateRiskAssessment({
      industry: targetIndustry,
      riskData: riskData || [],
      trends: trends || [],
      regulatoryChanges: regulatoryChanges || [],
      economicIndicators: economicIndicators || [],
      riskType: validatedQuery.riskType,
      timeHorizon: validatedQuery.timeHorizon,
      includeMitigation: validatedQuery.includeMitigation,
      userProfile: profile
    });

    // Store risk assessment results
    await supabase
      .from('risk_assessment_results')
      .upsert({
        user_id: validatedQuery.userId,
        industry: targetIndustry,
        risk_type: validatedQuery.riskType,
        time_horizon: validatedQuery.timeHorizon,
        assessment_data: riskAssessment,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      riskAssessment: riskAssessment,
      summary: {
        industry: targetIndustry,
        riskType: validatedQuery.riskType,
        timeHorizon: validatedQuery.timeHorizon,
        dataPoints: {
          riskData: riskData?.length || 0,
          trends: trends?.length || 0,
          regulatoryChanges: regulatoryChanges?.length || 0,
          economicIndicators: economicIndicators?.length || 0
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Risk assessment API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, riskData } = body;

    switch (action) {
      case 'save_assessment':
        // Save custom risk assessment
        const { error: saveError } = await supabase
          .from('saved_risk_assessments')
          .insert({
            user_id: user.id,
            industry: riskData.industry,
            assessment_name: riskData.assessmentName,
            assessment_data: riskData.assessmentData,
            notes: riskData.notes,
            created_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving assessment:', saveError);
          return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Risk assessment saved successfully' });

      case 'track_risk':
        // Track specific risk
        const { error: trackError } = await supabase
          .from('risk_tracking')
          .insert({
            user_id: user.id,
            risk_id: riskData.riskId,
            risk_name: riskData.riskName,
            risk_level: riskData.riskLevel,
            probability: riskData.probability,
            impact: riskData.impact,
            mitigation_plan: riskData.mitigationPlan,
            created_at: new Date().toISOString()
          });

        if (trackError) {
          console.error('Error tracking risk:', trackError);
          return NextResponse.json({ error: 'Failed to track risk' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Risk tracked successfully' });

      case 'set_risk_alerts':
        // Set up risk monitoring alerts
        const { error: alertError } = await supabase
          .from('risk_alerts')
          .insert({
            user_id: user.id,
            industry: riskData.industry,
            risk_type: riskData.riskType,
            alert_threshold: riskData.alertThreshold,
            notification_method: riskData.notificationMethod,
            created_at: new Date().toISOString()
          });

        if (alertError) {
          console.error('Error setting alert:', alertError);
          return NextResponse.json({ error: 'Failed to set alert' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Risk alert set successfully' });

      case 'update_risk_status':
        // Update risk status
        const { error: updateError } = await supabase
          .from('risk_tracking')
          .update({
            risk_level: riskData.riskLevel,
            probability: riskData.probability,
            impact: riskData.impact,
            status: riskData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', riskData.trackingId);

        if (updateError) {
          console.error('Error updating risk status:', updateError);
          return NextResponse.json({ error: 'Failed to update risk status' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Risk status updated successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Risk assessment action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

