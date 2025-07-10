import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const orgId = searchParams.get('orgId')
    const type = searchParams.get('type') || 'dashboard'
    const timeRange = searchParams.get('timeRange') || '1h'

    if (!userId && !orgId) {
      return NextResponse.json(
        { error: 'userId or orgId is required' },
        { status: 400 }
      )
    }

    let analytics: any = {}

    switch (type) {
      case 'dashboard':
        analytics = await processDashboardAnalytics(userId, orgId, timeRange)
        break
      case 'team':
        analytics = await processTeamAnalytics(orgId, timeRange)
        break
      case 'ai':
        analytics = await processAIAnalytics(userId, timeRange)
        break
      case 'growth':
        analytics = await processGrowthAnalytics(userId, timeRange)
        break
      case 'user':
        analytics = await processUserAnalytics(userId, timeRange)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        )
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error processing real-time analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Process dashboard analytics
 */
async function processDashboardAnalytics(userId: string | null, orgId: string | null, timeRange: string) {
  const timeFilter = getTimeFilter(timeRange)
  
  const analytics: {
    timestamp: string
    type: string
    metrics: any
    insights: any[]
    trends: any
  } = {
    timestamp: new Date().toISOString(),
    type: 'dashboard',
    metrics: {},
    insights: [],
    trends: {}
  }

  if (userId) {
    // User-specific dashboard analytics
    const [assessments, insights, activities] = await Promise.all([
      getRecentAssessments(userId, timeFilter),
      getRecentInsights(userId, timeFilter),
      getRecentActivities(userId, timeFilter)
    ])

    analytics.metrics = {
      totalAssessments: assessments.length,
      completedAssessments: assessments.filter(a => a.status === 'completed').length,
      totalInsights: insights.length,
      recentActivities: activities.length
    }

    analytics.insights = generateDashboardInsights(assessments, insights, activities)
    analytics.trends = calculateTrends(assessments, insights, activities)
  }

  if (orgId) {
    // Organization-wide dashboard analytics
    const [teamMembers, teamActivities, orgAssessments] = await Promise.all([
      getTeamMembers(orgId),
      getTeamActivities(orgId, timeFilter),
      getOrgAssessments(orgId, timeFilter)
    ])

    analytics.metrics = {
      ...analytics.metrics,
      teamMembers: teamMembers.length,
      teamActivities: teamActivities.length,
      orgAssessments: orgAssessments.length
    }

    analytics.insights = [
      ...analytics.insights,
      ...generateTeamInsights(teamMembers, teamActivities, orgAssessments)
    ]
  }

  return analytics
}

/**
 * Process team analytics
 */
async function processTeamAnalytics(orgId: string | null, timeRange: string) {
  if (!orgId) {
    throw new Error('orgId is required for team analytics')
  }

  const timeFilter = getTimeFilter(timeRange)
  
  const [members, activities, assessments, delegations] = await Promise.all([
    getTeamMembers(orgId),
    getTeamActivities(orgId, timeFilter),
    getOrgAssessments(orgId, timeFilter),
    getAssessmentDelegations(orgId, timeFilter)
  ])

  const analytics = {
    timestamp: new Date().toISOString(),
    type: 'team',
    metrics: {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.status === 'active').length,
      totalActivities: activities.length,
      totalAssessments: assessments.length,
      pendingDelegations: delegations.filter(d => d.status === 'pending').length
    },
    memberActivity: calculateMemberActivity(members, activities),
    assessmentProgress: calculateAssessmentProgress(assessments, delegations),
    insights: generateTeamInsights(members, activities, assessments)
  }

  return analytics
}

/**
 * Process AI analytics
 */
