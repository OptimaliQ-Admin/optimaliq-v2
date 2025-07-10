import { NextRequest, NextResponse } from 'next/server';
import { DashboardAIService } from '@/lib/ai/services/dashboard';
import { getErrorMessage } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    const { userId, dashboardData, period } = await req.json();

    if (!userId || !dashboardData) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId and dashboardData' },
        { status: 400 }
      );
    }

    const dashboardService = new DashboardAIService(userId);
    const summary = await dashboardService.generateExecutiveSummary(dashboardData, period);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating executive summary:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 