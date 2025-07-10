import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
  status?: number;
}

/**
 * Authenticate user from request and validate they can access the specified user ID
 * @param req - NextRequest object
 * @param targetUserId - The user ID the request is trying to access
 * @returns AuthResult with user info or error
 */
export async function authenticateUser(
  req: NextRequest,
  targetUserId?: string
): Promise<AuthResult> {
  try {
    // Create Supabase client with cookies
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized - Please log in',
        status: 401
      };
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email
    };

    // If a target user ID is specified, validate the user can access it
    if (targetUserId && targetUserId !== user.id) {
      // For now, only allow users to access their own data
      // In the future, this could be extended to check admin roles, team membership, etc.
      return {
        success: false,
        error: 'Forbidden - You can only access your own data',
        status: 403
      };
    }

    return {
      success: true,
      user: authenticatedUser
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Internal server error during authentication',
      status: 500
    };
  }
}

/**
 * Create a standardized error response for authentication failures
 */
export function createAuthErrorResponse(authResult: AuthResult): NextResponse {
  return NextResponse.json(
    { error: authResult.error },
    { status: authResult.status || 401 }
  );
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): { valid: boolean; missingFields?: string[] } {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      missingFields
    };
  }
  
  return { valid: true };
} 