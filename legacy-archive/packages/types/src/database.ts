// OptimaliQ v2 Database Types
// Generated from PostgreSQL schema

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: OrganizationInsert;
        Update: OrganizationUpdate;
      };
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      team_members: {
        Row: TeamMember;
        Insert: TeamMemberInsert;
        Update: TeamMemberUpdate;
      };
      assessments: {
        Row: Assessment;
        Insert: AssessmentInsert;
        Update: AssessmentUpdate;
      };
      assessment_responses: {
        Row: AssessmentResponse;
        Insert: AssessmentResponseInsert;
        Update: AssessmentResponseUpdate;
      };
      data_sources: {
        Row: DataSource;
        Insert: DataSourceInsert;
        Update: DataSourceUpdate;
      };
      data_points: {
        Row: DataPoint;
        Insert: DataPointInsert;
        Update: DataPointUpdate;
      };
      ai_insights: {
        Row: AIInsight;
        Insert: AIInsightInsert;
        Update: AIInsightUpdate;
      };
      ai_models: {
        Row: AIModel;
        Insert: AIModelInsert;
        Update: AIModelUpdate;
      };
      dashboards: {
        Row: Dashboard;
        Insert: DashboardInsert;
        Update: DashboardUpdate;
      };
      dashboard_widgets: {
        Row: DashboardWidget;
        Insert: DashboardWidgetInsert;
        Update: DashboardWidgetUpdate;
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
      };
      api_keys: {
        Row: APIKey;
        Insert: APIKeyInsert;
        Update: APIKeyUpdate;
      };
      webhooks: {
        Row: Webhook;
        Insert: WebhookInsert;
        Update: WebhookUpdate;
      };
      webhook_deliveries: {
        Row: WebhookDelivery;
        Insert: WebhookDeliveryInsert;
        Update: WebhookDeliveryUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_organization_with_user: {
        Args: {
          org_name: string;
          org_slug: string;
          user_email: string;
          user_first_name: string;
          user_last_name: string;
        };
        Returns: string;
      };
      update_updated_at_column: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Core Types

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  logo_url: string | null;
  settings: Record<string, any>;
  subscription_tier: string;
  subscription_status: string;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationInsert {
  id?: string;
  name: string;
  slug: string;
  domain?: string | null;
  industry?: string | null;
  size?: string | null;
  logo_url?: string | null;
  settings?: Record<string, any>;
  subscription_tier?: string;
  subscription_status?: string;
  trial_ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationUpdate {
  id?: string;
  name?: string;
  slug?: string;
  domain?: string | null;
  industry?: string | null;
  size?: string | null;
  logo_url?: string | null;
  settings?: Record<string, any>;
  subscription_tier?: string;
  subscription_status?: string;
  trial_ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string;
  organization_id: string;
  settings: Record<string, any>;
  last_login_at: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  id?: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  role?: string;
  organization_id: string;
  settings?: Record<string, any>;
  last_login_at?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserUpdate {
  id?: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  role?: string;
  organization_id?: string;
  settings?: Record<string, any>;
  last_login_at?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>;
  invited_by: string | null;
  invited_at: string;
  accepted_at: string | null;
  status: string;
}

export interface TeamMemberInsert {
  id?: string;
  organization_id: string;
  user_id: string;
  role?: string;
  permissions?: Record<string, any>;
  invited_by?: string | null;
  invited_at?: string;
  accepted_at?: string | null;
  status?: string;
}

export interface TeamMemberUpdate {
  id?: string;
  organization_id?: string;
  user_id?: string;
  role?: string;
  permissions?: Record<string, any>;
  invited_by?: string | null;
  invited_at?: string;
  accepted_at?: string | null;
  status?: string;
}

export interface Assessment {
  id: string;
  organization_id: string;
  name: string;
  type: string;
  status: string;
  config: Record<string, any>;
  results: Record<string, any> | null;
  score: number | null;
  completed_at: string | null;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentInsert {
  id?: string;
  organization_id: string;
  name: string;
  type: string;
  status?: string;
  config: Record<string, any>;
  results?: Record<string, any> | null;
  score?: number | null;
  completed_at?: string | null;
  expires_at?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  type?: string;
  status?: string;
  config?: Record<string, any>;
  results?: Record<string, any> | null;
  score?: number | null;
  completed_at?: string | null;
  expires_at?: string | null;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  user_id: string;
  question_id: string;
  response: Record<string, any>;
  score: number | null;
  created_at: string;
}

export interface AssessmentResponseInsert {
  id?: string;
  assessment_id: string;
  user_id: string;
  question_id: string;
  response: Record<string, any>;
  score?: number | null;
  created_at?: string;
}

export interface AssessmentResponseUpdate {
  id?: string;
  assessment_id?: string;
  user_id?: string;
  question_id?: string;
  response?: Record<string, any>;
  score?: number | null;
  created_at?: string;
}

export interface DataSource {
  id: string;
  organization_id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  status: string;
  last_sync_at: string | null;
  sync_frequency: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DataSourceInsert {
  id?: string;
  organization_id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  status?: string;
  last_sync_at?: string | null;
  sync_frequency?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface DataSourceUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  type?: string;
  config?: Record<string, any>;
  status?: string;
  last_sync_at?: string | null;
  sync_frequency?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DataPoint {
  id: string;
  organization_id: string;
  data_source_id: string;
  metric_name: string;
  value: number;
  unit: string | null;
  timestamp: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DataPointInsert {
  id?: string;
  organization_id: string;
  data_source_id: string;
  metric_name: string;
  value: number;
  unit?: string | null;
  timestamp: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface DataPointUpdate {
  id?: string;
  organization_id?: string;
  data_source_id?: string;
  metric_name?: string;
  value?: number;
  unit?: string | null;
  timestamp?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface AIInsight {
  id: string;
  organization_id: string;
  type: string;
  title: string;
  content: string;
  confidence: number | null;
  priority: string;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIInsightInsert {
  id?: string;
  organization_id: string;
  type: string;
  title: string;
  content: string;
  confidence?: number | null;
  priority?: string;
  status?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AIInsightUpdate {
  id?: string;
  organization_id?: string;
  type?: string;
  title?: string;
  content?: string;
  confidence?: number | null;
  priority?: string;
  status?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AIModel {
  id: string;
  organization_id: string;
  name: string;
  type: string;
  version: string;
  config: Record<string, any>;
  performance_metrics: Record<string, any> | null;
  status: string;
  deployed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIModelInsert {
  id?: string;
  organization_id: string;
  name: string;
  type: string;
  version: string;
  config: Record<string, any>;
  performance_metrics?: Record<string, any> | null;
  status?: string;
  deployed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AIModelUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  type?: string;
  version?: string;
  config?: Record<string, any>;
  performance_metrics?: Record<string, any> | null;
  status?: string;
  deployed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Dashboard {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  layout: Record<string, any>;
  config: Record<string, any>;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardInsert {
  id?: string;
  organization_id: string;
  name: string;
  description?: string | null;
  layout: Record<string, any>;
  config?: Record<string, any>;
  is_public?: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  description?: string | null;
  layout?: Record<string, any>;
  config?: Record<string, any>;
  is_public?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardWidget {
  id: string;
  dashboard_id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  position: Record<string, any>;
  size: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidgetInsert {
  id?: string;
  dashboard_id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  position: Record<string, any>;
  size: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardWidgetUpdate {
  id?: string;
  dashboard_id?: string;
  type?: string;
  title?: string;
  config?: Record<string, any>;
  position?: Record<string, any>;
  size?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

export interface NotificationInsert {
  id?: string;
  organization_id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string | null;
  created_at?: string;
}

export interface NotificationUpdate {
  id?: string;
  organization_id?: string;
  user_id?: string;
  type?: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
  read_at?: string | null;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogInsert {
  id?: string;
  organization_id: string;
  user_id?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details?: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

export interface AuditLogUpdate {
  id?: string;
  organization_id?: string;
  user_id?: string | null;
  action?: string;
  resource_type?: string;
  resource_id?: string | null;
  details?: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

export interface APIKey {
  id: string;
  organization_id: string;
  name: string;
  key_hash: string;
  permissions: Record<string, any>;
  last_used_at: string | null;
  expires_at: string | null;
  created_by: string;
  created_at: string;
}

export interface APIKeyInsert {
  id?: string;
  organization_id: string;
  name: string;
  key_hash: string;
  permissions?: Record<string, any>;
  last_used_at?: string | null;
  expires_at?: string | null;
  created_by: string;
  created_at?: string;
}

export interface APIKeyUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  key_hash?: string;
  permissions?: Record<string, any>;
  last_used_at?: string | null;
  expires_at?: string | null;
  created_by?: string;
  created_at?: string;
}

export interface Webhook {
  id: string;
  organization_id: string;
  name: string;
  url: string;
  events: Record<string, any>;
  secret: string | null;
  status: string;
  last_triggered_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookInsert {
  id?: string;
  organization_id: string;
  name: string;
  url: string;
  events: Record<string, any>;
  secret?: string | null;
  status?: string;
  last_triggered_at?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  url?: string;
  events?: Record<string, any>;
  secret?: string | null;
  status?: string;
  last_triggered_at?: string | null;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event: string;
  payload: Record<string, any>;
  response_status: number | null;
  response_body: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface WebhookDeliveryInsert {
  id?: string;
  webhook_id: string;
  event: string;
  payload: Record<string, any>;
  response_status?: number | null;
  response_body?: string | null;
  duration_ms?: number | null;
  created_at?: string;
}

export interface WebhookDeliveryUpdate {
  id?: string;
  webhook_id?: string;
  event?: string;
  payload?: Record<string, any>;
  response_status?: number | null;
  response_body?: string | null;
  duration_ms?: number | null;
  created_at?: string;
}

// Helper Types

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Common Enums and Constants

export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export const SubscriptionTier = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const;

export const AssessmentStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const InsightType = {
  TREND: 'trend',
  ANOMALY: 'anomaly',
  OPPORTUNITY: 'opportunity',
  RISK: 'risk',
  BENCHMARK: 'benchmark',
} as const;

export const DataSourceType = {
  MANUAL: 'manual',
  API: 'api',
  WEBHOOK: 'webhook',
  SCHEDULED: 'scheduled',
  REAL_TIME: 'real_time',
} as const;

export const NotificationType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const Status = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

// Type Guards

export function isUserRole(value: string): value is typeof UserRole[keyof typeof UserRole] {
  return Object.values(UserRole).includes(value as any);
}

export function isSubscriptionTier(value: string): value is typeof SubscriptionTier[keyof typeof SubscriptionTier] {
  return Object.values(SubscriptionTier).includes(value as any);
}

export function isAssessmentStatus(value: string): value is typeof AssessmentStatus[keyof typeof AssessmentStatus] {
  return Object.values(AssessmentStatus).includes(value as any);
}

export function isInsightType(value: string): value is typeof InsightType[keyof typeof InsightType] {
  return Object.values(InsightType).includes(value as any);
}

export function isDataSourceType(value: string): value is typeof DataSourceType[keyof typeof DataSourceType] {
  return Object.values(DataSourceType).includes(value as any);
}

export function isNotificationType(value: string): value is typeof NotificationType[keyof typeof NotificationType] {
  return Object.values(NotificationType).includes(value as any);
}

export function isPriority(value: string): value is typeof Priority[keyof typeof Priority] {
  return Object.values(Priority).includes(value as any);
}

export function isStatus(value: string): value is typeof Status[keyof typeof Status] {
  return Object.values(Status).includes(value as any);
} 