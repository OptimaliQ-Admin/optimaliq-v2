import { createClient } from '@supabase/supabase-js';
import { AppError } from '@/utils';

// Environment variables will be loaded from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use fallback values if environment variables are not set
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder_anon_key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase environment variables not set, using fallback values');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'optimaliq-web'
    }
  }
});

// Database table names
export const TABLES = {
  USERS: 'tier2_users',
  PROFILES: 'tier2_profiles',
  ORGANIZATIONS: 'organizations',
  ASSESSMENTS: 'onboarding_assessments',
  DASHBOARD_INSIGHTS: 'tier2_dashboard_insights',
  GROWTH_LEVERS: 'growth_levers',
  GROWTH_LEVER_PROGRESS: 'growth_lever_progress',
  TEAM_MEMBERS: 'team_members',
  ASSESSMENT_CAMPAIGNS: 'assessment_campaigns',
  ASSESSMENT_ASSIGNMENTS: 'assessment_assignments',
  SUBSCRIPTIONS: 'subscriptions',
  MARKET_ARTICLES: 'market_articles',
  MARKET_SNAPSHOTS: 'market_snapshots',
  BUSINESS_TRENDS: 'realtime_business_trends'
} as const;

// Row Level Security (RLS) policies
export const RLS_POLICIES = {
  USERS: {
    SELECT: 'auth.uid() = id',
    INSERT: 'auth.uid() = id',
    UPDATE: 'auth.uid() = id',
    DELETE: 'auth.uid() = id'
  },
  PROFILES: {
    SELECT: 'auth.uid() = user_id',
    INSERT: 'auth.uid() = user_id',
    UPDATE: 'auth.uid() = user_id',
    DELETE: 'auth.uid() = user_id'
  },
  ORGANIZATIONS: {
    SELECT: 'auth.uid() IN (SELECT user_id FROM team_members WHERE organization_id = id)',
    INSERT: 'auth.uid() IN (SELECT user_id FROM team_members WHERE organization_id = id AND role = \'owner\')',
    UPDATE: 'auth.uid() IN (SELECT user_id FROM team_members WHERE organization_id = id AND role IN (\'owner\', \'admin\'))',
    DELETE: 'auth.uid() IN (SELECT user_id FROM team_members WHERE organization_id = id AND role = \'owner\')'
  }
} as const;

// Database functions
export class SupabaseService {
  private static instance: SupabaseService;
  
  private constructor() {}
  
  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }
  
  // User management
  async getUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  async updateUser(userId: string, updates: Partial<any>) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  // Assessment management
  async createAssessment(assessment: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ASSESSMENTS)
        .insert(assessment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to create assessment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  async getAssessment(assessmentId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ASSESSMENTS)
        .select('*')
        .eq('id', assessmentId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch assessment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  async getUserAssessments(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ASSESSMENTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch user assessments: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  // Dashboard insights
  async getDashboardInsights(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_INSIGHTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch dashboard insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  async createDashboardInsights(insights: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_INSIGHTS)
        .insert(insights)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to create dashboard insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  // Growth levers
  async getGrowthLevers(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GROWTH_LEVERS)
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch growth levers: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  async createGrowthLevers(levers: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.GROWTH_LEVERS)
        .insert(levers)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to create growth levers: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  // Team management
  async getTeamMembers(organizationId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAM_MEMBERS)
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch team members: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  async inviteTeamMember(invitation: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEAM_MEMBERS)
        .insert(invitation)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to invite team member: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  // Market intelligence
  async getMarketSnapshots(industry: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.MARKET_SNAPSHOTS)
        .select('*')
        .eq('industry', industry)
        .gte('ttl_expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to fetch market snapshots: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
  
  // Vector search for market articles
  async searchMarketArticles(query: string, limit: number = 10) {
    try {
      // This would use pgvector for semantic search
      // For now, we'll do a basic text search
      const { data, error } = await supabase
        .from(TABLES.MARKET_ARTICLES)
        .select('*')
        .textSearch('content', query)
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to search market articles: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DATABASE_ERROR',
        500
      );
    }
  }
}

// Export singleton instance
export const supabaseService = SupabaseService.getInstance();

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to sign up: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AUTH_ERROR',
        500
      );
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(
        `Failed to sign in: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AUTH_ERROR',
        500
      );
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw new AppError(
        `Failed to sign out: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AUTH_ERROR',
        500
      );
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      throw new AppError(
        `Failed to get current user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AUTH_ERROR',
        500
      );
    }
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