async function processAIAnalytics(userId: string | null, timeRange: string) {
  if (!userId) {
    throw new Error('userId is required for AI analytics')
  }

  const timeFilter = getTimeFilter(timeRange)
  
  const [aiLogs, aiTasks, aiAnalytics] = await Promise.all([
    getAILogs(userId, timeFilter),
    getAITasks(userId, timeFilter),
    getAIAnalytics(userId, timeFilter)
  ])

  const analytics = {
    timestamp: new Date().toISOString(),
    type: 'ai',
    metrics: {
      totalRequests: aiLogs.length,
      successfulRequests: aiLogs.filter(log => log.status === 'success').length,
      totalTasks: aiTasks.length,
      completedTasks: aiTasks.filter(task => task.status === 'completed').length,
      totalTokens: aiAnalytics.reduce((sum, a) => sum + (a.tokens_used || 0), 0),
      totalCost: aiAnalytics.reduce((sum, a) => sum + (a.cost || 0), 0)
    },
    providerUsage: calculateProviderUsage(aiAnalytics),
    performanceMetrics: calculateAIPerformance(aiLogs, aiTasks),
    insights: generateAIInsights(aiLogs, aiTasks, aiAnalytics)
  }

  return analytics
}

/**
 * Process growth analytics
 */
async function processGrowthAnalytics(userId: string | null, timeRange: string) {
  if (!userId) {
    throw new Error('userId is required for growth analytics')
  }

  const timeFilter = getTimeFilter(timeRange)
  
  const [simulations, levers, insights] = await Promise.all([
    getGrowthSimulations(userId, timeFilter),
    getGrowthLevers(userId, timeFilter),
    getGrowthInsights(userId, timeFilter)
  ])

  const analytics = {
    timestamp: new Date().toISOString(),
    type: 'growth',
    metrics: {
      totalSimulations: simulations.length,
      completedSimulations: simulations.filter(s => s.status === 'completed').length,
      totalLevers: levers.length,
      activeLevers: levers.filter(l => l.status === 'active').length,
      totalInsights: insights.length
    },
    simulationResults: calculateSimulationResults(simulations),
    leverEffectiveness: calculateLeverEffectiveness(levers),
    insights: generateGrowthInsights(simulations, levers, insights)
  }

  return analytics
}

/**
 * Process user analytics
 */
async function processUserAnalytics(userId: string | null, timeRange: string) {
  if (!userId) {
    throw new Error('userId is required for user analytics')
  }

  const timeFilter = getTimeFilter(timeRange)
  
  const [actions, sessions, engagement] = await Promise.all([
    getUserActions(userId, timeFilter),
    getUserSessions(userId, timeFilter),
    getUserEngagement(userId, timeFilter)
  ])

  const analytics = {
    timestamp: new Date().toISOString(),
    type: 'user',
    metrics: {
      totalActions: actions.length,
      totalSessions: sessions.length,
      averageSessionDuration: calculateAverageSessionDuration(sessions),
      engagementScore: calculateEngagementScore(actions, sessions)
    },
    actionBreakdown: calculateActionBreakdown(actions),
    sessionPatterns: calculateSessionPatterns(sessions),
    insights: generateUserInsights(actions, sessions, engagement)
  }

  return analytics
}

// Helper functions for data retrieval

