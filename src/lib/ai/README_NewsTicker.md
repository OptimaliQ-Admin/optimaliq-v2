# News Ticker Feature Documentation

## Overview

The News Ticker is a real-time business news display component that shows trending business headlines in a scrolling marquee format. It's integrated into the Business Trend Card to provide users with current business news context.

## Architecture

### Backend Components

#### 1. Database Schema (`business_news_ticker` table)
```sql
CREATE TABLE business_news_ticker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. News Fetching Service (`/lib/cron/fetchBusinessNews.ts`)
- Fetches headlines from NewsAPI.org
- Includes fallback headlines if API fails
- Cleans up old headlines (24-hour retention)
- Stores headlines in Supabase

#### 3. API Routes
- **GET `/api/news/headlines`**: Serves headlines to frontend
- **GET `/api/news/headlines?refresh=true`**: Forces refresh of headlines
- **POST `/api/cron/fetch-business-news`**: Cron job endpoint

#### 4. Cron Job
- Runs every 6 hours (`0 */6 * * *`)
- Automatically fetches and updates headlines
- Requires `CRON_SECRET_TOKEN` for authentication

### Frontend Components

#### 1. NewsTicker Component (`/components/shared/NewsTicker.tsx`)
- Displays headlines in scrolling marquee
- Supports manual refresh
- Shows source and time information
- Pauses on hover

#### 2. Integration with Business Trend Card
- Added to Business Trend Card layout
- Provides real-time news context
- Enhances user experience

## Features

### ✅ Real-time News Updates
- Fetches from NewsAPI.org every 6 hours
- Fallback headlines if API unavailable
- Automatic cleanup of old headlines

### ✅ Interactive UI
- Scrolling marquee animation
- Pause on hover functionality
- Manual refresh button
- Loading and error states

### ✅ Responsive Design
- Mobile-friendly layout
- Adaptive text sizing
- Touch-friendly interactions

### ✅ Performance Optimized
- Cached headlines in database
- Efficient API calls
- Minimal re-renders

## Environment Variables

```bash
# Required for NewsAPI integration
NEWSAPI_KEY=your_newsapi_key_here

# Required for cron job authentication
CRON_SECRET_TOKEN=your_cron_secret_here

# Required for Supabase integration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

## Usage

### Basic Usage
```tsx
import NewsTicker from '@/components/shared/NewsTicker';

function MyComponent() {
  return (
    <NewsTicker 
      className="mb-4"
      showRefreshButton={true}
      maxHeadlines={5}
    />
  );
}
```

### Props
- `className`: Additional CSS classes
- `showRefreshButton`: Show/hide refresh button (default: true)
- `maxHeadlines`: Maximum number of headlines to display (default: 5)

### API Endpoints

#### Get Headlines
```bash
GET /api/news/headlines
```

Response:
```json
[
  {
    "title": "Tech Companies Focus on AI Integration",
    "url": "https://example.com/article",
    "source": "Business Insider",
    "publishedAt": "2024-01-01T12:00:00Z"
  }
]
```

#### Refresh Headlines
```bash
GET /api/news/headlines?refresh=true
```

#### Manual Cron Trigger
```bash
POST /api/cron/fetch-business-news
Authorization: Bearer your_cron_secret_token
```

## Styling

### CSS Animations
```css
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
```

### Color Scheme
- Background: Yellow theme (`bg-yellow-50`, `border-yellow-200`)
- Text: Blue links (`text-blue-700`)
- Icons: Yellow accent (`text-yellow-600`)

## Error Handling

### API Failures
- Graceful fallback to cached headlines
- User-friendly error messages
- Retry mechanisms

### Network Issues
- Timeout handling (10 seconds)
- Offline state management
- Loading indicators

## Monitoring

### Logging
- Console logs for debugging
- Error tracking
- Performance metrics

### Health Checks
- API endpoint monitoring
- Database connectivity
- Cron job execution

## Future Enhancements

### Planned Features
1. **Industry-specific headlines**: Filter by user's industry
2. **Sentiment analysis**: Color-code headlines by sentiment
3. **User preferences**: Allow users to customize news sources
4. **Push notifications**: Alert users to breaking news
5. **Analytics**: Track headline engagement

### Technical Improvements
1. **Caching optimization**: Redis for better performance
2. **Multiple news sources**: Reuters, Bloomberg, etc.
3. **Real-time updates**: WebSocket integration
4. **A/B testing**: Test different headline formats

## Troubleshooting

### Common Issues

#### Headlines not loading
1. Check `NEWSAPI_KEY` environment variable
2. Verify Supabase connection
3. Check browser console for errors

#### Cron job not running
1. Verify `CRON_SECRET_TOKEN` is set
2. Check Vercel cron job configuration
3. Monitor cron job logs

#### Animation not working
1. Ensure CSS is properly loaded
2. Check for JavaScript errors
3. Verify browser compatibility

### Debug Commands
```bash
# Test news API directly
curl "https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=5&apiKey=YOUR_KEY"

# Test cron endpoint
curl -X POST "https://your-domain.vercel.app/api/cron/fetch-business-news" \
  -H "Authorization: Bearer YOUR_CRON_TOKEN"

# Check database
SELECT * FROM business_news_ticker ORDER BY published_at DESC LIMIT 5;
```

## Security Considerations

### API Security
- Rate limiting on endpoints
- Authentication for cron jobs
- Input validation and sanitization

### Data Privacy
- No user data stored with headlines
- Secure API key management
- HTTPS enforcement

## Performance Metrics

### Targets
- **Load Time**: < 500ms for headlines
- **Animation**: 60fps smooth scrolling
- **API Response**: < 2s for refresh
- **Database Queries**: < 100ms

### Monitoring
- Real User Monitoring (RUM)
- API response times
- Error rates
- User engagement metrics 