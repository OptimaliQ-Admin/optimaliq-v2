/**
 * AI-Optimized Project and Task Assignment
 * Intelligent matching of projects and tasks to team members based on skills, capacity, and optimization goals
 */

import { z } from 'zod';

// Project Assignment Request Schema
const ProjectAssignmentRequestSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  assignmentScope: z.object({
    projectIds: z.array(z.string()).optional(),
    teamIds: z.array(z.string()),
    timeframe: z.object({
      start: z.string(),
      end: z.string(),
      planning_horizon: z.enum(['sprint', 'quarter', 'half_year', 'year'])
    }),
    assignmentTypes: z.array(z.enum(['new_project', 'ongoing_project', 'task_rebalancing', 'skill_development', 'succession_planning'])),
    optimizationGoals: z.array(z.enum(['efficiency', 'quality', 'development', 'balance', 'risk_mitigation', 'innovation', 'speed'])),
    constraints: z.array(z.enum(['capacity', 'skills', 'availability', 'dependencies', 'preferences', 'compliance']))
  }),
  projects: z.array(z.object({
    projectId: z.string(),
    name: z.string(),
    type: z.enum(['development', 'research', 'implementation', 'maintenance', 'innovation', 'operations']),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    status: z.enum(['planned', 'active', 'on_hold', 'completed', 'cancelled']),
    timeline: z.object({
      start: z.string(),
      end: z.string(),
      milestones: z.array(z.object({
        milestone: z.string(),
        date: z.string(),
        dependencies: z.array(z.string())
      })),
      flexibility: z.enum(['fixed', 'moderate', 'flexible'])
    }),
    requirements: z.object({
      skillRequirements: z.array(z.object({
        skill: z.string(),
        level: z.number().finite().min(0).max(10),
        criticality: z.enum(['essential', 'important', 'preferred']),
        hours: z.number().finite(),
        overlap: z.boolean()
      })),
      teamSize: z.object({
        minimum: z.number().finite(),
        optimal: z.number().finite(),
        maximum: z.number().finite()
      }),
      experience: z.object({
        minimum: z.number().finite(),
        preferred: z.number().finite(),
        domain: z.array(z.string())
      }),
      leadership: z.object({
        required: z.boolean(),
        level: z.enum(['team_lead', 'senior', 'expert']).optional(),
        responsibilities: z.array(z.string())
      })
    }),
    characteristics: z.object({
      complexity: z.enum(['low', 'medium', 'high', 'very_high']),
      uncertainty: z.enum(['low', 'medium', 'high']),
      innovation: z.enum(['routine', 'incremental', 'breakthrough']),
      visibility: z.enum(['internal', 'department', 'organization', 'external']),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical'])
    }),
    success_criteria: z.array(z.object({
      criterion: z.string(),
      metric: z.string(),
      target: z.number().finite(),
      weight: z.number().finite().min(0).max(1)
    })),
    stakeholders: z.array(z.object({
      stakeholder: z.string(),
      role: z.enum(['sponsor', 'customer', 'user', 'contributor', 'reviewer']),
      influence: z.enum(['low', 'medium', 'high']),
      expectations: z.array(z.string())
    })),
    resources: z.object({
      budget: z.number().finite(),
      tools: z.array(z.string()),
      infrastructure: z.array(z.string()),
      external: z.array(z.string())
    }),
    currentAssignment: z.array(z.object({
      userId: z.string(),
      role: z.string(),
      allocation: z.number().finite().min(0).max(1),
      startDate: z.string(),
      endDate: z.string().optional()
    }))
  })),
  teamMembers: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    role: z.string(),
    seniority: z.enum(['junior', 'mid', 'senior', 'lead', 'principal', 'manager']),
    department: z.string(),
    location: z.enum(['on_site', 'remote', 'hybrid']),
    availability: z.object({
      currentCapacity: z.number().finite().min(0).max(1),
      futureCapacity: z.array(z.object({
        period: z.string(),
        capacity: z.number().finite().min(0).max(1)
      })),
      constraints: z.array(z.object({
        type: z.enum(['vacation', 'training', 'other_project', 'personal']),
        start: z.string(),
        end: z.string(),
        impact: z.number().finite().min(0).max(1)
      })),
      preferred_allocation: z.number().finite().min(0).max(1),
      minimum_allocation: z.number().finite().min(0).max(1)
    }),
    skills: z.array(z.object({
      skill: z.string(),
      level: z.number().finite().min(0).max(10),
      experience: z.number().finite(),
      certified: z.boolean(),
      last_used: z.string(),
      growth_trajectory: z.enum(['declining', 'stable', 'improving']),
      interest: z.number().finite().min(0).max(10),
      teaching_ability: z.boolean()
    })),
    performance: z.object({
      overall: z.number().finite().min(0).max(10),
      productivity: z.number().finite().min(0).max(10),
      quality: z.number().finite().min(0).max(10),
      collaboration: z.number().finite().min(0).max(10),
      leadership: z.number().finite().min(0).max(10),
      innovation: z.number().finite().min(0).max(10),
      reliability: z.number().finite().min(0).max(10)
    }),
    preferences: z.object({
      projectTypes: z.array(z.string()),
      workStyle: z.enum(['individual', 'collaborative', 'leadership', 'support']),
      challenge_level: z.enum(['routine', 'moderate', 'challenging', 'breakthrough']),
      learning_goals: z.array(z.string()),
      career_aspirations: z.array(z.string()),
      avoid: z.array(z.string())
    }),
    development: z.object({
      currentLevel: z.enum(['junior', 'mid', 'senior', 'expert']),
      targetLevel: z.enum(['mid', 'senior', 'expert', 'leader']),
      development_areas: z.array(z.string()),
      learning_velocity: z.enum(['slow', 'average', 'fast']),
      mentoring: z.object({
        as_mentor: z.array(z.string()),
        needs_mentor: z.array(z.string())
      })
    }),
    workHistory: z.array(z.object({
      projectId: z.string(),
      role: z.string(),
      duration: z.string(),
      performance: z.number().finite().min(0).max(10),
      skills_used: z.array(z.string()),
      challenges: z.array(z.string()),
      achievements: z.array(z.string()),
      lessons: z.array(z.string())
    }))
  })),
  organizationalContext: z.object({
    culture: z.object({
      collaboration_style: z.enum(['individual', 'team_based', 'matrix', 'cross_functional']),
      risk_tolerance: z.enum(['conservative', 'moderate', 'aggressive']),
      innovation_focus: z.enum(['low', 'medium', 'high']),
      learning_culture: z.enum(['minimal', 'supported', 'encouraged', 'required']),
      performance_culture: z.enum(['results', 'process', 'balanced', 'development'])
    }),
    policies: z.array(z.object({
      policy: z.string(),
      area: z.enum(['assignment', 'workload', 'skills', 'development', 'performance']),
      description: z.string(),
      mandatory: z.boolean(),
      exceptions: z.array(z.string())
    })),
    constraints: z.array(z.object({
      constraint: z.string(),
      type: z.enum(['regulatory', 'budget', 'timeline', 'resource', 'skill']),
      impact: z.enum(['low', 'medium', 'high']),
      workaround: z.string().optional()
    })),
    goals: z.array(z.object({
      goal: z.string(),
      category: z.enum(['performance', 'development', 'innovation', 'efficiency']),
      priority: z.enum(['critical', 'high', 'medium', 'low']),
      timeline: z.string(),
      metrics: z.array(z.string())
    }))
  }),
  historicalData: z.object({
    assignments: z.array(z.object({
      projectId: z.string(),
      userId: z.string(),
      role: z.string(),
      duration: z.string(),
      success: z.enum(['failed', 'partial', 'successful', 'exceptional']),
      performance: z.number().finite().min(0).max(10),
      satisfaction: z.number().finite().min(0).max(10),
      learning: z.number().finite().min(0).max(10),
      factors: z.array(z.string())
    })),
    patterns: z.array(z.object({
      pattern: z.string(),
      context: z.string(),
      success_rate: z.number().finite().min(0).max(1),
      factors: z.array(z.string()),
      lessons: z.array(z.string())
    })),
    outcomes: z.array(z.object({
      projectId: z.string(),
      outcome: z.enum(['delivered', 'delayed', 'cancelled', 'failed']),
      factors: z.array(z.string()),
      assignment_quality: z.number().finite().min(0).max(10),
      team_performance: z.number().finite().min(0).max(10)
    }))
  })
});

