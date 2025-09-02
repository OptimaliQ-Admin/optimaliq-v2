/**
 * AI-Powered Skill Gap Analysis
 * Automated skill gap identification and analysis
 */

import { z } from 'zod';

// Skill Gap Analysis Request Schema
const SkillGapAnalysisRequestSchema = z.object({
  userId: z.string(),
  assessmentId: z.string(),
  skillFramework: z.object({
    id: z.string(),
    name: z.string(),
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      skills: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        levels: z.array(z.object({
          level: z.number().finite(),
          name: z.string(),
          description: z.string(),
          indicators: z.array(z.string())
        }))
      }))
    }))
  }),
  currentSkills: z.object({
    assessedSkills: z.array(z.object({
      skillId: z.string(),
      categoryId: z.string(),
      currentLevel: z.number().finite(),
      confidence: z.number().finite().min(0).max(1),
      evidence: z.array(z.string())
    })),
    selfAssessedSkills: z.array(z.object({
      skillId: z.string(),
      categoryId: z.string(),
      selfLevel: z.number().finite(),
      confidence: z.number().finite().min(0).max(1)
    }))
  }),
  targetSkills: z.object({
    requiredSkills: z.array(z.object({
      skillId: z.string(),
      categoryId: z.string(),
      requiredLevel: z.number().finite(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      timeframe: z.string()
    })),
    desiredSkills: z.array(z.object({
      skillId: z.string(),
      categoryId: z.string(),
      desiredLevel: z.number().finite(),
      priority: z.enum(['low', 'medium', 'high']),
      timeframe: z.string()
    }))
  }),
  context: z.object({
    role: z.string(),
    industry: z.string(),
    experience: z.number().finite(),
    goals: z.array(z.string()),
    constraints: z.object({
      timeAvailable: z.number().finite(), // hours per week
      budget: z.number().finite().optional(),
      learningPreferences: z.array(z.string())
    })
  })
});

export type SkillGapAnalysisRequest = z.infer<typeof SkillGapAnalysisRequestSchema>;

