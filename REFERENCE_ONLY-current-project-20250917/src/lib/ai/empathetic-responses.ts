/**
 * Empathetic Response System for Conversational AI
 * Personalized and empathetic AI responses with emotional intelligence
 */

import { z } from 'zod';

// Emotional Context Schema
const EmotionalContextSchema = z.object({
  userEmotion: z.enum(['happy', 'frustrated', 'confused', 'excited', 'worried', 'neutral']),
  conversationTone: z.enum(['formal', 'casual', 'urgent', 'relaxed', 'professional']),
  userEngagement: z.number().finite().min(0).max(1),
  previousResponses: z.array(z.string()),
  userProfile: z.record(z.any()),
  context: z.record(z.any())
});

export type EmotionalContext = z.infer<typeof EmotionalContextSchema>;

// Empathetic Response Schema
const EmpatheticResponseSchema = z.object({
  content: z.string(),
  tone: z.enum(['supportive', 'encouraging', 'understanding', 'celebratory', 'reassuring']),
  emotionalAlignment: z.number().finite().min(0).max(1),
  personalization: z.record(z.any()),
  suggestions: z.array(z.string()).optional(),
  followUp: z.string().optional()
});

export type EmpatheticResponse = z.infer<typeof EmpatheticResponseSchema>;

export class EmpatheticResponseSystem {
  private emotionalTemplates: Map<string, any>;
  private personalizationRules: Map<string, any>;
  private toneModifiers: Map<string, any>;

  constructor() {
    this.emotionalTemplates = new Map();
    this.personalizationRules = new Map();
    this.toneModifiers = new Map();
    this.initializeTemplates();
  }

  /**
   * Generate empathetic response based on context
   */
  async generateEmpatheticResponse(
    userInput: string,
    context: EmotionalContext,
    questionType: string
  ): Promise<EmpatheticResponse> {
    try {
      const validatedContext = EmotionalContextSchema.parse(context);
      
      // Analyze user input for emotional cues
      const emotionalAnalysis = this.analyzeEmotionalCues(userInput, validatedContext);
      
      // Determine appropriate tone and approach
      const responseStrategy = this.determineResponseStrategy(emotionalAnalysis, validatedContext);
      
      // Generate personalized response
      const response = this.generatePersonalizedResponse(
        userInput, 
        responseStrategy, 
        validatedContext, 
        questionType
      );
      
      // Apply emotional alignment
      const alignedResponse = this.applyEmotionalAlignment(response, emotionalAnalysis);
      
      // Add suggestions and follow-up
      const finalResponse = this.addSuggestionsAndFollowUp(alignedResponse, validatedContext);
      
      return EmpatheticResponseSchema.parse(finalResponse);
    } catch (error) {
      console.error('Error generating empathetic response:', error);
      return this.getFallbackResponse(userInput, context);
    }
  }

  /**
   * Analyze emotional cues in user input
   */
  private analyzeEmotionalCues(userInput: string, context: EmotionalContext): any {
    const analysis = {
      primaryEmotion: this.detectPrimaryEmotion(userInput),
      emotionalIntensity: this.calculateEmotionalIntensity(userInput),
      urgency: this.detectUrgency(userInput),
      confidence: this.detectConfidence(userInput),
      engagement: context.userEngagement,
      emotionalKeywords: this.extractEmotionalKeywords(userInput)
    };

    return analysis;
  }

