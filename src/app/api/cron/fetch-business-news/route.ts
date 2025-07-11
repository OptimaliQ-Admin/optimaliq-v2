import { NextRequest, NextResponse } from 'next/server';
import { fetchBusinessNews } from '@/lib/cron/fetchBusinessNews';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      console.error('❌ Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🕐 Cron job triggered: Fetching business news');
    
    const headlines = await fetchBusinessNews();
    
    return NextResponse.json({
      success: true,
      message: 'Business news fetched successfully',
      count: headlines?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Cron job error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch business news',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
} 