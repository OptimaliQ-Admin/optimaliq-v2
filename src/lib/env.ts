import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // AI Providers
  OPENAI_API_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  VERTEX_PROJECT_ID: z.string().min(1).optional(),
  MISTRAL_API_KEY: z.string().min(1).optional(),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  // External APIs
  FINNHUB_API_KEY: z.string().min(1).optional(),
  NEWS_API_KEY: z.string().min(1).optional(),

  // Security
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1).optional(),
  RECAPTCHA_SECRET_KEY: z.string().min(1).optional(),

  // Application
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().min(1).optional(),

  // Feature Flags
  ENABLE_AI_FEATURES: z.string().transform(val => val === 'true').default('true'),
  ENABLE_TEAM_FEATURES: z.string().transform(val => val === 'true').default('true'),
  ENABLE_MARKET_INTELLIGENCE: z.string().transform(val => val === 'true').default('true'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),

  // Optional Services
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.string().transform(val => parseInt(val, 10)).optional(),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
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
  ai: env.ENABLE_AI_FEATURES,
  team: env.ENABLE_TEAM_FEATURES,
  marketIntelligence: env.ENABLE_MARKET_INTELLIGENCE,
  analytics: env.ENABLE_ANALYTICS,
} as const;
