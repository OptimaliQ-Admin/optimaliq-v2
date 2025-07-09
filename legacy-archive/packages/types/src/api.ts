// OptimaliQ v2 API Types
// REST API, Real-time, and GraphQL integration

import { Database } from './database';
import { AuthUser, Session } from './auth';

// Base API Response
export interface APIResponse<T = any> {
  data: T | null;
  error: APIError | null;
  meta?: APIMeta;
}

export interface APIError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
  timestamp: string;
}

export interface APIMeta {
  pagination?: PaginationMeta;
  rateLimit?: RateLimitMeta;
  timestamp: string;
  version: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface RateLimitMeta {
  limit: number;
  remaining: number;
  reset: string;
}

// API Request/Response Types
export interface APIRequest<T = any> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: T;
  timeout?: number;
}

export interface APIRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  retry?: {
    attempts: number;
    delay: number;
    backoff: 'linear' | 'exponential';
  };
}

// Authentication
export interface APIAuth {
  type: 'bearer' | 'api_key' | 'session';
  token?: string;
  apiKey?: string;
  session?: Session;
}

// REST API Endpoints
export interface RESTEndpoints {
  // Organizations
  'GET /api/organizations': {
    request: {
      params?: PaginationParams & {
        search?: string;
        status?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['organizations']['Row'][]>;
  };
  'POST /api/organizations': {
    request: {
      data: Database['public']['Tables']['organizations']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['organizations']['Row']>;
  };
  'GET /api/organizations/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['organizations']['Row']>;
  };
  'PUT /api/organizations/:id': {
    request: {
      params: { id: string };
      data: Database['public']['Tables']['organizations']['Update'];
    };
    response: APIResponse<Database['public']['Tables']['organizations']['Row']>;
  };
  'DELETE /api/organizations/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<{}>;
  };

  // Users
  'GET /api/users': {
    request: {
      params?: PaginationParams & {
        organization_id?: string;
        role?: string;
        search?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['users']['Row'][]>;
  };
  'POST /api/users': {
    request: {
      data: Database['public']['Tables']['users']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['users']['Row']>;
  };
  'GET /api/users/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['users']['Row']>;
  };
  'PUT /api/users/:id': {
    request: {
      params: { id: string };
      data: Database['public']['Tables']['users']['Update'];
    };
    response: APIResponse<Database['public']['Tables']['users']['Row']>;
  };
  'DELETE /api/users/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<{}>;
  };

  // Assessments
  'GET /api/assessments': {
    request: {
      params?: PaginationParams & {
        organization_id?: string;
        type?: string;
        status?: string;
        created_by?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['assessments']['Row'][]>;
  };
  'POST /api/assessments': {
    request: {
      data: Database['public']['Tables']['assessments']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['assessments']['Row']>;
  };
  'GET /api/assessments/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['assessments']['Row']>;
  };
  'PUT /api/assessments/:id': {
    request: {
      params: { id: string };
      data: Database['public']['Tables']['assessments']['Update'];
    };
    response: APIResponse<Database['public']['Tables']['assessments']['Row']>;
  };
  'DELETE /api/assessments/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<{}>;
  };

  // Data Sources
  'GET /api/data-sources': {
    request: {
      params?: PaginationParams & {
        organization_id?: string;
        type?: string;
        status?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['data_sources']['Row'][]>;
  };
  'POST /api/data-sources': {
    request: {
      data: Database['public']['Tables']['data_sources']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['data_sources']['Row']>;
  };
  'GET /api/data-sources/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['data_sources']['Row']>;
  };
  'PUT /api/data-sources/:id': {
    request: {
      params: { id: string };
      data: Database['public']['Tables']['data_sources']['Update'];
    };
    response: APIResponse<Database['public']['Tables']['data_sources']['Row']>;
  };
  'DELETE /api/data-sources/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<{}>;
  };

  // Data Points
  'GET /api/data-points': {
    request: {
      params?: PaginationParams & {
        organization_id?: string;
        data_source_id?: string;
        metric_name?: string;
        start_date?: string;
        end_date?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['data_points']['Row'][]>;
  };
  'POST /api/data-points': {
    request: {
      data: Database['public']['Tables']['data_points']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['data_points']['Row']>;
  };
  'GET /api/data-points/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['data_points']['Row']>;
  };

  // AI Insights
  'GET /api/ai-insights': {
    request: {
      params?: PaginationParams & {
        organization_id?: string;
        type?: string;
        priority?: string;
        status?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['ai_insights']['Row'][]>;
  };
  'POST /api/ai-insights': {
    request: {
      data: Database['public']['Tables']['ai_insights']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['ai_insights']['Row']>;
  };
  'GET /api/ai-insights/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['ai_insights']['Row']>;
  };
  'PUT /api/ai-insights/:id': {
    request: {
      params: { id: string };
      data: Database['public']['Tables']['ai_insights']['Update'];
    };
    response: APIResponse<Database['public']['Tables']['ai_insights']['Row']>;
  };

  // Dashboards
  'GET /api/dashboards': {
    request: {
      params?: PaginationParams & {
        organization_id?: string;
        is_public?: boolean;
        created_by?: string;
      };
    };
    response: APIResponse<Database['public']['Tables']['dashboards']['Row'][]>;
  };
  'POST /api/dashboards': {
    request: {
      data: Database['public']['Tables']['dashboards']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['dashboards']['Row']>;
  };
  'GET /api/dashboards/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['dashboards']['Row']>;
  };
  'PUT /api/dashboards/:id': {
    request: {
      params: { id: string };
      data: Database['public']['Tables']['dashboards']['Update'];
    };
    response: APIResponse<Database['public']['Tables']['dashboards']['Row']>;
  };
  'DELETE /api/dashboards/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<{}>;
  };

  // Notifications
  'GET /api/notifications': {
    request: {
      params?: PaginationParams & {
        user_id?: string;
        type?: string;
        read?: boolean;
      };
    };
    response: APIResponse<Database['public']['Tables']['notifications']['Row'][]>;
  };
  'POST /api/notifications': {
    request: {
      data: Database['public']['Tables']['notifications']['Insert'];
    };
    response: APIResponse<Database['public']['Tables']['notifications']['Row']>;
  };
  'PUT /api/notifications/:id/read': {
    request: {
      params: { id: string };
    };
    response: APIResponse<Database['public']['Tables']['notifications']['Row']>;
  };
  'DELETE /api/notifications/:id': {
    request: {
      params: { id: string };
    };
    response: APIResponse<{}>;
  };
}

// Real-time API Types
export interface RealtimeSubscription {
  id: string;
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
}

export interface RealtimeMessage<T = any> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: T;
  old_record?: T;
  errors: any[] | null;
}

export interface RealtimeConfig {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  heartbeatIntervalMs?: number;
  reconnectAfterMs?: number;
  maxRetries?: number;
}

// GraphQL Types
export interface GraphQLRequest<T = any> {
  query: string;
  variables?: T;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, any>;
}

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: Record<string, any>;
}

// WebSocket Types
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

// API Client Types
export interface APIClient {
  request<T = any>(config: APIRequest<T>): Promise<APIResponse<T>>;
  get<T = any>(url: string, config?: Partial<APIRequest<T>>): Promise<APIResponse<T>>;
  post<T = any>(url: string, data?: T, config?: Partial<APIRequest<T>>): Promise<APIResponse<T>>;
  put<T = any>(url: string, data?: T, config?: Partial<APIRequest<T>>): Promise<APIResponse<T>>;
  patch<T = any>(url: string, data?: T, config?: Partial<APIRequest<T>>): Promise<APIResponse<T>>;
  delete<T = any>(url: string, config?: Partial<APIRequest<T>>): Promise<APIResponse<T>>;
  setAuth(auth: APIAuth): void;
  setBaseURL(url: string): void;
  setDefaultHeaders(headers: Record<string, string>): void;
}

// Real-time Client Types
export interface RealtimeClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe<T = any>(
    subscription: RealtimeSubscription,
    callback: (message: RealtimeMessage<T>) => void
  ): Promise<string>;
  unsubscribe(subscriptionId: string): Promise<void>;
  on(event: 'connected' | 'disconnected' | 'error', callback: (data: any) => void): void;
  off(event: 'connected' | 'disconnected' | 'error', callback: (data: any) => void): void;
}

// WebSocket Client Types
export interface WebSocketClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send<T = any>(message: WebSocketMessage<T>): Promise<void>;
  on(event: 'open' | 'message' | 'close' | 'error', callback: (data: any) => void): void;
  off(event: 'open' | 'message' | 'close' | 'error', callback: (data: any) => void): void;
}

// API Hooks Types
export interface UseAPIQueryOptions<T = any> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number;
  retry?: number | boolean;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: APIError) => void;
  onSettled?: (data: T | null, error: APIError | null) => void;
}

export interface UseAPIMutationOptions<T = any, V = any> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: APIError, variables: V) => void;
  onSettled?: (data: T | null, error: APIError | null, variables: V) => void;
  retry?: number | boolean;
  retryDelay?: number;
}