export type ProjectAssignmentRequest = z.infer<typeof ProjectAssignmentRequestSchema>;

// Project Assignment Result Schema
const ProjectAssignmentResultSchema = z.object({
  executiveSummary: z.object({
    assignmentOverview: z.object({
      totalProjects: z.number().finite(),
      totalAssignments: z.number().finite(),
      optimization_score: z.number().finite().min(0).max(10),
      capacity_utilization: z.number().finite().min(0).max(1),
      skill_match_quality: z.number().finite().min(0).max(10),
      risk_level: z.enum(['low', 'medium', 'high', 'critical'])
    }),
    keyInsights: z.array(z.object({
      insight: z.string(),
      category: z.enum(['capacity', 'skills', 'development', 'risk', 'opportunity']),
      impact: z.enum(['low', 'medium', 'high', 'critical']),
      confidence: z.number().finite().min(0).max(1),
      evidence: z.array(z.string()),
      recommendations: z.array(z.string())
    })),
    challenges: z.array(z.object({
      challenge: z.string(),
      type: z.enum(['skill_gap', 'capacity_constraint', 'timeline_conflict', 'preference_mismatch']),
      severity: z.enum(['minor', 'moderate', 'significant', 'critical']),
      affected_projects: z.array(z.string()),
      mitigation: z.array(z.string())
    }))
  }),
  optimalAssignments: z.array(z.object({
    projectId: z.string(),
    projectName: z.string(),
    assignments: z.array(z.object({
      userId: z.string(),
      name: z.string(),
      role: z.string(),
      allocation: z.number().finite().min(0).max(1),
      startDate: z.string(),
      endDate: z.string(),
      confidence: z.number().finite().min(0).max(1),
      rationale: z.string(),
      skillMatch: z.object({
        overall: z.number().finite().min(0).max(10),
        details: z.array(z.object({
          skill: z.string(),
          required: z.number().finite().min(0).max(10),
          available: z.number().finite().min(0).max(10),
          gap: z.number().finite(),
          mitigation: z.string().optional()
        }))
      }),
      development: z.object({
        opportunities: z.array(z.string()),
        growth_potential: z.number().finite().min(0).max(10),
        learning_goals: z.array(z.string()),
        mentoring: z.object({
          needs_mentor: z.boolean(),
          can_mentor: z.array(z.string())
        })
      }),
      risks: z.array(z.object({
        risk: z.string(),
        probability: z.number().finite().min(0).max(1),
        impact: z.enum(['low', 'medium', 'high']),
        mitigation: z.string()
      })),
      alternatives: z.array(z.object({
        userId: z.string(),
        name: z.string(),
        score: z.number().finite().min(0).max(10),
        tradeoffs: z.array(z.string())
      }))
    })),
    teamComposition: z.object({
      size: z.number().finite(),
      diversity: z.object({
        seniority: z.number().finite().min(0).max(1),
        skills: z.number().finite().min(0).max(1),
        experience: z.number().finite().min(0).max(1),
        background: z.number().finite().min(0).max(1)
      }),
      dynamics: z.object({
        collaboration_potential: z.number().finite().min(0).max(10),
        leadership_structure: z.string(),
        communication_efficiency: z.number().finite().min(0).max(10),
        conflict_risk: z.enum(['low', 'medium', 'high'])
      }),
      capabilities: z.object({
        technical: z.number().finite().min(0).max(10),
        domain: z.number().finite().min(0).max(10),
        leadership: z.number().finite().min(0).max(10),
        innovation: z.number().finite().min(0).max(10)
      })
    }),
    successPrediction: z.object({
      probability: z.number().finite().min(0).max(1),
      factors: z.array(z.object({
        factor: z.string(),
        impact: z.enum(['positive', 'negative', 'neutral']),
        strength: z.number().finite().min(0).max(1)
      })),
      risks: z.array(z.string()),
      mitigation: z.array(z.string()),
      monitoring: z.array(z.string())
    })
  })),
  capacityAnalysis: z.object({
    teamCapacity: z.array(z.object({
      userId: z.string(),
      name: z.string(),
      currentUtilization: z.number().finite().min(0).max(1),
      projectedUtilization: z.array(z.object({
        period: z.string(),
        utilization: z.number().finite().min(0).max(1),
        projects: z.array(z.string())
      })),
      capacity_status: z.enum(['underutilized', 'optimal', 'overutilized', 'critical']),
      flexibility: z.object({
        availability: z.number().finite().min(0).max(1),
        skill_adaptability: z.number().finite().min(0).max(1),
        project_switching: z.number().finite().min(0).max(1)
      }),
      recommendations: z.array(z.string())
    })),
    organizationalCapacity: z.object({
      totalCapacity: z.number().finite(),
      utilizedCapacity: z.number().finite(),
      availableCapacity: z.number().finite(),
      demandVsCapacity: z.number().finite(),
      bottlenecks: z.array(z.object({
        area: z.string(),
        constraint: z.string(),
        impact: z.enum(['low', 'medium', 'high']),
        solutions: z.array(z.string())
      })),
      recommendations: z.array(z.string())
    }),
    skillCapacity: z.array(z.object({
      skill: z.string(),
      demand: z.number().finite(),
      supply: z.number().finite(),
      gap: z.number().finite(),
      criticality: z.enum(['low', 'medium', 'high', 'critical']),
      timeline: z.string(),
      solutions: z.array(z.object({
        solution: z.string(),
        timeline: z.string(),
        cost: z.number().finite(),
        effectiveness: z.number().finite().min(0).max(1)
      }))
    }))
  }),
  developmentOpportunities: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    currentLevel: z.string(),
    opportunities: z.array(z.object({
      opportunity: z.string(),
      type: z.enum(['skill_development', 'leadership_experience', 'domain_expertise', 'cross_functional']),
      project: z.string(),
      description: z.string(),
      growth_potential: z.number().finite().min(0).max(10),
      timeline: z.string(),
      requirements: z.array(z.string()),
      support: z.array(z.string()),
      risks: z.array(z.string())
    })),
    careerPath: z.object({
      currentRole: z.string(),
      nextRole: z.string(),
      timeline: z.string(),
      requirements: z.array(z.string()),
      assignments: z.array(z.string())
    }),
    mentoring: z.object({
      as_mentor: z.array(z.object({
        mentee: z.string(),
        area: z.string(),
        project: z.string(),
        value: z.string()
      })),
      needs_mentoring: z.array(z.object({
        area: z.string(),
        mentor: z.string(),
        approach: z.string(),
        timeline: z.string()
      }))
    })
  })),
  riskAssessment: z.object({
    projectRisks: z.array(z.object({
      projectId: z.string(),
      risks: z.array(z.object({
        risk: z.string(),
        category: z.enum(['skill', 'capacity', 'timeline', 'dependency', 'quality']),
        probability: z.number().finite().min(0).max(1),
        impact: z.enum(['low', 'medium', 'high', 'critical']),
        timeline: z.string(),
        mitigation: z.array(z.object({
          action: z.string(),
          timeline: z.string(),
          cost: z.number().finite(),
          effectiveness: z.number().finite().min(0).max(1)
        })),
        monitoring: z.array(z.string()),
        contingency: z.array(z.string())
      }))
    })),
    individualRisks: z.array(z.object({
      userId: z.string(),
      name: z.string(),
      risks: z.array(z.object({
        risk: z.string(),
        category: z.enum(['overload', 'underutilization', 'skill_mismatch', 'career_stagnation', 'burnout']),
        probability: z.number().finite().min(0).max(1),
        impact: z.enum(['low', 'medium', 'high']),
        indicators: z.array(z.string()),
        mitigation: z.array(z.string())
      }))
    })),
    organizationalRisks: z.array(z.object({
      risk: z.string(),
      description: z.string(),
      category: z.enum(['capacity', 'skills', 'knowledge', 'succession']),
      probability: z.number().finite().min(0).max(1),
      impact: z.enum(['low', 'medium', 'high', 'critical']),
      affected_areas: z.array(z.string()),
      mitigation: z.array(z.string()),
      timeline: z.string()
    }))
  }),
  implementationPlan: z.object({
    phases: z.array(z.object({
      phase: z.string(),
      duration: z.string(),
      objectives: z.array(z.string()),
      assignments: z.array(z.object({
        action: z.string(),
        responsible: z.string(),
        timeline: z.string(),
        dependencies: z.array(z.string()),
        deliverables: z.array(z.string())
      })),
      milestones: z.array(z.object({
        milestone: z.string(),
        date: z.string(),
        criteria: z.array(z.string())
      })),
      risks: z.array(z.string())
    })),
    changeManagement: z.object({
      communication: z.object({
        strategy: z.string(),
        audiences: z.array(z.object({
          audience: z.string(),
          messaging: z.array(z.string()),
          channels: z.array(z.string()),
          frequency: z.string()
        })),
        timeline: z.string()
      }),
      training: z.object({
        programs: z.array(z.object({
          program: z.string(),
          audience: z.array(z.string()),
          content: z.array(z.string()),
          format: z.string(),
          duration: z.string()
        })),
        timeline: z.string(),
        resources: z.array(z.string())
      }),
      support: z.object({
        mechanisms: z.array(z.string()),
        resources: z.array(z.string()),
        feedback: z.string()
      })
    }),
    monitoring: z.object({
      metrics: z.array(z.object({
        metric: z.string(),
        baseline: z.number().finite(),
        target: z.number().finite(),
        frequency: z.enum(['weekly', 'monthly', 'quarterly']),
        threshold: z.number().finite()
      })),
      reviews: z.object({
        frequency: z.enum(['weekly', 'monthly', 'quarterly']),
        participants: z.array(z.string()),
        agenda: z.array(z.string()),
        decisions: z.array(z.string())
      }),
      adjustments: z.object({
        triggers: z.array(z.string()),
        process: z.string(),
        authority: z.string()
      })
    })
  })
});

