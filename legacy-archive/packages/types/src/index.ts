// OptimaliQ v2 Types Package
// Comprehensive type definitions for the enterprise business intelligence platform

// Database Types
export * from './database';

// Authentication Types
export * from './auth';

// API Types
export * from './api';

// Re-export commonly used types for convenience
export type {
  // Database
  Organization,
  User,
  TeamMember,
  Assessment,
  AssessmentResponse,
  DataSource,
  DataPoint,
  AIInsight,
  AIModel,
  Dashboard,
  DashboardWidget,
  Notification,
  AuditLog,
  APIKey,
  Webhook,
  WebhookDelivery,
} from './database';

export type {
  // Auth
  AuthUser,
  Session,
  AuthError,
  SignUpRequest,
  SignInRequest,
  PasswordResetRequest,
  ProfileUpdateRequest,
  Permission,
  Role,
  RBACPolicy,
  AuthContextValue,
  UseAuthReturn,
  AuthGuardProps,
} from './auth';

export type {
  // API
  APIResponse,
  APIError,
  APIRequest,
  PaginationParams,
  RealtimeSubscription,
  RealtimeMessage,
  GraphQLRequest,
  GraphQLResponse,
  WebSocketMessage,
  APIClient,
  RealtimeClient,
  WebSocketClient,
  UseAPIQueryReturn,
  UseAPIMutationReturn,
} from './api';

// Re-export constants
export {
  UserRole,
  SubscriptionTier,
  AssessmentStatus,
  InsightType,
  DataSourceType,
  NotificationType,
  Priority,
  Status,
} from './database';

export {
  AuthEventType,
  MFAFactorType,
  OrganizationMembershipStatus,
  AuthFlowType,
} from './auth';

export {
  APIErrorCode,
  HTTPStatus,
  API_VERSION,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY_ATTEMPTS,
  DEFAULT_RETRY_DELAY,
} from './api';

// Re-export type guards
export {
  isUserRole,
  isSubscriptionTier,
  isAssessmentStatus,
  isInsightType,
  isDataSourceType,
  isNotificationType,
  isPriority,
  isStatus,
} from './database';

export {
  isAuthUser,
  isSession,
  isAuthError,
} from './auth';

export {
  isAPIError,
  isAPIResponse,
  isRealtimeMessage,
  isGraphQLResponse,
} from './api';

// Utility types for common patterns
export type Database = import('./database').Database;
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Common response patterns
export interface SuccessResponse<T = any> {
  data: T;
  error: null;
}

export interface ErrorResponse {
  data: null;
  error: {
    message: string;
    code: string;
    status: number;
    details?: Record<string, any>;
  };
}

export type ApiResult<T = any> = SuccessResponse<T> | ErrorResponse;

// Pagination helpers
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Real-time helpers
export interface RealtimeConfig {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  heartbeatIntervalMs?: number;
  reconnectAfterMs?: number;
  maxRetries?: number;
}

// WebSocket helpers
export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Event types
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface UserEvent extends BaseEvent {
  user_id: string;
  organization_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
}

export interface SystemEvent extends BaseEvent {
  component: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: Record<string, any>;
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  auth: {
    autoRefreshToken: boolean;
    persistSession: boolean;
    detectSessionInUrl: boolean;
  };
  realtime: {
    enabled: boolean;
    url: string;
    heartbeatInterval: number;
    reconnectInterval: number;
  };
  features: {
    ai: boolean;
    realtime: boolean;
    analytics: boolean;
    collaboration: boolean;
  };
}

// Theme and UI types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Form types
export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'datetime';
  value: T;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: T) => string | null;
  };
  error?: string;
}

export interface FormConfig<T = Record<string, any>> {
  fields: FormField[];
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Toast notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retry?: () => void;
}

// Search and filter types
export interface SearchParams {
  query: string;
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'dateRange' | 'number' | 'numberRange';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

// Export everything as default for convenience
export default {
  // Re-export all named exports
  ...require('./database'),
  ...require('./auth'),
  ...require('./api'),
}; 