/**
 * Market Intelligence Export API
 * Provides data export functionality for market intelligence reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const exportRequestSchema = z.object({
  userId: z.string().uuid(),
  exportType: z.enum(['insights', 'articles', 'trends', 'recommendations', 'full_report']),
  format: z.enum(['pdf', 'csv', 'json', 'excel']).default('pdf'),
  dateRange: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  }).optional(),
  includeCharts: z.boolean().default(true),
  includeCitations: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      exportType: searchParams.get('exportType'),
      format: searchParams.get('format') || 'pdf',
      dateRange: {
        startDate: searchParams.get('startDate'),
        endDate: searchParams.get('endDate')
      },
      includeCharts: searchParams.get('includeCharts') === 'true',
      includeCitations: searchParams.get('includeCitations') === 'true'
    };

    const validatedQuery = exportRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    let exportData: any = {};

    // Collect data based on export type
    switch (validatedQuery.exportType) {
      case 'insights':
        const { data: insights } = await supabase
          .from('market_insights')
          .select('*')
          .eq('user_id', validatedQuery.userId)
          .gte('created_at', validatedQuery.dateRange?.startDate || '2024-01-01')
          .lte('created_at', validatedQuery.dateRange?.endDate || new Date().toISOString())
          .order('created_at', { ascending: false });

        exportData.insights = insights || [];
        break;

      case 'articles':
        const { data: articles } = await supabase
          .from('market_articles')
          .select('*')
          .eq('industry', profile?.industry || 'general')
          .gte('published_date', validatedQuery.dateRange?.startDate || '2024-01-01')
          .lte('published_date', validatedQuery.dateRange?.endDate || new Date().toISOString())
          .order('published_date', { ascending: false });

        exportData.articles = articles || [];
        break;

      case 'trends':
        const { data: trends } = await supabase
          .from('market_trends')
          .select('*')
          .eq('industry', profile?.industry || 'general')
          .gte('created_at', validatedQuery.dateRange?.startDate || '2024-01-01')
          .lte('created_at', validatedQuery.dateRange?.endDate || new Date().toISOString())
          .order('created_at', { ascending: false });

        exportData.trends = trends || [];
        break;

      case 'recommendations':
        const { data: recommendations } = await supabase
          .from('market_recommendations')
          .select('*')
          .eq('user_id', validatedQuery.userId)
          .gte('created_at', validatedQuery.dateRange?.startDate || '2024-01-01')
          .lte('created_at', validatedQuery.dateRange?.endDate || new Date().toISOString())
          .order('created_at', { ascending: false });

        exportData.recommendations = recommendations || [];
        break;

      case 'full_report':
        // Get all data for comprehensive report
        const [insightsData, articlesData, trendsData, recommendationsData] = await Promise.all([
          supabase
            .from('market_insights')
            .select('*')
            .eq('user_id', validatedQuery.userId)
            .gte('created_at', validatedQuery.dateRange?.startDate || '2024-01-01')
            .lte('created_at', validatedQuery.dateRange?.endDate || new Date().toISOString()),
          supabase
            .from('market_articles')
            .select('*')
            .eq('industry', profile?.industry || 'general')
            .gte('published_date', validatedQuery.dateRange?.startDate || '2024-01-01')
            .lte('published_date', validatedQuery.dateRange?.endDate || new Date().toISOString()),
          supabase
            .from('market_trends')
            .select('*')
            .eq('industry', profile?.industry || 'general')
            .gte('created_at', validatedQuery.dateRange?.startDate || '2024-01-01')
            .lte('created_at', validatedQuery.dateRange?.endDate || new Date().toISOString()),
          supabase
            .from('market_recommendations')
            .select('*')
            .eq('user_id', validatedQuery.userId)
            .gte('created_at', validatedQuery.dateRange?.startDate || '2024-01-01')
            .lte('created_at', validatedQuery.dateRange?.endDate || new Date().toISOString())
        ]);

        exportData = {
          insights: insightsData.data || [],
          articles: articlesData.data || [],
          trends: trendsData.data || [],
          recommendations: recommendationsData.data || [],
          profile: profile,
          exportMetadata: {
            generatedAt: new Date().toISOString(),
            exportType: 'full_report',
            dateRange: validatedQuery.dateRange,
            userProfile: {
              industry: profile?.industry,
              companySize: profile?.company_size,
              role: profile?.role
            }
          }
        };
        break;
    }

    // Add citations if requested
    if (validatedQuery.includeCitations && exportData.articles) {
      const articleIds = exportData.articles.map((a: any) => a.id);
      const { data: citations } = await supabase
        .from('market_citations')
        .select('*')
        .in('article_id', articleIds);

      exportData.citations = citations || [];
    }

    // Generate export file based on format
    let exportFile: any = {};
    
    switch (validatedQuery.format) {
      case 'json':
        exportFile = {
          data: exportData,
          metadata: {
            exportType: validatedQuery.exportType,
            format: 'json',
            generatedAt: new Date().toISOString(),
            recordCount: Object.keys(exportData).reduce((sum, key) => 
              Array.isArray(exportData[key]) ? sum + exportData[key].length : sum, 0
            )
          }
        };
        break;

      case 'csv':
        // Convert to CSV format (simplified)
        exportFile = {
          data: exportData,
          format: 'csv',
          downloadUrl: `/api/market-intelligence/export/download?type=${validatedQuery.exportType}&format=csv&userId=${validatedQuery.userId}`
        };
        break;

      case 'pdf':
        // Generate PDF report
        exportFile = {
          data: exportData,
          format: 'pdf',
          downloadUrl: `/api/market-intelligence/export/download?type=${validatedQuery.exportType}&format=pdf&userId=${validatedQuery.userId}`,
          includeCharts: validatedQuery.includeCharts
        };
        break;

      case 'excel':
        // Generate Excel report
        exportFile = {
          data: exportData,
          format: 'excel',
          downloadUrl: `/api/market-intelligence/export/download?type=${validatedQuery.exportType}&format=excel&userId=${validatedQuery.userId}`,
          includeCharts: validatedQuery.includeCharts
        };
        break;
    }

    // Log export activity
    await supabase
      .from('export_logs')
      .insert({
        user_id: validatedQuery.userId,
        export_type: validatedQuery.exportType,
        format: validatedQuery.format,
        record_count: Object.keys(exportData).reduce((sum, key) => 
          Array.isArray(exportData[key]) ? sum + exportData[key].length : sum, 0
        ),
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      export: exportFile,
      summary: {
        exportType: validatedQuery.exportType,
        format: validatedQuery.format,
        recordCount: Object.keys(exportData).reduce((sum, key) => 
          Array.isArray(exportData[key]) ? sum + exportData[key].length : sum, 0
        ),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Export API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, shareData } = body;

    switch (action) {
      case 'share_report':
        // Share report with team members
        const { error: shareError } = await supabase
          .from('shared_reports')
          .insert({
            user_id: user.id,
            report_type: shareData.reportType,
            shared_with: shareData.sharedWith,
            share_permissions: shareData.permissions || 'read',
            expires_at: shareData.expiresAt,
            created_at: new Date().toISOString()
          });

        if (shareError) {
          console.error('Error sharing report:', shareError);
          return NextResponse.json({ error: 'Failed to share report' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Report shared successfully' });

      case 'schedule_export':
        // Schedule recurring export
        const { error: scheduleError } = await supabase
          .from('scheduled_exports')
          .insert({
            user_id: user.id,
            export_type: shareData.exportType,
            format: shareData.format,
            frequency: shareData.frequency,
            recipients: shareData.recipients,
            next_run: shareData.nextRun,
            created_at: new Date().toISOString()
          });

        if (scheduleError) {
          console.error('Error scheduling export:', scheduleError);
          return NextResponse.json({ error: 'Failed to schedule export' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Export scheduled successfully' });

      case 'save_template':
        // Save export template
        const { error: templateError } = await supabase
          .from('export_templates')
          .insert({
            user_id: user.id,
            template_name: shareData.templateName,
            export_type: shareData.exportType,
            format: shareData.format,
            include_charts: shareData.includeCharts,
            include_citations: shareData.includeCitations,
            created_at: new Date().toISOString()
          });

        if (templateError) {
          console.error('Error saving template:', templateError);
          return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Template saved successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Export action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
