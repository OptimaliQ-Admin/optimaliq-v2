import { z } from 'zod';

// Assessment request schemas
export const CreateAssessmentRequestSchema = z.object({
  type: z.enum(['onboarding', 'bmp', 'sales_performance', 'ai_readiness', 'strategy', 'process', 'technology']),
  responses: z.record(z.union([z.string(), z.number().finite(), z.boolean(), z.array(z.string())])),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    sessionId: z.string().optional(),
    startTime: z.string().optional(),
    completionTime: z.string().optional()
  }).optional()
});

export const GetAssessmentRequestSchema = z.object({
  type: z.enum(['onboarding', 'bmp', 'sales_performance', 'ai_readiness', 'strategy', 'process', 'technology']).optional(),
  limit: z.number().finite().min(1).max(100).default(10),
  offset: z.number().finite().min(0).default(0)
});

// Assessment response schemas
export const AssessmentResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']),
  score: z.number().finite().optional(),
  breakdown: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    categoryScores: z.record(z.number().finite())
  }).optional(),
  roadmap: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    priority: z.number().finite(),
    effort: z.number().finite(),
    timeline: z.number().finite(),
    dependencies: z.array(z.string()),
    isCompleted: z.boolean()
  })).optional(),
  benchmarks: z.array(z.object({
    category: z.string(),
    userScore: z.number().finite(),
    industryAverage: z.number().finite(),
    topPerformers: z.number().finite(),
    percentile: z.number().finite()
  })).optional(),
  createdAt: z.string(),
  completedAt: z.string().optional()
});

export const AssessmentListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(AssessmentResponseSchema),
  pagination: z.object({
    page: z.number().finite(),
    limit: z.number().finite(),
    total: z.number().finite(),
    totalPages: z.number().finite()
  }),
  message: z.string().optional()
});

export const CreateAssessmentResponseSchema = z.object({
  success: z.boolean(),
  data: AssessmentResponseSchema,
  message: z.string()
});

// Assessment template schemas
export const AssessmentTemplateSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  description: z.string(),
  industry: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    type: z.enum(['multiple_choice', 'scale', 'text', 'boolean', 'ranking']),
    options: z.array(z.string()).optional(),
    weight: z.number().finite(),
    category: z.string(),
    required: z.boolean(),
    order: z.number().finite()
  })),
  scoringRules: z.array(z.object({
    category: z.string(),
    weight: z.number().finite(),
    algorithm: z.string(),
    parameters: z.record(z.any())
  })),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const GetTemplatesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(AssessmentTemplateSchema),
  message: z.string().optional()
});

// Type exports
export type CreateAssessmentRequest = z.infer<typeof CreateAssessmentRequestSchema>;
export type GetAssessmentRequest = z.infer<typeof GetAssessmentRequestSchema>;
export type AssessmentResponse = z.infer<typeof AssessmentResponseSchema>;
export type AssessmentListResponse = z.infer<typeof AssessmentListResponseSchema>;
export type CreateAssessmentResponse = z.infer<typeof CreateAssessmentResponseSchema>;
export type AssessmentTemplate = z.infer<typeof AssessmentTemplateSchema>;
export type GetTemplatesResponse = z.infer<typeof GetTemplatesResponseSchema>;