export interface UseAPIQueryReturn<T = any> {
  data: T | null;
  error: APIError | null;
  loading: boolean;
  refetch: () => Promise<void>;
  isFetching: boolean;
  isStale: boolean;
}

export interface UseAPIMutationReturn<T = any, V = any> {
  mutate: (variables: V) => Promise<void>;
  mutateAsync: (variables: V) => Promise<T>;
  data: T | null;
  error: APIError | null;
  loading: boolean;
  reset: () => void;
}

// API Error Codes
export const APIErrorCode = {
  // Authentication Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Business Logic Errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ORGANIZATION_SUSPENDED: 'ORGANIZATION_SUSPENDED',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
} as const;

export type APIErrorCode = typeof APIErrorCode[keyof typeof APIErrorCode];

// HTTP Status Codes
export const HTTPStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HTTPStatus = typeof HTTPStatus[keyof typeof HTTPStatus];

// API Constants
export const API_VERSION = 'v1';
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_RETRY_ATTEMPTS = 3;
export const DEFAULT_RETRY_DELAY = 1000; // 1 second

// Utility Types
export type EndpointKey = keyof RESTEndpoints;
export type EndpointRequest<T extends EndpointKey> = RESTEndpoints[T]['request'];
export type EndpointResponse<T extends EndpointKey> = RESTEndpoints[T]['response'];

// Type Guards
export function isAPIError(value: any): value is APIError {
  return value && typeof value.message === 'string' && typeof value.code === 'string';
}

export function isAPIResponse<T>(value: any): value is APIResponse<T> {
  return value && (value.data !== undefined || value.error !== undefined);
}

export function isRealtimeMessage<T>(value: any): value is RealtimeMessage<T> {
  return value && typeof value.type === 'string' && typeof value.table === 'string';
}

export function isGraphQLResponse<T>(value: any): value is GraphQLResponse<T> {
  return value && (value.data !== undefined || value.errors !== undefined);
}

// API Event Types
export interface APIEvent {
  type: 'request' | 'response' | 'error' | 'retry';
  url: string;
  method: string;
  timestamp: string;
  duration?: number;
  status?: number;
  error?: APIError;
}

export type APIEventListener = (event: APIEvent) => void;

// API Middleware Types
export interface APIMiddleware {
  name: string;
  handler: (request: APIRequest, next: () => Promise<APIResponse>) => Promise<APIResponse>;
}

export interface APIMiddlewareConfig {
  middlewares: APIMiddleware[];
  order?: 'before' | 'after';
} 