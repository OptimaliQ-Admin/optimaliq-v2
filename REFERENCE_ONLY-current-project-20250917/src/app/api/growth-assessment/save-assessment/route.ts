import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AppError } from '@/utils'

// Request schema
const SaveAssessmentRequestSchema = z.object({
  responses: z.record(z.union([z.string(), z.array(z.string())])),
  userInfo: z.object({
    name: z.string(),
    email: z.string(),
    industry: z.string(),
    role: z.string(),
    companySize: z.string(),
    revenueRange: z.string(),
    userId: z.string().optional()
  }).optional(),
  assessmentType: z.string().optional()
})

// Response schema
const SaveAssessmentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  assessmentId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    console.log('Save assessment API called')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate request
    const validatedData = SaveAssessmentRequestSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    // For now, just return success
    // In a real implementation, you would save to database
    const assessmentId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('Assessment saved with ID:', assessmentId)
    
    const response = SaveAssessmentResponseSchema.parse({
      success: true,
      message: 'Assessment saved successfully',
      assessmentId
    })
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error in save assessment API:', error)
    
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