  /**
   * Detect primary emotion from user input
   */
  private detectPrimaryEmotion(userInput: string): string {
    const input = userInput.toLowerCase();
    
    // Emotion detection patterns
    const emotionPatterns = {
      happy: ['great', 'excellent', 'amazing', 'wonderful', 'excited', 'thrilled', 'love'],
      frustrated: ['frustrated', 'annoyed', 'difficult', 'problem', 'issue', 'struggling', 'confused'],
      confused: ['confused', 'unsure', 'not sure', 'don\'t know', 'unclear', 'complicated'],
      excited: ['excited', 'thrilled', 'can\'t wait', 'looking forward', 'eager'],
      worried: ['worried', 'concerned', 'anxious', 'nervous', 'stress', 'pressure'],
      neutral: ['okay', 'fine', 'alright', 'good', 'sure']
    };

    for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return emotion;
      }
    }

    return 'neutral';
  }

  /**
   * Calculate emotional intensity
   */
  private calculateEmotionalIntensity(userInput: string): number {
    const intensityIndicators = {
      high: ['very', 'extremely', 'really', 'absolutely', 'completely', 'totally'],
      medium: ['quite', 'pretty', 'rather', 'somewhat', 'kind of'],
      low: ['slightly', 'a bit', 'a little', 'somewhat']
    };

    const input = userInput.toLowerCase();
    let intensity = 0.5; // Base intensity

    if (intensityIndicators.high.some(indicator => input.includes(indicator))) {
      intensity = 0.9;
    } else if (intensityIndicators.medium.some(indicator => input.includes(indicator))) {
      intensity = 0.7;
    } else if (intensityIndicators.low.some(indicator => input.includes(indicator))) {
      intensity = 0.3;
    }

    return intensity;
  }

  /**
   * Detect urgency in user input
   */
  private detectUrgency(userInput: string): number {
    const urgencyKeywords = [
      'urgent', 'asap', 'quickly', 'fast', 'immediately', 'now', 'soon',
      'deadline', 'time', 'pressure', 'rush', 'hurry'
    ];

    const input = userInput.toLowerCase();
    const urgencyCount = urgencyKeywords.filter(keyword => input.includes(keyword)).length;
    
    return Math.min(1, urgencyCount * 0.3);
  }

  /**
   * Detect confidence level in user input
   */
  private detectConfidence(userInput: string): number {
    const confidentKeywords = ['definitely', 'certainly', 'absolutely', 'sure', 'confident'];
    const uncertainKeywords = ['maybe', 'perhaps', 'possibly', 'not sure', 'unsure', 'think'];
    
    const input = userInput.toLowerCase();
    
    if (confidentKeywords.some(keyword => input.includes(keyword))) {
      return 0.9;
    } else if (uncertainKeywords.some(keyword => input.includes(keyword))) {
      return 0.3;
    }
    
    return 0.6; // Neutral confidence
  }

  /**
   * Extract emotional keywords
   */
  private extractEmotionalKeywords(userInput: string): string[] {
    const allEmotionalKeywords = [
      'happy', 'excited', 'thrilled', 'frustrated', 'annoyed', 'confused',
      'worried', 'concerned', 'anxious', 'nervous', 'stressed', 'relaxed',
      'calm', 'peaceful', 'energetic', 'tired', 'exhausted', 'motivated'
    ];

    const input = userInput.toLowerCase();
    return allEmotionalKeywords.filter(keyword => input.includes(keyword));
  }

  /**
   * Determine response strategy based on emotional analysis
   */
  private determineResponseStrategy(emotionalAnalysis: any, context: EmotionalContext): any {
    const strategy = {
      tone: this.selectTone(emotionalAnalysis, context),
      approach: this.selectApproach(emotionalAnalysis, context),
      personalization: this.selectPersonalization(context),
      emotionalAlignment: this.calculateEmotionalAlignment(emotionalAnalysis, context)
    };

    return strategy;
  }

  /**
   * Select appropriate tone for response
   */
  private selectTone(emotionalAnalysis: any, context: EmotionalContext): string {
    const { primaryEmotion, emotionalIntensity, urgency } = emotionalAnalysis;
    
    if (urgency > 0.7) {
      return 'reassuring';
    }
    
    switch (primaryEmotion) {
      case 'frustrated':
        return 'understanding';
      case 'confused':
        return 'supportive';
      case 'excited':
        return 'celebratory';
      case 'worried':
        return 'reassuring';
      case 'happy':
        return emotionalIntensity > 0.7 ? 'celebratory' : 'encouraging';
      default:
        return 'supportive';
    }
  }

  /**
   * Select appropriate approach
   */
  private selectApproach(emotionalAnalysis: any, context: EmotionalContext): string {
    const { primaryEmotion, confidence, engagement } = emotionalAnalysis;
    
    if (engagement < 0.3) {
      return 're-engage';
    }
    
    if (confidence < 0.4) {
      return 'encourage';
    }
    
    switch (primaryEmotion) {
      case 'frustrated':
        return 'validate_and_support';
      case 'confused':
        return 'clarify_and_guide';
      case 'worried':
        return 'reassure_and_plan';
      default:
        return 'acknowledge_and_progress';
    }
  }

  /**
   * Select personalization elements
   */
  private selectPersonalization(context: EmotionalContext): any {
    const personalization = {
      useName: context.userProfile.name ? true : false,
      referenceIndustry: context.userProfile.industry ? true : false,
      referenceTeamSize: context.userProfile.teamSize ? true : false,
      referenceGoals: context.userProfile.businessGoals ? true : false,
      usePreviousContext: context.previousResponses.length > 0
    };

    return personalization;
  }

  /**
   * Calculate emotional alignment
   */
  private calculateEmotionalAlignment(emotionalAnalysis: any, context: EmotionalContext): number {
    let alignment = 0.5; // Base alignment
    
    // Align with user's primary emotion
    if (emotionalAnalysis.primaryEmotion === context.userEmotion) {
      alignment += 0.2;
    }
    
    // Consider emotional intensity
    alignment += emotionalAnalysis.emotionalIntensity * 0.1;
    
    // Consider engagement level
    alignment += context.userEngagement * 0.1;
    
    return Math.min(1, alignment);
  }

  /**
   * Generate personalized response
   */
  private generatePersonalizedResponse(
    userInput: string,
    strategy: any,
    context: EmotionalContext,
    questionType: string
  ): EmpatheticResponse {
    const template = this.emotionalTemplates.get(strategy.tone) || this.emotionalTemplates.get('supportive');
    
    let content = template.baseResponse;
    
    // Apply personalization
    if (strategy.personalization.useName && context.userProfile.name) {
      content = content.replace('{{name}}', context.userProfile.name);
    }
    
    if (strategy.personalization.referenceIndustry && context.userProfile.industry) {
      content = content.replace('{{industry}}', context.userProfile.industry);
    }
    
    if (strategy.personalization.referenceTeamSize && context.userProfile.teamSize) {
      content = content.replace('{{teamSize}}', context.userProfile.teamSize);
    }
    
    // Add emotional acknowledgment
    content = this.addEmotionalAcknowledgment(content, context.userEmotion);
    
    // Add context-specific content
    content = this.addContextSpecificContent(content, questionType, context);
    
    return {
      content,
      tone: strategy.tone,
      emotionalAlignment: strategy.emotionalAlignment,
      personalization: strategy.personalization
    };
  }

  /**
   * Apply emotional alignment to response
   */
  private applyEmotionalAlignment(response: EmpatheticResponse, emotionalAnalysis: any): EmpatheticResponse {
    const alignedResponse = { ...response };
    
    // Adjust content based on emotional intensity
    if (emotionalAnalysis.emotionalIntensity > 0.8) {
      alignedResponse.content = this.intensifyResponse(alignedResponse.content, emotionalAnalysis.primaryEmotion);
    } else if (emotionalAnalysis.emotionalIntensity < 0.3) {
      alignedResponse.content = this.softenResponse(alignedResponse.content);
    }
    
    // Add urgency handling if needed
    if (emotionalAnalysis.urgency > 0.7) {
      alignedResponse.content = this.addUrgencyHandling(alignedResponse.content);
    }
    
    return alignedResponse;
  }

  /**
   * Add suggestions and follow-up
   */
  private addSuggestionsAndFollowUp(response: EmpatheticResponse, context: EmotionalContext): EmpatheticResponse {
    const enhancedResponse = { ...response };
    
    // Add context-appropriate suggestions
    if (context.userEmotion === 'confused') {
      enhancedResponse.suggestions = [
        'Would you like me to explain this in more detail?',
        'Should we take a step back and review the basics?',
        'Would you prefer to see some examples?'
      ];
    } else if (context.userEmotion === 'frustrated') {
      enhancedResponse.suggestions = [
        'Let me help you find a solution',
        'We can work through this together',
        'Would you like to try a different approach?'
      ];
    }
    
    // Add appropriate follow-up
    enhancedResponse.followUp = this.generateFollowUp(context);
    
    return enhancedResponse;
  }

  /**
   * Add emotional acknowledgment
   */
  private addEmotionalAcknowledgment(content: string, userEmotion: string): string {
    const acknowledgments = {
      frustrated: 'I understand this can be frustrating, and I\'m here to help.',
      confused: 'I can see this might be confusing, let me clarify.',
      worried: 'I understand your concerns, and we\'ll address them together.',
      excited: 'I can feel your enthusiasm, and that\'s wonderful!',
      happy: 'I\'m glad you\'re feeling positive about this!',
      neutral: 'Thank you for sharing that with me.'
    };

    const acknowledgment = acknowledgments[userEmotion as keyof typeof acknowledgments] || acknowledgments.neutral;
    return `${acknowledgment} ${content}`;
  }

  /**
   * Add context-specific content
   */
  private addContextSpecificContent(content: string, questionType: string, context: EmotionalContext): string {
    const contextAdditions = {
      business_goal: 'Understanding your goals helps us tailor the perfect solution for you.',
      team_size: 'Team size is crucial for finding the right collaboration approach.',
      industry: 'Industry context helps us provide relevant insights and benchmarks.',
      tech_level: 'Technology maturity guides our recommendations perfectly.',
      challenge: 'Identifying challenges is the first step to solving them.',
      timeline: 'Timeline helps us set realistic expectations and milestones.',
      budget: 'Budget considerations ensure we recommend the right investment level.',
      learning_preference: 'Learning style helps us create the perfect onboarding experience.'
    };

    const addition = contextAdditions[questionType as keyof typeof contextAdditions] || '';
    return addition ? `${content} ${addition}` : content;
  }

  /**
   * Intensify response for high emotional intensity
   */
  private intensifyResponse(content: string, emotion: string): string {
    const intensifiers = {
      happy: 'That\'s absolutely fantastic! ',
      excited: 'I\'m thrilled to hear that! ',
      frustrated: 'I completely understand your frustration. ',
      worried: 'I really understand your concerns. ',
      confused: 'I can see why this might be confusing. '
    };

    const intensifier = intensifiers[emotion as keyof typeof intensifiers] || '';
    return intensifier + content;
  }

  /**
   * Soften response for low emotional intensity
   */
  private softenResponse(content: string): string {
    return content.replace(/!/g, '.').replace(/amazing/g, 'good').replace(/fantastic/g, 'nice');
  }

  /**
   * Add urgency handling
   */
  private addUrgencyHandling(content: string): string {
    return content + ' I understand this is time-sensitive, so let\'s move quickly to get you what you need.';
  }

  /**
   * Generate appropriate follow-up
   */
  private generateFollowUp(context: EmotionalContext): string {
    const followUps = {
      happy: 'What would you like to explore next?',
      excited: 'What aspect would you like to dive into first?',
      frustrated: 'Let\'s work through this step by step.',
      confused: 'Let me break this down for you.',
      worried: 'Let\'s address your concerns together.',
      neutral: 'How can I help you move forward?'
    };

    return followUps[context.userEmotion as keyof typeof followUps] || followUps.neutral;
  }

  /**
   * Get fallback response
   */
  private getFallbackResponse(userInput: string, context: EmotionalContext): EmpatheticResponse {
    return {
      content: 'Thank you for sharing that with me. How can I help you get started with OptimaliQ?',
      tone: 'supportive',
      emotionalAlignment: 0.5,
      personalization: {},
      suggestions: ['Start Assessment', 'View Dashboard', 'Schedule Demo'],
      followUp: 'What would you like to explore next?'
    };
  }

  /**
   * Initialize emotional templates
   */
  private initializeTemplates(): void {
    // Supportive tone templates
    this.emotionalTemplates.set('supportive', {
      baseResponse: 'I\'m here to support you every step of the way. {{context}}',
      modifiers: {
        high_engagement: 'I can see you\'re really engaged with this.',
        low_engagement: 'Let me help you get more involved.',
        confused: 'Let me clarify this for you.',
        frustrated: 'I understand this can be challenging.'
      }
    });

    // Encouraging tone templates
    this.emotionalTemplates.set('encouraging', {
      baseResponse: 'That\'s a great approach! {{context}}',
      modifiers: {
        progress: 'You\'re making excellent progress.',
        effort: 'Your effort is really paying off.',
        potential: 'I can see great potential here.'
      }
    });

    // Understanding tone templates
    this.emotionalTemplates.set('understanding', {
      baseResponse: 'I completely understand where you\'re coming from. {{context}}',
      modifiers: {
        challenge: 'This is indeed a challenging situation.',
        complexity: 'This can be quite complex.',
        frustration: 'Your frustration is completely valid.'
      }
    });

    // Celebratory tone templates
    this.emotionalTemplates.set('celebratory', {
      baseResponse: 'That\'s wonderful! {{context}}',
      modifiers: {
        achievement: 'This is a fantastic achievement!',
        progress: 'You\'ve made incredible progress!',
        success: 'This is a real success story!'
      }
    });

    // Reassuring tone templates
    this.emotionalTemplates.set('reassuring', {
      baseResponse: 'Don\'t worry, we\'ll work through this together. {{context}}',
      modifiers: {
        support: 'You have our full support.',
        solution: 'We\'ll find the right solution.',
        guidance: 'I\'ll guide you through this.'
      }
    });
  }
}

