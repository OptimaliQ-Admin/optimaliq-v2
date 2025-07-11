# Dashboard Enhancements

## Current State

### Overview
The Premium Dashboard is a comprehensive business intelligence platform that provides real-time insights, market analysis, and strategic recommendations. It's built with Next.js 14, TypeScript, and integrates with Supabase for data storage and real-time features.

### Page Structure
**Location**: `src/app/premium/dashboard/page.tsx`

The dashboard is organized into 5 main sections:
1. **Score Overview** - Business maturity assessment scores
2. **Performance Summary** - Industry benchmarking and positioning
3. **Growth Analysis** - Strategic planning and growth charts
4. **Performance Insights** - Strengths and improvement areas
5. **Market Intelligence** - Real-time market and engagement insights

---

## Components

### Core Dashboard Components

#### 1. **ScoreCard** (`src/components/dashboard/ScoreCard.tsx`)
- **Purpose**: Displays individual business scores (Overall, Strategy, Process, Technology)
- **Features**: 
  - Score visualization with industry comparison
  - Click-to-learn-more functionality
  - Animated score display
  - Industry percentile positioning

#### 2. **InsightCard** (`src/components/dashboard/InsightCard.tsx`)
- **Purpose**: Displays lists of insights (strengths, weaknesses, roadmap items)
- **Features**:
  - Clean list presentation
  - Hover effects
  - Responsive design

#### 3. **GrowthChart** (`src/components/dashboard/GrowthChart.tsx`)
- **Purpose**: Visualizes growth trajectory and projections
- **Features**:
  - Interactive charts using Chart.js
  - Multiple data series
  - Responsive design
  - Growth projections

#### 4. **PerformanceFunnelChart** (`src/components/dashboard/PerformanceFunnelChart.tsx`)
- **Purpose**: Shows performance funnel from strategy to execution
- **Features**:
  - Funnel visualization
  - Score comparisons
  - Industry benchmarking

#### 5. **CardLoadingAnimation** (`src/components/dashboard/CardLoadingAnimation.tsx`)
- **Purpose**: Provides consistent loading states for all cards
- **Features**:
  - Spinning loader with gradient background
  - Animated progress bar
  - Customizable loading messages
  - Smooth fade-in animations

### Market Intelligence Components

#### 6. **EnhancedMarketInsightCard** (`src/components/dashboard/EnhancedMarketInsightCard.tsx`)
- **Purpose**: Real-time market intelligence and analysis
- **Features**:
  - Market size, growth rate, competition, sentiment metrics
  - TradingView ticker integration
  - AI-generated insights
  - Monday-only refresh schedule
  - Modal with detailed market report

#### 7. **BusinessTrendCard** (`src/components/dashboard/BusinessTrendCard.tsx`)
- **Purpose**: Strategic business trend analysis
- **Features**:
  - Trend direction indicators (up/down/stable)
  - Percentage change displays
  - News ticker integration
  - Monday-only refresh schedule
  - Modal with detailed trend report

#### 8. **EngagementIntelligenceCard** (`src/components/dashboard/EngagementIntelligenceCard.tsx`)
- **Purpose**: Customer engagement and marketing intelligence
- **Features**:
  - Signal score visualization
  - Engagement trends
  - Strategic recommendations
  - Monday-only refresh schedule
  - Modal with detailed engagement report

### Supporting Components

#### 9. **SectionHeader** (`src/components/dashboard/SectionHeader.tsx`)
- **Purpose**: Consistent section headers across dashboard
- **Features**: Title, subtitle, and icon support

#### 10. **ScoreContextModal** (`src/components/dashboard/ScoreContextModal.tsx`)
- **Purpose**: Detailed score explanations and context
- **Features**: Modal popup with score breakdowns

#### 11. **InsightLoading** (`src/components/dashboard/InsightLoading.tsx`)
- **Purpose**: Main dashboard loading state
- **Features**: Rotating motivational quotes, progress bar

#### 12. **PageNavigation** (`src/components/shared/PageNavigation.tsx`)
- **Purpose**: Floating navigation between dashboard sections
- **Features**: Smooth scrolling, section highlighting

### Modal Components

#### 13. **DashboardExplanationModal** (`src/components/modals/DashboardExplanationModal.tsx`)
- **Purpose**: First-time user onboarding
- **Features**: Dashboard walkthrough, feature explanations

#### 14. **EnhancedAIInsightModal** (`src/components/modals/EnhancedAIInsightModal.tsx`)
- **Purpose**: Detailed AI-generated market insights
- **Features**: Comprehensive market analysis, data sources

#### 15. **BusinessTrendModal** (`src/components/modals/BusinessTrendModal.tsx`)
- **Purpose**: Detailed business trend analysis
- **Features**: Trend breakdowns, strategic implications

