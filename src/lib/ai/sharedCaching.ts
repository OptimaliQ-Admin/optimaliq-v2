/**
 * 🔄 Shared Caching Utility for AI Modules
 *
 * Provides consistent caching behavior across all AI analysis modules:
 * - 7-day cache for regular insights
 * - 1-day refresh limit for manual refreshes
 * - Supabase integration for persistent storage
 * - Rate limiting and user tracking
 * - Signal score and metadata storage
 */

import { createClient } from '@supabase/supabase-js';

// Cache configuration
const CACHE_DURATION_DAYS = 7; // Regular cache duration
const REFRESH_LIMIT_HOURS = 24; // Manual refresh limit
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
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

      // Check if cache is still valid (within 7 days)
      const cacheAge = Date.now() - new Date(cachedInsight.created_at).getTime();
      const isValid = cacheAge < (CACHE_DURATION_DAYS * MILLISECONDS_PER_DAY);

      if (isValid) {
        console.log(`✅ Returning cached ${tableName} for ${industry} (age: ${Math.round(cacheAge / MILLISECONDS_PER_DAY)} days)`);
        return cachedInsight.insight_data as T;
      } else {
        console.log(`⏰ Cached ${tableName} for ${industry} expired (age: ${Math.round(cacheAge / MILLISECONDS_PER_DAY)} days)`);
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