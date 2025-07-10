import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { eventBus } from '@/lib/events/eventBus'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { event, data } = await req.json()
    
    if (!event || !event.type) {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      )
    }

    // Process real-time events based on type
    switch (event.type) {
      case 'assessment_completed':
        await processAssessmentCompletion(data)
        break
      case 'dashboard_update':
        await processDashboardUpdate(data)
        break
      case 'team_activity':
        await processTeamActivity(data)
        break
      case 'ai_task_completed':
        await processAITaskCompletion(data)
        break
      case 'growth_simulation_completed':
        await processGrowthSimulationCompletion(data)
        break
      case 'user_action':
        await processUserAction(data)
        break
      default:
        console.log(`Unknown event type: ${event.type}`)
    }

    // Emit event to event bus for further processing
    await eventBus.emitSimple(event.type, data, event.userId, event.orgId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing real-time event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Process assessment completion events
 */
async function processAssessmentCompletion(data: any) {
  try {
    const { userId, assessmentId, responses, score } = data

    // Generate real-time insights
    const insights = await generateRealTimeInsights(data)
    
    // Update dashboard insights
    await updateDashboardInsights(userId, insights)
    
    // Notify team members if applicable
    if (data.orgId) {
      await notifyTeamMembers(data.orgId, insights)
    }

    // Update assessment status
    await supabase
      .from('assessments')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        score: score
      })
      .eq('id', assessmentId)

    console.log(`Assessment ${assessmentId} completed for user ${userId}`)
  } catch (error) {
    console.error('Error processing assessment completion:', error)
  }
}

/**
 * Process dashboard update events
 */
async function processDashboardUpdate(data: any) {
  try {
    const { userId, table, action, recordId, data: recordData } = data

    // Update dashboard cache
    await updateDashboardCache(userId, table, action, recordId, recordData)
    
    // Trigger dashboard refresh
    await triggerDashboardRefresh(userId)

    console.log(`Dashboard updated for user ${userId}: ${table} ${action}`)
  } catch (error) {
    console.error('Error processing dashboard update:', error)
  }
}

/**
 * Process team activity events
 */
async function processTeamActivity(data: any) {
  try {
    const { orgId, memberId, activity, data: activityData } = data

    // Log team activity
    await supabase
      .from('team_activities')
      .insert({
        org_id: orgId,
        member_id: memberId,
        activity_type: activity,
        activity_data: activityData,
        created_at: new Date().toISOString()
      })

    // Update team analytics
    await updateTeamAnalytics(orgId, activity, activityData)

    console.log(`Team activity logged: ${activity} for member ${memberId} in org ${orgId}`)
  } catch (error) {
    console.error('Error processing team activity:', error)
  }
}

/**
 * Process AI task completion events
 */
async function processAITaskCompletion(data: any) {
  try {
    const { userId, taskId, result, provider, duration } = data

    // Update AI task status
    await supabase
      .from('ai_tasks')
      .update({
        status: 'completed',
        result: result,
        completed_at: new Date().toISOString(),
        duration: duration
      })
      .eq('id', taskId)

    // Update AI analytics
    await updateAIAnalytics(userId, provider, duration, result)

    console.log(`AI task ${taskId} completed for user ${userId}`)
  } catch (error) {
    console.error('Error processing AI task completion:', error)
  }
}

/**
 * Process growth simulation completion events
 */
async function processGrowthSimulationCompletion(data: any) {
  try {
    const { userId, simulationId, results, scenario } = data

    // Update simulation status
    await supabase
      .from('growth_simulations')
      .update({
        status: 'completed',
        results: results,
        completed_at: new Date().toISOString()
      })
      .eq('id', simulationId)

    // Generate growth recommendations
    const recommendations = await generateGrowthRecommendations(results, scenario)
    
    // Update user's growth insights
    await updateGrowthInsights(userId, recommendations)

    console.log(`Growth simulation ${simulationId} completed for user ${userId}`)
  } catch (error) {
    console.error('Error processing growth simulation completion:', error)
  }
}

