import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminClientAvailable } from '@/lib/supabaseAdmin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    // Get the current user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseAdmin!
      .from('users')
      .select('role')
      .eq('u_id', user.id)
      .single();

    if (userError) {
      console.error('Error checking admin status:', userError);
      return NextResponse.json({ isAdmin: false, error: 'Failed to check admin status' }, { status: 500 });
    }

    const isAdmin = userData?.role === 'admin';

    return NextResponse.json({
      isAdmin,
      role: userData?.role || 'user',
      userId: user.id,
    });

  } catch (error) {
    console.error('Admin status check error:', error);
    return NextResponse.json({ isAdmin: false, error: 'Internal server error' }, { status: 500 });
  }
} 