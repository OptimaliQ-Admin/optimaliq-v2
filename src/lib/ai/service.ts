import { aiClient, AIProviderError } from './client'
import { realtimeManager } from './realtime'
import { createClient } from '@supabase/supabase-js'

export interface AITask {
  taskId: string
  type: 'analysis' | 'generation' | 'scoring' | 'custom'
  data: any
  priority: 'low' | 'normal' | 'high' | 'urgent'
  userId?: string
  metadata?: Record<string, any>
}

export interface AITaskResult {
  taskId: string
  success: boolean
  result?: any
  error?: string
  processingTime: number
  tokensUsed: number
  provider: string
}

export interface RateLimitInfo {
  userId: string
  provider: string
  requestCount: number
  lastRequest: Date
  limit: number
  resetTime: Date
}

export class AIService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  private taskQueue: AITask[] = []
  private processingTasks: Set<string> = new Set()
  private rateLimits: Map<string, RateLimitInfo> = new Map()
  private isProcessing = false

  constructor() {
    this.setupRealtimeListeners()
    this.startTaskProcessor()
  }

  private setupRealtimeListeners(): void {
    // Listen for AI status updates
    realtimeManager.on('ai_status_update', (update) => {
      console.log(`🤖 AI Status Update: ${update.provider} - ${update.status}`)
      this.handleAIStatusUpdate(update)
    })

    // Listen for task completion events
    realtimeManager.on('ai_task_complete', (data) => {
      console.log(`✅ AI Task Complete: ${data.taskId}`)
      this.handleTaskComplete(data)
    })

    // Listen for task failure events
    realtimeManager.on('ai_task_failed', (data) => {
      console.error(`❌ AI Task Failed: ${data.taskId} - ${data.error}`)
      this.handleTaskFailure(data)
    })
  }

  async generateText(prompt: string, options?: any, userId?: string): Promise<any> {
    const taskId = crypto.randomUUID()
    
    try {
      // Check rate limits
      if (userId) {
        await this.checkRateLimit(userId, 'openai')
      }

      // Broadcast task start
      await realtimeManager.broadcastAIProgressUpdate({
        taskId,
        progress: 0,
        status: 'processing'
      })

      const result = await aiClient.generate(prompt, options)

      // Update rate limits
      if (userId) {
        await this.updateRateLimit(userId, 'openai')
      }

      // Broadcast task completion
      await realtimeManager.broadcastAIProgressUpdate({
        taskId,
        progress: 100,
        status: 'completed'
      })

      await realtimeManager.broadcastAITaskComplete(taskId, result)

      return result
    } catch (error) {
      // Broadcast task failure
      await realtimeManager.broadcastAIProgressUpdate({
        taskId,
        progress: 0,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })

      await realtimeManager.broadcastAITaskFailed(taskId, error instanceof Error ? error.message : 'Unknown error')

      throw error
    }
  }

  async analyzeBusinessData(data: any, context: string, userId?: string): Promise<any> {
    const taskId = crypto.randomUUID()
    
    try {
      // Check rate limits
      if (userId) {
        await this.checkRateLimit(userId, 'openai')
      }

      // Broadcast task start
      await realtimeManager.broadcastAIProgressUpdate({
        taskId,
        progress: 0,
        status: 'processing'
      })

      const result = await aiClient.analyze(data, context)

      // Update rate limits
      if (userId) {
        await this.updateRateLimit(userId, 'openai')
      }

      // Broadcast task completion
      await realtimeManager.broadcastAIProgressUpdate({
        taskId,
        progress: 100,
        status: 'completed'
      })

      await realtimeManager.broadcastAITaskComplete(taskId, result)

      return result
    } catch (error) {
      // Broadcast task failure
      await realtimeManager.broadcastAIProgressUpdate({
        taskId,
        progress: 0,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })

      await realtimeManager.broadcastAITaskFailed(taskId, error instanceof Error ? error.message : 'Unknown error')

      throw error
    }
  }

  async queueTask(task: AITask): Promise<string> {
    const taskId = crypto.randomUUID()
    
    const queuedTask: AITask = {
      ...task,
      taskId
    }

    // Add to database queue
    await this.addTaskToQueue(queuedTask)

    // Add to local queue
    this.taskQueue.push(queuedTask)

    // Broadcast task queued
    await realtimeManager.broadcastAIProgressUpdate({
      taskId,
      progress: 0,
      status: 'queued'
    })

    console.log(`📋 Task queued: ${taskId} (${task.type})`)
    return taskId
  }

  async getTaskStatus(taskId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('ai_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single()

      if (error) {
        console.error('Failed to get task status:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting task status:', error)
      return null
    }
  }

  async getProviderHealth(): Promise<any[]> {
    return aiClient.getProviderHealth()
  }

  async switchProvider(provider: string): Promise<void> {
    await aiClient.switchProvider(provider)
    
    // Broadcast provider switch
    await realtimeManager.broadcastEvent('ai_provider_switched', {
      provider,
      timestamp: new Date().toISOString()
    })
  }

  async getProviderStats(provider: string, days: number = 7): Promise<any> {
    return aiClient.getProviderStats(provider, days)
  }

  async getUserStats(userId: string, days: number = 7): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_user_ai_stats', {
          user_id: userId,
          days_back: days
        })

      if (error) {
        console.error('Failed to get user stats:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('Error getting user stats:', error)
      return null
    }
  }

  async getRateLimitInfo(userId: string, provider: string): Promise<RateLimitInfo | null> {
    try {
      const { data, error } = await this.supabase
        .from('ai_rate_limits')
        .select('*')
        .eq('u_id', userId)
        .eq('provider', provider)
        .single()

      if (error) {
        return null
      }

      return {
        userId: data.u_id,
        provider: data.provider,
        requestCount: data.request_count,
        lastRequest: new Date(data.last_request),
        limit: 1000, // Default limit
        resetTime: new Date(data.last_request.getTime() + 24 * 60 * 60 * 1000) // 24 hours
      }
    } catch (error) {
      console.error('Error getting rate limit info:', error)
      return null
    }
  }

  private async checkRateLimit(userId: string, provider: string): Promise<void> {
    const rateLimit = await this.getRateLimitInfo(userId, provider)
    
    if (rateLimit) {
      const now = new Date()
      const timeSinceLastRequest = now.getTime() - rateLimit.lastRequest.getTime()
      
      // Reset counter if 24 hours have passed
      if (timeSinceLastRequest > 24 * 60 * 60 * 1000) {
        return // Allow request, counter will be reset
      }
      
      if (rateLimit.requestCount >= rateLimit.limit) {
        throw new Error(`Rate limit exceeded for ${provider}. Limit: ${rateLimit.limit} requests per day.`)
      }
    }
  }

  private async updateRateLimit(userId: string, provider: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_rate_limits')
        .upsert({
          u_id: userId,
          provider,
          request_count: 1,
          last_request: new Date().toISOString()
        }, {
          onConflict: 'u_id,provider'
        })

      if (error) {
        console.error('Failed to update rate limit:', error)
      }
    } catch (error) {
      console.error('Error updating rate limit:', error)
    }
  }

  private async addTaskToQueue(task: AITask): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_tasks')
        .insert({
          task_id: task.taskId,
          task_type: task.type,
          task_data: task.data,
          priority: task.priority,
          status: 'queued'
        })

      if (error) {
        console.error('Failed to add task to queue:', error)
        throw error
      }
    } catch (error) {
      console.error('Error adding task to queue:', error)
      throw error
    }
  }

  private async startTaskProcessor(): Promise<void> {
    if (this.isProcessing) return
    
    this.isProcessing = true
    
    while (this.isProcessing) {
      try {
        // Get next task from database
        const { data: tasks, error } = await this.supabase
          .from('ai_tasks')
          .select('*')
          .eq('status', 'queued')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: true })
          .limit(5)

        if (error) {
          console.error('Failed to get tasks from queue:', error)
          await this.sleep(5000)
          continue
        }

        for (const task of tasks || []) {
          if (this.processingTasks.has(task.task_id)) {
            continue
          }

          this.processingTasks.add(task.task_id)
          
          // Update task status to processing
          await this.updateTaskStatus(task.task_id, 'processing')
          
          // Process task
          this.processTask(task).catch(console.error)
        }

        await this.sleep(1000) // Wait 1 second before next iteration
      } catch (error) {
        console.error('Task processor error:', error)
        await this.sleep(5000)
      }
    }
  }

  private async processTask(task: any): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Broadcast task start
      await realtimeManager.broadcastAIProgressUpdate({
        taskId: task.task_id,
        progress: 10,
        status: 'processing'
      })

      let result: any

      switch (task.task_type) {
        case 'analysis':
          result = await aiClient.analyze(task.task_data.data, task.task_data.context)
          break
        case 'generation':
          result = await aiClient.generate(task.task_data.prompt, task.task_data.options)
          break
        case 'scoring':
          result = await aiClient.analyze(task.task_data, 'business scoring')
          break
        default:
          throw new Error(`Unknown task type: ${task.task_type}`)
      }

      const processingTime = Date.now() - startTime

      // Update task status to completed
      await this.updateTaskStatus(task.task_id, 'completed', result)

      // Broadcast task completion
      await realtimeManager.broadcastAIProgressUpdate({
        taskId: task.task_id,
        progress: 100,
        status: 'completed'
      })

      await realtimeManager.broadcastAITaskComplete(task.task_id, {
        result,
        processingTime,
        tokensUsed: result.tokensUsed || 0,
        provider: result.provider || 'unknown'
      })

      console.log(`✅ Task completed: ${task.task_id} (${processingTime}ms)`)
    } catch (error) {
      const processingTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Update task status to failed
      await this.updateTaskStatus(task.task_id, 'failed', null, errorMessage)

      // Broadcast task failure
      await realtimeManager.broadcastAIProgressUpdate({
        taskId: task.task_id,
        progress: 0,
        status: 'failed',
        message: errorMessage
      })

      await realtimeManager.broadcastAITaskFailed(task.task_id, errorMessage)

      console.error(`❌ Task failed: ${task.task_id} - ${errorMessage}`)
    } finally {
      this.processingTasks.delete(task.task_id)
    }
  }

  private async updateTaskStatus(taskId: string, status: string, result?: any, error?: string): Promise<void> {
    try {
      const updateData: any = {
        status,
        started_at: status === 'processing' ? new Date().toISOString() : undefined,
        completed_at: ['completed', 'failed'].includes(status) ? new Date().toISOString() : undefined
      }

      if (result) {
        updateData.task_data = { ...updateData.task_data, result }
      }

      if (error) {
        updateData.error_message = error
      }

      const { error: updateError } = await this.supabase
        .from('ai_tasks')
        .update(updateData)
        .eq('task_id', taskId)

      if (updateError) {
        console.error('Failed to update task status:', updateError)
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  private handleAIStatusUpdate(update: any): void {
    // Handle AI provider status updates
    console.log(`🤖 AI Provider ${update.provider} status: ${update.status}`)
    
    if (update.status === 'down') {
      // Switch to fallback provider if available
      this.switchToFallbackProvider(update.provider).catch(console.error)
    }
  }

  private handleTaskComplete(data: any): void {
    // Handle task completion events
    console.log(`✅ Task ${data.taskId} completed successfully`)
  }

  private handleTaskFailure(data: any): void {
    // Handle task failure events
    console.error(`❌ Task ${data.taskId} failed: ${data.error}`)
  }

  private async switchToFallbackProvider(failedProvider: string): Promise<void> {
    const health = await aiClient.getProviderHealth()
    const healthyProviders = health.filter(h => h.isHealthy && h.provider !== failedProvider)
    
    if (healthyProviders.length > 0) {
      const fallbackProvider = healthyProviders[0].provider
      await this.switchProvider(fallbackProvider)
      console.log(`🔄 Switched to fallback provider: ${fallbackProvider}`)
    } else {
      console.error('❌ No healthy fallback providers available')
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  stop(): void {
    this.isProcessing = false
  }
}

// Export singleton instance
export const aiService = new AIService() 