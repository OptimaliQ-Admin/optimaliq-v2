import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = params;
    const { canvasData } = await request.json();

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('onboarding_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session || session.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // Save canvas data to session metadata
    const { error: updateError } = await supabase
      .from('onboarding_sessions')
      .update({
        metadata: {
          canvas_data: canvasData,
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', sessionId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Canvas data saved successfully'
    });

  } catch (error) {
    console.error('Error saving canvas data:', error);
    return NextResponse.json(
      { error: 'Failed to save canvas data' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = params;

    // Verify session belongs to user and get canvas data
    const { data: session, error: sessionError } = await supabase
      .from('onboarding_sessions')
      .select('user_id, metadata')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session || session.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    const canvasData = session.metadata?.canvas_data || null;

    return NextResponse.json({
      success: true,
      canvasData
    });

  } catch (error) {
    console.error('Error retrieving canvas data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve canvas data' },
      { status: 500 }
    );
  }
} 