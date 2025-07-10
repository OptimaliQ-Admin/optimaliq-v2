'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  Brain, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Database,
  Clock,
  Users
} from 'lucide-react'

interface ProviderHealth {
  provider: string
  isHealthy: boolean
  lastCheck: Date
  errorRate: number
  avgLatency: number
}

interface UserStats {
  totalRequests: number
  totalTokens: number
  averageLatency: number
  providers_used: string[]
}

interface RateLimitInfo {
  userId: string
  provider: string
  requestCount: number
  lastRequest: Date
  limit: number
  resetTime: Date
}

export default function AIInfrastructureMonitor() {
  const [providerHealth, setProviderHealth] = useState<ProviderHealth[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [rateLimits, setRateLimits] = useState<RateLimitInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch provider health
      const healthResponse = await fetch('/api/ai/test?action=health')
      const healthData = await healthResponse.json()
      
      if (healthData.health) {
        setProviderHealth(healthData.health)
      }

      // Fetch user stats
      const statsResponse = await fetch('/api/ai/test?action=stats')
      const statsData = await statsResponse.json()
      
      if (statsData.stats) {
        setUserStats(statsData.stats)
      }

      // Fetch rate limits
      const rateLimitResponse = await fetch('/api/ai/test?action=rate-limits')
      const rateLimitData = await rateLimitResponse.json()
      
      if (rateLimitData.rateLimits) {
        setRateLimits(rateLimitData.rateLimits)
      }

      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getHealthStatus = (provider: ProviderHealth) => {
    if (!provider.isHealthy) return 'down'
    if (provider.errorRate > 0.1) return 'degraded'
    return 'healthy'
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'down': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'down': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading && providerHealth.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading AI infrastructure data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Infrastructure Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of AI providers, performance, and system health
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button onClick={fetchData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Provider Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Provider Health
          </CardTitle>
          <CardDescription>
            Current status of all AI providers and their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providerHealth.map((provider) => {
              const status = getHealthStatus(provider)
              return (
                <div key={provider.provider} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getHealthIcon(status)}
                      <span className="font-medium capitalize">{provider.provider}</span>
                    </div>
                    <Badge variant={status === 'healthy' ? 'primary' : 'danger'}>
                      {status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Error Rate:</span>
                      <span className={provider.errorRate > 0.1 ? 'text-red-500' : 'text-green-500'}>
                        {(provider.errorRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Latency:</span>
                      <span>{provider.avgLatency.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Check:</span>
                      <span>{new Date(provider.lastCheck).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Statistics (7 days)
            </CardTitle>
            <CardDescription>
              AI usage statistics for the current user
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userStats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Requests:</span>
                  <span className="font-bold">{userStats.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Tokens:</span>
                  <span className="font-bold">{userStats.totalTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Latency:</span>
                  <span className="font-bold">{userStats.averageLatency.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Providers Used:</span>
                  <div className="flex space-x-1">
                    {userStats.providers_used.map((provider) => (
                      <Badge key={provider} variant="outline">
                        {provider}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No usage data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Rate Limits
            </CardTitle>
            <CardDescription>
              Current rate limit status for AI providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rateLimits ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Provider:</span>
                  <Badge variant="outline">{rateLimits.provider}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Requests Used:</span>
                  <span className="font-bold">{rateLimits.requestCount} / {rateLimits.limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(rateLimits.requestCount / rateLimits.limit) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Request:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(rateLimits.lastRequest).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reset Time:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(rateLimits.resetTime).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No rate limit data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
          <CardDescription>
            Overall system health and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {providerHealth.filter(p => p.isHealthy).length}
              </div>
              <div className="text-sm text-muted-foreground">Healthy Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {providerHealth.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {userStats?.totalRequests || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 