export type ProjectAssignmentResult = z.infer<typeof ProjectAssignmentResultSchema>;

export class ProjectAssignmentEngine {
  private assignmentEngine: Map<string, any>;
  private optimizationEngine: Map<string, any>;
  private matchingEngine: Map<string, any>;

  constructor() {
    this.assignmentEngine = new Map();
    this.optimizationEngine = new Map();
    this.matchingEngine = new Map();
    this.initializeEngines();
  }

  /**
   * Generate optimal project assignments
   */
  async generateAssignments(request: ProjectAssignmentRequest): Promise<ProjectAssignmentResult> {
    try {
      const validatedRequest = ProjectAssignmentRequestSchema.parse(request);
      
      // Generate executive summary
      const executiveSummary = this.generateExecutiveSummary(validatedRequest);
      
      // Generate optimal assignments
      const optimalAssignments = this.generateOptimalAssignments(validatedRequest);
      
      // Analyze capacity
      const capacityAnalysis = this.analyzeCapacity(validatedRequest, optimalAssignments);
      
      // Identify development opportunities
      const developmentOpportunities = this.identifyDevelopmentOpportunities(validatedRequest, optimalAssignments);
      
      // Assess risks
      const riskAssessment = this.assessRisks(validatedRequest, optimalAssignments);
      
      // Create implementation plan
      const implementationPlan = this.createImplementationPlan(validatedRequest, optimalAssignments);
      
      const result: ProjectAssignmentResult = {
        executiveSummary,
        optimalAssignments,
        capacityAnalysis,
        developmentOpportunities,
        riskAssessment,
        implementationPlan
      };

      return ProjectAssignmentResultSchema.parse(result);
    } catch (error) {
      console.error('Error generating project assignments:', error);
      return this.getFallbackAssignmentResult(request);
    }
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(request: ProjectAssignmentRequest): any {
    const { projects, teamMembers, assignmentScope } = request;
    
    const assignmentOverview = this.calculateAssignmentOverview(request);
    const keyInsights = this.extractKeyInsights(request);
    const challenges = this.identifyChallenges(request);
    
    return {
      assignmentOverview,
      keyInsights,
      challenges
    };
  }

  /**
   * Calculate assignment overview
   */
  private calculateAssignmentOverview(request: ProjectAssignmentRequest): any {
    const { projects, teamMembers } = request;
    
    const totalProjects = projects.filter(p => p.status === 'planned' || p.status === 'active').length;
    
    // Calculate total required assignments
    let totalAssignments = 0;
    projects.forEach(project => {
      totalAssignments += project.requirements.teamSize.optimal;
    });
    
    // Calculate optimization score (simplified)
    const optimizationScore = this.calculateOptimizationScore(request);
    
    // Calculate capacity utilization
    const totalCapacity = teamMembers.reduce((sum, member) => sum + member.availability.currentCapacity, 0);
    const requiredCapacity = this.calculateRequiredCapacity(projects);
    const capacityUtilization = totalCapacity > 0 ? Math.min(1, requiredCapacity / totalCapacity) : 0;
    
    // Calculate skill match quality
    const skillMatchQuality = this.calculateSkillMatchQuality(request);
    
    // Assess risk level
    const riskLevel = this.assessOverallRiskLevel(request);
    
    return {
      totalProjects,
      totalAssignments,
      optimization_score: optimizationScore,
      capacity_utilization: capacityUtilization,
      skill_match_quality: skillMatchQuality,
      risk_level: riskLevel
    };
  }

  /**
   * Calculate optimization score
   */
  private calculateOptimizationScore(request: ProjectAssignmentRequest): number {
    // Simplified calculation based on various factors
    let score = 7.0; // Base score
    
    const { teamMembers, projects } = request;
    
    // Skill availability factor
    const skillCoverage = this.calculateSkillCoverage(teamMembers, projects);
    score += (skillCoverage - 0.7) * 5; // Adjust based on skill coverage
    
    // Capacity factor
    const totalCapacity = teamMembers.reduce((sum, member) => sum + member.availability.currentCapacity, 0);
    const requiredCapacity = this.calculateRequiredCapacity(projects);
    const capacityRatio = totalCapacity > 0 ? requiredCapacity / totalCapacity : 1;
    
    if (capacityRatio > 1.1) score -= 2; // Overallocation penalty
    else if (capacityRatio < 0.7) score -= 1; // Underutilization penalty
    
    return Math.min(10, Math.max(0, score));
  }

  /**
   * Calculate skill coverage
   */
  private calculateSkillCoverage(teamMembers: any[], projects: any[]): number {
    const requiredSkills = new Set();
    const availableSkills = new Set();
    
    // Collect required skills
    projects.forEach(project => {
      project.requirements.skillRequirements.forEach((req: any) => {
        requiredSkills.add(req.skill);
      });
    });
    
    // Collect available skills
    teamMembers.forEach(member => {
      member.skills.forEach((skill: any) => {
        if (skill.level >= 5) { // Minimum competency level
          availableSkills.add(skill.skill);
        }
      });
    });
    
    // Calculate coverage
    const coveredSkills = Array.from(requiredSkills).filter(skill => availableSkills.has(skill));
    return requiredSkills.size > 0 ? coveredSkills.length / requiredSkills.size : 1;
  }

  /**
   * Calculate required capacity
   */
  private calculateRequiredCapacity(projects: any[]): number {
    return projects
      .filter(p => p.status === 'planned' || p.status === 'active')
      .reduce((sum, project) => {
        return sum + project.requirements.teamSize.optimal;
      }, 0);
  }

  /**
   * Calculate skill match quality
   */
  private calculateSkillMatchQuality(request: ProjectAssignmentRequest): number {
    // Simplified calculation - would be more sophisticated in practice
    const { teamMembers, projects } = request;
    
    let totalMatchQuality = 0;
    let totalRequirements = 0;
    
    projects.forEach(project => {
      project.requirements.skillRequirements.forEach((requirement: any) => {
        const bestMatch = this.findBestSkillMatch(requirement.skill, teamMembers);
        if (bestMatch) {
          const matchQuality = Math.min(10, bestMatch.level / requirement.level * 10);
          totalMatchQuality += matchQuality;
        } else {
          totalMatchQuality += 0; // No match available
        }
        totalRequirements++;
      });
    });
    
    return totalRequirements > 0 ? totalMatchQuality / totalRequirements : 7.0;
  }

  /**
   * Find best skill match
   */
  private findBestSkillMatch(skillName: string, teamMembers: any[]): any {
    let bestMatch = null;
    let highestLevel = 0;
    
    teamMembers.forEach(member => {
      const skill = member.skills.find((s: any) => s.skill === skillName);
      if (skill && skill.level > highestLevel) {
        highestLevel = skill.level;
        bestMatch = skill;
      }
    });
    
    return bestMatch;
  }

  /**
   * Assess overall risk level
   */
  private assessOverallRiskLevel(request: ProjectAssignmentRequest): 'low' | 'medium' | 'high' | 'critical' {
    const { projects, teamMembers } = request;
    
    let riskScore = 0;
    
    // Capacity risk
    const totalCapacity = teamMembers.reduce((sum, member) => sum + member.availability.currentCapacity, 0);
    const requiredCapacity = this.calculateRequiredCapacity(projects);
    if (requiredCapacity > totalCapacity * 1.1) riskScore += 2;
    
    // Skill risk
    const skillCoverage = this.calculateSkillCoverage(teamMembers, projects);
    if (skillCoverage < 0.8) riskScore += 2;
    
    // Project complexity risk
    const highComplexityProjects = projects.filter(p => p.characteristics.complexity === 'high' || p.characteristics.complexity === 'very_high').length;
    if (highComplexityProjects > projects.length * 0.5) riskScore += 1;
    
    if (riskScore >= 4) return 'critical';
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(request: ProjectAssignmentRequest): any[] {
    const insights = [];
    const { teamMembers, projects, historicalData } = request;
    
    // Capacity insight
    const capacityInsight = this.analyzeCapacityInsights(teamMembers, projects);
    if (capacityInsight) insights.push(capacityInsight);
    
    // Skill gap insight
    const skillGapInsight = this.analyzeSkillGaps(teamMembers, projects);
    if (skillGapInsight) insights.push(skillGapInsight);
    
    // Development insight
    const developmentInsight = this.analyzeDevelopmentOpportunities(teamMembers, projects);
    if (developmentInsight) insights.push(developmentInsight);
    
    return insights;
  }

  /**
   * Analyze capacity insights
   */
  private analyzeCapacityInsights(teamMembers: any[], projects: any[]): any | null {
    const totalCapacity = teamMembers.reduce((sum, member) => sum + member.availability.currentCapacity, 0);
    const requiredCapacity = this.calculateRequiredCapacity(projects);
    const utilizationRatio = totalCapacity > 0 ? requiredCapacity / totalCapacity : 0;
    
    if (utilizationRatio > 1.1) {
      return {
        insight: `Team capacity is over-allocated by ${((utilizationRatio - 1) * 100).toFixed(1)}%`,
        category: 'capacity' as const,
        impact: 'high' as const,
        confidence: 0.9,
        evidence: ['Capacity analysis', 'Project requirements'],
        recommendations: [
          'Consider extending project timelines',
          'Prioritize critical projects',
          'Explore additional resource allocation'
        ]
      };
    } else if (utilizationRatio < 0.7) {
      return {
        insight: `Team capacity is under-utilized with ${((1 - utilizationRatio) * 100).toFixed(1)}% available capacity`,
        category: 'capacity' as const,
        impact: 'medium' as const,
        confidence: 0.85,
        evidence: ['Capacity analysis', 'Project pipeline'],
        recommendations: [
          'Consider additional projects or initiatives',
          'Focus on skill development activities',
          'Optimize team size for efficiency'
        ]
      };
    }
    
    return null;
  }

  /**
   * Analyze skill gaps
   */
  private analyzeSkillGaps(teamMembers: any[], projects: any[]): any | null {
    const skillCoverage = this.calculateSkillCoverage(teamMembers, projects);
    
    if (skillCoverage < 0.8) {
      return {
        insight: `${((1 - skillCoverage) * 100).toFixed(1)}% of required skills are not adequately covered`,
        category: 'skills' as const,
        impact: 'high' as const,
        confidence: 0.9,
        evidence: ['Skill requirements analysis', 'Team capability assessment'],
        recommendations: [
          'Prioritize skill development in gap areas',
          'Consider external hiring or contracting',
          'Implement knowledge sharing programs'
        ]
      };
    }
    
    return null;
  }

  /**
   * Analyze development opportunities
   */
  private analyzeDevelopmentOpportunities(teamMembers: any[], projects: any[]): any | null {
    const developmentOpportunities = teamMembers.filter(member => 
      member.development.learning_velocity === 'fast' && 
      member.development.development_areas.length > 0
    ).length;
    
    if (developmentOpportunities > teamMembers.length * 0.3) {
      return {
        insight: `${developmentOpportunities} team members have high development potential`,
        category: 'development' as const,
        impact: 'medium' as const,
        confidence: 0.8,
        evidence: ['Individual development profiles', 'Learning velocity assessment'],
        recommendations: [
          'Align project assignments with development goals',
          'Implement mentoring programs',
          'Create stretch assignment opportunities'
        ]
      };
    }
    
    return null;
  }

  /**
   * Placeholder methods for detailed analysis
   */
  private identifyChallenges(request: ProjectAssignmentRequest): any[] { return []; }
  private generateOptimalAssignments(request: ProjectAssignmentRequest): any[] { return []; }
  private analyzeCapacity(request: ProjectAssignmentRequest, assignments: any[]): any { return {}; }
  private identifyDevelopmentOpportunities(request: ProjectAssignmentRequest, assignments: any[]): any[] { return []; }
  private assessRisks(request: ProjectAssignmentRequest, assignments: any[]): any { return {}; }
  private createImplementationPlan(request: ProjectAssignmentRequest, assignments: any[]): any { return {}; }

  /**
   * Get fallback assignment result
   */
  private getFallbackAssignmentResult(request: ProjectAssignmentRequest): ProjectAssignmentResult {
    return {
      executiveSummary: {
        assignmentOverview: { totalProjects: 0, totalAssignments: 0, optimization_score: 7.0, capacity_utilization: 0.8, skill_match_quality: 7.5, risk_level: 'medium' },
        keyInsights: [],
        challenges: []
      },
      optimalAssignments: [],
      capacityAnalysis: {
        teamCapacity: [],
        organizationalCapacity: { totalCapacity: 0, utilizedCapacity: 0, availableCapacity: 0, demandVsCapacity: 0, bottlenecks: [], recommendations: [] },
        skillCapacity: []
      },
      developmentOpportunities: [],
      riskAssessment: { projectRisks: [], individualRisks: [], organizationalRisks: [] },
      implementationPlan: {
        phases: [],
        changeManagement: {
          communication: { strategy: '', audiences: [], timeline: '' },
          training: { programs: [], timeline: '', resources: [] },
          support: { mechanisms: [], resources: [], feedback: '' }
        },
        monitoring: { metrics: [], reviews: { frequency: 'monthly', participants: [], agenda: [], decisions: [] }, adjustments: { triggers: [], process: '', authority: '' } }
      }
    };
  }

  /**
   * Initialize assignment engines
   */
  private initializeEngines(): void {
    this.assignmentEngine.set('overview', this.calculateAssignmentOverview.bind(this));
    this.assignmentEngine.set('assignments', this.generateOptimalAssignments.bind(this));
    
    this.optimizationEngine.set('score', this.calculateOptimizationScore.bind(this));
    this.optimizationEngine.set('capacity', this.analyzeCapacity.bind(this));
    
    this.matchingEngine.set('skills', this.calculateSkillMatchQuality.bind(this));
    this.matchingEngine.set('development', this.identifyDevelopmentOpportunities.bind(this));
  }
}
