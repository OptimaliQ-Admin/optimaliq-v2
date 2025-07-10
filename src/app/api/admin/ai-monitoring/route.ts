/**
 * AI Monitoring API Endpoints
 * 
 * Provides endpoints for:
 * - Rate limiting statistics
 * - Model performance metrics
 * - System health monitoring
 * - Cost analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { aiRateLimiter } from '@/lib/ai/rateLimiter';
import { modelVersioning } from '@/lib/ai/modelVersioning';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('u_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'rate-limits':
        return await getRateLimitStats();
      
      case 'model-performance':
        return await getModelPerformance();
      
      case 'system-health':
        return await getSystemHealth();
      
      case 'cost-analysis':
        return await getCostAnalysis();
      
      case 'alerts':
        return await getAlerts();
      
      case 'usage':
        const userId = searchParams.get('userId');
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }
        return await getUserUsage(userId);
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Monitoring API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('u_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'reset-rate-limits':
        return await resetRateLimits(params.userId, params.provider);
      
      case 'update-model-status':
        return await updateModelStatus(params.provider, params.model, params.version, params.status);
      
      case 'rollback-model':
        return await rollbackModel(params.provider, params.model, params.version);
      
      case 'acknowledge-alert':
        return await acknowledgeAlert(params.alertId);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Monitoring API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getRateLimitStats() {
  const stats = aiRateLimiter.getStats();
  
  return NextResponse.json({
    success: true,
    data: stats
  });
}

async function getModelPerformance() {
  const performance = modelVersioning.getAllModelPerformance();
  
  return NextResponse.json({
    success: true,
    data: performance
  });
}

async function getSystemHealth() {
  const stats = aiRateLimiter.getStats();
  
  // Check for critical issues
  const criticalIssues = stats.filter(stat => stat.errorRate > 0.1);
  const highUsage = stats.filter(stat => stat.totalRequests > 1000);
  
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  let message = 'All systems operational';
  
  if (criticalIssues.length > 0) {
    status = 'critical';
    message = `${criticalIssues.length} providers experiencing high error rates`;
  } else if (highUsage.length > 0) {
    status = 'warning';
    message = `${highUsage.length} providers under high load`;
  }
  
  return NextResponse.json({
    success: true,
    data: {
      status,
      message,
      timestamp: new Date().toISOString(),
      criticalIssues: criticalIssues.length,
      highUsage: highUsage.length,
      totalProviders: stats.length
    }
  });
}

async function getCostAnalysis() {
  const costs = modelVersioning.getCostAnalysis('day');
  const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  
  return NextResponse.json({
    success: true,
    data: {
      totalCost,
      costPerHour: totalCost / 24,
      costPerDay: totalCost,
      costTrend: totalCost > 100 ? 'up' : 'stable',
      breakdown: costs
    }
  });
}

async function getAlerts() {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get recent alerts from database
  const { data: alerts, error } = await supabase
    .from('admin_audit_log')
    .select('*')
    .eq('action', 'alert')
    .order('timestamp', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Failed to fetch alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    data: alerts || []
  });
}

async function getUserUsage(userId: string) {
  const usage = await aiRateLimiter.getUserUsage(userId);
  
  return NextResponse.json({
    success: true,
    data: usage
  });
}

async function resetRateLimits(userId: string, provider?: string) {
  await aiRateLimiter.resetUserLimits(userId, provider);
  
  return NextResponse.json({
    success: true,
    message: 'Rate limits reset successfully'
  });
}

async function updateModelStatus(provider: string, model: string, version: string, status: string) {
  await modelVersioning.updateModelStatus(provider, model, version, status as any);
  
  return NextResponse.json({
    success: true,
    message: 'Model status updated successfully'
  });
}

async function rollbackModel(provider: string, model: string, version: string) {
  await modelVersioning.rollbackToVersion(provider, model, version);
  
  return NextResponse.json({
    success: true,
    message: 'Model rollback completed successfully'
  });
}

async function acknowledgeAlert(alertId: string) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Update alert status in database
  const { error } = await supabase
    .from('admin_audit_log')
    .update({ details: { acknowledged: true } })
    .eq('id', alertId);
  
  if (error) {
    console.error('Failed to acknowledge alert:', error);
    return NextResponse.json({ error: 'Failed to acknowledge alert' }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Alert acknowledged successfully'
  });
} 