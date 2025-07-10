import { createClient } from '@supabase/supabase-js'

export interface EnhancedAILog {
  log_id: string
  u_id: string | null
  provider: string
  model: string
  apirequest: string
  apiresponse: string
  tokensused: number
  latency: number
  error_message?: string
  fallback_used: boolean
  model_version: string
  request_id: string
  createdat: Date
}

export interface ProviderStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageLatency: number
  totalTokens: number
  errorRate: number
  lastRequest: Date
}

export class AILogger {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  async logRequest(log: Omit<EnhancedAILog, 'log_id' | 'createdat'>): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('ai_log')
        .insert({
          u_id: log.u_id,
          provider: log.provider,
          model: log.model,
          apirequest: log.apirequest,
          apiresponse: log.apiresponse,
          tokensused: log.tokensused,
          latency: log.latency,
          error_message: log.error_message,
          fallback_used: log.fallback_used,
          model_version: log.model_version,
          request_id: log.request_id,
          createdat: new Date().toISOString()
        })
        .select('log_id')
        .single()

      if (error) {
        console.error('Failed to log AI request:', error)
        return crypto.randomUUID() // Return fallback ID
      }

      return data.log_id
    } catch (error) {
      console.error('Error logging AI request:', error)
      return crypto.randomUUID() // Return fallback ID
    }
  }

  async logError(logId: string, error: Error): Promise<void> {
    try {
      await this.supabase
        .from('ai_log')
        .update({
          error_message: error.message,
          apiresponse: JSON.stringify({ error: error.message, stack: error.stack })
        })
        .eq('log_id', logId)
    } catch (logError) {
      console.error('Failed to log AI error:', logError)
    }
  }

  async getProviderStats(provider: string, days: number = 7): Promise<ProviderStats> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from('ai_log')
        .select('*')
        .eq('provider', provider)
        .gte('createdat', startDate.toISOString())

      if (error) {
        console.error('Failed to get provider stats:', error)
        return this.getDefaultStats()
      }

      const requests = data || []
      const totalRequests = requests.length
      const successfulRequests = requests.filter(r => !r.error_message).length
      const failedRequests = totalRequests - successfulRequests
      const averageLatency = requests.length > 0 
        ? requests.reduce((sum, r) => sum + (r.latency || 0), 0) / requests.length 
        : 0
      const totalTokens = requests.reduce((sum, r) => sum + (r.tokensused || 0), 0)
      const errorRate = totalRequests > 0 ? failedRequests / totalRequests : 0
      const lastRequest = requests.length > 0 
        ? new Date(Math.max(...requests.map(r => new Date(r.createdat).getTime())))
        : new Date()

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageLatency,
        totalTokens,
        errorRate,
        lastRequest
      }
    } catch (error) {
      console.error('Error getting provider stats:', error)
      return this.getDefaultStats()
    }
  }

  async getErrorRate(provider: string, hours: number = 24): Promise<number> {
    try {
      const startDate = new Date()
      startDate.setHours(startDate.getHours() - hours)

      const { data, error } = await this.supabase
        .from('ai_log')
        .select('*')
        .eq('provider', provider)
        .gte('createdat', startDate.toISOString())

      if (error) {
        console.error('Failed to get error rate:', error)
        return 0
      }

      const requests = data || []
      const totalRequests = requests.length
      const failedRequests = requests.filter(r => r.error_message).length

      return totalRequests > 0 ? failedRequests / totalRequests : 0
    } catch (error) {
      console.error('Error getting error rate:', error)
      return 0
    }
  }

  async getRecentErrors(provider?: string, limit: number = 10): Promise<EnhancedAILog[]> {
    try {
      let query = this.supabase
        .from('ai_log')
        .select('*')
        .not('error_message', 'is', null)
        .order('createdat', { ascending: false })
        .limit(limit)

      if (provider) {
        query = query.eq('provider', provider)
      }

      const { data, error } = await query

      if (error) {
        console.error('Failed to get recent errors:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting recent errors:', error)
      return []
    }
  }

  async getTokenUsage(provider: string, days: number = 7): Promise<number> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from('ai_log')
        .select('tokensused')
        .eq('provider', provider)
        .gte('createdat', startDate.toISOString())

      if (error) {
        console.error('Failed to get token usage:', error)
        return 0
      }

      return (data || []).reduce((sum, log) => sum + (log.tokensused || 0), 0)
    } catch (error) {
      console.error('Error getting token usage:', error)
      return 0
    }
  }

  async getAverageLatency(provider: string, hours: number = 24): Promise<number> {
    try {
      const startDate = new Date()
      startDate.setHours(startDate.getHours() - hours)

      const { data, error } = await this.supabase
        .from('ai_log')
        .select('latency')
        .eq('provider', provider)
        .gte('createdat', startDate.toISOString())
        .not('error_message', 'is', null)

      if (error) {
        console.error('Failed to get average latency:', error)
        return 0
      }

      const latencies = data || []
      return latencies.length > 0 
        ? latencies.reduce((sum, log) => sum + (log.latency || 0), 0) / latencies.length 
        : 0
    } catch (error) {
      console.error('Error getting average latency:', error)
      return 0
    }
  }

  async cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const { data, error } = await this.supabase
        .from('ai_log')
        .delete()
        .lt('createdat', cutoffDate.toISOString())
        .select('log_id')

      if (error) {
        console.error('Failed to cleanup old logs:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('Error cleaning up old logs:', error)
      return 0
    }
  }

  private getDefaultStats(): ProviderStats {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      totalTokens: 0,
      errorRate: 0,
      lastRequest: new Date()
    }
  }
} 