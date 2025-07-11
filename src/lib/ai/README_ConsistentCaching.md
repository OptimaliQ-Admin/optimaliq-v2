# 🔄 Consistent AI Module Caching System

## Overview

This document describes the unified caching system implemented across all AI analysis modules to ensure consistent behavior, performance optimization, and cost control.

## 🎯 Design Goals

- **7-day cache** for regular insights to reduce AI costs
- **1-day refresh limit** for manual refreshes to prevent abuse
- **Consistent behavior** across all AI modules
- **Signal score integration** for advanced analytics
- **Supabase persistence** for reliable data storage
- **Rate limiting** to protect against abuse

## 📊 Cached Modules

| Module | Table Name | Cache Duration | Refresh Limit |
|--------|------------|----------------|---------------|
| Enhanced Market Analysis | `market_insights` | 7 days | 1 per day |
| Business Trend Analysis | `business_trends` | 7 days | 1 per day |
| Engagement Intelligence | `engagement_insights` | 7 days | 1 per day |

## 🏗️ Architecture

### Shared Caching Utility (`sharedCaching.ts`)

The `SharedCaching` class provides unified caching functionality:

```typescript
export class SharedCaching {
  // Core caching methods
  async getCachedInsight<T>(userId, industry, tableName): Promise<T | null>
  async saveInsightToCache<T>(userId, industry, insight, tableName, modelVersion, signalScore?, insightMeta?): Promise<void>
  async generateInsightWithCache<T>(userId, industry, tableName, generateFunction, modelVersion, forceRefresh?, signalScore?, insightMeta?): Promise<T>
  
  // Rate limiting methods
  async checkRefreshLimit(userId, industry, tableName): Promise<RefreshLimit>
  async forceRefreshInsight<T>(userId, industry, tableName, generateFunction, modelVersion, signalScore?, insightMeta?): Promise<T>
}
```

### Database Schema

Each caching table follows this structure:

```sql
CREATE TABLE table_name (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    industry TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    model_version TEXT NOT NULL,
    signal_score DECIMAL(5,2),
    insight_meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_refreshed TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT unique_user_industry UNIQUE (user_id, industry),
    CONSTRAINT signal_score_range CHECK (signal_score >= -100 AND signal_score <= 100)
);
```

## 🔄 Caching Flow

### 1. Regular Load (No Force Refresh)

```mermaid
graph TD
    A[User requests insight] --> B{Check cache}
    B -->|Cache exists & < 7 days| C[Return cached insight]
    B -->|No cache or expired| D[Generate new insight]
    D --> E[Save to cache]
    E --> F[Return insight]
```

### 2. Manual Refresh (Force Refresh)

```mermaid
graph TD
    A[User requests refresh] --> B{Check refresh limit}
    B -->|Limit exceeded| C[Return error with retry time]
    B -->|Limit OK| D[Delete old cache]
    D --> E[Generate new insight]
    E --> F[Save to cache]
    F --> G[Update refresh timestamp]
    G --> H[Return insight]
```

## 📝 API Usage

### Enhanced Market Analysis

```typescript
import { enhancedMarketAnalysis } from './enhancedMarketAnalysis';

// Regular load (uses cache if available)
const insight = await enhancedMarketAnalysis.generateMarketInsightWithCache(
  userId,
  industry,
  userTier
);

// Force refresh (respects rate limits)
const refreshedInsight = await enhancedMarketAnalysis.forceRefreshInsight(
  userId,
  industry,
  userTier
);

// Check if refresh is allowed
const refreshLimit = await enhancedMarketAnalysis.checkRefreshLimit(userId, industry);
```

### Business Trend Analysis

```typescript
import { businessTrendAnalysis } from './businessTrendAnalysis';

// Regular load (uses cache if available)
const trends = await businessTrendAnalysis.generateBusinessTrendsWithCache(
  userId,
  industry,
  userTier
);

// Force refresh (respects rate limits)
const refreshedTrends = await businessTrendAnalysis.forceRefreshBusinessTrends(
  userId,
  industry,
  userTier
);
```

### Engagement Intelligence

```typescript
import { engagementIntelligenceAnalysis } from './engagementIntelligenceAnalysis';

// Regular load (uses cache if available)
const insight = await engagementIntelligenceAnalysis.generateEngagementInsightWithCache(
  userId,
  industry,
  userTier
);

// Force refresh (respects rate limits)
const refreshedInsight = await engagementIntelligenceAnalysis.forceRefreshEngagementInsight(
  userId,
  industry,
  userTier
);
```

## 🎛️ Configuration

### Cache Duration

```typescript
const CACHE_DURATION_DAYS = 7; // Regular cache duration
const REFRESH_LIMIT_HOURS = 24; // Manual refresh limit
```

### Signal Score Integration

All modules store signal scores and metadata:

```typescript
interface CachedInsight {
  signal_score?: number;        // -100 to 100
  insight_meta?: {              // Additional metadata
    signalFactors: SignalFactors;
    signalData: SignalData;
  };
}
```

## 🔒 Security & Performance

### Row Level Security (RLS)

All caching tables have RLS enabled with policies:

- Users can only access their own cached insights
- Automatic cleanup of old data (30+ days)
- Proper indexing for performance

### Rate Limiting

- **1 refresh per day per user per industry**
- Automatic retry-after calculation
- Graceful error handling

### Performance Optimizations

- Database indexes on `(user_id, industry)`, `created_at`, `last_refreshed`
- JSONB storage for flexible insight data
- Efficient cache invalidation

## 🚀 Benefits

### Cost Optimization
- **Reduced AI API calls** through intelligent caching
- **7-day cache** significantly reduces costs
- **Smart refresh limits** prevent abuse

### User Experience
- **Faster response times** for cached insights
- **Consistent behavior** across all modules
- **Clear feedback** on refresh limits

### Developer Experience
- **Unified API** across all modules
- **Shared logic** reduces code duplication
- **Type-safe** caching with generics

## 🔧 Maintenance

### Database Cleanup

Automatic cleanup function removes old data:

```sql
SELECT cleanup_old_ai_insights(); -- Removes insights older than 30 days
```

### Monitoring

Key metrics to monitor:

- Cache hit rates
- Refresh limit violations
- Storage usage
- API response times

## 🐛 Troubleshooting

### Common Issues

1. **"Refresh limit exceeded"**
   - User tried to refresh more than once per day
   - Wait for the retry-after time or use cached data

2. **"Invalid AI response format"**
   - AI model returned malformed JSON
   - Check logs for raw AI response
   - Consider adjusting prompts

3. **Cache not working**
   - Check Supabase connection
   - Verify RLS policies
   - Check table permissions

### Debug Commands

```typescript
// Check cache status
const cached = await module.getCachedInsight(userId, industry);

// Check refresh limit
const limit = await module.checkRefreshLimit(userId, industry);

// Force cleanup (admin only)
await supabase.rpc('cleanup_old_ai_insights');
```

## 📈 Future Enhancements

- **Adaptive cache duration** based on signal strength
- **Multi-region caching** for global users
- **Cache warming** for popular industries
- **Analytics dashboard** for cache performance
- **A/B testing** for cache strategies 