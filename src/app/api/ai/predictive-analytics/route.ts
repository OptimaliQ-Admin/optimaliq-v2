import { NextRequest, NextResponse } from 'next/server';
import { DashboardAIService } from '@/lib/ai/services/dashboard';
import { getErrorMessage } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    const { userId, dashboardData, metric } = await req.json();

    if (!userId || !dashboardData || !metric) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, dashboardData, and metric' },
        { status: 400 }
      );
    }

    const dashboardService = new DashboardAIService(userId);
    const analytics = await dashboardService.generatePredictiveAnalytics(dashboardData, metric);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error generating predictive analytics:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 