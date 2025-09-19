import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DelegationAgent } from '@/lib/ai/agents/delegation-agent';
import { z } from 'zod';

const campaignRequestSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  includeAssignments: z.boolean().default(true)
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
      organizationId: searchParams.get('organizationId'),
      status: searchParams.get('status'),
      includeAssignments: searchParams.get('includeAssignments') === 'true'
    };

    const validatedQuery = campaignRequestSchema.parse(queryData);

    // Get user's organization
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('organization_id')
      .eq('user_id', validatedQuery.userId)
      .single();

    const organizationId = validatedQuery.organizationId || profile?.organization_id;

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Build query for assessment campaigns
    let query = supabase
      .from('assessment_campaigns')
      .select(`
        *,
        team_members!inner(organization_id)
      `)
      .eq('team_members.organization_id', organizationId);

    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status);
    }

    const { data: campaigns, error: campaignsError } = await query;

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }

    // Get assignments if requested
    let assignments = null;
    if (validatedQuery.includeAssignments && campaigns && campaigns.length > 0) {
      const campaignIds = campaigns.map(c => c.id);
      const { data: assignmentData } = await supabase
        .from('assessment_assignments')
        .select('*')
        .in('campaign_id', campaignIds);

      assignments = assignmentData || [];
    }

    // Calculate campaign analytics
    const campaignAnalytics = calculateCampaignAnalytics(campaigns || [], assignments || []);

    // Get team member data for campaigns
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', organizationId);

    return NextResponse.json({
      campaigns: campaigns || [],
      assignments: assignments || [],
      teamMembers: teamMembers || [],
      analytics: campaignAnalytics,
      summary: {
        totalCampaigns: campaigns?.length || 0,
        activeCampaigns: campaigns?.filter(c => c.status === 'active').length || 0,
        completedCampaigns: campaigns?.filter(c => c.status === 'completed').length || 0,
        totalAssignments: assignments?.length || 0,
        completedAssignments: assignments?.filter(a => a.status === 'completed').length || 0,
        averageCompletionRate: assignments && assignments.length > 0 
          ? (assignments.filter(a => a.status === 'completed').length / assignments.length) * 100 
          : 0
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Assessment campaigns API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateCampaignAnalytics(campaigns: any[], assignments: any[]) {
  const analytics = {
    byStatus: {
      draft: campaigns.filter(c => c.status === 'draft').length,
      active: campaigns.filter(c => c.status === 'active').length,
      paused: campaigns.filter(c => c.status === 'paused').length,
      completed: campaigns.filter(c => c.status === 'completed').length
    },
    byType: {
      onboarding: campaigns.filter(c => c.campaign_type === 'onboarding').length,
      pulse: campaigns.filter(c => c.campaign_type === 'pulse').length,
      custom: campaigns.filter(c => c.campaign_type === 'custom').length
    },
    assignmentStats: {
      total: assignments.length,
      pending: assignments.filter(a => a.status === 'pending').length,
      inProgress: assignments.filter(a => a.status === 'in_progress').length,
      completed: assignments.filter(a => a.status === 'completed').length,
      overdue: assignments.filter(a => {
        if (a.status === 'completed') return false;
        const dueDate = new Date(a.due_date);
        return dueDate < new Date();
      }).length
    },
    completionRates: campaigns.map(campaign => {
      const campaignAssignments = assignments.filter(a => a.campaign_id === campaign.id);
      const completed = campaignAssignments.filter(a => a.status === 'completed').length;
      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        totalAssignments: campaignAssignments.length,
        completedAssignments: completed,
        completionRate: campaignAssignments.length > 0 ? (completed / campaignAssignments.length) * 100 : 0
      };
    })
  };

  return analytics;
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
    const { action, campaignData } = body;

    switch (action) {
      case 'create_campaign':
        // Create a new assessment campaign
        const { data: newCampaign, error: createError } = await supabase
          .from('assessment_campaigns')
          .insert({
            name: campaignData.name,
            description: campaignData.description,
            campaign_type: campaignData.campaignType,
            assessment_template_id: campaignData.assessmentTemplateId,
            created_by: user.id,
            organization_id: campaignData.organizationId,
            target_audience: campaignData.targetAudience,
            start_date: campaignData.startDate,
            end_date: campaignData.endDate,
            status: 'draft',
            settings: campaignData.settings,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating campaign:', createError);
          return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
        }

        // Generate assignments using Delegation Agent
        if (campaignData.autoAssign) {
          const delegationAgent = new DelegationAgent();
          const assignments = await delegationAgent.generateAssignments({
            campaignId: newCampaign.id,
            teamMembers: campaignData.teamMembers,
            assessmentTemplate: campaignData.assessmentTemplate,
            campaignSettings: campaignData.settings
          });

          // Insert assignments
          if (assignments && assignments.length > 0) {
            const { error: assignmentError } = await supabase
              .from('assessment_assignments')
              .insert(assignments);

            if (assignmentError) {
              console.error('Error creating assignments:', assignmentError);
            }
          }
        }

        return NextResponse.json({ 
          message: 'Campaign created successfully',
          campaign: newCampaign 
        });

      case 'update_campaign':
        // Update an existing campaign
        const { error: updateError } = await supabase
          .from('assessment_campaigns')
          .update({
            name: campaignData.name,
            description: campaignData.description,
            target_audience: campaignData.targetAudience,
            start_date: campaignData.startDate,
            end_date: campaignData.endDate,
            settings: campaignData.settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignData.id)
          .eq('created_by', user.id);

        if (updateError) {
          console.error('Error updating campaign:', updateError);
          return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Campaign updated successfully' });

      case 'launch_campaign':
        // Launch a campaign
        const { error: launchError } = await supabase
          .from('assessment_campaigns')
          .update({
            status: 'active',
            launched_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignData.id)
          .eq('created_by', user.id);

        if (launchError) {
          console.error('Error launching campaign:', launchError);
          return NextResponse.json({ error: 'Failed to launch campaign' }, { status: 500 });
        }

        // Send notifications to assigned team members
        const { data: assignments } = await supabase
          .from('assessment_assignments')
          .select('*')
          .eq('campaign_id', campaignData.id);

        if (assignments && assignments.length > 0) {
          // TODO: Implement notification system
          console.log(`Sending notifications to ${assignments.length} team members`);
        }

        return NextResponse.json({ message: 'Campaign launched successfully' });

      case 'pause_campaign':
        // Pause a campaign
        const { error: pauseError } = await supabase
          .from('assessment_campaigns')
          .update({
            status: 'paused',
            paused_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignData.id)
          .eq('created_by', user.id);

        if (pauseError) {
          console.error('Error pausing campaign:', pauseError);
          return NextResponse.json({ error: 'Failed to pause campaign' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Campaign paused successfully' });

      case 'complete_campaign':
        // Complete a campaign
        const { error: completeError } = await supabase
          .from('assessment_campaigns')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignData.id)
          .eq('created_by', user.id);

        if (completeError) {
          console.error('Error completing campaign:', completeError);
          return NextResponse.json({ error: 'Failed to complete campaign' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Campaign completed successfully' });

      case 'delete_campaign':
        // Delete a campaign (only if draft or completed)
        const { data: campaign } = await supabase
          .from('assessment_campaigns')
          .select('status')
          .eq('id', campaignData.id)
          .eq('created_by', user.id)
          .single();

        if (!campaign) {
          return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        if (campaign.status === 'active' || campaign.status === 'paused') {
          return NextResponse.json({ error: 'Cannot delete active or paused campaigns' }, { status: 400 });
        }

        const { error: deleteError } = await supabase
          .from('assessment_campaigns')
          .delete()
          .eq('id', campaignData.id)
          .eq('created_by', user.id);

        if (deleteError) {
          console.error('Error deleting campaign:', deleteError);
          return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Campaign deleted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Campaign action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

