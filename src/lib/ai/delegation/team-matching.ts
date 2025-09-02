/**
 * AI-Powered Team Matching Algorithms
 * Team composition optimization with skill matching and collaboration analysis
 */

import { z } from 'zod';

// Team Matching Request Schema
const TeamMatchingRequestSchema = z.object({
  projectId: z.string(),
  projectRequirements: z.object({
    skills: z.array(z.string()),
    experience: z.number().finite().min(0).max(20),
    roles: z.array(z.string()),
    timeline: z.number().finite(), // weeks
    complexity: z.enum(['low', 'medium', 'high']),
    budget: z.number().finite().optional()
  }),
  availableMembers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    skills: z.array(z.object({
      name: z.string(),
      level: z.number().finite().min(1).max(5),
      experience: z.number().finite()
    })),
    availability: z.number().finite().min(0).max(1),
    preferences: z.array(z.string()),
    collaborationHistory: z.record(z.number().finite()),
    performance: z.object({
      average: z.number().finite(),
      consistency: z.number().finite(),
      leadership: z.number().finite()
    })
  })),
  constraints: z.object({
    maxTeamSize: z.number().finite().optional(),
    minTeamSize: z.number().finite().optional(),
    requiredRoles: z.array(z.string()).optional(),
    budgetLimit: z.number().finite().optional(),
    timeline: z.number().finite().optional()
  })
});

export type TeamMatchingRequest = z.infer<typeof TeamMatchingRequestSchema>;

// Team Matching Result Schema
const TeamMatchingResultSchema = z.object({
  recommendedTeam: z.array(z.object({
    memberId: z.string(),
    name: z.string(),
    role: z.string(),
    primarySkills: z.array(z.string()),
    matchScore: z.number().finite().min(0).max(1),
    contribution: z.string(),
    availability: z.number().finite().min(0).max(1)
  })),
  teamMetrics: z.object({
    overallMatchScore: z.number().finite().min(0).max(1),
    skillCoverage: z.number().finite().min(0).max(1),
    collaborationPotential: z.number().finite().min(0).max(1),
    experienceBalance: z.number().finite().min(0).max(1),
    costEfficiency: z.number().finite().min(0).max(1)
  }),
  analysis: z.object({
    strengths: z.array(z.string()),
    gaps: z.array(z.string()),
    risks: z.array(z.string()),
    recommendations: z.array(z.string())
  }),
  alternatives: z.array(z.object({
    team: z.array(z.string()),
    score: z.number().finite().min(0).max(1),
    tradeoffs: z.array(z.string())
  }))
});

export type TeamMatchingResult = z.infer<typeof TeamMatchingResultSchema>;

export class TeamMatchingAlgorithms {
  private skillWeights: Map<string, number>;
  private roleTemplates: Map<string, any>;
  private collaborationModels: Map<string, any>;

  constructor() {
    this.skillWeights = new Map();
    this.roleTemplates = new Map();
    this.collaborationModels = new Map();
    this.initializeWeights();
  }

  /**
   * Generate optimal team composition
   */
  async generateOptimalTeam(request: TeamMatchingRequest): Promise<TeamMatchingResult> {
    try {
      const validatedRequest = TeamMatchingRequestSchema.parse(request);
      
      // Analyze project requirements
      const requirementAnalysis = this.analyzeProjectRequirements(validatedRequest.projectRequirements);
      
      // Score all potential team members
      const memberScores = this.scoreTeamMembers(validatedRequest.availableMembers, requirementAnalysis);
      
      // Generate optimal team combinations
      const teamCombinations = this.generateTeamCombinations(memberScores, validatedRequest);
      
      // Evaluate and rank teams
      const evaluatedTeams = this.evaluateTeamCombinations(teamCombinations, validatedRequest);
      
      // Select best team
      const bestTeam = this.selectBestTeam(evaluatedTeams);
      
      // Generate analysis and alternatives
      const analysis = this.generateTeamAnalysis(bestTeam, validatedRequest);
      const alternatives = this.generateAlternatives(evaluatedTeams, bestTeam);
      
      const result: TeamMatchingResult = {
        recommendedTeam: bestTeam.members,
        teamMetrics: bestTeam.metrics,
        analysis,
        alternatives
      };

      return TeamMatchingResultSchema.parse(result);
    } catch (error) {
      console.error('Error generating optimal team:', error);
      return this.getFallbackTeam(request);
    }
  }

