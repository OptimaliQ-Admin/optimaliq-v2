/**
 * 🔄 Shared Caching Utility for AI Modules
 *
 * Provides consistent caching behavior across all AI analysis modules:
 * - Weekly cache refresh every Monday at 12am
 * - 1-day refresh limit for manual refreshes
 * - Supabase integration for persistent storage
 * - Rate limiting and user tracking
 * - Signal score and metadata storage
 */

import { createClient } from '@supabase/supabase-js';

// Cache configuration
const REFRESH_LIMIT_HOURS = 24; // Manual refresh limit
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

// Base interface for cached insights
export interface CachedInsight {
  id?: string;
  user_id: string;
  industry: string;
  insight_data: any;
  model_version: string;
  signal_score?: number;
  insight_meta?: any;
  created_at: Date;
  last_refreshed?: Date;
}

// Rate limiting interface
export interface RefreshLimit {
  allowed: boolean;
  retryAfter?: number; // seconds
  lastRefresh?: Date;
}

export class SharedCaching {
  private static instance: SharedCaching;
  private supabase: any;

  private constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  static getInstance(): SharedCaching {
    if (!SharedCaching.instance) {
      SharedCaching.instance = new SharedCaching();
    }
    return SharedCaching.instance;
  }

  /**
   * Get the last Monday at 12am (midnight)
   */
  private getLastMonday12am(): Date {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate days to subtract to get to last Monday
    // If today is Monday (1), we want last Monday, so subtract 7
    // If today is Tuesday (2), we want last Monday, so subtract 1
    // If today is Sunday (0), we want last Monday, so subtract 6
    const daysToSubtract = currentDay === 1 ? 7 : currentDay === 0 ? 6 : currentDay - 1;
    
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - daysToSubtract);
    lastMonday.setHours(0, 0, 0, 0); // Set to 12am (midnight)
    
