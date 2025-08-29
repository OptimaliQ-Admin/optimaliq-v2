/**
 * User preferences API endpoints
 * Handles user settings, notifications, and customization preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schemas
const UpdatePreferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    marketing: z.boolean().default(true),
    assessmentReminders: z.boolean().default(true),
    teamUpdates: z.boolean().default(true),
    marketIntelligence: z.boolean().default(false)
  }).optional(),
  theme: z.enum(['light', 'dark', 'system']).default('system').optional(),
  language: z.string().min(2).max(5).default('en').optional(),
  timezone: z.string().default('UTC').optional(),
  dashboard: z.object({
    defaultView: z.enum(['overview', 'assessments', 'growth', 'team']).default('overview'),
    refreshInterval: z.number().min(30).max(300).default(60), // seconds
    showAnimations: z.boolean().default(true),
    compactMode: z.boolean().default(false)
  }).optional(),
  privacy: z.object({
    shareAnalytics: z.boolean().default(true),
    showInDirectory: z.boolean().default(false),
    allowTeamInvites: z.boolean().default(true)
  }).optional()
});

// Response schemas
const PreferencesResponseSchema = z.object({
  success: z.boolean(),
  preferences: z.object({
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
      marketing: z.boolean(),
      assessmentReminders: z.boolean(),
      teamUpdates: z.boolean(),
      marketIntelligence: z.boolean()
    }),
    theme: z.enum(['light', 'dark', 'system']),
    language: z.string(),
    timezone: z.string(),
    dashboard: z.object({
      defaultView: z.enum(['overview', 'assessments', 'growth', 'team']),
      refreshInterval: z.number(),
      showAnimations: z.boolean(),
      compactMode: z.boolean()
    }),
    privacy: z.object({
      shareAnalytics: z.boolean(),
      showInDirectory: z.boolean(),
      allowTeamInvites: z.boolean()
    }),
    updatedAt: z.string()
  }).optional(),
  message: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
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

    // Get user preferences
    const { data: profile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('preferences, updated_at')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Failed to fetch user preferences:', profileError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch preferences' },
        { status: 500 }
      );
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: true,
        assessmentReminders: true,
        teamUpdates: true,
        marketIntelligence: false
      },
      theme: 'system' as const,
      language: 'en',
      timezone: 'UTC',
      dashboard: {
        defaultView: 'overview' as const,
        refreshInterval: 60,
        showAnimations: true,
        compactMode: false
      },
      privacy: {
        shareAnalytics: true,
        showInDirectory: false,
        allowTeamInvites: true
      }
    };

    const preferences = profile.preferences || defaultPreferences;

    const response = PreferencesResponseSchema.parse({
      success: true,
      preferences: {
        ...preferences,
        updatedAt: profile.updated_at
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdatePreferencesSchema.parse(body);

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

    // Get current preferences
    const { data: currentProfile, error: fetchError } = await supabase
      .from('tier2_profiles')
      .select('preferences')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current preferences:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch current preferences' },
        { status: 500 }
      );
    }

    // Merge with existing preferences
    const currentPreferences = currentProfile.preferences || {};
    const updatedPreferences = {
      ...currentPreferences,
      ...validatedData
    };

    // Update user preferences
    const { error: updateError } = await supabase
      .from('tier2_profiles')
      .update({ 
        preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update user preferences:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update preferences' },
        { status: 500 }
      );
    }

    const response = PreferencesResponseSchema.parse({
      success: true,
      preferences: {
        ...updatedPreferences,
        updatedAt: new Date().toISOString()
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

    console.error('Update preferences error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