// Skill Gap Analysis Result Schema
const SkillGapAnalysisResultSchema = z.object({
  gapAnalysis: z.object({
    overallGap: z.number().finite().min(0).max(100),
    categoryGaps: z.array(z.object({
      categoryId: z.string(),
      categoryName: z.string(),
      gap: z.number().finite().min(0).max(100),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      skills: z.array(z.object({
        skillId: z.string(),
        skillName: z.string(),
        currentLevel: z.number().finite(),
        targetLevel: z.number().finite(),
        gap: z.number().finite(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        impact: z.number().finite().min(0).max(1)
      }))
    })),
    criticalGaps: z.array(z.object({
      skillId: z.string(),
      skillName: z.string(),
      categoryName: z.string(),
      gap: z.number().finite(),
      impact: z.number().finite().min(0).max(1),
      urgency: z.enum(['immediate', 'short_term', 'medium_term', 'long_term'])
    })),
    quickWins: z.array(z.object({
      skillId: z.string(),
      skillName: z.string(),
      categoryName: z.string(),
      gap: z.number().finite(),
      effort: z.enum(['low', 'medium', 'high']),
      timeframe: z.string()
    }))
  }),
  recommendations: z.object({
    immediate: z.array(z.object({
      action: z.string(),
      skill: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      rationale: z.string(),
      expectedOutcome: z.string(),
      timeframe: z.string()
    })),
    shortTerm: z.array(z.object({
      action: z.string(),
      skills: z.array(z.string()),
      timeframe: z.string(),
      rationale: z.string(),
      successMetrics: z.array(z.string())
    })),
    longTerm: z.array(z.object({
      action: z.string(),
      skills: z.array(z.string()),
      timeframe: z.string(),
      rationale: z.string(),
      milestones: z.array(z.string())
    }))
  }),
  developmentPlan: z.object({
    learningPath: z.array(z.object({
      phase: z.number().finite(),
      name: z.string(),
      skills: z.array(z.string()),
      duration: z.string(),
      activities: z.array(z.object({
        type: z.string(),
        description: z.string(),
        duration: z.string(),
        resources: z.array(z.string())
      }))
    })),
    timeline: z.object({
      startDate: z.string(),
      endDate: z.string(),
      milestones: z.array(z.object({
        milestone: z.string(),
        targetDate: z.string(),
        skills: z.array(z.string()),
        successCriteria: z.array(z.string())
      }))
    }),
    resources: z.object({
      courses: z.array(z.object({
        name: z.string(),
        provider: z.string(),
        duration: z.string(),
        cost: z.number().finite(),
        skills: z.array(z.string())
      })),
      mentors: z.array(z.object({
        name: z.string(),
        expertise: z.array(z.string()),
        availability: z.string(),
        cost: z.number().finite().optional()
      })),
      tools: z.array(z.object({
        name: z.string(),
        purpose: z.string(),
        cost: z.number().finite(),
        skills: z.array(z.string())
      }))
    })
  }),
  insights: z.object({
    keyInsights: z.array(z.object({
      insight: z.string(),
      category: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      confidence: z.number().finite().min(0).max(1)
    })),
    trends: z.array(z.object({
      skill: z.string(),
      trend: z.enum(['improving', 'declining', 'stable']),
      magnitude: z.number().finite(),
      timeframe: z.string()
    })),
    opportunities: z.array(z.object({
      opportunity: z.string(),
      probability: z.number().finite().min(0).max(1),
      potential: z.number().finite().min(0).max(1),
      timeframe: z.string()
    }))
  })
});

export type SkillGapAnalysisResult = z.infer<typeof SkillGapAnalysisResultSchema>;

export class SkillGapAnalysis {
  private analysisEngine: Map<string, any>;
  private recommendationEngine: Map<string, any>;
  private planningEngine: Map<string, any>;

  constructor() {
    this.analysisEngine = new Map();
    this.recommendationEngine = new Map();
    this.planningEngine = new Map();
    this.initializeEngines();
  }

  /**
   * Analyze skill gaps and generate recommendations
   */
  async analyzeSkillGaps(request: SkillGapAnalysisRequest): Promise<SkillGapAnalysisResult> {
    try {
      const validatedRequest = SkillGapAnalysisRequestSchema.parse(request);
      
      // Analyze gaps
      const gapAnalysis = this.analyzeGaps(validatedRequest);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(validatedRequest, gapAnalysis);
      
      // Create development plan
      const developmentPlan = this.createDevelopmentPlan(validatedRequest, gapAnalysis);
      
      // Generate insights
      const insights = this.generateInsights(validatedRequest, gapAnalysis);
      
      const result: SkillGapAnalysisResult = {
        gapAnalysis,
        recommendations,
        developmentPlan,
        insights
      };

      return SkillGapAnalysisResultSchema.parse(result);
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      return this.getFallbackAnalysisResult(request);
    }
  }

  /**
   * Analyze skill gaps
   */
  private analyzeGaps(request: SkillGapAnalysisRequest): any {
    const categoryGaps = this.analyzeCategoryGaps(request);
    const criticalGaps = this.identifyCriticalGaps(request, categoryGaps);
    const quickWins = this.identifyQuickWins(request, categoryGaps);
    const overallGap = this.calculateOverallGap(categoryGaps);

    return {
      overallGap,
      categoryGaps,
      criticalGaps,
      quickWins
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(request: SkillGapAnalysisRequest, gapAnalysis: any): any {
    const immediate = this.generateImmediateRecommendations(gapAnalysis);
    const shortTerm = this.generateShortTermRecommendations(request, gapAnalysis);
    const longTerm = this.generateLongTermRecommendations(request, gapAnalysis);

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * Create development plan
   */
  private createDevelopmentPlan(request: SkillGapAnalysisRequest, gapAnalysis: any): any {
    const learningPath = this.createLearningPath(request, gapAnalysis);
    const timeline = this.createTimeline(request, learningPath);
    const resources = this.identifyResources(request, gapAnalysis);

    return {
      learningPath,
      timeline,
      resources
    };
  }

  /**
   * Generate insights
   */
  private generateInsights(request: SkillGapAnalysisRequest, gapAnalysis: any): any {
    const keyInsights = this.extractKeyInsights(request, gapAnalysis);
    const trends = this.analyzeTrends(request, gapAnalysis);
    const opportunities = this.identifyOpportunities(request, gapAnalysis);

    return {
      keyInsights,
      trends,
      opportunities
    };
  }

  /**
   * Analyze category gaps
   */
  private analyzeCategoryGaps(request: SkillGapAnalysisRequest): any[] {
    return request.skillFramework.categories.map(category => {
      const categorySkills = category.skills.map(skill => {
        const currentSkill = request.currentSkills.assessedSkills.find(s => s.skillId === skill.id);
        const requiredSkill = request.targetSkills.requiredSkills.find(s => s.skillId === skill.id);
        const desiredSkill = request.targetSkills.desiredSkills.find(s => s.skillId === skill.id);

        const currentLevel = currentSkill?.currentLevel || 0;
        const targetLevel = requiredSkill?.requiredLevel || desiredSkill?.desiredLevel || 0;
        const gap = Math.max(0, targetLevel - currentLevel);
        const priority = requiredSkill?.priority || desiredSkill?.priority || 'low';
        const impact = this.calculateSkillImpact(skill, category, request);

        return {
          skillId: skill.id,
          skillName: skill.name,
          currentLevel,
          targetLevel,
          gap,
          priority,
          impact
        };
      });

      const categoryGap = categorySkills.reduce((sum, skill) => sum + skill.gap, 0) / categorySkills.length;
      const categoryPriority = this.determineCategoryPriority(categorySkills);

      return {
        categoryId: category.id,
        categoryName: category.name,
        gap: categoryGap,
        priority: categoryPriority,
        skills: categorySkills
      };
    });
  }

  /**
   * Identify critical gaps
   */
  private identifyCriticalGaps(request: SkillGapAnalysisRequest, categoryGaps: any[]): any[] {
    const criticalGaps = [];

    categoryGaps.forEach(category => {
      category.skills.forEach(skill => {
        if (skill.priority === 'critical' && skill.gap > 0) {
          criticalGaps.push({
            skillId: skill.skillId,
            skillName: skill.skillName,
            categoryName: category.categoryName,
            gap: skill.gap,
            impact: skill.impact,
            urgency: this.determineUrgency(skill.gap, skill.impact)
          });
        }
      });
    });

    return criticalGaps.sort((a, b) => b.impact - a.impact);
  }

  /**
   * Identify quick wins
   */
  private identifyQuickWins(request: SkillGapAnalysisRequest, categoryGaps: any[]): any[] {
    const quickWins = [];

    categoryGaps.forEach(category => {
      category.skills.forEach(skill => {
        if (skill.gap <= 1 && skill.impact > 0.3) {
          quickWins.push({
            skillId: skill.skillId,
            skillName: skill.skillName,
            categoryName: category.categoryName,
            gap: skill.gap,
            effort: this.determineEffort(skill.gap),
            timeframe: this.estimateTimeframe(skill.gap)
          });
        }
      });
    });

    return quickWins.sort((a, b) => a.effort.localeCompare(b.effort));
  }

  /**
   * Calculate overall gap
   */
  private calculateOverallGap(categoryGaps: any[]): number {
    if (categoryGaps.length === 0) return 0;
    
    const totalGap = categoryGaps.reduce((sum, category) => sum + category.gap, 0);
    return totalGap / categoryGaps.length;
  }

  /**
   * Generate immediate recommendations
   */
  private generateImmediateRecommendations(gapAnalysis: any): any[] {
    const recommendations = [];

    gapAnalysis.criticalGaps.slice(0, 3).forEach(gap => {
      recommendations.push({
        action: `Address critical gap in ${gap.skillName}`,
        skill: gap.skillName,
        priority: 'critical' as const,
        rationale: `Critical skill gap (${gap.gap} levels) with high impact (${(gap.impact * 100).toFixed(1)}%)`,
        expectedOutcome: `Achieve target level within ${this.estimateTimeframe(gap.gap)}`,
        timeframe: this.estimateTimeframe(gap.gap)
      });
    });

    gapAnalysis.quickWins.slice(0, 2).forEach(win => {
      recommendations.push({
        action: `Quick win: Improve ${win.skillName}`,
        skill: win.skillName,
        priority: 'high' as const,
        rationale: `Low effort, high impact improvement opportunity`,
        expectedOutcome: `Achieve target level quickly`,
        timeframe: win.timeframe
      });
    });

    return recommendations;
  }

  /**
   * Generate short-term recommendations
   */
  private generateShortTermRecommendations(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    const recommendations = [];

    const highPriorityGaps = gapAnalysis.categoryGaps
      .flatMap(category => category.skills)
      .filter(skill => skill.priority === 'high' && skill.gap > 0)
      .slice(0, 5);

    if (highPriorityGaps.length > 0) {
      recommendations.push({
        action: 'Address high-priority skill gaps',
        skills: highPriorityGaps.map(skill => skill.skillName),
        timeframe: 'Next 3 months',
        rationale: 'Focus on high-priority skills for balanced development',
        successMetrics: ['Achieve target levels', 'Improve overall skill score', 'Reduce critical gaps']
      });
    }

    return recommendations;
  }

  /**
   * Generate long-term recommendations
   */
  private generateLongTermRecommendations(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    const recommendations = [];

    if (gapAnalysis.overallGap > 30) {
      recommendations.push({
        action: 'Develop comprehensive skill foundation',
        skills: request.skillFramework.categories.flatMap(category => 
          category.skills.map(skill => skill.name)
        ),
        timeframe: 'Next 12 months',
        rationale: 'Significant skill gaps require systematic development approach',
        milestones: ['Achieve intermediate levels', 'Balance skill categories', 'Establish learning habits']
      });
    }

    return recommendations;
  }

  /**
   * Create learning path
   */
  private createLearningPath(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    const learningPath = [];
    const criticalSkills = gapAnalysis.criticalGaps.slice(0, 3);
    const highPrioritySkills = gapAnalysis.categoryGaps
      .flatMap(category => category.skills)
      .filter(skill => skill.priority === 'high' && skill.gap > 0)
      .slice(0, 5);

    // Phase 1: Critical skills
    if (criticalSkills.length > 0) {
      learningPath.push({
        phase: 1,
        name: 'Critical Skills Development',
        skills: criticalSkills.map(skill => skill.skillName),
        duration: '1-2 months',
        activities: this.generateActivities(criticalSkills, 'critical')
      });
    }

    // Phase 2: High priority skills
    if (highPrioritySkills.length > 0) {
      learningPath.push({
        phase: 2,
        name: 'High Priority Skills',
        skills: highPrioritySkills.map(skill => skill.skillName),
        duration: '3-6 months',
        activities: this.generateActivities(highPrioritySkills, 'high')
      });
    }

    return learningPath;
  }

  /**
   * Create timeline
   */
  private createTimeline(request: SkillGapAnalysisRequest, learningPath: any[]): any {
    const startDate = new Date();
    let currentDate = new Date(startDate);

    const milestones = learningPath.map((phase, index) => {
      const targetDate = new Date(currentDate.getTime() + this.getPhaseDuration(phase.duration) * 24 * 60 * 60 * 1000);
      const milestone = {
        milestone: `Complete ${phase.name}`,
        targetDate: targetDate.toISOString().split('T')[0],
        skills: phase.skills,
        successCriteria: this.generateSuccessCriteria(phase)
      };
      currentDate = targetDate;
      return milestone;
    });

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: currentDate.toISOString().split('T')[0],
      milestones
    };
  }

  /**
   * Identify resources
   */
  private identifyResources(request: SkillGapAnalysisRequest, gapAnalysis: any): any {
    const courses = this.identifyCourses(request, gapAnalysis);
    const mentors = this.identifyMentors(request, gapAnalysis);
    const tools = this.identifyTools(request, gapAnalysis);

    return {
      courses,
      mentors,
      tools
    };
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    const insights = [];

    // Overall gap insight
    if (gapAnalysis.overallGap > 40) {
      insights.push({
        insight: 'Significant skill gaps detected requiring comprehensive development plan',
        category: 'overall',
        impact: 'high' as const,
        confidence: 0.9
      });
    }

    // Critical gaps insight
    if (gapAnalysis.criticalGaps.length > 0) {
      insights.push({
        insight: `${gapAnalysis.criticalGaps.length} critical skill gaps require immediate attention`,
        category: 'critical',
        impact: 'high' as const,
        confidence: 0.95
      });
    }

    // Quick wins insight
    if (gapAnalysis.quickWins.length > 0) {
      insights.push({
        insight: `${gapAnalysis.quickWins.length} quick win opportunities available for rapid improvement`,
        category: 'opportunities',
        impact: 'medium' as const,
        confidence: 0.8
      });
    }

    return insights;
  }

  /**
   * Analyze trends
   */
  private analyzeTrends(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    // Simplified trend analysis - in real implementation, this would use historical data
    const trends = [];
    
    gapAnalysis.categoryGaps.forEach(category => {
      const avgGap = category.skills.reduce((sum, skill) => sum + skill.gap, 0) / category.skills.length;
      if (avgGap > 2) {
        trends.push({
          skill: category.categoryName,
          trend: 'declining' as const,
          magnitude: avgGap,
          timeframe: 'current_assessment'
        });
      }
    });

    return trends;
  }

  /**
   * Identify opportunities
   */
  private identifyOpportunities(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    const opportunities = [];

    // Quick wins opportunity
    if (gapAnalysis.quickWins.length > 0) {
      opportunities.push({
        opportunity: 'Leverage quick wins for rapid skill improvement',
        probability: 0.8,
        potential: 0.6,
        timeframe: '1-2 months'
      });
    }

    // High-impact skills opportunity
    const highImpactSkills = gapAnalysis.categoryGaps
      .flatMap(category => category.skills)
      .filter(skill => skill.impact > 0.7 && skill.gap > 0);
    
    if (highImpactSkills.length > 0) {
      opportunities.push({
        opportunity: `Focus on ${highImpactSkills.length} high-impact skills for maximum ROI`,
        probability: 0.7,
        potential: 0.8,
        timeframe: '3-6 months'
      });
    }

    return opportunities;
  }

  // Helper methods
  private calculateSkillImpact(skill: any, category: any, request: SkillGapAnalysisRequest): number {
    const requiredSkill = request.targetSkills.requiredSkills.find(s => s.skillId === skill.id);
    const desiredSkill = request.targetSkills.desiredSkills.find(s => s.skillId === skill.id);
    
    if (requiredSkill?.priority === 'critical') return 0.9;
    if (requiredSkill?.priority === 'high') return 0.7;
    if (desiredSkill?.priority === 'high') return 0.6;
    return 0.4;
  }

  private determineCategoryPriority(skills: any[]): 'low' | 'medium' | 'high' | 'critical' {
    const priorities = skills.map(skill => skill.priority);
    if (priorities.includes('critical')) return 'critical';
    if (priorities.includes('high')) return 'high';
    if (priorities.includes('medium')) return 'medium';
    return 'low';
  }

  private determineUrgency(gap: number, impact: number): 'immediate' | 'short_term' | 'medium_term' | 'long_term' {
    if (gap > 3 && impact > 0.7) return 'immediate';
    if (gap > 2 && impact > 0.5) return 'short_term';
    if (gap > 1) return 'medium_term';
    return 'long_term';
  }

  private determineEffort(gap: number): 'low' | 'medium' | 'high' {
    if (gap <= 1) return 'low';
    if (gap <= 2) return 'medium';
    return 'high';
  }

  private estimateTimeframe(gap: number): string {
    if (gap <= 1) return '1-2 weeks';
    if (gap <= 2) return '1-2 months';
    if (gap <= 3) return '3-6 months';
    return '6-12 months';
  }

  private generateActivities(skills: any[], priority: string): any[] {
    return [
      {
        type: 'learning',
        description: `Study ${skills.map(s => s.skillName || s.skill).join(', ')} fundamentals`,
        duration: priority === 'critical' ? '2-4 weeks' : '4-8 weeks',
        resources: ['Online courses', 'Books', 'Tutorials']
      },
      {
        type: 'practice',
        description: `Apply ${skills.map(s => s.skillName || s.skill).join(', ')} in real projects`,
        duration: priority === 'critical' ? '1-2 months' : '2-3 months',
        resources: ['Project work', 'Mentorship', 'Peer review']
      }
    ];
  }

  private getPhaseDuration(duration: string): number {
    if (duration.includes('1-2 months')) return 45;
    if (duration.includes('3-6 months')) return 135;
    return 30;
  }

  private generateSuccessCriteria(phase: any): string[] {
    return [
      `Demonstrate ${phase.skills.join(', ')} at target levels`,
      'Complete required activities',
      'Pass skill assessments',
      'Receive peer/mentor validation'
    ];
  }

  private identifyCourses(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    const courses = [];
    const criticalSkills = gapAnalysis.criticalGaps.map(gap => gap.skillName);

    criticalSkills.forEach(skill => {
      courses.push({
        name: `${skill} Fundamentals`,
        provider: 'Online Learning Platform',
        duration: '4-6 weeks',
        cost: 99,
        skills: [skill]
      });
    });

    return courses;
  }

  private identifyMentors(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    return [
      {
        name: 'Industry Expert',
        expertise: gapAnalysis.criticalGaps.map(gap => gap.skillName),
        availability: '2 hours/week',
        cost: 150
      }
    ];
  }

  private identifyTools(request: SkillGapAnalysisRequest, gapAnalysis: any): any[] {
    return [
      {
        name: 'Skill Assessment Platform',
        purpose: 'Track skill development progress',
        cost: 29,
        skills: gapAnalysis.criticalGaps.map(gap => gap.skillName)
      }
    ];
  }

  /**
   * Get fallback analysis result
   */
  private getFallbackAnalysisResult(request: SkillGapAnalysisRequest): SkillGapAnalysisResult {
    return {
      gapAnalysis: {
        overallGap: 0,
        categoryGaps: [],
        criticalGaps: [],
        quickWins: []
      },
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: []
      },
      developmentPlan: {
        learningPath: [],
        timeline: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          milestones: []
        },
        resources: {
          courses: [],
          mentors: [],
          tools: []
        }
      },
      insights: {
        keyInsights: [],
        trends: [],
        opportunities: []
      }
    };
  }

  /**
   * Initialize engines
   */
  private initializeEngines(): void {
    // Initialize skill gap analysis engines
    this.analysisEngine.set('gaps', this.analyzeGaps.bind(this));
    this.analysisEngine.set('recommendations', this.generateRecommendations.bind(this));
    this.analysisEngine.set('planning', this.createDevelopmentPlan.bind(this));
  }
}