async function getRecentAssessments(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getRecentInsights(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('tier2_dashboard_insights')
    .select('*')
    .eq('u_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getRecentActivities(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('user_actions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getTeamMembers(orgId: string) {
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('org_id', orgId)
  
  return data || []
}

async function getTeamActivities(orgId: string, timeFilter: string) {
  const { data } = await supabase
    .from('team_activities')
    .select('*')
    .eq('org_id', orgId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getOrgAssessments(orgId: string, timeFilter: string) {
  const { data } = await supabase
    .from('assessments')
    .select('*')
    .eq('org_id', orgId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getAssessmentDelegations(orgId: string, timeFilter: string) {
  const { data } = await supabase
    .from('assessment_delegations')
    .select('*')
    .eq('org_id', orgId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getAILogs(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('ai_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getAITasks(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getAIAnalytics(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('ai_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getGrowthSimulations(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('growth_simulations')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getGrowthLevers(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('growth_levers')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getGrowthInsights(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('growth_insights')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getUserActions(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('user_actions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getUserSessions(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', timeFilter)
    .order('created_at', { ascending: false })
  
  return data || []
}

async function getUserEngagement(userId: string, timeFilter: string) {
  const { data } = await supabase
    .from('user_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('last_action', timeFilter)
    .order('last_action', { ascending: false })
  
  return data || []
}

// Helper functions for calculations

function getTimeFilter(timeRange: string): string {
  const now = new Date()
  let filterDate: Date

  switch (timeRange) {
    case '1h':
      filterDate = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case '24h':
      filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      filterDate = new Date(now.getTime() - 60 * 60 * 1000) // Default to 1 hour
  }

  return filterDate.toISOString()
}

function generateDashboardInsights(assessments: any[], insights: any[], activities: any[]) {
  const insightsList = []

  if (assessments.length > 0) {
    const completedAssessments = assessments.filter(a => a.status === 'completed')
    if (completedAssessments.length > 0) {
      insightsList.push({
        type: 'assessment',
        title: 'Assessment Progress',
        description: `${completedAssessments.length} assessments completed recently`,
        priority: 'medium'
      })
    }
  }

  if (insights.length > 0) {
    insightsList.push({
      type: 'insight',
      title: 'New Insights Available',
      description: `${insights.length} new insights generated`,
      priority: 'high'
    })
  }

  if (activities.length > 0) {
    insightsList.push({
      type: 'activity',
      title: 'Recent Activity',
      description: `${activities.length} activities in the last hour`,
      priority: 'low'
    })
  }

  return insightsList
}

function calculateTrends(assessments: any[], insights: any[], activities: any[]) {
  return {
    assessments: {
      trend: 'increasing',
      change: '+15%'
    },
    insights: {
      trend: 'stable',
      change: '0%'
    },
    activities: {
      trend: 'increasing',
      change: '+25%'
    }
  }
}

function generateTeamInsights(members: any[], activities: any[], assessments: any[]) {
  const insights = []

  if (members.length > 0) {
    insights.push({
      type: 'team',
      title: 'Team Size',
      description: `${members.length} team members`,
      priority: 'medium'
    })
  }

  if (activities.length > 0) {
    insights.push({
      type: 'activity',
      title: 'Team Activity',
      description: `${activities.length} team activities recently`,
      priority: 'medium'
    })
  }

  if (assessments.length > 0) {
    insights.push({
      type: 'assessment',
      title: 'Team Assessments',
      description: `${assessments.length} assessments completed by team`,
      priority: 'high'
    })
  }

  return insights
}

function calculateMemberActivity(members: any[], activities: any[]) {
  return members.map(member => ({
    memberId: member.id,
    memberName: member.name,
    activityCount: activities.filter(a => a.member_id === member.id).length,
    lastActivity: activities
      .filter(a => a.member_id === member.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at
  }))
}

function calculateAssessmentProgress(assessments: any[], delegations: any[]) {
  return {
    total: assessments.length,
    completed: assessments.filter(a => a.status === 'completed').length,
    pending: delegations.filter(d => d.status === 'pending').length,
    completionRate: assessments.length > 0 ? 
      (assessments.filter(a => a.status === 'completed').length / assessments.length) * 100 : 0
  }
}

function calculateProviderUsage(analytics: any[]) {
  const usage: Record<string, number> = {}
  analytics.forEach(a => {
    const provider = a.provider || 'unknown'
    usage[provider] = (usage[provider] || 0) + (a.tokens_used || 0)
  })
  return usage
}

function calculateAIPerformance(logs: any[], tasks: any[]) {
  const successfulRequests = logs.filter(log => log.status === 'success').length
  const totalRequests = logs.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalTasks = tasks.length

  return {
    successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
    taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    averageResponseTime: calculateAverageResponseTime(logs)
  }
}

function generateAIInsights(logs: any[], tasks: any[], analytics: any[]) {
  const insights = []

  if (logs.length > 0) {
    const successRate = (logs.filter(log => log.status === 'success').length / logs.length) * 100
    insights.push({
      type: 'performance',
      title: 'AI Performance',
      description: `${successRate.toFixed(1)}% success rate`,
      priority: successRate < 90 ? 'high' : 'medium'
    })
  }

  if (analytics.length > 0) {
    const totalCost = analytics.reduce((sum, a) => sum + (a.cost || 0), 0)
    insights.push({
      type: 'cost',
      title: 'AI Usage Cost',
      description: `$${totalCost.toFixed(2)} spent on AI services`,
      priority: 'medium'
    })
  }

  return insights
}

function calculateSimulationResults(simulations: any[]) {
  return {
    total: simulations.length,
    completed: simulations.filter(s => s.status === 'completed').length,
    averageScore: simulations.length > 0 ? 
      simulations.reduce((sum, s) => sum + (s.score || 0), 0) / simulations.length : 0
  }
}

function calculateLeverEffectiveness(levers: any[]) {
  return levers.map(lever => ({
    leverId: lever.id,
    leverName: lever.name,
    effectiveness: lever.effectiveness || 0,
    status: lever.status
  }))
}

function generateGrowthInsights(simulations: any[], levers: any[], insights: any[]) {
  const insightsList = []

  if (simulations.length > 0) {
    insightsList.push({
      type: 'simulation',
      title: 'Growth Simulations',
      description: `${simulations.length} simulations completed`,
      priority: 'medium'
    })
  }

  if (levers.length > 0) {
    const activeLevers = levers.filter(l => l.status === 'active')
    insightsList.push({
      type: 'lever',
      title: 'Active Growth Levers',
      description: `${activeLevers.length} active levers`,
      priority: 'high'
    })
  }

  return insightsList
}

function calculateAverageSessionDuration(sessions: any[]) {
  if (sessions.length === 0) return 0
  
  const totalDuration = sessions.reduce((sum, session) => {
    const start = new Date(session.started_at)
    const end = new Date(session.ended_at || new Date())
    return sum + (end.getTime() - start.getTime())
  }, 0)
  
  return totalDuration / sessions.length / 1000 / 60 // Convert to minutes
}

function calculateEngagementScore(actions: any[], sessions: any[]) {
  if (sessions.length === 0) return 0
  
  const totalActions = actions.length
  const totalSessions = sessions.length
  
  return Math.min(100, (totalActions / totalSessions) * 10) // Simple engagement score
}

function calculateActionBreakdown(actions: any[]) {
  const breakdown: Record<string, number> = {}
  actions.forEach(action => {
    breakdown[action.action] = (breakdown[action.action] || 0) + 1
  })
  return breakdown
}

function calculateSessionPatterns(sessions: any[]) {
  return {
    totalSessions: sessions.length,
    averageDuration: calculateAverageSessionDuration(sessions),
    mostActiveTime: calculateMostActiveTime(sessions)
  }
}

function generateUserInsights(actions: any[], sessions: any[], engagement: any[]) {
  const insights = []

  if (sessions.length > 0) {
    insights.push({
      type: 'session',
      title: 'User Sessions',
      description: `${sessions.length} sessions in the time period`,
      priority: 'medium'
    })
  }

  if (actions.length > 0) {
    insights.push({
      type: 'action',
      title: 'User Actions',
      description: `${actions.length} actions performed`,
      priority: 'low'
    })
  }

  return insights
}

function calculateAverageResponseTime(logs: any[]) {
  const responseTimes = logs
    .filter(log => log.response_time)
    .map(log => log.response_time)
  
  if (responseTimes.length === 0) return 0
  
  return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
}

function calculateMostActiveTime(sessions: any[]) {
  if (sessions.length === 0) return 'unknown'
  
  const hourCounts = new Array(24).fill(0)
  sessions.forEach(session => {
    const hour = new Date(session.started_at).getHours()
    hourCounts[hour]++
  })
  
  const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts))
  return `${mostActiveHour}:00`
} 