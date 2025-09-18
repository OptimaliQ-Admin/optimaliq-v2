import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Test basic connection
    const { data, error } = await supabase
      .from('organizations')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        message: 'Database connection failed'
      }, { status: 500 });
    }
    
    // Test table structure
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info');
    
    if (tablesError) {
      console.warn('Could not get table info:', tablesError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'OK',
        tables: tables || 'Could not retrieve table info',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database test failed'
    }, { status: 500 });
  }
}
