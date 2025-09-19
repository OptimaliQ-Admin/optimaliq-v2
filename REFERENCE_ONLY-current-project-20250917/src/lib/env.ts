import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Public (sent to the browser)
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK: z.string().optional(),
  NEXT_PUBLIC_MARKET_AGENTIC: z.string().optional(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),

  // AI providers
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  MISTRAL_API_KEY: z.string().optional(),
  VERTEX_PROJECT_ID: z.string().optional(),

  // Market / news / RAG
  ALPHA_VANTAGE_API_KEY: z.string().optional(),
  FINNHUB_API_KEY: z.string().optional(),
  NEWSAPI_KEY: z.string().optional(),
  MARKET_AGENT_TTL_MIN: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ACCELERATOR_MONTHLY: z.string().optional(),
  STRIPE_PRICE_ACCELERATOR_ANNUAL: z.string().optional(),

  // Supabase / Postgres
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
  POSTGRES_URL: z.string().optional(),
  POSTGRES_PRISMA_URL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),

  // Jobs / misc
  CRON_SECRET: z.string().optional(),

  // Legacy support
  NODE_ENV: z.enum(['development', 'staging', 'production']).optional().default('development'),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Environment validation failed. Check your .env.local file.');
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type for environment variables
export type Env = z.infer<typeof envSchema>;

// Helper functions
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isStaging = env.NODE_ENV === 'staging';

// Feature flags
export const features = {
  ai: false, // AI features disabled until API keys are provided
  team: true, // Team features are always enabled
  marketIntelligence: false, // Market intelligence disabled until API keys are provided
  analytics: true, // Analytics are always enabled
} as const;
