export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // User & Organization Management
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          title: string | null
          company: string | null
          company_size: string | null
          revenue_range: string | null
          industry: string | null
          timezone: string | null
          linkedin_url: string | null
          profile_pic_url: string | null
          agreed_terms: boolean
          agreed_marketing: boolean
          role: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          title?: string | null
          company?: string | null
          company_size?: string | null
          revenue_range?: string | null
          industry?: string | null
          timezone?: string | null
          linkedin_url?: string | null
          profile_pic_url?: string | null
          agreed_terms?: boolean
          agreed_marketing?: boolean
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          title?: string | null
          company?: string | null
          company_size?: string | null
          revenue_range?: string | null
          industry?: string | null
          timezone?: string | null
          linkedin_url?: string | null
          profile_pic_url?: string | null
          agreed_terms?: boolean
          agreed_marketing?: boolean
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string | null
          sso_config: Json
          settings: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          owner_id?: string | null
          sso_config?: Json
          settings?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          owner_id?: string | null
          sso_config?: Json
          settings?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          permissions: Json
          department: string | null
          status: string
          joined_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          permissions?: Json
          department?: string | null
          status?: string
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          permissions?: Json
          department?: string | null
          status?: string
          joined_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          billing_cycle: string | null
          next_billing_date: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          stripe_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan?: string
          status?: string
          billing_cycle?: string | null
          next_billing_date?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          stripe_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          billing_cycle?: string | null
          next_billing_date?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          stripe_data?: Json
          created_at?: string
          updated_at?: string
        }
      }

      // World-Class Onboarding System
      onboarding_sessions: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          session_type: string
          status: string
          current_step: string | null
          progress_percentage: number
          engagement_score: number | null
          completion_time_minutes: number | null
          metadata: Json
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          session_type?: string
          status?: string
          current_step?: string | null
          progress_percentage?: number
          engagement_score?: number | null
          completion_time_minutes?: number | null
          metadata?: Json
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          session_type?: string
          status?: string
          current_step?: string | null
          progress_percentage?: number
          engagement_score?: number | null
          completion_time_minutes?: number | null
          metadata?: Json
          created_at?: string
          completed_at?: string | null
        }
      }
      conversation_messages: {
        Row: {
          id: string
          session_id: string
          message_type: string
          content: Json
          intent: string | null
          confidence_score: number | null
          response_time_ms: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          message_type: string
          content: Json
          intent?: string | null
          confidence_score?: number | null
          response_time_ms?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          message_type?: string
          content?: Json
          intent?: string | null
          confidence_score?: number | null
          response_time_ms?: number | null
          metadata?: Json
          created_at?: string
        }
      }
      adaptive_questions: {
        Row: {
          id: string
          session_id: string
          question_id: string
          question_type: string
          question_data: Json
          relevance_score: number | null
          user_response: Json | null
          effectiveness_score: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          question_type: string
          question_data: Json
          relevance_score?: number | null
          user_response?: Json | null
          effectiveness_score?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          question_type?: string
          question_data?: Json
          relevance_score?: number | null
          user_response?: Json | null
          effectiveness_score?: number | null
          metadata?: Json
          created_at?: string
        }
      }
      real_time_insights: {
        Row: {
          id: string
          session_id: string
          insight_type: string
          insight_data: Json
          confidence_score: number | null
          relevance_score: number | null
          actionability_score: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          insight_type: string
          insight_data: Json
          confidence_score?: number | null
          relevance_score?: number | null
          actionability_score?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          insight_type?: string
          insight_data?: Json
          confidence_score?: number | null
          relevance_score?: number | null
          actionability_score?: number | null
          metadata?: Json
          created_at?: string
        }
      }
      business_model_canvas: {
        Row: {
          id: string
          session_id: string
          canvas_data: Json
          template_used: string | null
          completion_percentage: number
          interactions: Json
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          canvas_data: Json
          template_used?: string | null
          completion_percentage?: number
          interactions?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          canvas_data?: Json
          template_used?: string | null
          completion_percentage?: number
          interactions?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      gamification_achievements: {
        Row: {
          id: string
          session_id: string
          achievement_type: string
          achievement_data: Json
          earned_at: string
        }
        Insert: {
          id?: string
          session_id: string
          achievement_type: string
          achievement_data: Json
          earned_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          achievement_type?: string
          achievement_data?: Json
          earned_at?: string
        }
      }


      // Assessment System
      assessments: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          assessment_type: string
          version: string
          responses: Json
          metadata: Json
          status: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          assessment_type: string
          version?: string
          responses?: Json
          metadata?: Json
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          assessment_type?: string
          version?: string
          responses?: Json
          metadata?: Json
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assessment_scores: {
        Row: {
          id: string
          assessment_id: string
          overall_score: number | null
          bracket: string | null
          category_scores: Json
          recommendations: string[] | null
          next_steps: string[] | null
          ai_insights: string | null
          confidence_score: number | null
          swot_analysis: Json
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          overall_score?: number | null
          bracket?: string | null
          category_scores?: Json
          recommendations?: string[] | null
          next_steps?: string[] | null
          ai_insights?: string | null
          confidence_score?: number | null
          swot_analysis?: Json
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          overall_score?: number | null
          bracket?: string | null
          category_scores?: Json
          recommendations?: string[] | null
          next_steps?: string[] | null
          ai_insights?: string | null
          confidence_score?: number | null
          swot_analysis?: Json
          created_at?: string
        }
      }
      assessment_invitations: {
        Row: {
          id: string
          inviter_id: string | null
          organization_id: string | null
          invitee_email: string
          invitee_name: string | null
          assessment_type: string
          invitation_token: string
          status: string
          expires_at: string
          completed_at: string | null
          custom_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inviter_id?: string | null
          organization_id?: string | null
          invitee_email: string
          invitee_name?: string | null
          assessment_type: string
          invitation_token: string
          status?: string
          expires_at: string
          completed_at?: string | null
          custom_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inviter_id?: string | null
          organization_id?: string | null
          invitee_email?: string
          invitee_name?: string | null
          assessment_type?: string
          invitation_token?: string
          status?: string
          expires_at?: string
          completed_at?: string | null
          custom_message?: string | null
          created_at?: string
        }
      }

      // Intelligence & Analytics
      market_insights: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          industry: string
          market_size: Json
          growth_rate: Json
          competition: Json
          sentiment: Json
          full_insight: string | null
          data_sources: Json
          confidence_score: number | null
          ai_model_version: string | null
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          industry: string
          market_size?: Json
          growth_rate?: Json
          competition?: Json
          sentiment?: Json
          full_insight?: string | null
          data_sources?: Json
          confidence_score?: number | null
          ai_model_version?: string | null
          source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          industry?: string
          market_size?: Json
          growth_rate?: Json
          competition?: Json
          sentiment?: Json
          full_insight?: string | null
          data_sources?: Json
          confidence_score?: number | null
          ai_model_version?: string | null
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_trends: {
        Row: {
          id: string
          title: string
          insight: string
          industry: string | null
          trend_type: string
          source: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          insight: string
          industry?: string | null
          trend_type?: string
          source?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          insight?: string
          industry?: string | null
          trend_type?: string
          source?: string
          metadata?: Json
          created_at?: string
        }
      }
      engagement_intelligence: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          signal_score: number | null
          engagement_metrics: Json
          customer_sentiment: Json
          recommendations: string[] | null
          insights: string | null
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          signal_score?: number | null
          engagement_metrics?: Json
          customer_sentiment?: Json
          recommendations?: string[] | null
          insights?: string | null
          source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          signal_score?: number | null
          engagement_metrics?: Json
          customer_sentiment?: Json
          recommendations?: string[] | null
          insights?: string | null
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
      news_feed: {
        Row: {
          id: string
          title: string
          url: string | null
          source: string | null
          published_at: string | null
          category: string | null
          relevance_score: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          url?: string | null
          source?: string | null
          published_at?: string | null
          category?: string | null
          relevance_score?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string | null
          source?: string | null
          published_at?: string | null
          category?: string | null
          relevance_score?: number | null
          metadata?: Json
          created_at?: string
        }
      }

      // Event Sourcing & Audit
      events: {
        Row: {
          id: string
          aggregate_id: string
          aggregate_type: string
          event_type: string
          event_data: Json
          version: number
          user_id: string | null
          organization_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          aggregate_id: string
          aggregate_type: string
          event_type: string
          event_data: Json
          version: number
          user_id?: string | null
          organization_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          aggregate_id?: string
          aggregate_type?: string
          event_type?: string
          event_data?: Json
          version?: number
          user_id?: string | null
          organization_id?: string | null
          created_at?: string
        }
      }
      snapshots: {
        Row: {
          id: string
          aggregate_id: string
          aggregate_type: string
          state: Json
          version: number
          created_at: string
        }
        Insert: {
          id?: string
          aggregate_id: string
          aggregate_type: string
          state: Json
          version: number
          created_at?: string
        }
        Update: {
          id?: string
          aggregate_id?: string
          aggregate_type?: string
          state?: Json
          version?: number
          created_at?: string
        }
      }
      audit_log: {
        Row: {
          id: number
          table_name: string
          operation: string
          user_id: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: number
          table_name: string
          operation: string
          user_id?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          table_name?: string
          operation?: string
          user_id?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
      }

      // Analytics & Sessions
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          event_type: string
          event_data: Json
          session_id: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          event_type: string
          event_data?: Json
          session_id?: string | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          event_type?: string
          event_data?: Json
          session_id?: string | null
          source?: string
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_token: string
          ip_address: string | null
          user_agent: string | null
          device_info: Json
          started_at: string
          ended_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_token: string
          ip_address?: string | null
          user_agent?: string | null
          device_info?: Json
          started_at?: string
          ended_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          session_token?: string
          ip_address?: string | null
          user_agent?: string | null
          device_info?: Json
          started_at?: string
          ended_at?: string | null
          is_active?: boolean
        }
      }
      dashboard_widgets: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          widget_type: string
          widget_config: Json
          position: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          widget_type: string
          widget_config?: Json
          position?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          widget_type?: string
          widget_config?: Json
          position?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // Notifications & Communication
      notifications: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          type: string
          title: string
          message: string
          priority: string
          link: string | null
          is_read: boolean
          metadata: Json
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          type: string
          title: string
          message: string
          priority?: string
          link?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          type?: string
          title?: string
          message?: string
          priority?: string
          link?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
          read_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type aliases for common patterns
export type User = Database['public']['Tables']['users']['Row']
export type Organization = Database['public']['Tables']['organizations']['Row']
export type OnboardingSession = Database['public']['Tables']['onboarding_sessions']['Row']
export type ConversationMessage = Database['public']['Tables']['conversation_messages']['Row']
export type AdaptiveQuestion = Database['public']['Tables']['adaptive_questions']['Row']
export type RealTimeInsight = Database['public']['Tables']['real_time_insights']['Row']
export type BusinessModelCanvas = Database['public']['Tables']['business_model_canvas']['Row']
export type GamificationAchievement = Database['public']['Tables']['gamification_achievements']['Row']
export type OnboardingAssessment = Database['public']['Tables']['onboarding_sessions']['Row']
export type Assessment = Database['public']['Tables']['assessments']['Row']
export type AssessmentScore = Database['public']['Tables']['assessment_scores']['Row']
export type MarketInsight = Database['public']['Tables']['market_insights']['Row']
export type BusinessTrend = Database['public']['Tables']['business_trends']['Row']
export type EngagementIntelligence = Database['public']['Tables']['engagement_intelligence']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type AuditLog = Database['public']['Tables']['audit_log']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type UserSession = Database['public']['Tables']['user_sessions']['Row']
export type DashboardWidget = Database['public']['Tables']['dashboard_widgets']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type OnboardingSessionInsert = Database['public']['Tables']['onboarding_sessions']['Insert']
export type ConversationMessageInsert = Database['public']['Tables']['conversation_messages']['Insert']
export type AdaptiveQuestionInsert = Database['public']['Tables']['adaptive_questions']['Insert']
export type RealTimeInsightInsert = Database['public']['Tables']['real_time_insights']['Insert']
export type BusinessModelCanvasInsert = Database['public']['Tables']['business_model_canvas']['Insert']
export type GamificationAchievementInsert = Database['public']['Tables']['gamification_achievements']['Insert']
export type OnboardingAssessmentInsert = Database['public']['Tables']['onboarding_sessions']['Insert']
export type AssessmentInsert = Database['public']['Tables']['assessments']['Insert']
export type AssessmentScoreInsert = Database['public']['Tables']['assessment_scores']['Insert']
export type MarketInsightInsert = Database['public']['Tables']['market_insights']['Insert']
export type BusinessTrendInsert = Database['public']['Tables']['business_trends']['Insert']
export type EngagementIntelligenceInsert = Database['public']['Tables']['engagement_intelligence']['Insert']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type AuditLogInsert = Database['public']['Tables']['audit_log']['Insert']
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert']
export type UserSessionInsert = Database['public']['Tables']['user_sessions']['Insert']
export type DashboardWidgetInsert = Database['public']['Tables']['dashboard_widgets']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']
export type OnboardingSessionUpdate = Database['public']['Tables']['onboarding_sessions']['Update']
export type ConversationMessageUpdate = Database['public']['Tables']['conversation_messages']['Update']
export type AdaptiveQuestionUpdate = Database['public']['Tables']['adaptive_questions']['Update']
export type RealTimeInsightUpdate = Database['public']['Tables']['real_time_insights']['Update']
export type BusinessModelCanvasUpdate = Database['public']['Tables']['business_model_canvas']['Update']
export type GamificationAchievementUpdate = Database['public']['Tables']['gamification_achievements']['Update']
export type OnboardingAssessmentUpdate = Database['public']['Tables']['onboarding_sessions']['Update']
export type AssessmentUpdate = Database['public']['Tables']['assessments']['Update']
export type AssessmentScoreUpdate = Database['public']['Tables']['assessment_scores']['Update']
export type MarketInsightUpdate = Database['public']['Tables']['market_insights']['Update']
export type BusinessTrendUpdate = Database['public']['Tables']['business_trends']['Update']
export type EngagementIntelligenceUpdate = Database['public']['Tables']['engagement_intelligence']['Update']
export type EventUpdate = Database['public']['Tables']['events']['Update']
export type AuditLogUpdate = Database['public']['Tables']['audit_log']['Update']
export type AnalyticsEventUpdate = Database['public']['Tables']['analytics_events']['Update']
export type UserSessionUpdate = Database['public']['Tables']['user_sessions']['Update']
export type DashboardWidgetUpdate = Database['public']['Tables']['dashboard_widgets']['Update']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'] 