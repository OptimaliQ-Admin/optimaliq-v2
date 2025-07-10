/**
 * AI Rate Limiter
 * 
 * Provides rate limiting for AI API calls with:
 * - Per-user limits based on subscription tier
 * - Per-provider limits to prevent abuse
 * - Model-specific limits for cost control
 * - Automatic fallback to alternative providers
 * - Real-time monitoring and alerting
 */

import { supabase } from '@/lib/supabase';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  provider: string; // AI provider (openai, claude, vertex, mistral)
  model?: string; // Specific model (optional)
  tier?: string; // User subscription tier
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  provider: string;
  model?: string;
  fallbackProvider?: string;
  retryAfter?: number;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  fallbackUsed: number;
  averageResponseTime: number;
  errorRate: number;
  lastReset: Date;
}

class AIRateLimiter {
  private static instance: AIRateLimiter;
  private cache = new Map<string, { count: number; resetTime: Date }>();
  private stats = new Map<string, RateLimitStats>();

  // Default rate limits by subscription tier
  private readonly tierLimits = {
    free: { requestsPerMinute: 10, requestsPerHour: 100, requestsPerDay: 1000 },
    basic: { requestsPerMinute: 30, requestsPerHour: 500, requestsPerDay: 5000 },
    premium: { requestsPerMinute: 60, requestsPerHour: 1000, requestsPerDay: 10000 },
    enterprise: { requestsPerMinute: 200, requestsPerHour: 5000, requestsPerDay: 50000 }
  };

  // Provider-specific limits
  private readonly providerLimits = {
    openai: { requestsPerMinute: 100, requestsPerHour: 2000 },
    claude: { requestsPerMinute: 50, requestsPerHour: 1000 },
    vertex: { requestsPerMinute: 80, requestsPerHour: 1500 },
    mistral: { requestsPerMinute: 60, requestsPerHour: 1200 }
  };

  // Model-specific cost limits
  private readonly modelLimits = {
    'gpt-4': { requestsPerMinute: 20, requestsPerHour: 200 },
    'gpt-4-turbo': { requestsPerMinute: 40, requestsPerHour: 400 },
    'gpt-3.5-turbo': { requestsPerMinute: 100, requestsPerHour: 1000 },
    'claude-3-opus': { requestsPerMinute: 10, requestsPerHour: 100 },
    'claude-3-sonnet': { requestsPerMinute: 30, requestsPerHour: 300 },
    'claude-3-haiku': { requestsPerMinute: 60, requestsPerHour: 600 },
    'gemini-pro': { requestsPerMinute: 50, requestsPerHour: 500 },
    'mistral-large': { requestsPerMinute: 20, requestsPerHour: 200 },
    'mistral-medium': { requestsPerMinute: 40, requestsPerHour: 400 }
  };

  private constructor() {
    this.initializeStats();
    this.startCleanupInterval();
  }

  static getInstance(): AIRateLimiter {
    if (!AIRateLimiter.instance) {
      AIRateLimiter.instance = new AIRateLimiter();
    }
    return AIRateLimiter.instance;
  }

  /**
   * Check if a request is allowed based on rate limits
   */
  async checkRateLimit(
    userId: string,
    provider: string,
    model?: string,
    tier: string = 'free'
  ): Promise<RateLimitResult> {
    const now = new Date();
    const key = this.generateKey(userId, provider, model);
    
    // Get current usage
    const current = this.cache.get(key) || { count: 0, resetTime: new Date(now.getTime() + 60000) };
    
    // Check if window has reset
    if (now > current.resetTime) {
      current.count = 0;
      current.resetTime = new Date(now.getTime() + 60000); // 1 minute window
    }

    // Get limits
    const limits = this.getLimits(tier, provider, model);
    const isAllowed = current.count < limits.requestsPerMinute;

    if (isAllowed) {
      // Increment counter
      current.count++;
      this.cache.set(key, current);
      
      // Update stats
      this.updateStats(key, true, false);
      
      // Log to database
      await this.logRateLimitCheck(userId, provider, model, true, current.count);
    } else {
      // Update stats
      this.updateStats(key, false, false);
      
      // Log to database
      await this.logRateLimitCheck(userId, provider, model, false, current.count);
      
      // Check for fallback provider
      const fallbackProvider = this.getFallbackProvider(provider);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
        provider,
        model,
        fallbackProvider,
        retryAfter: Math.ceil((current.resetTime.getTime() - now.getTime()) / 1000)
      };
    }

