import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai/service'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, type = 'generation' } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    let result: any

    switch (type) {
      case 'generation':
        result = await aiService.generateText(prompt, {
          model: 'gpt-4.1-mini',
          temperature: 0.7,
          maxTokens: 500
        }, user.id)
        break
        
      case 'analysis':
        result = await aiService.analyzeBusinessData(
          { prompt, timestamp: new Date().toISOString() },
          'Test business analysis',
          user.id
        )
        break
        
      case 'queue':
        const taskId = await aiService.queueTask({
          taskId: '',
          type: 'generation',
          data: { prompt, options: { model: 'gpt-4.1-mini' } },
          priority: 'normal',
          userId: user.id
        })
        result = { taskId, status: 'queued' }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      result,
      userId: user.id
    })

  } catch (error) {
    console.error('AI test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'health':
        const health = await aiService.getProviderHealth()
        return NextResponse.json({ health })
        
      case 'stats':
        const stats = await aiService.getUserStats(user.id, 7)
        return NextResponse.json({ stats })
        
      case 'rate-limits':
        const rateLimits = await aiService.getRateLimitInfo(user.id, 'openai')
        return NextResponse.json({ rateLimits })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('AI test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 