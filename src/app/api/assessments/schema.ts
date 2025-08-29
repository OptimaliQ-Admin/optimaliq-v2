import { z } from 'zod';

// Assessment request schemas
export const CreateAssessmentRequestSchema = z.object({
  type: z.enum(['onboarding', 'bmp', 'sales_performance', 'ai_readiness', 'strategy', 'process', 'technology']),
  responses: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
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
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0)
});

// Assessment response schemas
export const AssessmentResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']),
  score: z.number().optional(),
  breakdown: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    categoryScores: z.record(z.number())
  }).optional(),
  roadmap: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    priority: z.number(),
    effort: z.number(),
    timeline: z.number(),
    dependencies: z.array(z.string()),
    isCompleted: z.boolean()
  })).optional(),
  benchmarks: z.array(z.object({
    category: z.string(),
    userScore: z.number(),
    industryAverage: z.number(),
    topPerformers: z.number(),
    percentile: z.number()
  })).optional(),
  createdAt: z.string(),
  completedAt: z.string().optional()
});

export const AssessmentListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(AssessmentResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
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
    weight: z.number(),
    category: z.string(),
    required: z.boolean(),
    order: z.number()
  })),
  scoringRules: z.array(z.object({
    category: z.string(),
    weight: z.number(),
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