    return {
      allowed: true,
      remaining: limits.requestsPerMinute - current.count,
      resetTime: current.resetTime,
      provider,
      model
    };
  }

  /**
   * Record a successful AI request
   */
  async recordRequest(
    userId: string,
    provider: string,
    model: string,
    responseTime: number,
    success: boolean,
    tokensUsed?: number
  ): Promise<void> {
    const key = this.generateKey(userId, provider, model);
    
    // Update stats
    this.updateStats(key, success, true, responseTime);
    
    // Log to database
    await this.logAIRequest(userId, provider, model, responseTime, success, tokensUsed);
  }

  /**
   * Get rate limit statistics
   */
  getStats(provider?: string): RateLimitStats[] {
    if (provider) {
      const stats = this.stats.get(provider);
      return stats ? [stats] : [];
    }
    
    return Array.from(this.stats.values());
  }

  /**
   * Reset rate limits for a user (admin function)
   */
  async resetUserLimits(userId: string, provider?: string): Promise<void> {
    if (provider) {
      const key = this.generateKey(userId, provider);
      this.cache.delete(key);
    } else {
      // Reset all providers for user
      for (const [key] of this.cache) {
        if (key.startsWith(`${userId}:`)) {
          this.cache.delete(key);
        }
      }
    }
    
    // Log reset action
    await this.logAdminAction('reset_rate_limits', { userId, provider });
  }

  /**
   * Get current usage for a user
   */
  async getUserUsage(userId: string): Promise<Record<string, any>> {
    const usage: Record<string, any> = {};
    
    for (const [key, value] of this.cache) {
      if (key.startsWith(`${userId}:`)) {
        const [, provider, model] = key.split(':');
        const providerKey = model ? `${provider}:${model}` : provider;
        
        if (!usage[providerKey]) {
          usage[providerKey] = {
            current: 0,
            resetTime: value.resetTime,
            remaining: 0
          };
        }
        
        usage[providerKey].current = Math.max(usage[providerKey].current, value.count);
        usage[providerKey].resetTime = value.resetTime;
        
        // Calculate remaining based on limits
        const limits = this.getLimits('premium', provider, model);
        usage[providerKey].remaining = Math.max(0, limits.requestsPerMinute - value.count);
      }
    }
    
    return usage;
  }

  /**
   * Generate cache key for rate limiting
   */
  private generateKey(userId: string, provider: string, model?: string): string {
    return model ? `${userId}:${provider}:${model}` : `${userId}:${provider}`;
  }

  /**
   * Get rate limits based on tier, provider, and model
   */
  private getLimits(tier: string, provider: string, model?: string): { requestsPerMinute: number; requestsPerHour: number } {
    const tierLimit = this.tierLimits[tier as keyof typeof this.tierLimits] || this.tierLimits.free;
    const providerLimit = this.providerLimits[provider as keyof typeof this.providerLimits] || { requestsPerMinute: 50, requestsPerHour: 1000 };
    
    if (model) {
      const modelLimit = this.modelLimits[model as keyof typeof this.modelLimits];
      if (modelLimit) {
        return {
          requestsPerMinute: Math.min(tierLimit.requestsPerMinute, providerLimit.requestsPerMinute, modelLimit.requestsPerMinute),
          requestsPerHour: Math.min(tierLimit.requestsPerHour, providerLimit.requestsPerHour, modelLimit.requestsPerHour)
        };
      }
    }
    
    return {
      requestsPerMinute: Math.min(tierLimit.requestsPerMinute, providerLimit.requestsPerMinute),
      requestsPerHour: Math.min(tierLimit.requestsPerHour, providerLimit.requestsPerHour)
    };
  }

  /**
   * Get fallback provider when rate limit is exceeded
   */
  private getFallbackProvider(provider: string): string | undefined {
    const fallbackMap: Record<string, string[]> = {
      openai: ['claude', 'vertex', 'mistral'],
      claude: ['openai', 'vertex', 'mistral'],
      vertex: ['openai', 'claude', 'mistral'],
      mistral: ['openai', 'claude', 'vertex']
    };
    
    const fallbacks = fallbackMap[provider];
    return fallbacks ? fallbacks[0] : undefined;
  }

  /**
   * Update statistics
   */
  private updateStats(key: string, success: boolean, isRequest: boolean, responseTime?: number): void {
    const [, provider] = key.split(':');
    const stats = this.stats.get(provider) || {
      totalRequests: 0,
      blockedRequests: 0,
      fallbackUsed: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastReset: new Date()
    };
    
    if (isRequest) {
      stats.totalRequests++;
      if (!success) {
        stats.blockedRequests++;
      }
      
      if (responseTime) {
        stats.averageResponseTime = (stats.averageResponseTime * (stats.totalRequests - 1) + responseTime) / stats.totalRequests;
      }
      
      stats.errorRate = stats.blockedRequests / stats.totalRequests;
    } else {
      if (!success) {
        stats.blockedRequests++;
      }
    }
    
    this.stats.set(provider, stats);
  }

  /**
   * Initialize statistics
   */
  private initializeStats(): void {
    const providers = ['openai', 'claude', 'vertex', 'mistral'];
    providers.forEach(provider => {
      this.stats.set(provider, {
        totalRequests: 0,
        blockedRequests: 0,
        fallbackUsed: 0,
        averageResponseTime: 0,
        errorRate: 0,
        lastReset: new Date()
      });
    });
  }

  /**
   * Start cleanup interval to remove expired entries
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = new Date();
      for (const [key, value] of this.cache) {
        if (now > value.resetTime) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }

  /**
   * Log rate limit check to database
   */
  private async logRateLimitCheck(
    userId: string,
    provider: string,
    model: string | undefined,
    allowed: boolean,
    currentCount: number
  ): Promise<void> {
    try {
      await supabase
        .from('ai_rate_limits')
        .upsert({
          u_id: userId,
          provider,
          model: model || null,
          request_count: currentCount,
          last_request: new Date().toISOString(),
          allowed,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log rate limit check:', error);
    }
  }

  /**
   * Log AI request to database
   */
  private async logAIRequest(
    userId: string,
    provider: string,
    model: string,
    responseTime: number,
    success: boolean,
    tokensUsed?: number
  ): Promise<void> {
    try {
      await supabase
        .from('ai_log')
        .insert({
          u_id: userId,
          provider,
          model,
          response_time: responseTime,
          success,
          tokens_used: tokensUsed,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log AI request:', error);
    }
  }

  /**
   * Log admin actions
   */
  private async logAdminAction(action: string, details: Record<string, any>): Promise<void> {
    try {
      await supabase
        .from('admin_audit_log')
        .insert({
          action,
          details,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }
}

// Export singleton instance
export const aiRateLimiter = AIRateLimiter.getInstance(); 