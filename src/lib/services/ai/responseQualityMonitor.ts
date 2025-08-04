interface ResponseQualityMetrics {
  length: number;
  hasAcknowledgment: boolean;
  hasInsight: boolean;
  hasTransition: boolean;
  toneScore: number;
  inappropriateContent: boolean;
  responseTime: number;
}

interface QualityScore {
  score: number; // 0-10
  issues: string[];
  suggestions: string[];
}

export class ResponseQualityMonitor {
  private static readonly MIN_LENGTH = 20;
  private static readonly MAX_LENGTH = 500;
  private static readonly IDEAL_LENGTH_MIN = 50;
  private static readonly IDEAL_LENGTH_MAX = 200;

  private static readonly ACKNOWLEDGMENT_PATTERNS = [
    /thank you/i,
    /i see/i,
    /that's/i,
    /you're/i,
    /your/i,
    /interesting/i,
    /great/i,
    /excellent/i
  ];

  private static readonly INSIGHT_PATTERNS = [
    /companies that/i,
    /many companies/i,
    /often/i,
    /typically/i,
    /usually/i,
    /the key is/i,
    /important/i,
    /crucial/i,
    /essential/i
  ];

  private static readonly TRANSITION_PATTERNS = [
    /now let's/i,
    /let's look at/i,
    /let's examine/i,
    /let's explore/i,
    /next/i,
    /moving on/i,
    /let's continue/i,
    /let's discuss/i
  ];

  private static readonly INAPPROPRIATE_WORDS = [
    'inappropriate',
    'offensive',
    'spam',
    'hate',
    'discrimination',
    'illegal',
    'unethical'
  ];

  private static readonly POSITIVE_TONE_WORDS = [
    'excellent',
    'great',
    'good',
    'strong',
    'smart',
    'strategic',
    'sophisticated',
    'mature',
    'powerful',
    'effective'
  ];

  private static readonly NEGATIVE_TONE_WORDS = [
    'bad',
    'poor',
    'weak',
    'stupid',
    'dumb',
    'naive',
    'immature',
    'ineffective',
    'failing'
  ];

  static analyzeResponse(response: string, responseTime: number): QualityScore {
    const metrics = this.calculateMetrics(response, responseTime);
    const score = this.calculateScore(metrics);
    const issues = this.identifyIssues(metrics);
    const suggestions = this.generateSuggestions(metrics);

    return {
      score,
      issues,
      suggestions
    };
  }

  private static calculateMetrics(response: string, responseTime: number): ResponseQualityMetrics {
    const lowerResponse = response.toLowerCase();

    return {
      length: response.length,
      hasAcknowledgment: this.ACKNOWLEDGMENT_PATTERNS.some(pattern => pattern.test(lowerResponse)),
      hasInsight: this.INSIGHT_PATTERNS.some(pattern => pattern.test(lowerResponse)),
      hasTransition: this.TRANSITION_PATTERNS.some(pattern => pattern.test(lowerResponse)),
      toneScore: this.calculateToneScore(lowerResponse),
      inappropriateContent: this.INAPPROPRIATE_WORDS.some(word => lowerResponse.includes(word)),
      responseTime
    };
  }

  private static calculateToneScore(response: string): number {
    const positiveCount = this.POSITIVE_TONE_WORDS.filter(word => response.includes(word)).length;
    const negativeCount = this.NEGATIVE_TONE_WORDS.filter(word => response.includes(word)).length;
    
    const total = positiveCount + negativeCount;
    if (total === 0) return 5; // Neutral if no tone words found
    
    return Math.max(0, Math.min(10, (positiveCount / total) * 10));
  }

  private static calculateScore(metrics: ResponseQualityMetrics): number {
    let score = 10;

    // Length penalties
    if (metrics.length < this.MIN_LENGTH) score -= 3;
    else if (metrics.length > this.MAX_LENGTH) score -= 2;
    else if (metrics.length < this.IDEAL_LENGTH_MIN || metrics.length > this.IDEAL_LENGTH_MAX) score -= 1;

    // Content structure penalties
    if (!metrics.hasAcknowledgment) score -= 2;
    if (!metrics.hasInsight) score -= 2;
    if (!metrics.hasTransition) score -= 1;

    // Tone penalties
    if (metrics.toneScore < 6) score -= 1;
    if (metrics.toneScore < 4) score -= 2;

    // Inappropriate content penalty
    if (metrics.inappropriateContent) score -= 5;

    // Response time penalties
    if (metrics.responseTime > 10000) score -= 1; // Over 10 seconds
    if (metrics.responseTime > 15000) score -= 2; // Over 15 seconds

    return Math.max(0, score);
  }

  private static identifyIssues(metrics: ResponseQualityMetrics): string[] {
    const issues: string[] = [];

    if (metrics.length < this.MIN_LENGTH) {
      issues.push('Response too short');
    } else if (metrics.length > this.MAX_LENGTH) {
      issues.push('Response too long');
    }

    if (!metrics.hasAcknowledgment) {
      issues.push('Missing acknowledgment of user answer');
    }

    if (!metrics.hasInsight) {
      issues.push('Missing strategic insight');
    }

    if (!metrics.hasTransition) {
      issues.push('Missing transition to next question');
    }

    if (metrics.toneScore < 6) {
      issues.push('Tone could be more positive');
    }

    if (metrics.inappropriateContent) {
      issues.push('Potentially inappropriate content detected');
    }

    if (metrics.responseTime > 10000) {
      issues.push('Response time too slow');
    }

    return issues;
  }

  private static generateSuggestions(metrics: ResponseQualityMetrics): string[] {
    const suggestions: string[] = [];

    if (!metrics.hasAcknowledgment) {
      suggestions.push('Start with acknowledging their specific answer');
    }

    if (!metrics.hasInsight) {
      suggestions.push('Include a strategic insight based on patterns you\'ve seen');
    }

    if (!metrics.hasTransition) {
      suggestions.push('End with a natural transition to the next question');
    }

    if (metrics.toneScore < 6) {
      suggestions.push('Use more positive, encouraging language');
    }

    if (metrics.length < this.IDEAL_LENGTH_MIN) {
      suggestions.push('Provide more detailed response');
    } else if (metrics.length > this.IDEAL_LENGTH_MAX) {
      suggestions.push('Keep response more concise');
    }

    return suggestions;
  }

  static shouldUseFallback(score: number): boolean {
    return score < 5; // Use fallback for low-quality responses
  }

  static logQualityMetrics(sessionId: string, questionId: string, metrics: ResponseQualityMetrics, score: number): void {
    console.log(`Quality Metrics for ${sessionId}/${questionId}:`, {
      score,
      length: metrics.length,
      hasAcknowledgment: metrics.hasAcknowledgment,
      hasInsight: metrics.hasInsight,
      hasTransition: metrics.hasTransition,
      toneScore: metrics.toneScore,
      responseTime: metrics.responseTime
    });
  }
} 