import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ConsultativeIntakeBot, ConversationContext } from '@/lib/ai/consultative-intake-bot'
import { AppError } from '@/utils'

// Request schema
const ConsultativeAssessmentRequestSchema = z.object({
  userInput: z.string().min(1, 'User input is required'),
  context: z.object({
    userId: z.string().optional(),
    industry: z.string(),
    companySize: z.string(),
    role: z.string(),
    responses: z.record(z.string()).optional(),
    currentPhase: z.enum(['discovery', 'diagnostic', 'solution', 'validation']).optional(),
    rapportLevel: z.number().optional(),
    emotionalState: z.enum(['curious', 'engaged', 'frustrated', 'excited', 'skeptical']).optional(),
    maturityScores: z.object({
      strategy: z.number().optional(),
      operations: z.number().optional(),
      team: z.number().optional(),
      technology: z.number().optional(),
      market: z.number().optional()
    }).optional()
  })
})

// Response schema
const ConsultativeAssessmentResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    message: z.string(),
    insights: z.array(z.string()),
    nextQuestion: z.string().optional(),
    maturityUpdate: z.record(z.number()).optional(),
    industryInsight: z.string().optional(),
    confidence: z.number(),
    rapportBuilding: z.string(),
    maturityLevel: z.string().optional(),
    industryComparison: z.object({
      userScore: z.number(),
      industryAverage: z.number(),
      percentile: z.number()
    }).optional()
  }),
  message: z.string()
})

export async function POST(request: NextRequest) {
  try {
    console.log('Consultative assessment API called')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate request
    const validatedData = ConsultativeAssessmentRequestSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    // Initialize consultative bot
    const bot = new ConsultativeIntakeBot()
    
    // Create conversation context
    const context: ConversationContext = {
      userId: validatedData.context.userId,
      industry: validatedData.context.industry,
      companySize: validatedData.context.companySize,
      role: validatedData.context.role,
      responses: validatedData.context.responses || {},
      currentPhase: validatedData.context.currentPhase || 'discovery',
      rapportLevel: validatedData.context.rapportLevel || 0.5,
      emotionalState: validatedData.context.emotionalState || 'curious',
      maturityScores: {
        strategy: validatedData.context.maturityScores?.strategy || 0,
        operations: validatedData.context.maturityScores?.operations || 0,
        team: validatedData.context.maturityScores?.team || 0,
        technology: validatedData.context.maturityScores?.technology || 0,
        market: validatedData.context.maturityScores?.market || 0
      }
    }
    
    // Process user input
    const response = await bot.processUserInput(validatedData.userInput, context)
    
    // Calculate overall maturity level
    const overallScore = Object.values(response.maturityUpdate || context.maturityScores)
      .reduce((a, b) => a + b, 0) / Object.values(response.maturityUpdate || context.maturityScores).length
    
    let maturityLevel = 'Initial'
    if (overallScore >= 4) maturityLevel = 'Optimizing'
    else if (overallScore >= 3) maturityLevel = 'Managed'
    else if (overallScore >= 2) maturityLevel = 'Defined'
    else if (overallScore >= 1) maturityLevel = 'Repeatable'
    
    // Calculate industry comparison
    const industryComparison = {
      userScore: overallScore,
      industryAverage: 3.0, // This would come from the benchmark data
      percentile: Math.round((overallScore / 5) * 100)
    }
    
    const responseData = {
      message: response.message,
      insights: response.insights,
      nextQuestion: response.nextQuestion,
      maturityUpdate: response.maturityUpdate,
      industryInsight: response.industryInsight,
      confidence: response.confidence,
      rapportBuilding: response.rapportBuilding,
      maturityLevel,
      industryComparison
    }
    
    console.log('Response data:', responseData)
    
    const validatedResponse = ConsultativeAssessmentResponseSchema.parse({
      success: true,
      data: responseData,
      message: 'Consultative assessment completed successfully'
    })
    
    return NextResponse.json(validatedResponse)
    
  } catch (error) {
    console.error('Error in consultative assessment API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      }, { status: 400 })
    }
    
    if (error instanceof AppError) {
      return NextResponse.json({
        success: false,
        message: error.message,
        code: error.code
      }, { status: error.statusCode })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