  /**
   * Analyze project requirements
   */
  private analyzeProjectRequirements(requirements: any): any {
    const analysis = {
      skillPriorities: this.rankSkillsByPriority(requirements.skills),
      roleRequirements: this.analyzeRoleRequirements(requirements.roles),
      complexityFactors: this.analyzeComplexityFactors(requirements.complexity),
      timelineConstraints: this.analyzeTimelineConstraints(requirements.timeline),
      budgetConsiderations: this.analyzeBudgetConsiderations(requirements.budget)
    };

    return analysis;
  }

  /**
   * Score team members based on requirements
   */
  private scoreTeamMembers(members: any[], requirementAnalysis: any): any[] {
    return members.map(member => {
      const skillScore = this.calculateSkillMatch(member.skills, requirementAnalysis.skillPriorities);
      const experienceScore = this.calculateExperienceMatch(member, requirementAnalysis);
      const availabilityScore = this.calculateAvailabilityScore(member);
      const collaborationScore = this.calculateCollaborationScore(member);
      const performanceScore = this.calculatePerformanceScore(member);
      
      const overallScore = (
        skillScore * 0.3 +
        experienceScore * 0.25 +
        availabilityScore * 0.2 +
        collaborationScore * 0.15 +
        performanceScore * 0.1
      );

      return {
        ...member,
        scores: {
          skill: skillScore,
          experience: experienceScore,
          availability: availabilityScore,
          collaboration: collaborationScore,
          performance: performanceScore,
          overall: overallScore
        }
      };
    });
  }

  /**
   * Generate team combinations
   */
  private generateTeamCombinations(memberScores: any[], request: TeamMatchingRequest): any[] {
    const combinations = [];
    const minSize = request.constraints.minTeamSize || 2;
    const maxSize = request.constraints.maxTeamSize || 8;
    
    // Generate combinations of different sizes
    for (let size = minSize; size <= Math.min(maxSize, memberScores.length); size++) {
      const sizeCombinations = this.generateCombinations(memberScores, size);
      combinations.push(...sizeCombinations);
    }
    
    return combinations;
  }

