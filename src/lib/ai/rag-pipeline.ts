import { OpenAI } from 'openai';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { AppError } from '@/utils';

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Content preprocessing schema
const ContentSchema = z.object({
  title: z.string(),
  content: z.string(),
  url: z.string().url(),
  source: z.string(),
  publishedAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

type Content = z.infer<typeof ContentSchema>;

// Embedding generation schema
const EmbeddingRequestSchema = z.object({
  text: z.string().min(1).max(8192), // OpenAI ada-002 limit
  model: z.string().default('text-embedding-ada-002'),
});

type EmbeddingRequest = z.infer<typeof EmbeddingRequestSchema>;

// Search schema
const SearchRequestSchema = z.object({
  query: z.string().min(1),
  limit: z.number().finite().min(1).max(100).default(10),
  threshold: z.number().finite().min(0).max(1).default(0.8),
  filters: z.record(z.any()).optional(),
});

type SearchRequest = z.infer<typeof SearchRequestSchema>;

// Citation schema
const CitationSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  source: z.string(),
  publishedAt: z.date().optional(),
  relevanceScore: z.number().finite().min(0).max(1),
});

type Citation = z.infer<typeof CitationSchema>;

/**
 * RAG Pipeline Implementation
 * Handles content ingestion, embedding generation, storage, and retrieval
 */
export class RAGPipeline {
  private supabase;
  
  constructor() {
    this.supabase = createServerClient();
  }

  /**
   * 1. CLEAN: Preprocess and normalize content
   */
  async preprocessContent(rawContent: string, title?: string): Promise<string> {
    try {
      // Remove HTML tags
      let cleanContent = rawContent.replace(/<[^>]*>/g, ' ');
      
      // Normalize whitespace
      cleanContent = cleanContent.replace(/\s+/g, ' ').trim();
      
      // Remove special characters but keep punctuation
      cleanContent = cleanContent.replace(/[^\w\s.,!?;:()\-"']/g, ' ');
      
      // Ensure content doesn't exceed OpenAI limits
      if (cleanContent.length > 8000) {
        cleanContent = cleanContent.substring(0, 8000) + '...';
      }
      
      // Add title context if provided
      if (title) {
        cleanContent = `Title: ${title}\n\nContent: ${cleanContent}`;
      }
      
      return cleanContent;
    } catch (error) {
      throw new AppError(
        `Content preprocessing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PREPROCESSING_ERROR',
        500
      );
    }
  }

  /**
   * 2. EMBED: Generate vector embeddings using OpenAI ada-002
   */
  async generateEmbedding(request: EmbeddingRequest): Promise<number[]> {
    try {
      const validatedRequest = EmbeddingRequestSchema.parse(request);
      
      const response = await openai.embeddings.create({
        model: validatedRequest.model,
        input: validatedRequest.text,
      });
      
      if (!response.data[0]?.embedding) {
        throw new AppError('No embedding returned from OpenAI', 'EMBEDDING_ERROR', 500);
      }
      
      return response.data[0].embedding;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'EMBEDDING_ERROR',
        500
      );
    }
  }

  /**
   * 3. STORE: Save content and embeddings to pgvector
   */
  async storeContent(content: Content): Promise<string> {
    try {
      const validatedContent = ContentSchema.parse(content);
      
      // Preprocess content
      const cleanContent = await this.preprocessContent(
        validatedContent.content,
        validatedContent.title
      );
      
      // Generate embedding
      const embedding = await this.generateEmbedding({
        text: cleanContent,
        model: 'text-embedding-ada-002',
      });
      
      // Store in database
      const { data, error } = await this.supabase
        .from('market_articles')
        .insert({
          source: validatedContent.source,
          url: validatedContent.url,
          title: validatedContent.title,
          content: cleanContent,
          summary: this.generateSummary(cleanContent),
          embedding,
          published_at: validatedContent.publishedAt?.toISOString(),
        })
        .select('id')
        .single();
      
      if (error) {
        throw new AppError(`Database storage failed: ${error.message}`, 'STORAGE_ERROR', 500);
      }
      
      return data.id.toString();
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `Content storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'STORAGE_ERROR',
        500
      );
    }
  }

  /**
   * 4. SEARCH: Semantic similarity search
   */
  async searchSimilarContent(request: SearchRequest): Promise<Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    publishedAt?: Date;
    similarity: number;
  }>> {
    try {
      const validatedRequest = SearchRequestSchema.parse(request);
      
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding({
        text: validatedRequest.query,
        model: 'text-embedding-ada-002',
      });
      
      // Perform vector similarity search
      const { data, error } = await this.supabase.rpc('search_market_articles', {
        query_embedding: queryEmbedding,
        match_threshold: validatedRequest.threshold,
        match_count: validatedRequest.limit,
      });
      
      if (error) {
        throw new AppError(`Search failed: ${error.message}`, 'SEARCH_ERROR', 500);
      }
      
      return data?.map((item: any) => ({
        id: item.id.toString(),
        title: item.title || '',
        content: item.content || '',
        url: item.url || '',
        source: item.source || '',
        publishedAt: item.published_at ? new Date(item.published_at) : undefined,
        similarity: item.similarity || 0,
      })) || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SEARCH_ERROR',
        500
      );
    }
  }

