import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminClientAvailable } from '@/lib/supabaseAdmin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.',
        auditLogs: [],
        stats: []
      }, { status: 503 });
    }

    // Get the current user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseAdmin!
      .from('users')
      .select('role')
      .eq('u_id', user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('table_name');
    const operation = searchParams.get('operation');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get audit logs
    let auditQuery = supabaseAdmin!
      .from('audit_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (tableName) {
      auditQuery = auditQuery.eq('table_name', tableName);
    }
    if (operation) {
      auditQuery = auditQuery.eq('operation', operation);
    }
    if (startDate) {
      auditQuery = auditQuery.gte('timestamp', startDate);
    }
    if (endDate) {
      auditQuery = auditQuery.lte('timestamp', endDate);
    }

    const { data: auditLogs, error: auditError } = await auditQuery;

    if (auditError) {
      console.error('Error fetching audit logs:', auditError);
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    // Get dashboard stats
    const { data: dashboardStats, error: statsError } = await supabaseAdmin!
      .from('admin_dashboard')
      .select('*');

    if (statsError) {
      console.error('Error fetching dashboard stats:', statsError);
      return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }

    return NextResponse.json({
      auditLogs: auditLogs || [],
      stats: dashboardStats || [],
    });

  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 