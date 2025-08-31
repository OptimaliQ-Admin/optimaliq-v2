/**
 * OptimaliQ External API Integrations
 * Integration with external services for market data, news, and social media
 */

// API Configuration
const API_CONFIG = {
  FINNHUB: {
    baseUrl: 'https://finnhub.io/api/v1',
    apiKey: process.env.NEXT_PUBLIC_FINNHUB_API_KEY || ''
  },
  NEWS_API: {
    baseUrl: 'https://newsapi.org/v2',
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || ''
  },
  TWITTER: {
    baseUrl: 'https://api.twitter.com/2',
    bearerToken: process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN || ''
  },
  LINKEDIN: {
    baseUrl: 'https://api.linkedin.com/v2',
    accessToken: process.env.NEXT_PUBLIC_LINKEDIN_ACCESS_TOKEN || ''
  }
}

// Market Data Integration (Finnhub)
export class MarketDataService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = API_CONFIG.FINNHUB.apiKey
    this.baseUrl = API_CONFIG.FINNHUB.baseUrl
  }

  async getStockQuote(symbol: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching stock quote:', error)
      throw error
    }
  }

  async getCompanyProfile(symbol: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching company profile:', error)
      throw error
    }
  }

  async getMarketNews(category: string = 'general') {
    try {
      const response = await fetch(
        `${this.baseUrl}/news?category=${category}&token=${this.apiKey}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching market news:', error)
      throw error
    }
  }

  async getEarningsCalendar(from: string, to: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/calendar/earnings?from=${from}&to=${to}&token=${this.apiKey}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching earnings calendar:', error)
      throw error
    }
  }

  async getInsiderTransactions(symbol: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/insider-transactions?symbol=${symbol}&token=${this.apiKey}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching insider transactions:', error)
      throw error
    }
  }
}

// News API Integration
export class NewsService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = API_CONFIG.NEWS_API.apiKey
    this.baseUrl = API_CONFIG.NEWS_API.baseUrl
  }

  async getTopHeadlines(country: string = 'us', category?: string) {
    try {
      let url = `${this.baseUrl}/top-headlines?country=${country}&apiKey=${this.apiKey}`
      if (category) {
        url += `&category=${category}`
      }
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching top headlines:', error)
      throw error
    }
  }

  async searchNews(query: string, from?: string, to?: string) {
    try {
      let url = `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&apiKey=${this.apiKey}`
      if (from) url += `&from=${from}`
      if (to) url += `&to=${to}`
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error searching news:', error)
      throw error
    }
  }

  async getNewsByCategory(category: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/top-headlines?category=${category}&apiKey=${this.apiKey}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching news by category:', error)
      throw error
    }
  }

  async getNewsSources(country?: string, category?: string) {
    try {
      let url = `${this.baseUrl}/sources?apiKey=${this.apiKey}`
      if (country) url += `&country=${country}`
      if (category) url += `&category=${category}`
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.error('Error fetching news sources:', error)
      throw error
    }
  }
}

// Social Media Integration (Twitter)
export class TwitterService {
  private bearerToken: string
  private baseUrl: string

  constructor() {
    this.bearerToken = API_CONFIG.TWITTER.bearerToken
    this.baseUrl = API_CONFIG.TWITTER.baseUrl
  }

  async searchTweets(query: string, maxResults: number = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error searching tweets:', error)
      throw error
    }
  }

  async getUserTweets(userId: string, maxResults: number = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${userId}/tweets?max_results=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching user tweets:', error)
      throw error
    }
  }

  async getTrendingTopics(woeid: number = 1) {
    try {
      const response = await fetch(
        `${this.baseUrl}/trends/place/${woeid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching trending topics:', error)
      throw error
    }
  }
}

// LinkedIn Integration
export class LinkedInService {
  private accessToken: string
  private baseUrl: string

  constructor() {
    this.accessToken = API_CONFIG.LINKEDIN.accessToken
    this.baseUrl = API_CONFIG.LINKEDIN.baseUrl
  }

  async getCompanyUpdates(companyId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/organizations/${companyId}/updates`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching company updates:', error)
      throw error
    }
  }

  async getCompanyFollowers(companyId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/organizations/${companyId}/followers`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching company followers:', error)
      throw error
    }
  }
}

// Email Service Integration
export class EmailService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_EMAIL_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_EMAIL_API_URL || ''
  }

  async sendEmail(to: string, subject: string, content: string, from?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to,
          subject,
          content,
          from: from || 'noreply@optimaliq.ai'
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  async sendTemplateEmail(to: string, templateId: string, variables: Record<string, any>) {
    try {
      const response = await fetch(`${this.baseUrl}/send-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to,
          templateId,
          variables
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Error sending template email:', error)
      throw error
    }
  }
}

// Calendar Integration
export class CalendarService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_CALENDAR_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_CALENDAR_API_URL || ''
  }

  async createEvent(event: {
    summary: string
    description: string
    startTime: string
    endTime: string
    attendees?: string[]
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(event)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw error
    }
  }

  async getEvents(timeMin: string, timeMax: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      throw error
    }
  }
}

// CRM Integration
export class CRMService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_CRM_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_CRM_API_URL || ''
  }

  async createContact(contact: {
    firstName: string
    lastName: string
    email: string
    company?: string
    phone?: string
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(contact)
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating CRM contact:', error)
      throw error
    }
  }

  async updateContact(contactId: string, updates: Record<string, any>) {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(updates)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating CRM contact:', error)
      throw error
    }
  }

  async getContacts(limit: number = 50, offset: number = 0) {
    try {
      const response = await fetch(
        `${this.baseUrl}/contacts?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching CRM contacts:', error)
      throw error
    }
  }
}

// Analytics Integration
export class AnalyticsService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ANALYTICS_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || ''
  }

  async trackEvent(event: {
    name: string
    properties?: Record<string, any>
    userId?: string
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(event)
      })
      return await response.json()
    } catch (error) {
      console.error('Error tracking analytics event:', error)
      throw error
    }
  }

  async getMetrics(metric: string, startDate: string, endDate: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/metrics/${metric}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics metrics:', error)
      throw error
    }
  }
}

// Export service instances
export const marketDataService = new MarketDataService()
export const newsService = new NewsService()
export const twitterService = new TwitterService()
export const linkedInService = new LinkedInService()
export const emailService = new EmailService()
export const calendarService = new CalendarService()
export const crmService = new CRMService()
export const analyticsService = new AnalyticsService()

// Unified API Integration Manager
export class APIIntegrationManager {
  private services: Map<string, any> = new Map()

  constructor() {
    this.services.set('marketData', marketDataService)
    this.services.set('news', newsService)
    this.services.set('twitter', twitterService)
    this.services.set('linkedIn', linkedInService)
    this.services.set('email', emailService)
    this.services.set('calendar', calendarService)
    this.services.set('crm', crmService)
    this.services.set('analytics', analyticsService)
  }

  getService(serviceName: string) {
    return this.services.get(serviceName)
  }

  async healthCheck() {
    const results: Record<string, boolean> = {}
    
    for (const [name, service] of this.services) {
      try {
        // Basic health check for each service
        if (service.apiKey || service.bearerToken || service.accessToken) {
          results[name] = true
        } else {
          results[name] = false
        }
      } catch (error) {
        results[name] = false
      }
    }
    
    return results
  }
}

export const apiManager = new APIIntegrationManager()