---

## API Endpoints

### Core Dashboard APIs

#### 1. **Main Dashboard** (`/api/dashboard/route.ts`)
- **Method**: POST
- **Purpose**: Fetches all dashboard data
- **Returns**: Complete dashboard insights object
- **Data**: Scores, strengths, weaknesses, roadmap, chart data

#### 2. **Welcome Message** (`/api/dashboard/welcome_message/route.ts`)
- **Method**: POST
- **Purpose**: Personalized welcome messages
- **Returns**: First name, quote, author

#### 3. **Scorecard Insights** (`/api/dashboard/scorecard_insights/route.ts`)
- **Method**: POST
- **Purpose**: Detailed score explanations
- **Returns**: Score breakdown and recommendations

### Market Intelligence APIs

#### 4. **Enhanced Market Insights** (`/api/market-insights/enhanced/route.ts`)
- **Method**: GET/POST
- **Purpose**: Real-time market intelligence
- **Features**:
  - Shared caching system (Monday-only refresh)
  - Industry-specific analysis
  - Multiple data sources (Finnhub, Alpha Vantage, News API)
- **Returns**: Market size, growth rate, competition, sentiment

#### 5. **Business Trends** (`/api/business-trends/enhanced/route.ts`)
- **Method**: GET/POST
- **Purpose**: Strategic business trend analysis
- **Features**:
  - Shared caching system (Monday-only refresh)
  - Trend direction analysis
  - Percentage change calculations
- **Returns**: Business trends with directions and impacts

#### 6. **Engagement Intelligence** (`/api/engagement-intelligence/enhanced/route.ts`)
- **Method**: GET/POST
- **Purpose**: Customer engagement analysis
- **Features**:
  - Shared caching system (Monday-only refresh)
  - Signal score calculation
  - Strategic recommendations
- **Returns**: Engagement insights, trends, recommendations

### Cron Job APIs

#### 7. **Market Trends** (`/api/dashboard/market_trends/route.ts`)
- **Method**: GET/POST
- **Purpose**: Cron-generated market trend summaries
- **Schedule**: Every Monday at 12am
- **Returns**: AI-generated market trend insights

#### 8. **Business Trends** (`/api/dashboard/business_trends/route.ts`)
- **Method**: GET/POST
- **Purpose**: Cron-generated business trend summaries
- **Schedule**: Every Monday at 12am
- **Returns**: AI-generated business trend insights

#### 9. **Marketing Playbook** (`/api/dashboard/marketing_playbook/route.ts`)
- **Method**: GET/POST
- **Purpose**: Cron-generated marketing recommendations
- **Schedule**: Every Monday at 12am
- **Returns**: AI-generated marketing playbook insights

---

## Database Tables

### Core Dashboard Tables

#### 1. **profiles** (`public.profiles`)
- **Purpose**: User profile information
- **Key Fields**: u_id, email, first_name, last_name, company, industry
- **RLS**: Enabled

#### 2. **assessments** (`public.assessments`)
- **Purpose**: User assessment responses and scores
- **Key Fields**: u_id, strategy_score, process_score, technology_score, overall_score
- **RLS**: Enabled

#### 3. **tier2_profiles** (`public.tier2_profiles`)
- **Purpose**: Premium user profile extensions
- **Key Fields**: u_id, dashboard_explanation_seen_at
- **RLS**: Enabled

### Market Intelligence Tables

#### 4. **market_insights** (`public.market_insights`)
- **Purpose**: Cached market intelligence data
- **Key Fields**: user_id, industry, insight_data, model_version, signal_score, created_at
- **Cache Duration**: Monday-only refresh
- **RLS**: Enabled

#### 5. **business_trends** (`public.business_trends`)
- **Purpose**: Cached business trend analysis
- **Key Fields**: user_id, industry, insight_data, model_version, signal_score, created_at
- **Cache Duration**: Monday-only refresh
- **RLS**: Enabled

#### 6. **engagement_insights** (`public.engagement_insights`)
- **Purpose**: Cached engagement intelligence data
- **Key Fields**: user_id, industry, insight_data, model_version, signal_score, created_at
- **Cache Duration**: Monday-only refresh
- **RLS**: Enabled

#### 7. **enhanced_market_insights** (`public.enhanced_market_insights`)
- **Purpose**: Legacy market insights (being phased out)
- **Key Fields**: u_id, industry, market_size, growth_rate, competition, sentiment
- **RLS**: Enabled

### AI Infrastructure Tables

#### 8. **ai_rate_limits** (`public.ai_rate_limits`)
- **Purpose**: AI API rate limiting
- **Key Fields**: user_id, endpoint, request_count, window_start
- **RLS**: Enabled

