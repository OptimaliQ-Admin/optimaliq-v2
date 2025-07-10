import { NextRequest, NextResponse } from 'next/server';
import { DashboardAIService } from '@/lib/ai/services/dashboard';
import { getErrorMessage } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    const { userId, dashboardData, industry } = await req.json();

    if (!userId || !dashboardData || !industry) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, dashboardData, and industry' },
        { status: 400 }
      );
    }

    const dashboardService = new DashboardAIService(userId);
    const insights = await dashboardService.generateStrategicInsights(dashboardData, industry);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating strategic insights:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 