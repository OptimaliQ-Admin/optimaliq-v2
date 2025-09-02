import { z } from 'zod';
import { env } from '@/lib/env';
import { AppError } from '@/utils';
import { ragPipeline } from '@/lib/ai/rag-pipeline';

// Finnhub API schemas
const FinnhubNewsSchema = z.object({
  category: z.string(),
  datetime: z.number().finite(),
  headline: z.string(),
  id: z.number().finite(),
  image: z.string(),
  related: z.string(),
  source: z.string(),
  summary: z.string(),
  url: z.string(),
});

const FinnhubCompanyNewsSchema = z.array(FinnhubNewsSchema);

// News API schemas
const NewsAPIArticleSchema = z.object({
  source: z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
  author: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  publishedAt: z.string(),
  content: z.string().nullable(),
});

const NewsAPIResponseSchema = z.object({
  status: z.string(),
  totalResults: z.number().finite(),
  articles: z.array(NewsAPIArticleSchema),
});

// Rate limiting utilities
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  async waitForRateLimit(key: string, maxRequests: number, windowMs: number): Promise<void> {
    while (!this.canMakeRequest(key, maxRequests, windowMs)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

const rateLimiter = new RateLimiter();

/**
 * Finnhub API Integration
 * Provides market news and financial data
 */
export class FinnhubAPI {
  private baseUrl = 'https://finnhub.io/api/v1';
  private apiKey: string;

  constructor() {
    if (!env.FINNHUB_API_KEY) {
      throw new AppError('Finnhub API key not configured', 'CONFIG_ERROR', 500);
    }
    this.apiKey = env.FINNHUB_API_KEY;
  }

  /**
   * Fetch general market news
   */
  async getMarketNews(category: 'general' | 'forex' | 'crypto' | 'merger' = 'general'): Promise<Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    publishedAt: Date;
    metadata: Record<string, any>;
  }>> {
    try {
      // Rate limiting: 60 requests per minute
      await rateLimiter.waitForRateLimit('finnhub', 60, 60000);

      const response = await fetch(
        `${this.baseUrl}/news?category=${category}&token=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new AppError(
          `Finnhub API error: ${response.status} ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedData = FinnhubCompanyNewsSchema.parse(data);

      return validatedData.map(article => ({
        id: article.id.toString(),
        title: article.headline,
        content: article.summary,
        url: article.url,
        source: `Finnhub - ${article.source}`,
        publishedAt: new Date(article.datetime * 1000),
        metadata: {
          category: article.category,
          image: article.image,
          related: article.related,
        },
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `Finnhub market news fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR',
        500
      );
    }
  }

  /**
   * Fetch company-specific news
   */
  async getCompanyNews(symbol: string, fromDate?: Date, toDate?: Date): Promise<Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    publishedAt: Date;
    metadata: Record<string, any>;
  }>> {
    try {
      await rateLimiter.waitForRateLimit('finnhub', 60, 60000);

      const from = fromDate ? Math.floor(fromDate.getTime() / 1000) : Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
      const to = toDate ? Math.floor(toDate.getTime() / 1000) : Math.floor(Date.now() / 1000);

      const response = await fetch(
        `${this.baseUrl}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new AppError(
          `Finnhub API error: ${response.status} ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedData = FinnhubCompanyNewsSchema.parse(data);

      return validatedData.map(article => ({
        id: article.id.toString(),
        title: article.headline,
        content: article.summary,
        url: article.url,
        source: `Finnhub - ${article.source}`,
        publishedAt: new Date(article.datetime * 1000),
        metadata: {
          category: article.category,
          symbol,
          image: article.image,
          related: article.related,
        },
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `Finnhub company news fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR',
        500
      );
    }
  }
}

/**
 * News API Integration
 * Provides general news and business articles
 */
export class NewsAPI {
  private baseUrl = 'https://newsapi.org/v2';
  private apiKey: string;

  constructor() {
    if (!env.NEWS_API_KEY) {
      throw new AppError('News API key not configured', 'CONFIG_ERROR', 500);
    }
    this.apiKey = env.NEWS_API_KEY;
  }

  /**
   * Fetch business news
   */
  async getBusinessNews(options?: {
    country?: string;
    category?: string;
    sources?: string;
    pageSize?: number;
  }): Promise<Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    publishedAt: Date;
    metadata: Record<string, any>;
  }>> {
    try {
      // Rate limiting: 1000 requests per day, ~1 per minute to be safe
      await rateLimiter.waitForRateLimit('newsapi', 1, 60000);

      const params = new URLSearchParams({
        apiKey: this.apiKey,
        category: options?.category || 'business',
        country: options?.country || 'us',
        pageSize: (options?.pageSize || 20).toString(),
      });

      if (options?.sources) {
        params.set('sources', options.sources);
        params.delete('country'); // Can't use both country and sources
        params.delete('category');
      }

      const response = await fetch(`${this.baseUrl}/top-headlines?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new AppError(
          `News API error: ${response.status} ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedData = NewsAPIResponseSchema.parse(data);

      return validatedData.articles
        .filter(article => article.title && article.url)
        .map((article, index) => ({
          id: `newsapi-${Date.now()}-${index}`,
          title: article.title,
          content: article.description || article.content || article.title,
          url: article.url,
          source: `News API - ${article.source.name}`,
          publishedAt: new Date(article.publishedAt),
          metadata: {
            author: article.author,
            image: article.urlToImage,
            sourceId: article.source.id,
          },
        }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `News API fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR',
        500
      );
    }
  }

  /**
   * Search for specific news topics
   */
  async searchNews(query: string, options?: {
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    fromDate?: Date;
    toDate?: Date;
    pageSize?: number;
    sources?: string;
  }): Promise<Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    publishedAt: Date;
    metadata: Record<string, any>;
  }>> {
    try {
      await rateLimiter.waitForRateLimit('newsapi', 1, 60000);

      const params = new URLSearchParams({
        apiKey: this.apiKey,
        q: query,
        sortBy: options?.sortBy || 'publishedAt',
        pageSize: (options?.pageSize || 20).toString(),
      });

      if (options?.fromDate) {
        params.set('from', options.fromDate.toISOString());
      }

      if (options?.toDate) {
        params.set('to', options.toDate.toISOString());
      }

      if (options?.sources) {
        params.set('sources', options.sources);
      }

      const response = await fetch(`${this.baseUrl}/everything?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new AppError(
          `News API error: ${response.status} ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedData = NewsAPIResponseSchema.parse(data);

      return validatedData.articles
        .filter(article => article.title && article.url)
        .map((article, index) => ({
          id: `newsapi-search-${Date.now()}-${index}`,
          title: article.title,
          content: article.description || article.content || article.title,
          url: article.url,
          source: `News API - ${article.source.name}`,
          publishedAt: new Date(article.publishedAt),
          metadata: {
            author: article.author,
            image: article.urlToImage,
            sourceId: article.source.id,
            query,
          },
        }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `News API search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR',
        500
      );
    }
  }
}

/**
 * Content Ingestion Service
 * Orchestrates content fetching from multiple sources and feeds into RAG pipeline
 */
export class ContentIngestionService {
  private finnhub: FinnhubAPI;
  private newsApi: NewsAPI;

  constructor() {
    this.finnhub = new FinnhubAPI();
    this.newsApi = new NewsAPI();
  }

  /**
   * Ingest content from all sources and store in RAG pipeline
   */
  async ingestAllSources(options?: {
    includeMarketNews?: boolean;
    includeBusinessNews?: boolean;
    companySymbols?: string[];
    searchQueries?: string[];
  }): Promise<{
    totalIngested: number;
    sources: {
      finnhubMarket: number;
      finnhubCompany: number;
      newsApiBusiness: number;
      newsApiSearch: number;
    };
    errors: string[];
  }> {
    const results = {
      totalIngested: 0,
      sources: {
        finnhubMarket: 0,
        finnhubCompany: 0,
        newsApiBusiness: 0,
        newsApiSearch: 0,
      },
      errors: [] as string[],
    };

    // Ingest Finnhub market news
    if (options?.includeMarketNews !== false) {
      try {
        const marketNews = await this.finnhub.getMarketNews('general');
        const stored = await ragPipeline.batchStoreContent(marketNews);
        const successCount = stored.filter(id => id !== '').length;
        results.sources.finnhubMarket = successCount;
        results.totalIngested += successCount;
      } catch (error) {
        results.errors.push(`Finnhub market news: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Ingest company-specific news
    if (options?.companySymbols?.length) {
      for (const symbol of options.companySymbols) {
        try {
          const companyNews = await this.finnhub.getCompanyNews(symbol);
          const stored = await ragPipeline.batchStoreContent(companyNews);
          const successCount = stored.filter(id => id !== '').length;
          results.sources.finnhubCompany += successCount;
          results.totalIngested += successCount;
        } catch (error) {
          results.errors.push(`Finnhub ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Ingest News API business news
    if (options?.includeBusinessNews !== false) {
      try {
        const businessNews = await this.newsApi.getBusinessNews();
        const stored = await ragPipeline.batchStoreContent(businessNews);
        const successCount = stored.filter(id => id !== '').length;
        results.sources.newsApiBusiness = successCount;
        results.totalIngested += successCount;
      } catch (error) {
        results.errors.push(`News API business: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Ingest search-based news
    if (options?.searchQueries?.length) {
      for (const query of options.searchQueries) {
        try {
          const searchNews = await this.newsApi.searchNews(query);
          const stored = await ragPipeline.batchStoreContent(searchNews);
          const successCount = stored.filter(id => id !== '').length;
          results.sources.newsApiSearch += successCount;
          results.totalIngested += successCount;
        } catch (error) {
          results.errors.push(`News API search "${query}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return results;
  }

  /**
   * Scheduled content ingestion job
   */
  async runScheduledIngestion(): Promise<void> {
    try {
      console.log('Starting scheduled content ingestion...');
      
      const results = await this.ingestAllSources({
        includeMarketNews: true,
        includeBusinessNews: true,
        companySymbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'], // Top tech stocks
        searchQueries: [
          'artificial intelligence business',
          'market trends 2024',
          'business strategy',
          'digital transformation',
          'startup funding',
        ],
      });

      console.log('Content ingestion completed:', results);

      if (results.errors.length > 0) {
        console.error('Ingestion errors:', results.errors);
      }
    } catch (error) {
      console.error('Scheduled ingestion failed:', error);
      throw error;
    }
  }
}

// Export singleton instances
export const finnhubApi = new FinnhubAPI();
export const newsApi = new NewsAPI();
export const contentIngestion = new ContentIngestionService();
