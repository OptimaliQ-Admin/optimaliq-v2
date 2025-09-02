import { z } from 'zod';
import { AppError } from '@/utils';

// Content preprocessing schemas
const RawContentSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  url: z.string().url(),
  source: z.string(),
  publishedAt: z.date().optional(),
  author: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const PreprocessedContentSchema = z.object({
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  url: z.string().url(),
  source: z.string(),
  publishedAt: z.date().optional(),
  author: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  processingMetadata: z.object({
    originalLength: z.number().finite(),
    processedLength: z.number().finite(),
    language: z.string().optional(),
    readabilityScore: z.number().finite().optional(),
    keyPhrases: z.array(z.string()).optional(),
    sentiment: z.object({
      polarity: z.number().finite(),
      subjectivity: z.number().finite(),
    }).optional(),
    categories: z.array(z.string()).optional(),
  }),
});

type RawContent = z.infer<typeof RawContentSchema>;
type PreprocessedContent = z.infer<typeof PreprocessedContentSchema>;

/**
 * Content Preprocessing Pipeline
 * Handles cleaning, normalization, and enrichment of content before embedding
 */
export class ContentPreprocessor {
  /**
   * Main preprocessing pipeline
   */
  async preprocessContent(rawContent: RawContent): Promise<PreprocessedContent> {
    try {
      const validated = RawContentSchema.parse(rawContent);
      
      // Step 1: Clean and normalize content
      const cleanedContent = this.cleanContent(validated.content);
      const cleanedTitle = this.cleanTitle(validated.title || this.extractTitleFromContent(cleanedContent));
      
      // Step 2: Generate summary
      const summary = this.generateSummary(cleanedContent, cleanedTitle);
      
      // Step 3: Extract metadata
      const processingMetadata = await this.extractMetadata(cleanedContent);
      
      // Step 4: Validate final content
      const finalContent = this.validateContentLength(cleanedContent);
      
      const result: PreprocessedContent = {
        title: cleanedTitle,
        content: finalContent,
        summary,
        url: validated.url,
        source: validated.source,
        publishedAt: validated.publishedAt,
        author: validated.author,
        metadata: validated.metadata,
        processingMetadata: {
          originalLength: validated.content.length,
          processedLength: finalContent.length,
          ...processingMetadata,
        },
      };
      
      return PreprocessedContentSchema.parse(result);
    } catch (error) {
      throw new AppError(
        `Content preprocessing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PREPROCESSING_ERROR',
        500
      );
    }
  }

  /**
   * Clean and normalize content text
   */
  private cleanContent(content: string): string {
    let cleaned = content;
    
    // Remove HTML tags and decode entities
    cleaned = this.removeHtmlTags(cleaned);
    cleaned = this.decodeHtmlEntities(cleaned);
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Remove special characters but preserve important punctuation
    cleaned = cleaned.replace(/[^\w\s.,!?;:()\-"'@#$%&]/g, ' ');
    
    // Fix common encoding issues
    cleaned = this.fixEncodingIssues(cleaned);
    
    // Remove excessive punctuation
    cleaned = cleaned.replace(/[.]{3,}/g, '...');
    cleaned = cleaned.replace(/[!]{2,}/g, '!');
    cleaned = cleaned.replace(/[?]{2,}/g, '?');
    
    // Normalize quotes
    cleaned = cleaned.replace(/[""]/g, '"');
    cleaned = cleaned.replace(/['']/g, "'");
    
    // Remove extra spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }

  /**
   * Clean and normalize title
   */
  private cleanTitle(title: string): string {
    let cleaned = title.trim();
    
    // Remove HTML tags
    cleaned = this.removeHtmlTags(cleaned);
    
    // Decode HTML entities
    cleaned = this.decodeHtmlEntities(cleaned);
    
    // Remove special characters
    cleaned = cleaned.replace(/[^\w\s.,!?;:()\-"']/g, ' ');
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Capitalize first letter if not already
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    // Limit title length
    if (cleaned.length > 200) {
      cleaned = cleaned.substring(0, 197) + '...';
    }
    
    return cleaned || 'Untitled';
  }

  /**
   * Remove HTML tags
   */
  private removeHtmlTags(text: string): string {
    return text.replace(/<[^>]*>/g, ' ');
  }

  /**
   * Decode HTML entities
   */
  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&mdash;': '—',
      '&ndash;': '–',
      '&hellip;': '...',
    };
    
    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    
    // Handle numeric entities
    decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
      return String.fromCharCode(parseInt(num, 10));
    });
    
    return decoded;
  }

  /**
   * Fix common encoding issues
   */
  private fixEncodingIssues(text: string): string {
    const fixes: Record<string, string> = {
      'â€™': "'",
      'â€œ': '"',
      'â€': '"',
      'â€"': '—',
      'â€"': '–',
      'â€¦': '...',
      'Â ': ' ',
      'Â': '',
    };
    
    let fixed = text;
    for (const [wrong, right] of Object.entries(fixes)) {
      fixed = fixed.replace(new RegExp(wrong, 'g'), right);
    }
    
    return fixed;
  }

  /**
   * Extract title from content if not provided
   */
  private extractTitleFromContent(content: string): string {
    // Try to find the first sentence that looks like a title
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 10 && trimmed.length < 200) {
        return trimmed;
      }
    }
    
    // Fallback: use first 100 characters
    return content.length > 100 ? content.substring(0, 97) + '...' : content;
  }

  /**
   * Generate summary from content
   */
  private generateSummary(content: string, title: string): string {
    // If content is short, use it as summary
    if (content.length <= 300) {
      return content;
    }
    
    // Extract key sentences
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    
    if (sentences.length === 0) {
      return content.substring(0, 300) + '...';
    }
    
    // Score sentences based on position and keywords
    const scoredSentences = sentences.map((sentence, index) => ({
      sentence,
      score: this.scoreSentence(sentence, index, sentences.length, title),
    }));
    
    // Sort by score and take top sentences
    scoredSentences.sort((a, b) => b.score - a.score);
    
    let summary = '';
    for (const { sentence } of scoredSentences) {
      if (summary.length + sentence.length <= 300) {
        summary += sentence + '. ';
      } else {
        break;
      }
    }
    
    return summary.trim() || content.substring(0, 300) + '...';
  }

  /**
   * Score sentence for summary generation
   */
  private scoreSentence(sentence: string, position: number, totalSentences: number, title: string): number {
    let score = 0;
    
    // Position bonus (first and last sentences are important)
    if (position === 0) score += 3;
    if (position === totalSentences - 1) score += 2;
    if (position < totalSentences * 0.3) score += 1;
    
    // Length bonus (prefer medium-length sentences)
    const length = sentence.length;
    if (length > 50 && length < 200) score += 2;
    if (length > 20 && length < 300) score += 1;
    
    // Keyword bonus
    const keywords = ['important', 'significant', 'key', 'major', 'critical', 'essential'];
    for (const keyword of keywords) {
      if (sentence.toLowerCase().includes(keyword)) score += 1;
    }
    
    // Title similarity bonus
    const titleWords = title.toLowerCase().split(/\s+/);
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    const commonWords = titleWords.filter(word => sentenceWords.includes(word));
    score += commonWords.length * 0.5;
    
    return score;
  }

  /**
   * Extract metadata from content
   */
  private async extractMetadata(content: string): Promise<{
    language?: string;
    readabilityScore?: number;
    keyPhrases?: string[];
    sentiment?: {
      polarity: number;
      subjectivity: number;
    };
    categories?: string[];
  }> {
    const metadata: any = {};
    
    try {
      // Detect language (simple heuristic)
      metadata.language = this.detectLanguage(content);
      
      // Calculate readability score
      metadata.readabilityScore = this.calculateReadabilityScore(content);
      
      // Extract key phrases
      metadata.keyPhrases = this.extractKeyPhrases(content);
      
      // Analyze sentiment (simple heuristic)
      metadata.sentiment = this.analyzeSentiment(content);
      
      // Categorize content
      metadata.categories = this.categorizeContent(content);
      
      return metadata;
    } catch (error) {
      console.warn('Metadata extraction failed:', error);
      return {};
    }
  }

  /**
   * Simple language detection
   */
  private detectLanguage(content: string): string {
    // Simple heuristic - check for common English words
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = content.toLowerCase().split(/\s+/);
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    const englishRatio = englishWordCount / Math.min(words.length, 100);
    
    return englishRatio > 0.1 ? 'en' : 'unknown';
  }

  /**
   * Calculate readability score (Flesch Reading Ease approximation)
   */
  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Count syllables in a word (approximation)
   */
  private countSyllables(word: string): number {
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;
    
    for (const char of word.toLowerCase()) {
      const isVowel = vowels.includes(char);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Handle silent 'e'
    if (word.toLowerCase().endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  }

  /**
   * Extract key phrases (simple frequency-based approach)
   */
  private extractKeyPhrases(content: string): string[] {
    // Remove common stop words
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'this', 'that', 'these', 'those', 'is', 'it', 'its', 'they', 'them', 'their'
    ]);
    
    // Extract words and count frequency
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Extract n-grams (2-3 word phrases)
    const phrases: Record<string, number> = {};
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      phrases[bigram] = (phrases[bigram] || 0) + 1;
      
      if (i < words.length - 2) {
        const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        phrases[trigram] = (phrases[trigram] || 0) + 1;
      }
    }
    
    // Combine and sort by frequency
    const allPhrases = { ...frequency, ...phrases };
    const sorted = Object.entries(allPhrases)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([phrase]) => phrase);
    
    return sorted;
  }

  /**
   * Analyze sentiment (simple lexicon-based approach)
   */
  private analyzeSentiment(content: string): { polarity: number; subjectivity: number } {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 'growth', 'profit'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'loss', 'decline', 'failure', 'problem', 'crisis'];
    const subjectiveWords = ['think', 'believe', 'feel', 'opinion', 'seems', 'appears', 'probably', 'might', 'could', 'should'];
    
    const words = content.toLowerCase().split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    let subjectiveCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
      if (subjectiveWords.includes(word)) subjectiveCount++;
    });
    
    const totalSentimentWords = positiveCount + negativeCount;
    const polarity = totalSentimentWords > 0 
      ? (positiveCount - negativeCount) / totalSentimentWords 
      : 0;
    
    const subjectivity = Math.min(1, subjectiveCount / Math.max(1, words.length / 10));
    
    return {
      polarity: Math.max(-1, Math.min(1, polarity)),
      subjectivity: Math.max(0, Math.min(1, subjectivity)),
    };
  }

  /**
   * Categorize content based on keywords
   */
  private categorizeContent(content: string): string[] {
    const categories: Record<string, string[]> = {
      'Technology': ['technology', 'software', 'ai', 'artificial intelligence', 'machine learning', 'digital', 'tech', 'innovation'],
      'Business': ['business', 'company', 'corporate', 'market', 'industry', 'revenue', 'profit', 'strategy'],
      'Finance': ['finance', 'financial', 'investment', 'stock', 'trading', 'economy', 'economic', 'banking'],
      'Healthcare': ['health', 'medical', 'healthcare', 'hospital', 'patient', 'treatment', 'medicine', 'pharmaceutical'],
      'Politics': ['political', 'government', 'policy', 'election', 'vote', 'congress', 'senate', 'president'],
      'Sports': ['sport', 'game', 'team', 'player', 'match', 'championship', 'league', 'tournament'],
      'Entertainment': ['movie', 'film', 'music', 'celebrity', 'entertainment', 'show', 'actor', 'singer'],
    };
    
    const contentLower = content.toLowerCase();
    const matchedCategories: string[] = [];
    
    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter(keyword => contentLower.includes(keyword));
      if (matches.length > 0) {
        matchedCategories.push(category);
      }
    }
    
    return matchedCategories.length > 0 ? matchedCategories : ['General'];
  }

  /**
   * Validate content length for embedding
   */
  private validateContentLength(content: string): string {
    const maxLength = 8000; // OpenAI ada-002 limit with some buffer
    
    if (content.length <= maxLength) {
      return content;
    }
    
    // Truncate at sentence boundary if possible
    const truncated = content.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > maxLength * 0.8) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }
    
    return truncated + '...';
  }

  /**
   * Batch preprocessing for multiple content items
   */
  async batchPreprocess(contents: RawContent[]): Promise<PreprocessedContent[]> {
    const results: PreprocessedContent[] = [];
    const batchSize = 10;
    
    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);
      const batchPromises = batch.map(content => 
        this.preprocessContent(content).catch(error => {
          console.error(`Preprocessing failed for content ${i}:`, error);
          return null;
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null) as PreprocessedContent[]);
    }
    
    return results;
  }
}

// Export singleton instance
export const contentPreprocessor = new ContentPreprocessor();

// Export types
export type { RawContent, PreprocessedContent };