  /**
   * Evaluate team combinations
   */
  private evaluateTeamCombinations(combinations: any[], request: TeamMatchingRequest): any[] {
    return combinations.map(combination => {
      const teamMetrics = this.calculateTeamMetrics(combination, request);
      const overallScore = this.calculateOverallTeamScore(teamMetrics);
      
      return {
        members: combination,
        metrics: teamMetrics,
        score: overallScore
      };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Select best team
   */
  private selectBestTeam(evaluatedTeams: any[]): any {
    return evaluatedTeams[0] || { members: [], metrics: {}, score: 0 };
  }

  /**
   * Generate team analysis
   */
  private generateTeamAnalysis(bestTeam: any, request: TeamMatchingRequest): any {
    const strengths = this.identifyTeamStrengths(bestTeam);
    const gaps = this.identifyTeamGaps(bestTeam, request);
    const risks = this.identifyTeamRisks(bestTeam);
    const recommendations = this.generateTeamRecommendations(bestTeam, gaps, risks);

    return {
      strengths,
      gaps,
      risks,
      recommendations
    };
  }

  /**
   * Generate alternatives
   */
  private generateAlternatives(evaluatedTeams: any[], bestTeam: any): any[] {
    return evaluatedTeams.slice(1, 4).map(team => ({
      team: team.members.map((member: any) => member.id),
      score: team.score,
      tradeoffs: this.identifyTradeoffs(team, bestTeam)
    }));
  }

  /**
   * Rank skills by priority
   */
  private rankSkillsByPriority(skills: string[]): any[] {
    return skills.map((skill, index) => ({
      skill,
      priority: 1 - (index / skills.length),
      weight: this.skillWeights.get(skill) || 1.0
    }));
  }

  /**
   * Analyze role requirements
   */
  private analyzeRoleRequirements(roles: string[]): any {
    const roleAnalysis = {};
    
    roles.forEach(role => {
      roleAnalysis[role] = {
        required: true,
        critical: ['lead', 'architect', 'manager'].includes(role),
        alternatives: this.getRoleAlternatives(role)
      };
    });
    
    return roleAnalysis;
  }

  /**
   * Analyze complexity factors
   */
  private analyzeComplexityFactors(complexity: string): any {
    const complexityFactors = {
      low: { teamSize: 2, experience: 2, leadership: 1 },
      medium: { teamSize: 4, experience: 5, leadership: 2 },
      high: { teamSize: 6, experience: 8, leadership: 3 }
    };
    
    return complexityFactors[complexity] || complexityFactors.medium;
  }

  /**
   * Analyze timeline constraints
   */
  private analyzeTimelineConstraints(timeline: number): any {
    return {
      urgency: timeline < 4 ? 'high' : timeline < 12 ? 'medium' : 'low',
      requiredAvailability: timeline < 4 ? 0.8 : timeline < 12 ? 0.6 : 0.4,
      parallelWork: timeline < 8 ? 'high' : 'medium'
    };
  }

  /**
   * Analyze budget considerations
   */
  private analyzeBudgetConsiderations(budget?: number): any {
    if (!budget) return { costSensitive: false, maxCostPerMember: null };
    
    return {
      costSensitive: true,
      maxCostPerMember: budget / 4, // Assume 4-person team
      budgetEfficiency: 'high'
    };
  }

  /**
   * Calculate skill match
   */
  private calculateSkillMatch(memberSkills: any[], skillPriorities: any[]): number {
    let totalScore = 0;
    let totalWeight = 0;
    
    skillPriorities.forEach(priority => {
      const memberSkill = memberSkills.find(skill => skill.name === priority.skill);
      if (memberSkill) {
        const skillScore = (memberSkill.level / 5) * (memberSkill.experience / 10);
        totalScore += skillScore * priority.weight * priority.priority;
        totalWeight += priority.weight * priority.priority;
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Calculate experience match
   */
  private calculateExperienceMatch(member: any, requirementAnalysis: any): number {
    const avgExperience = member.skills.reduce((sum, skill) => sum + skill.experience, 0) / member.skills.length;
    const requiredExperience = requirementAnalysis.complexityFactors.experience;
    
    if (avgExperience >= requiredExperience) {
      return 1.0;
    } else if (avgExperience >= requiredExperience * 0.7) {
      return 0.8;
    } else if (avgExperience >= requiredExperience * 0.5) {
      return 0.6;
    } else {
      return 0.3;
    }
  }

  /**
   * Calculate availability score
   */
  private calculateAvailabilityScore(member: any): number {
    return member.availability;
  }

  /**
   * Calculate collaboration score
   */
  private calculateCollaborationScore(member: any): number {
    const collaborationHistory = Object.values(member.collaborationHistory);
    if (collaborationHistory.length === 0) return 0.5;
    
    const avgCollaboration = collaborationHistory.reduce((sum, score) => sum + score, 0) / collaborationHistory.length;
    return Math.min(1, avgCollaboration / 5);
  }

  /**
   * Calculate performance score
   */
  private calculatePerformanceScore(member: any): number {
    const { average, consistency, leadership } = member.performance;
    return (average * 0.5 + consistency * 0.3 + leadership * 0.2) / 5;
  }

  /**
   * Generate combinations
   */
  private generateCombinations(members: any[], size: number): any[] {
    if (size === 1) {
      return members.map(member => [member]);
    }
    
    const combinations = [];
    for (let i = 0; i <= members.length - size; i++) {
      const head = members[i];
      const tailCombinations = this.generateCombinations(members.slice(i + 1), size - 1);
      tailCombinations.forEach(combination => {
        combinations.push([head, ...combination]);
      });
    }
    
    return combinations;
  }

  /**
   * Calculate team metrics
   */
  private calculateTeamMetrics(team: any[], request: TeamMatchingRequest): any {
    const skillCoverage = this.calculateSkillCoverage(team, request.projectRequirements.skills);
    const collaborationPotential = this.calculateCollaborationPotential(team);
    const experienceBalance = this.calculateExperienceBalance(team);
    const costEfficiency = this.calculateCostEfficiency(team, request.constraints.budgetLimit);
    
    return {
      skillCoverage,
      collaborationPotential,
      experienceBalance,
      costEfficiency
    };
  }

  /**
   * Calculate overall team score
   */
  private calculateOverallTeamScore(metrics: any): number {
    return (
      metrics.skillCoverage * 0.35 +
      metrics.collaborationPotential * 0.25 +
      metrics.experienceBalance * 0.25 +
      metrics.costEfficiency * 0.15
    );
  }

  /**
   * Calculate skill coverage
   */
  private calculateSkillCoverage(team: any[], requiredSkills: string[]): number {
    const coveredSkills = new Set();
    
    team.forEach(member => {
      member.skills.forEach(skill => {
        if (requiredSkills.includes(skill.name) && skill.level >= 3) {
          coveredSkills.add(skill.name);
        }
      });
    });
    
    return coveredSkills.size / requiredSkills.length;
  }

  /**
   * Calculate collaboration potential
   */
  private calculateCollaborationPotential(team: any[]): number {
    if (team.length < 2) return 1.0;
    
    let totalCollaboration = 0;
    let collaborationCount = 0;
    
    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const member1 = team[i];
        const member2 = team[j];
        const collaborationScore = member1.collaborationHistory[member2.id] || 3; // Default neutral
        totalCollaboration += collaborationScore;
        collaborationCount++;
      }
    }
    
    return collaborationCount > 0 ? totalCollaboration / (collaborationCount * 5) : 0.6;
  }

  /**
   * Calculate experience balance
   */
  private calculateExperienceBalance(team: any[]): number {
    if (team.length < 2) return 1.0;
    
    const experiences = team.map(member => 
      member.skills.reduce((sum, skill) => sum + skill.experience, 0) / member.skills.length
    );
    
    const avgExperience = experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length;
    const variance = experiences.reduce((sum, exp) => sum + Math.pow(exp - avgExperience, 2), 0) / experiences.length;
    
    // Lower variance = better balance
    return Math.max(0, 1 - (variance / 25));
  }

  /**
   * Calculate cost efficiency
   */
  private calculateCostEfficiency(team: any[], budgetLimit?: number): number {
    if (!budgetLimit) return 1.0;
    
    // Simulate cost calculation
    const estimatedCost = team.length * 5000; // Assume $5k per member
    const efficiency = Math.max(0, 1 - (estimatedCost / budgetLimit));
    
    return efficiency;
  }

  /**
   * Identify team strengths
   */
  private identifyTeamStrengths(team: any): string[] {
    const strengths = [];
    
    if (team.metrics.skillCoverage > 0.8) {
      strengths.push('Excellent skill coverage across all required areas');
    }
    
    if (team.metrics.collaborationPotential > 0.8) {
      strengths.push('Strong collaboration history and team chemistry');
    }
    
    if (team.metrics.experienceBalance > 0.8) {
      strengths.push('Well-balanced experience levels across team members');
    }
    
    if (team.members.length >= 4) {
      strengths.push('Optimal team size for project complexity');
    }
    
    return strengths;
  }

  /**
   * Identify team gaps
   */
  private identifyTeamGaps(team: any, request: TeamMatchingRequest): string[] {
    const gaps = [];
    
    if (team.metrics.skillCoverage < 0.7) {
      gaps.push('Insufficient coverage of required skills');
    }
    
    if (team.metrics.collaborationPotential < 0.6) {
      gaps.push('Limited collaboration history between team members');
    }
    
    if (team.members.length < 3) {
      gaps.push('Small team size may limit project capacity');
    }
    
    const requiredRoles = request.constraints.requiredRoles || [];
    const assignedRoles = team.members.map(member => member.role || 'member');
    const missingRoles = requiredRoles.filter(role => !assignedRoles.includes(role));
    
    if (missingRoles.length > 0) {
      gaps.push(`Missing critical roles: ${missingRoles.join(', ')}`);
    }
    
    return gaps;
  }

  /**
   * Identify team risks
   */
  private identifyTeamRisks(team: any): string[] {
    const risks = [];
    
    if (team.metrics.collaborationPotential < 0.5) {
      risks.push('Low collaboration potential may impact team performance');
    }
    
    if (team.metrics.experienceBalance < 0.5) {
      risks.push('Experience imbalance may create knowledge gaps');
    }
    
    const lowAvailabilityMembers = team.members.filter(member => member.availability < 0.6);
    if (lowAvailabilityMembers.length > 0) {
      risks.push('Some team members have limited availability');
    }
    
    return risks;
  }

  /**
   * Generate team recommendations
   */
  private generateTeamRecommendations(team: any, gaps: string[], risks: string[]): string[] {
    const recommendations = [];
    
    if (gaps.includes('Insufficient coverage of required skills')) {
      recommendations.push('Consider adding team members with missing skills');
      recommendations.push('Provide training opportunities for skill development');
    }
    
    if (gaps.includes('Limited collaboration history')) {
      recommendations.push('Schedule team-building activities before project start');
      recommendations.push('Assign collaboration-focused project roles');
    }
    
    if (risks.includes('Low collaboration potential')) {
      recommendations.push('Implement regular team check-ins and communication protocols');
      recommendations.push('Consider team coaching or facilitation');
    }
    
    return recommendations;
  }

  /**
   * Identify tradeoffs
   */
  private identifyTradeoffs(team: any, bestTeam: any): string[] {
    const tradeoffs = [];
    
    if (team.metrics.skillCoverage < bestTeam.metrics.skillCoverage) {
      tradeoffs.push('Lower skill coverage but potentially better collaboration');
    }
    
    if (team.members.length < bestTeam.members.length) {
      tradeoffs.push('Smaller team size may reduce costs but limit capacity');
    }
    
    if (team.metrics.costEfficiency > bestTeam.metrics.costEfficiency) {
      tradeoffs.push('More cost-effective but may sacrifice some expertise');
    }
    
    return tradeoffs;
  }

  /**
   * Get role alternatives
   */
  private getRoleAlternatives(role: string): string[] {
    const alternatives = {
      'lead': ['senior developer', 'architect', 'manager'],
      'architect': ['senior developer', 'lead', 'technical lead'],
      'developer': ['programmer', 'engineer', 'coder'],
      'designer': ['ui designer', 'ux designer', 'visual designer'],
      'tester': ['qa engineer', 'test engineer', 'quality analyst']
    };
    
    return alternatives[role] || [];
  }

  /**
   * Get fallback team
   */
  private getFallbackTeam(request: TeamMatchingRequest): TeamMatchingResult {
    return {
      recommendedTeam: [],
      teamMetrics: {
        overallMatchScore: 0,
        skillCoverage: 0,
        collaborationPotential: 0,
        experienceBalance: 0,
        costEfficiency: 0
      },
      analysis: {
        strengths: [],
        gaps: ['Unable to generate optimal team due to insufficient data'],
        risks: ['Team composition may not meet project requirements'],
        recommendations: ['Review available team members and project requirements']
      },
      alternatives: []
    };
  }

  /**
   * Initialize skill weights
   */
  private initializeWeights(): void {
    // Initialize skill importance weights
    this.skillWeights.set('leadership', 1.5);
    this.skillWeights.set('communication', 1.3);
    this.skillWeights.set('problem-solving', 1.2);
    this.skillWeights.set('technical', 1.0);
    this.skillWeights.set('domain', 0.9);
  }
}