    return lastMonday;
  }

  /**
   * Check if cache is still valid (created after last Monday 12am)
   */
  private isCacheValid(createdAt: Date): boolean {
    const lastMonday12am = this.getLastMonday12am();
    return new Date(createdAt) > lastMonday12am;
  }

  /**
   * Check if a cached insight exists and is still valid
   */
  async getCachedInsight<T>(
    userId: string,
    industry: string,
    tableName: string
  ): Promise<T | null> {
    try {
      const { data: cachedInsight, error } = await this.supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('industry', industry)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !cachedInsight) {
        return null;
      }

      // Check if cache is still valid (created after last Monday 12am)
      const isValid = this.isCacheValid(cachedInsight.created_at);

      if (isValid) {
        const lastMonday = this.getLastMonday12am();
        const nextRefresh = new Date(lastMonday);
        nextRefresh.setDate(lastMonday.getDate() + 7); // Next Monday
        
        console.log(`✅ Returning cached ${tableName} for ${industry} (refreshes next Monday 12am)`);
        return cachedInsight.insight_data as T;
      } else {
        console.log(`⏰ Cached ${tableName} for ${industry} expired (older than last Monday 12am)`);
        return null;
      }
    } catch (error) {
      console.error(`Error checking cached ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Save insight to cache
   */
  async saveInsightToCache<T>(
    userId: string,
    industry: string,
    insight: T,
    tableName: string,
    modelVersion: string,
    signalScore?: number,
    insightMeta?: any
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .insert({
          user_id: userId,
          industry,
          insight_data: insight,
          model_version: modelVersion,
          signal_score: signalScore,
          insight_meta: insightMeta,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error(`Error saving ${tableName} to cache:`, error);
      } else {
        console.log(`💾 Saved ${tableName} to cache for ${industry}`);
      }
    } catch (error) {
      console.error(`Error saving ${tableName} to cache:`, error);
    }
  }

  /**
   * Check if user can perform a manual refresh (1 per day limit)
   */
  async checkRefreshLimit(
    userId: string,
    industry: string,
    tableName: string
  ): Promise<RefreshLimit> {
    try {
      const { data: lastRefresh, error } = await this.supabase
        .from(tableName)
        .select('last_refreshed')
        .eq('user_id', userId)
        .eq('industry', industry)
        .order('last_refreshed', { ascending: false })
        .limit(1)
        .single();

      if (error || !lastRefresh?.last_refreshed) {
        return { allowed: true };
      }

      const timeSinceLastRefresh = Date.now() - new Date(lastRefresh.last_refreshed).getTime();
      const hoursSinceLastRefresh = timeSinceLastRefresh / MILLISECONDS_PER_HOUR;

      if (hoursSinceLastRefresh < REFRESH_LIMIT_HOURS) {
        const retryAfter = Math.ceil((REFRESH_LIMIT_HOURS - hoursSinceLastRefresh) * 3600);
        return {
          allowed: false,
          retryAfter,
          lastRefresh: new Date(lastRefresh.last_refreshed)
        };
      }

      return { allowed: true, lastRefresh: new Date(lastRefresh.last_refreshed) };
    } catch (error) {
      console.error(`Error checking refresh limit for ${tableName}:`, error);
      return { allowed: true }; // Allow refresh on error
    }
  }

  /**
   * Update last refresh timestamp
   */
  async updateRefreshTimestamp(
    userId: string,
    industry: string,
    tableName: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .update({ last_refreshed: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('industry', industry);

      if (error) {
        console.error(`Error updating refresh timestamp for ${tableName}:`, error);
      }
    } catch (error) {
      console.error(`Error updating refresh timestamp for ${tableName}:`, error);
    }
  }

  /**
   * Delete cached insight
   */
  async deleteCachedInsight(
    userId: string,
    industry: string,
    tableName: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .eq('user_id', userId)
        .eq('industry', industry);

      if (error) {
        console.error(`Error deleting cached ${tableName}:`, error);
      } else {
        console.log(`🗑️ Deleted cached ${tableName} for ${industry}`);
      }
    } catch (error) {
      console.error(`Error deleting cached ${tableName}:`, error);
    }
  }

  /**
   * Force refresh insight (bypass cache but respect rate limits)
   */
  async forceRefreshInsight<T>(
    userId: string,
    industry: string,
    tableName: string,
    generateFunction: () => Promise<T>,
    modelVersion: string,
    signalScore?: number,
    insightMeta?: any
  ): Promise<T> {
    try {
      // Check refresh limit
      const refreshLimit = await this.checkRefreshLimit(userId, industry, tableName);
      if (!refreshLimit.allowed) {
        throw new Error(`Refresh limit exceeded. Please try again in ${refreshLimit.retryAfter} seconds.`);
      }

      // Delete existing cache
      await this.deleteCachedInsight(userId, industry, tableName);

      // Generate fresh insight
      const insight = await generateFunction();

      // Save to cache with refresh timestamp
      await this.saveInsightToCache(userId, industry, insight, tableName, modelVersion, signalScore, insightMeta);
      await this.updateRefreshTimestamp(userId, industry, tableName);

      console.log(`🔄 Force refreshed ${tableName} for ${industry}`);
      return insight;
    } catch (error) {
      console.error(`Error force refreshing ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Generate insight with caching support
   */
  async generateInsightWithCache<T>(
    userId: string,
    industry: string,
    tableName: string,
    generateFunction: () => Promise<T>,
    modelVersion: string,
    forceRefresh: boolean = false,
    signalScore?: number,
    insightMeta?: any
  ): Promise<T> {
    try {
      // Check for cached insight if not forcing refresh
      if (!forceRefresh) {
        const cachedInsight = await this.getCachedInsight<T>(userId, industry, tableName);
        if (cachedInsight) {
          return cachedInsight;
        }
      }

      // If force refresh, check rate limits
      if (forceRefresh) {
        const refreshLimit = await this.checkRefreshLimit(userId, industry, tableName);
        if (!refreshLimit.allowed) {
          throw new Error(`Refresh limit exceeded. Please try again in ${refreshLimit.retryAfter} seconds.`);
        }
      }

      // Generate fresh insight
      const insight = await generateFunction();

      // Save to cache
      await this.saveInsightToCache(userId, industry, insight, tableName, modelVersion, signalScore, insightMeta);

      // Update refresh timestamp if force refresh
      if (forceRefresh) {
        await this.updateRefreshTimestamp(userId, industry, tableName);
      }

      return insight;
    } catch (error) {
      console.error(`Error generating ${tableName} with cache:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const sharedCaching = SharedCaching.getInstance(); 