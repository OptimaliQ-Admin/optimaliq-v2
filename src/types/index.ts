// Core User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  companySize?: CompanySize;
  revenueRange?: RevenueRange;
  industry?: Industry;
  timezone?: string;
  linkedinUrl?: string;
  agreedTerms: boolean;
  agreedMarketing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  scoreOverall: number;
  scoreStrategy: number;
  scoreProcess: number;
  scoreTechnology: number;
  bpmScore?: number;
  salesScore?: number;
  aiReadinessScore?: number;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  industry: Industry;
  companySize: CompanySize;
  revenueRange: RevenueRange;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Assessment Types
export interface Assessment {
  id: string;
  userId: string;
  type: AssessmentType;
  status: AssessmentStatus;
  payload: Record<string, any>;
  score?: number;
  breakdown?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface AssessmentTemplate {
  id: string;
  type: AssessmentType;
  name: string;
  description: string;
  questions: Question[];
  scoringRules: ScoringRule[];
  industry?: Industry;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  weight: number;
  category: string;
  required: boolean;
  order: number;
}

// AI and Intelligence Types
export interface AIModel {
  id: string;
  provider: AIProvider;
  model: string;
  version: string;
  capabilities: AICapability[];
  costPerToken: number;
  maxTokens: number;
  isActive: boolean;
}

export interface AIResponse {
  id: string;
  modelId: string;
  prompt: string;
  response: string;
  tokensUsed: number;
  cost: number;
  latency: number;
  createdAt: Date;
}

export interface MarketInsight {
  id: string;
  industry: Industry;
  title: string;
  summary: string;
  content: string;
  sources: Source[];
  relevance: number;
  expiresAt: Date;
  createdAt: Date;
}

// Growth and Analytics Types
export interface GrowthLever {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  impact: number;
  effort: number;
  priority: number;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface DashboardInsight {
  id: string;
  userId: string;
  score: number;
  strategy: number;
  process: number;
  technology: number;
  roadmap: RoadmapItem[];
  benchmarks: Benchmark[];
  trends: Trend[];
  createdAt: Date;
  updatedAt: Date;
}

// Team and Collaboration Types
export interface TeamMember {
  id: string;
  organizationId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  role: TeamRole;
  isActive: boolean;
  invitedAt: Date;
  joinedAt?: Date;
}

export interface AssessmentCampaign {
  id: string;
  organizationId: string;
  ownerId: string;
  title: string;
  description: string;
  assessmentType: AssessmentType;
  status: CampaignStatus;
  startsAt: Date;
  dueAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription and Billing Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum CompanySize {
  MICRO = '1-10',
  SMALL = '11-50',
  MEDIUM = '51-200',
  LARGE = '201-1000',
  ENTERPRISE = '1000+'
}

export enum RevenueRange {
  UNDER_1M = 'Under $1M',
  ONE_TO_10M = '$1M - $10M',
  TEN_TO_50M = '$10M - $50M',
  FIFTY_TO_100M = '$50M - $100M',
  OVER_100M = 'Over $100M'
}

export enum Industry {
  TECHNOLOGY = 'Technology',
  HEALTHCARE = 'Healthcare',
  FINANCIAL_SERVICES = 'Financial Services',
  MANUFACTURING = 'Manufacturing',
  RETAIL = 'Retail',
  CONSULTING = 'Consulting',
  NON_PROFIT = 'Non-Profit',
  EDUCATION = 'Education',
  REAL_ESTATE = 'Real Estate',
  OTHER = 'Other'
}

export enum AssessmentType {
  ONBOARDING = 'onboarding',
  BPM = 'bpm',
  SALES_PERFORMANCE = 'sales_performance',
  AI_READINESS = 'ai_readiness',
  STRATEGY = 'strategy',
  PROCESS = 'process',
  TECHNOLOGY = 'technology'
}

export enum AssessmentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SCALE = 'scale',
  TEXT = 'text',
  BOOLEAN = 'boolean',
  RANKING = 'ranking'
}

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  MISTRAL = 'mistral'
}

export enum AICapability {
  TEXT_GENERATION = 'text_generation',
  EMBEDDINGS = 'embeddings',
  CLASSIFICATION = 'classification',
  SUMMARIZATION = 'summarization',
  TRANSLATION = 'translation'
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum SubscriptionPlan {
  FREE = 'free',
  ACCELERATOR = 'accelerator',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  TRIAL = 'trial'
}

// Utility Types
export interface Source {
  url: string;
  title: string;
  author?: string;
  publishedAt?: Date;
  domain: string;
}

export interface ScoringRule {
  category: string;
  weight: number;
  algorithm: string;
  parameters: Record<string, any>;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  effort: number;
  timeline: number;
  dependencies: string[];
  isCompleted: boolean;
}

export interface Benchmark {
  category: string;
  userScore: number;
  industryAverage: number;
  topPerformers: number;
  percentile: number;
}

export interface Trend {
  category: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  confidence: number;
  description: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date';
  required: boolean;
  validation?: ValidationRule[];
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Configuration Types
export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  stripePublishableKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  googleApiKey: string;
  mistralApiKey: string;
  recaptchaSiteKey: string;
}
