/**
 * Market Intelligence Export API
 * Provides data export functionality for market intelligence reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schema
const ExportRequestSchema = z.object({
  dataType: z.enum(['trends', 'insights', 'competitive', 'full_report']),
  format: z.enum(['pdf', 'excel', 'csv', 'json']).default('pdf'),
  filters: z.object({
    timeRange: z.enum(['1week', '1month', '3months', '6months', '1year']).optional(),
    industry: z.array(z.string()).optional(),
    trendType: z.array(z.enum(['up', 'down', 'stable'])).optional(),
    confidence: z.number().min(0).max(1).optional(),
    category: z.array(z.string()).optional()
  }).optional(),
  options: z.object({
    includeCharts: z.boolean().default(true),
    includeRecommendations: z.boolean().default(true),
    includeMetadata: z.boolean().default(true),
    customTitle: z.string().optional(),
    customDescription: z.string().optional()
  }).optional()
});

// Response schema
const ExportResponseSchema = z.object({
  success: z.boolean(),
  export: z.object({
    id: z.string(),
    dataType: z.string(),
    format: z.string(),
    status: z.enum(['processing', 'completed', 'failed']),
    downloadUrl: z.string().optional(),
    expiresAt: z.string().optional(),
    fileSize: z.number().optional(),
    recordCount: z.number().optional(),
    metadata: z.object({
      generatedAt: z.string(),
      generatedBy: z.string(),
      filters: z.record(z.any()).optional(),
      options: z.record(z.any()).optional()
    })
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = ExportRequestSchema.parse(body);

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's organization
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id, industry, first_name, last_name')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Create export record
    const exportId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { data: exportRecord, error: exportError } = await supabase
      .from('market_exports')
      .insert({
        id: exportId,
        organization_id: userProfile.organization_id,
        user_id: user.id,
        data_type: validatedData.dataType,
        format: validatedData.format,
        status: 'processing',
        filters: validatedData.filters || {},
        options: validatedData.options || {},
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (exportError) {
      console.error('Failed to create export record:', exportError);
      return NextResponse.json(
        { success: false, message: 'Failed to create export' },
        { status: 500 }
      );
    }

    // Process export asynchronously
    processExportAsync(exportId, validatedData, userProfile);

    const response = ExportResponseSchema.parse({
      success: true,
      export: {
        id: exportId,
        dataType: validatedData.dataType,
        format: validatedData.format,
        status: 'processing',
        expiresAt: expiresAt.toISOString(),
        metadata: {
          generatedAt: new Date().toISOString(),
          generatedBy: `${userProfile.first_name} ${userProfile.last_name}`,
          filters: validatedData.filters,
          options: validatedData.options
        }
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Export creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create export' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const exportId = searchParams.get('id');

    if (!exportId) {
      return NextResponse.json(
        { success: false, message: 'Export ID required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get export record
    const { data: exportRecord, error: exportError } = await supabase
      .from('market_exports')
      .select('*')
      .eq('id', exportId)
      .eq('user_id', user.id)
      .single();

    if (exportError || !exportRecord) {
      return NextResponse.json(
        { success: false, message: 'Export not found' },
        { status: 404 }
      );
    }

    const response = ExportResponseSchema.parse({
      success: true,
      export: {
        id: exportRecord.id,
        dataType: exportRecord.data_type,
        format: exportRecord.format,
        status: exportRecord.status,
        downloadUrl: exportRecord.download_url,
        expiresAt: exportRecord.expires_at,
        fileSize: exportRecord.file_size,
        recordCount: exportRecord.record_count,
        metadata: {
          generatedAt: exportRecord.created_at,
          generatedBy: 'User', // Would need to join with user profile
          filters: exportRecord.filters,
          options: exportRecord.options
        }
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Export status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check export status' },
      { status: 500 }
    );
  }
}

// Async export processing function
async function processExportAsync(
  exportId: string,
  exportData: any,
  userProfile: any
): Promise<void> {
  try {
    // Fetch data based on export type
    const data = await fetchExportData(exportData, userProfile);
    
    // Generate export file
    const exportResult = await generateExportFile(data, exportData);
    
    // Update export record
    await updateExportRecord(exportId, exportResult);
    
  } catch (error) {
    console.error('Export processing error:', error);
    await updateExportRecord(exportId, { status: 'failed', error: error.message });
  }
}

async function fetchExportData(exportData: any, userProfile: any): Promise<any> {
  const { dataType, filters } = exportData;
  
  let query = supabase
    .from('realtime_market_trends')
    .select('*')
    .eq('industry', userProfile.industry);

  // Apply filters
  if (filters?.timeRange) {
    const timeRange = getTimeRange(filters.timeRange);
    query = query.gte('created_at', timeRange);
  }

  if (filters?.trendType && filters.trendType.length > 0) {
    query = query.in('direction', filters.trendType);
  }

  if (filters?.confidence) {
    query = query.gte('confidence', filters.confidence);
  }

  if (filters?.category && filters.category.length > 0) {
    query = query.in('category', filters.category);
  }

  const { data: trends, error: trendsError } = await query;

  if (trendsError) {
    throw new Error('Failed to fetch market trends');
  }

  // Fetch additional data based on export type
  let additionalData = {};
  
  if (exportData.dataType === 'competitive' || exportData.dataType === 'full_report') {
    const { data: competitors } = await supabase
      .from('market_snapshots')
      .select('*')
      .eq('industry', userProfile.industry)
      .limit(50);
    
    additionalData = { competitors: competitors || [] };
  }

  if (exportData.dataType === 'insights' || exportData.dataType === 'full_report') {
    const { data: insights } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', userProfile.industry)
      .limit(100);
    
    additionalData = { ...additionalData, insights: insights || [] };
  }

  return {
    trends: trends || [],
    ...additionalData,
    metadata: {
      industry: userProfile.industry,
      exportDate: new Date().toISOString(),
      recordCount: trends?.length || 0
    }
  };
}

async function generateExportFile(data: any, exportData: any): Promise<any> {
  const { format, options } = exportData;
  
  let fileContent: string;
  let fileSize: number;
  let downloadUrl: string;

  switch (format) {
    case 'json':
      fileContent = JSON.stringify(data, null, 2);
      fileSize = Buffer.byteLength(fileContent, 'utf8');
      downloadUrl = await uploadToStorage(fileContent, 'json', exportData.dataType);
      break;

    case 'csv':
      fileContent = generateCSV(data);
      fileSize = Buffer.byteLength(fileContent, 'utf8');
      downloadUrl = await uploadToStorage(fileContent, 'csv', exportData.dataType);
      break;

    case 'excel':
      const excelBuffer = await generateExcel(data, options);
      fileSize = excelBuffer.length;
      downloadUrl = await uploadToStorage(excelBuffer, 'xlsx', exportData.dataType);
      break;

    case 'pdf':
      const pdfBuffer = await generatePDF(data, options);
      fileSize = pdfBuffer.length;
      downloadUrl = await uploadToStorage(pdfBuffer, 'pdf', exportData.dataType);
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return {
    status: 'completed',
    downloadUrl,
    fileSize,
    recordCount: data.metadata.recordCount
  };
}

async function updateExportRecord(exportId: string, updateData: any): Promise<void> {
  const { error } = await supabase
    .from('market_exports')
    .update({
      status: updateData.status,
      download_url: updateData.downloadUrl,
      file_size: updateData.fileSize,
      record_count: updateData.recordCount,
      completed_at: updateData.status === 'completed' ? new Date().toISOString() : null,
      error_message: updateData.error
    })
    .eq('id', exportId);

  if (error) {
    console.error('Failed to update export record:', error);
  }
}

// Helper functions
function getTimeRange(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '1week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '1month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '3months':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '6months':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString();
    case '1year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function generateCSV(data: any): string {
  const trends = data.trends || [];
  
  if (trends.length === 0) {
    return 'No data available';
  }

  const headers = Object.keys(trends[0]).join(',');
  const rows = trends.map(trend => 
    Object.values(trend).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );

  return [headers, ...rows].join('\n');
}

async function generateExcel(data: any, options: any): Promise<Buffer> {
  // Mock Excel generation (in production, use a library like xlsx)
  const csv = generateCSV(data);
  return Buffer.from(csv, 'utf8');
}

async function generatePDF(data: any, options: any): Promise<Buffer> {
  // Mock PDF generation (in production, use a library like puppeteer or jsPDF)
  const content = JSON.stringify(data, null, 2);
  return Buffer.from(content, 'utf8');
}

async function uploadToStorage(content: any, extension: string, dataType: string): Promise<string> {
  // Mock file upload (in production, upload to Supabase Storage or S3)
  const fileName = `${dataType}_export_${Date.now()}.${extension}`;
  const mockUrl = `https://storage.optimaliq.ai/exports/${fileName}`;
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockUrl;
}
