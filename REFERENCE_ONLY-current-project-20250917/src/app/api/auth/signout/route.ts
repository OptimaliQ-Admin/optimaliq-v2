import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/supabase';
import { ErrorResponseSchema } from '../schema';
import { handleError } from '@/utils';

export async function POST(_request: NextRequest) {
  try {
    // Sign out user
    await auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Signout error:', error);
    
    const handledError = handleError(error);
    
    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to sign out',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
