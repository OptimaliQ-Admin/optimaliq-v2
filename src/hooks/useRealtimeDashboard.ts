import { useEffect, useState, useCallback, useRef } from 'react'
import { RealtimeManager } from '@/lib/realtime/subscriptions'
import { eventBus } from '@/lib/events/eventBus'

export interface DashboardData {
  insights: any[]
  assessments: any[]
  activities: any[]
  metrics: {
    totalAssessments: number
    completedAssessments: number
    totalInsights: number
    recentActivities: number
  }
  trends: {
    assessments: { trend: string; change: string }
    insights: { trend: string; change: string }
    activities: { trend: string; change: string }
  }
}

export interface RealtimeStatus {
  isConnected: boolean
  channels: string[]
  lastUpdate: Date | null
  error: string | null
}

export function useRealtimeDashboard(userId: string) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [channels, setChannels] = useState<string[]>([])
  
  const realtimeManagerRef = useRef<RealtimeManager | null>(null)
  const eventHandlersRef = useRef<Map<string, (data: any) => void>>(new Map())

  // Initialize real-time manager
  useEffect(() => {
    if (!userId) return

    const realtimeManager = new RealtimeManager()
    realtimeManagerRef.current = realtimeManager

    // Subscribe to dashboard updates
    const dashboardChannel = realtimeManager.subscribeToDashboard(userId)
    
    // Subscribe to AI service updates
    const aiChannel = realtimeManager.subscribeToAIServiceUpdates(userId)
    
    // Subscribe to growth studio updates
    const growthChannel = realtimeManager.subscribeToGrowthStudioUpdates(userId)

    // Set up event listeners
    const handleDashboardUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateDashboardData(data)
    }

    const handleAssessmentUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateAssessmentData(data)
    }

    const handleAILogUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateAIData(data)
    }

    const handleGrowthUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateGrowthData(data)
    }

    // Register event handlers
    realtimeManager.on('dashboard_update', handleDashboardUpdate)
    realtimeManager.on('assessment_update', handleAssessmentUpdate)
    realtimeManager.on('ai_log_update', handleAILogUpdate)
    realtimeManager.on('growth_simulation_update', handleGrowthUpdate)

    // Store handlers for cleanup
    eventHandlersRef.current.set('dashboard_update', handleDashboardUpdate)
    eventHandlersRef.current.set('assessment_update', handleAssessmentUpdate)
    eventHandlersRef.current.set('ai_log_update', handleAILogUpdate)
    eventHandlersRef.current.set('growth_simulation_update', handleGrowthUpdate)

    // Set connection status
    setIsConnected(true)
    setChannels(['dashboard', 'ai', 'growth'])

    // Set up connection status monitoring
    const checkConnection = () => {
      const status = realtimeManager.getConnectionStatus()
      setIsConnected(status.connected)
      setChannels(status.channels)
    }

    const connectionInterval = setInterval(checkConnection, 5000)

    // Cleanup function
    return () => {
      clearInterval(connectionInterval)
      
      // Remove event handlers
      eventHandlersRef.current.forEach((handler, eventType) => {
        realtimeManager.off(eventType, handler)
      })
      eventHandlersRef.current.clear()
      
      // Unsubscribe from channels
      realtimeManager.unsubscribeAll()
      realtimeManagerRef.current = null
      
      setIsConnected(false)
      setChannels([])
    }
  }, [userId])

  // Update dashboard data based on real-time events
  const updateDashboardData = useCallback((data: any) => {
    setDashboardData(prevData => {
      if (!prevData) return prevData

      // Update insights if this is an insight update
      if (data.table === 'tier2_dashboard_insights') {
        const updatedInsights = [...prevData.insights]
        
        if (data.action === 'INSERT') {
          updatedInsights.unshift(data.data)
        } else if (data.action === 'UPDATE') {
          const index = updatedInsights.findIndex(insight => insight.insight_id === data.recordId)
          if (index !== -1) {
            updatedInsights[index] = data.data
          }
        } else if (data.action === 'DELETE') {
          const index = updatedInsights.findIndex(insight => insight.insight_id === data.recordId)
          if (index !== -1) {
            updatedInsights.splice(index, 1)
          }
        }

        return {
          ...prevData,
          insights: updatedInsights.slice(0, 10), // Keep only latest 10 insights
          metrics: {
            ...prevData.metrics,
            totalInsights: updatedInsights.length
          }
        }
      }

      return prevData
    })
  }, [])

  // Update assessment data based on real-time events
  const updateAssessmentData = useCallback((data: any) => {
    setDashboardData(prevData => {
      if (!prevData) return prevData

      const updatedAssessments = [...prevData.assessments]
      
      if (data.action === 'INSERT') {
        updatedAssessments.unshift(data.data)
      } else if (data.action === 'UPDATE') {
        const index = updatedAssessments.findIndex(assessment => assessment.id === data.recordId)
        if (index !== -1) {
          updatedAssessments[index] = data.data
        }
      } else if (data.action === 'DELETE') {
        const index = updatedAssessments.findIndex(assessment => assessment.id === data.recordId)
        if (index !== -1) {
          updatedAssessments.splice(index, 1)
        }
      }

      const completedAssessments = updatedAssessments.filter(a => a.status === 'completed')

      return {
        ...prevData,
        assessments: updatedAssessments.slice(0, 10), // Keep only latest 10 assessments
        metrics: {
          ...prevData.metrics,
          totalAssessments: updatedAssessments.length,
          completedAssessments: completedAssessments.length
        }
      }
    })
  }, [])

  // Update AI data based on real-time events
  const updateAIData = useCallback((data: any) => {
    setDashboardData(prevData => {
      if (!prevData) return prevData

      // Add AI activity to activities list
      const aiActivity = {
        id: data.recordId,
        type: 'ai_request',
        description: `AI ${data.data.provider} request completed`,
        timestamp: new Date().toISOString(),
        data: data.data
      }

      const updatedActivities = [aiActivity, ...prevData.activities]

      return {
        ...prevData,
        activities: updatedActivities.slice(0, 20), // Keep only latest 20 activities
        metrics: {
          ...prevData.metrics,
          recentActivities: updatedActivities.length
        }
      }
    })
  }, [])

  // Update growth data based on real-time events
  const updateGrowthData = useCallback((data: any) => {
    setDashboardData(prevData => {
      if (!prevData) return prevData

      // Add growth activity to activities list
      const growthActivity = {
        id: data.recordId,
        type: 'growth_simulation',
        description: `Growth simulation ${data.action}`,
        timestamp: new Date().toISOString(),
        data: data.data
      }

      const updatedActivities = [growthActivity, ...prevData.activities]

      return {
        ...prevData,
        activities: updatedActivities.slice(0, 20), // Keep only latest 20 activities
        metrics: {
          ...prevData.metrics,
          recentActivities: updatedActivities.length
        }
      }
    })
  }, [])

  // Manual refresh function
  const refreshDashboard = useCallback(async () => {
    try {
      setError(null)
      
      // Fetch latest dashboard data
      const response = await fetch(`/api/analytics/realtime?userId=${userId}&type=dashboard&timeRange=24h`)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setDashboardData(data)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard')
    }
  }, [userId])

  // Subscribe to custom events
  const subscribeToCustomEvent = useCallback((eventType: string, handler: (data: any) => void) => {
    if (!realtimeManagerRef.current) return

    realtimeManagerRef.current.on(eventType, handler)
    eventHandlersRef.current.set(eventType, handler)
  }, [])

  // Unsubscribe from custom events
  const unsubscribeFromCustomEvent = useCallback((eventType: string) => {
    if (!realtimeManagerRef.current) return

    const handler = eventHandlersRef.current.get(eventType)
    if (handler) {
      realtimeManagerRef.current.off(eventType, handler)
      eventHandlersRef.current.delete(eventType)
    }
  }, [])

  // Broadcast custom event
  const broadcastEvent = useCallback(async (eventType: string, data: any) => {
    if (!realtimeManagerRef.current) return

    await realtimeManagerRef.current.broadcastEvent(eventType, data)
  }, [])

  // Get connection status
  const getConnectionStatus = useCallback((): RealtimeStatus => {
    return {
      isConnected,
      channels,
      lastUpdate,
      error
    }
  }, [isConnected, channels, lastUpdate, error])

  return {
    dashboardData,
    isConnected,
    lastUpdate,
    error,
    channels,
    refreshDashboard,
    subscribeToCustomEvent,
    unsubscribeFromCustomEvent,
    broadcastEvent,
    getConnectionStatus
  }
}