#### 9. **ai_requests** (`public.ai_requests`)
- **Purpose**: AI request logging
- **Key Fields**: user_id, endpoint, model_version, response_time, success
- **RLS**: Enabled

#### 10. **ai_insights_cache** (`public.ai_insights_cache`)
- **Purpose**: General AI insights caching
- **Key Fields**: user_id, insight_type, data, created_at
- **RLS**: Enabled

### News and Content Tables

#### 11. **business_news_ticker** (`public.business_news_ticker`)
- **Purpose**: Business news headlines
- **Key Fields**: headline, source, url, published_at, industry
- **RLS**: Public read access

---

## Data Flow

### 1. **Dashboard Initialization**
```
User Login → PremiumUserContext → Dashboard Page Load
↓
Fetch Dashboard Data → /api/dashboard → Return Complete Insights
↓
Render Dashboard Sections → Load Individual Cards
```

### 2. **Market Intelligence Flow**
```
Card Load → Check Cache → If Expired → Generate New Insights
↓
Shared Caching System → Monday-only Refresh Logic
↓
AI Analysis → Store in Database → Return to Card
```

### 3. **Cron Job Integration**
```
Monday 12am → Cron Jobs Execute → Generate New Insights
↓
Store in Database → Available for Next Card Load
↓
Cards Display Cached Data + Cron-generated Summaries
```

### 4. **Real-time Updates**
```
User Action → API Call → Database Update → Real-time Sync
↓
UI Updates → Optimistic Updates → Error Handling
```

---

## Caching Strategy

### Shared Caching System
- **Location**: `src/lib/ai/sharedCaching.ts`
- **Purpose**: Unified caching across all AI modules
- **Refresh Schedule**: Every Monday at 12am
- **Manual Refresh**: Disabled (Monday-only automatic refresh)
- **Cache Tables**: market_insights, business_trends, engagement_insights

### Cache Validation Logic
```typescript
// Check if cache is valid (created after last Monday 12am)
private isCacheValid(createdAt: Date): boolean {
  const lastMonday12am = this.getLastMonday12am();
  return new Date(createdAt) > lastMonday12am;
}
```

### Cache Benefits
- **Performance**: Instant loading for cached data
- **Cost Control**: Reduced AI API calls
- **Consistency**: All users see same data until Monday refresh
- **Reliability**: Fallback to cached data if AI services fail

---

## Security & Access Control

### Row Level Security (RLS)
- **Enabled**: On all user-specific tables
- **Policy**: Users can only access their own data
- **Service Role**: Used for AI operations and cron jobs

### Authentication
- **Provider**: Supabase Auth
- **Context**: PremiumUserContext for user state management
- **Session**: Automatic session validation on API calls

### Rate Limiting
- **AI APIs**: Rate limited per user per endpoint
- **Dashboard**: No rate limiting (cached data)
- **Cron Jobs**: Scheduled execution only

---

## Performance Optimizations

### 1. **Dynamic Imports**
- MarketInsightCard loaded dynamically to reduce initial bundle size
- Lazy loading for heavy components

### 2. **Caching Strategy**
- Monday-only refresh reduces API calls by 95%
- Shared caching prevents duplicate requests
- Optimistic updates for better UX

### 3. **Component Optimization**
- Memoized components where appropriate
- Efficient re-rendering with proper state management
- Responsive design with CSS Grid/Flexbox

### 4. **API Optimization**
- Single dashboard API call for core data
- Parallel loading of market intelligence cards
- Error boundaries and fallback states

---

## Error Handling

### 1. **API Error Handling**
- Graceful degradation when APIs fail
- Fallback to cached data
- User-friendly error messages

### 2. **Loading States**
- Consistent loading animations
- Skeleton screens for better UX
- Progressive loading of sections

### 3. **Data Validation**
- TypeScript interfaces for data validation
- Runtime checks for missing data
- Default values for optional fields

---

## Current Limitations

### 1. **Refresh Schedule**
- Fixed Monday-only refresh (no manual refresh)
- Users must wait for scheduled updates
- No real-time data updates

### 2. **Data Sources**
- Limited to specific AI models and APIs
- No user customization of data sources
- Fixed industry categorization

### 3. **Performance**
- Large bundle size due to chart libraries
- No server-side rendering for dynamic content
- Limited offline capabilities

### 4. **User Experience**
- No data export functionality
- Limited customization options
- No user preferences for refresh schedules

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

### AI & External APIs
- **Market Data**: Finnhub, Alpha Vantage
- **News**: News API
- **AI Models**: OpenAI GPT-4, Claude
- **Charts**: TradingView Widgets

### Infrastructure
- **Hosting**: Vercel
- **Cron Jobs**: Vercel Cron
- **Monitoring**: Built-in error tracking
- **CDN**: Vercel Edge Network 