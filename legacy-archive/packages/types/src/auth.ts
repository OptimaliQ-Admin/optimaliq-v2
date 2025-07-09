// Authentication Types for OptimaliQ v2

import { User } from './database';

// Authentication Types for OptimaliQ v2

export interface AuthUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string | null;
  phone_confirmed_at: string | null;
  confirmation_sent_at: string | null;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    organization_id?: string;
  };
  identities: AuthIdentity[];
  created_at: string;
  updated_at: string;
}

export interface AuthIdentity {
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthError {
  message: string;
  status?: number;
  name?: string;
  stack?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  organization_slug?: string;
  redirect_to?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  remember?: boolean;
  redirect_to?: string;
}

export interface PasswordResetRequest {
  email: string;
  redirect_to?: string;
}

export interface PasswordUpdateRequest {
  password: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface OrganizationInviteRequest {
  email: string;
  role?: string;
  organization_id: string;
  redirect_to?: string;
}

export interface TeamMemberInviteRequest {
  email: string;
  role?: string;
  permissions?: Record<string, any>;
  organization_id: string;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'saml' | 'oidc';
  enabled: boolean;
  config: Record<string, any>;
}

export interface OAuthProviderConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
  authorization_url: string;
  token_url: string;
  userinfo_url: string;
}

export interface SAMLProviderConfig {
  entity_id: string;
  sso_url: string;
  x509_cert: string;
  name_id_format: string;
  attribute_mapping: Record<string, string>;
}

export interface OIDCProviderConfig {
  client_id: string;
  client_secret: string;
  issuer: string;
  redirect_uri: string;
  scopes: string[];
}

export interface MFAFactor {
  id: string;
  friendly_name: string;
  factor_type: 'totp' | 'webauthn';
  status: 'verified' | 'unverified';
  created_at: string;
  updated_at: string;
}

export interface MFASetupRequest {
  factor_type: 'totp' | 'webauthn';
  friendly_name?: string;
}

export interface MFAVerifyRequest {
  factor_id: string;
  code?: string;
  challenge_id?: string;
}

export interface WebAuthnRegistration {
  id: string;
  user_id: string;
  credential_id: string;
  public_key: string;
  sign_count: number;
  friendly_name: string;
  created_at: string;
}

export interface APIKeyAuth {
  key: string;
  organization_id: string;
  permissions: Record<string, any>;
  expires_at?: string;
}

export interface JWTPayload {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  phone: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    organization_id?: string;
  };
  role: string;
  aal: string;
  amr: Array<{ method: string; timestamp: number }>;
  session_id: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (request: SignUpRequest) => Promise<{ data: { user: AuthUser | null; session: Session | null } | null; error: AuthError | null }>;
  signIn: (request: SignInRequest) => Promise<{ data: { user: AuthUser | null; session: Session | null } | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (request: PasswordResetRequest) => Promise<{ data: {} | null; error: AuthError | null }>;
  updatePassword: (request: PasswordUpdateRequest) => Promise<{ data: { user: AuthUser | null } | null; error: AuthError | null }>;
  updateProfile: (request: ProfileUpdateRequest) => Promise<{ data: { user: AuthUser | null } | null; error: AuthError | null }>;
  refreshSession: () => Promise<{ data: { session: Session | null } | null; error: AuthError | null }>;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface RBACPolicy {
  id: string;
  name: string;
  description?: string;
  effect: 'allow' | 'deny';
  resources: string[];
  actions: string[];
  conditions?: Record<string, any>;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthEvent {
  type: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'USER_DELETED';
  session?: Session;
  user?: AuthUser;
  timestamp: string;
}

export type AuthEventListener = (event: AuthEvent, session: Session | null) => void;

export interface AuthConfig {
  autoRefreshToken: boolean;
  persistSession: boolean;
  detectSessionInUrl: boolean;
  flowType: 'pkce' | 'implicit';
  debug: boolean;
  storage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
}

export interface OrganizationMembership {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  invited_by?: string;
  invited_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SSOConfig {
  id: string;
  organization_id: string;
  provider: string;
  enabled: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AuthAuditLog {
  id: string;
  user_id: string;
  organization_id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export function isAuthUser(value: any): value is AuthUser {
  return value && typeof value.id === 'string' && typeof value.email === 'string';
}

export function isSession(value: any): value is Session {
  return value && typeof value.access_token === 'string' && isAuthUser(value.user);
}

export function isAuthError(value: any): value is AuthError {
  return value && typeof value.message === 'string';
}

export const AuthEventType = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
} as const;

export const MFAFactorType = {
  TOTP: 'totp',
  WEBAUTHN: 'webauthn',
} as const;

export const OrganizationMembershipStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

export const AuthFlowType = {
  PKCE: 'pkce',
  IMPLICIT: 'implicit',
} as const;

export type AuthEventType = typeof AuthEventType[keyof typeof AuthEventType];
export type MFAFactorType = typeof MFAFactorType[keyof typeof MFAFactorType];
export type OrganizationMembershipStatus = typeof OrganizationMembershipStatus[keyof typeof OrganizationMembershipStatus];
export type AuthFlowType = typeof AuthFlowType[keyof typeof AuthFlowType];

export interface ExtendedUser extends User {
  auth_user?: AuthUser;
  organization_membership?: OrganizationMembership;
  permissions?: Permission[];
  roles?: Role[];
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: AuthError | null;
}

export interface AuthSuccessResponse<T = any> {
  data: T;
  error: null;
}

export interface AuthErrorResponse {
  data: null;
  error: AuthError;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (request: SignUpRequest) => Promise<AuthResponse<{ user: AuthUser | null; session: Session | null }>>;
  signIn: (request: SignInRequest) => Promise<AuthResponse<{ user: AuthUser | null; session: Session | null }>>;
  signOut: () => Promise<AuthResponse<{}>>;
  resetPassword: (request: PasswordResetRequest) => Promise<AuthResponse<{}>>;
  updatePassword: (request: PasswordUpdateRequest) => Promise<AuthResponse<{ user: AuthUser | null }>>;
  updateProfile: (request: ProfileUpdateRequest) => Promise<AuthResponse<{ user: AuthUser | null }>>;
  refreshSession: () => Promise<AuthResponse<{ session: Session | null }>>;
}

export interface AuthMiddlewareConfig {
  requireAuth: boolean;
  requireRole?: string[];
  requirePermission?: string[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  config?: AuthMiddlewareConfig;
  fallback?: React.ReactNode;
} 