/**
 * Process user action events
 */
async function processUserAction(data: any) {
  try {
    const { userId, action, page, data: actionData } = data

    // Log user action
    await supabase
      .from('user_actions')
      .insert({
        user_id: userId,
        action: action,
        page: page,
        action_data: actionData,
        created_at: new Date().toISOString()
      })

    // Update user analytics
    await updateUserAnalytics(userId, action, page)

    console.log(`User action logged: ${action} on ${page} for user ${userId}`)
  } catch (error) {
    console.error('Error processing user action:', error)
  }
}

// Helper functions

async function generateRealTimeInsights(data: any) {
  // This would integrate with the AI services we created in Phase 2
  return {
    type: 'assessment_completion',
    insights: [
      {
        title: 'Assessment Completed',
        description: 'Your assessment has been completed and analyzed',
        priority: 'high'
      }
    ],
    recommendations: [
      {
        title: 'Review Results',
        description: 'Check your detailed assessment results',
        action: 'view_results'
      }
    ]
  }
}

async function updateDashboardInsights(userId: string, insights: any) {
  await supabase
    .from('tier2_dashboard_insights')
    .insert({
      u_id: userId,
      insight_type: insights.type,
      insight_data: insights,
      created_at: new Date().toISOString()
    })
}

async function notifyTeamMembers(orgId: string, insights: any) {
  // Get team members
  const { data: members } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('org_id', orgId)

  if (members) {
    // Send notifications to team members
    for (const member of members) {
      await supabase
        .from('notifications')
        .insert({
          user_id: member.user_id,
          type: 'team_activity',
          title: 'Team Assessment Completed',
          message: 'A team member has completed an assessment',
          data: insights,
          created_at: new Date().toISOString()
        })
    }
  }
}

async function updateDashboardCache(userId: string, table: string, action: string, recordId: string, data: any) {
  // Update cache for faster dashboard loading
  const cacheKey = `dashboard:${userId}:${table}`
  
  // This would integrate with a caching system (Redis, etc.)
  console.log(`Updating cache for ${cacheKey}`)
}

async function triggerDashboardRefresh(userId: string) {
  // Trigger real-time dashboard refresh
  await eventBus.emitSimple('dashboard_refresh', { userId }, userId)
}

async function updateTeamAnalytics(orgId: string, activity: string, data: any) {
  // Update team analytics
  await supabase
    .from('team_analytics')
    .upsert({
      org_id: orgId,
      activity_type: activity,
      activity_count: 1,
      last_activity: new Date().toISOString()
    }, {
      onConflict: 'org_id,activity_type'
    })
}

async function updateAIAnalytics(userId: string, provider: string, duration: number, result: any) {
  // Update AI usage analytics
  await supabase
    .from('ai_analytics')
    .insert({
      user_id: userId,
      provider: provider,
      duration: duration,
      tokens_used: result.tokens || 0,
      cost: result.cost || 0,
      created_at: new Date().toISOString()
    })
}

async function generateGrowthRecommendations(results: any, scenario: string) {
  // This would integrate with the Growth Studio AI Service
  return {
    scenario: scenario,
    recommendations: [
      {
        title: 'Optimize Growth Levers',
        description: 'Based on your simulation results',
        priority: 'high'
      }
    ]
  }
}

async function updateGrowthInsights(userId: string, recommendations: any) {
  await supabase
    .from('growth_insights')
    .insert({
      user_id: userId,
      recommendations: recommendations,
      created_at: new Date().toISOString()
    })
}

async function updateUserAnalytics(userId: string, action: string, page: string) {
  // Update user engagement analytics
  await supabase
    .from('user_analytics')
    .upsert({
      user_id: userId,
      action: action,
      page: page,
      action_count: 1,
      last_action: new Date().toISOString()
    }, {
      onConflict: 'user_id,action,page'
    })
} 