  /**
   * 5. CITE: Generate citations from search results
   */
  generateCitations(searchResults: Array<{
    id: string;
    title: string;
    url: string;
    source: string;
    publishedAt?: Date;
    similarity: number;
  }>): Citation[] {
    return searchResults.map(result => ({
      url: result.url,
      title: result.title,
      source: result.source,
      publishedAt: result.publishedAt,
      relevanceScore: result.similarity,
    }));
  }

  /**
   * Complete RAG workflow: Retrieve and generate answer with citations
   */
  async retrieveAndGenerate(query: string, options?: {
    limit?: number;
    threshold?: number;
    includeContext?: boolean;
  }): Promise<{
    answer: string;
    citations: Citation[];
    context: string[];
  }> {
    try {
      // Search for relevant content
      const searchResults = await this.searchSimilarContent({
        query,
        limit: options?.limit || 5,
        threshold: options?.threshold || 0.8,
      });
      
      if (searchResults.length === 0) {
        return {
          answer: "I couldn't find relevant information to answer your question.",
          citations: [],
          context: [],
        };
      }
      
      // Generate citations
      const citations = this.generateCitations(searchResults);
      
      // Prepare context for answer generation
      const context = searchResults.map(result => 
        `${result.title}: ${result.content.substring(0, 500)}...`
      );
      
      // Generate answer using OpenAI with context
      const answer = await this.generateAnswerWithContext(query, context);
      
      return {
        answer,
        citations,
        context: options?.includeContext ? context : [],
      };
    } catch (error) {
      throw new AppError(
        `RAG workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RAG_ERROR',
        500
      );
    }
  }

  /**
   * Generate contextual answer using OpenAI
   */
  private async generateAnswerWithContext(query: string, context: string[]): Promise<string> {
    try {
      const contextText = context.join('\n\n');
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a business intelligence analyst. Use the provided context to answer questions accurately. Always cite sources when possible. If the context doesn't contain enough information, say so clearly.`,
          },
          {
            role: 'user',
            content: `Context:\n${contextText}\n\nQuestion: ${query}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });
      
      return response.choices[0]?.message?.content || 'Unable to generate answer.';
    } catch (error) {
      throw new AppError(
        `Answer generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ANSWER_GENERATION_ERROR',
        500
      );
    }
  }

  /**
   * Generate content summary
   */
  private generateSummary(content: string): string {
    // Simple extractive summarization - first 200 characters
    if (content.length <= 200) return content;
    
    const sentences = content.split(/[.!?]+/);
    let summary = '';
    
    for (const sentence of sentences) {
      if (summary.length + sentence.length <= 200) {
        summary += sentence.trim() + '. ';
      } else {
        break;
      }
    }
    
    return summary.trim() || content.substring(0, 200) + '...';
  }

  /**
   * Batch processing for multiple content items
   */
  async batchStoreContent(contents: Content[]): Promise<string[]> {
    const results: string[] = [];
    const batchSize = 5; // Process in batches to avoid rate limits
    
    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);
      const batchPromises = batch.map(content => this.storeContent(content));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            console.error(`Failed to store content ${i + index}:`, result.reason);
            results.push(''); // Placeholder for failed items
          }
        });
        
        // Rate limiting delay
        if (i + batchSize < contents.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Batch processing failed for batch starting at ${i}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Health check for RAG pipeline
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: {
      database: boolean;
      openai: boolean;
      vectorSearch: boolean;
    };
  }> {
    const checks = {
      database: false,
      openai: false,
      vectorSearch: false,
    };
    
    try {
      // Test database connection
      const { error: dbError } = await this.supabase
        .from('market_articles')
        .select('id')
        .limit(1);
      checks.database = !dbError;
      
      // Test OpenAI connection
      try {
        await this.generateEmbedding({ text: 'test', model: 'text-embedding-ada-002' });
        checks.openai = true;
      } catch {
        checks.openai = false;
      }
      
      // Test vector search
      try {
        await this.searchSimilarContent({ query: 'test', limit: 1 });
        checks.vectorSearch = true;
      } catch {
        checks.vectorSearch = false;
      }
      
      const healthyCount = Object.values(checks).filter(Boolean).length;
      let status: 'healthy' | 'degraded' | 'unhealthy';
      
      if (healthyCount === 3) status = 'healthy';
      else if (healthyCount >= 2) status = 'degraded';
      else status = 'unhealthy';
      
      return { status, checks };
    } catch (error) {
      return {
        status: 'unhealthy',
        checks,
      };
    }
  }
}

// Export singleton instance
export const ragPipeline = new RAGPipeline();

// Export types for external use
export type { Content, EmbeddingRequest, SearchRequest, Citation };