// Hook for team real-time updates
export function useRealtimeTeam(orgId: string) {
  const [teamData, setTeamData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const realtimeManagerRef = useRef<RealtimeManager | null>(null)

  useEffect(() => {
    if (!orgId) return

    const realtimeManager = new RealtimeManager()
    realtimeManagerRef.current = realtimeManager

    // Subscribe to team activity
    const teamChannel = realtimeManager.subscribeToTeamActivity(orgId)

    // Set up event listeners
    const handleTeamUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateTeamData(data)
    }

    realtimeManager.on('team_update', handleTeamUpdate)
    realtimeManager.on('team_member_update', handleTeamUpdate)
    realtimeManager.on('team_activity_update', handleTeamUpdate)

    setIsConnected(true)

    return () => {
      realtimeManager.unsubscribeAll()
      realtimeManagerRef.current = null
      setIsConnected(false)
    }
  }, [orgId])

  const updateTeamData = useCallback((data: any) => {
    setTeamData((prevData: any) => {
      if (!prevData) return prevData

      // Update team activities
      const updatedActivities = [data, ...prevData.activities]

      return {
        ...prevData,
        activities: updatedActivities.slice(0, 50), // Keep only latest 50 activities
        lastActivity: data
      }
    })
  }, [])

  const refreshTeamData = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch(`/api/analytics/realtime?orgId=${orgId}&type=team&timeRange=24h`)
      if (!response.ok) {
        throw new Error('Failed to fetch team data')
      }
      
      const data = await response.json()
      setTeamData(data)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh team data')
    }
  }, [orgId])

  return {
    teamData,
    isConnected,
    lastUpdate,
    error,
    refreshTeamData
  }
}

