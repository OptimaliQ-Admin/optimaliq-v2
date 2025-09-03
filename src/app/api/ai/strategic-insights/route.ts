import { NextRequest, NextResponse } from 'next/server';
import { agents } from '@/lib/ai/agents';
import { AppError, handleError } from '@/utils';

export async function POST(req: NextRequest) {
  try {
    const { userId, dashboardData, industry, assessmentData } = await req.json();

    if (!userId || !dashboardData || !industry) {
      throw new AppError('Missing required parameters: userId, dashboardData, and industry', 'MISSING_PARAMETERS', 400);
    }

    // Use our existing AI infrastructure to generate strategic insights
    const insights = await agents.generateStrategicInsights({
      userId,
      dashboardData,
      industry,
      assessmentData,
      useRAG: true,
      includeMarketContext: true
    });

    return NextResponse.json({
      success: true,
      data: insights
    });

  } catch (error) {
    return handleError(error);
  }
}