// Hook for AI service real-time updates
export function useRealtimeAI(userId: string) {
  const [aiData, setAiData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const realtimeManagerRef = useRef<RealtimeManager | null>(null)

  useEffect(() => {
    if (!userId) return

    const realtimeManager = new RealtimeManager()
    realtimeManagerRef.current = realtimeManager

    // Subscribe to AI service updates
    const aiChannel = realtimeManager.subscribeToAIServiceUpdates(userId)

    // Set up event listeners
    const handleAILogUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateAIData(data)
    }

    const handleAITaskUpdate = (data: any) => {
      setLastUpdate(new Date())
      updateAITaskData(data)
    }

    realtimeManager.on('ai_log_update', handleAILogUpdate)
    realtimeManager.on('ai_task_update', handleAITaskUpdate)

    setIsConnected(true)

    return () => {
      realtimeManager.unsubscribeAll()
      realtimeManagerRef.current = null
      setIsConnected(false)
    }
  }, [userId])

  const updateAIData = useCallback((data: any) => {
    setAiData((prevData: any) => {
      if (!prevData) return prevData

      const updatedLogs = [data.data, ...prevData.logs]

      return {
        ...prevData,
        logs: updatedLogs.slice(0, 100), // Keep only latest 100 logs
        lastLog: data.data
      }
    })
  }, [])

  const updateAITaskData = useCallback((data: any) => {
    setAiData((prevData: any) => {
      if (!prevData) return prevData

      const updatedTasks = [...prevData.tasks]
      
      if (data.action === 'INSERT') {
        updatedTasks.unshift(data.data)
      } else if (data.action === 'UPDATE') {
        const index = updatedTasks.findIndex(task => task.id === data.recordId)
        if (index !== -1) {
          updatedTasks[index] = data.data
        }
      }

      return {
        ...prevData,
        tasks: updatedTasks.slice(0, 50), // Keep only latest 50 tasks
        lastTask: data.data
      }
    })
  }, [])

  const refreshAIData = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch(`/api/analytics/realtime?userId=${userId}&type=ai&timeRange=24h`)
      if (!response.ok) {
        throw new Error('Failed to fetch AI data')
      }
      
      const data = await response.json()
      setAiData(data)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh AI data')
    }
  }, [userId])

  return {
    aiData,
    isConnected,
    lastUpdate,
    error,
    refreshAIData
  }
} 