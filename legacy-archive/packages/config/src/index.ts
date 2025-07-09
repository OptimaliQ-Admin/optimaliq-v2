// OptimaliQ v2 Configuration Package
// Environment variables and application configuration

export interface EnvironmentConfig {
  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  
  // Application Configuration
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
    baseUrl: string;
  };
  
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    rateLimit: {
      requests: number;
      window: number; // seconds
    };
  };
  
  // Authentication Configuration
  auth: {
    autoRefreshToken: boolean;
    persistSession: boolean;
    detectSessionInUrl: boolean;
    flowType: 'pkce' | 'implicit';
    redirectTo: string;
  };
  
  // Real-time Configuration
  realtime: {
    enabled: boolean;
    url: string;
    heartbeatInterval: number;
    reconnectInterval: number;
    maxRetries: number;
  };
  
  // AI Configuration
  ai: {
    enabled: boolean;
    provider: 'openai' | 'anthropic' | 'azure' | 'custom';
    apiKey?: string;
    endpoint?: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  
  // Database Configuration
  database: {
    url: string;
    poolSize: number;
    ssl: boolean;
  };
  
  // Storage Configuration
  storage: {
    provider: 'supabase' | 'aws' | 'gcp' | 'azure';
    bucket: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
  };
  
  // Email Configuration
  email: {
    provider: 'sendgrid' | 'mailgun' | 'ses' | 'resend';
    apiKey?: string;
    fromEmail: string;
    fromName: string;
  };
  
  // Monitoring Configuration
  monitoring: {
    enabled: boolean;
    provider: 'sentry' | 'datadog' | 'newrelic' | 'custom';
    dsn?: string;
    environment: string;
  };
  
  // Feature Flags
  features: {
    ai: boolean;
    realtime: boolean;
    analytics: boolean;
    collaboration: boolean;
    sso: boolean;
    mfa: boolean;
    audit: boolean;
  };
}

// Default configuration
export const defaultConfig: EnvironmentConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  app: {
    name: 'OptimaliQ v2',
    version: process.env.npm_package_version || '1.0.0',
    environment: (process.env.NODE_ENV as EnvironmentConfig['app']['environment']) || 'development',
    debug: process.env.NODE_ENV === 'development',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000'),
    rateLimit: {
      requests: parseInt(process.env.API_RATE_LIMIT_REQUESTS || '100'),
      window: parseInt(process.env.API_RATE_LIMIT_WINDOW || '60'),
    },
  },
  
  auth: {
    autoRefreshToken: process.env.AUTH_AUTO_REFRESH_TOKEN !== 'false',
    persistSession: process.env.AUTH_PERSIST_SESSION !== 'false',
    detectSessionInUrl: process.env.AUTH_DETECT_SESSION_IN_URL !== 'false',
    flowType: (process.env.AUTH_FLOW_TYPE as 'pkce' | 'implicit') || 'pkce',
    redirectTo: process.env.AUTH_REDIRECT_TO || '/dashboard',
  },
  
  realtime: {
    enabled: process.env.REALTIME_ENABLED !== 'false',
    url: process.env.REALTIME_URL || '',
    heartbeatInterval: parseInt(process.env.REALTIME_HEARTBEAT_INTERVAL || '30000'),
    reconnectInterval: parseInt(process.env.REALTIME_RECONNECT_INTERVAL || '1000'),
    maxRetries: parseInt(process.env.REALTIME_MAX_RETRIES || '5'),
  },
  
  ai: {
    enabled: process.env.AI_ENABLED === 'true',
    provider: (process.env.AI_PROVIDER as EnvironmentConfig['ai']['provider']) || 'openai',
    apiKey: process.env.AI_API_KEY,
    endpoint: process.env.AI_ENDPOINT,
    model: process.env.AI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
    ssl: process.env.DATABASE_SSL !== 'false',
  },
  
  storage: {
    provider: (process.env.STORAGE_PROVIDER as EnvironmentConfig['storage']['provider']) || 'supabase',
    bucket: process.env.STORAGE_BUCKET || 'optimaliq-assets',
    region: process.env.STORAGE_REGION,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
  },
  
  email: {
    provider: (process.env.EMAIL_PROVIDER as EnvironmentConfig['email']['provider']) || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY,
    fromEmail: process.env.EMAIL_FROM_EMAIL || 'noreply@optimaliq.com',
    fromName: process.env.EMAIL_FROM_NAME || 'OptimaliQ',
  },
  
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    provider: (process.env.MONITORING_PROVIDER as EnvironmentConfig['monitoring']['provider']) || 'sentry',
    dsn: process.env.MONITORING_DSN,
    environment: process.env.NODE_ENV || 'development',
  },
  
  features: {
    ai: process.env.FEATURE_AI !== 'false',
    realtime: process.env.FEATURE_REALTIME !== 'false',
    analytics: process.env.FEATURE_ANALYTICS !== 'false',
    collaboration: process.env.FEATURE_COLLABORATION !== 'false',
    sso: process.env.FEATURE_SSO === 'true',
    mfa: process.env.FEATURE_MFA === 'true',
    audit: process.env.FEATURE_AUDIT !== 'false',
  },
};

// Configuration validation
export function validateConfig(config: EnvironmentConfig): string[] {
  const errors: string[] = [];
  
  // Required Supabase configuration
  if (!config.supabase.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
  }
  if (!config.supabase.anonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }
  
  // Required API configuration
  if (!config.api.baseUrl) {
    errors.push('NEXT_PUBLIC_API_URL is required');
  }
  
  // Required database configuration
  if (!config.database.url) {
    errors.push('DATABASE_URL is required');
  }
  
  // AI configuration validation
  if (config.ai.enabled && !config.ai.apiKey) {
    errors.push('AI_API_KEY is required when AI is enabled');
  }
  
  // Email configuration validation
  if (!config.email.apiKey) {
    errors.push('EMAIL_API_KEY is required');
  }
  
  // Monitoring configuration validation
  if (config.monitoring.enabled && !config.monitoring.dsn) {
    errors.push('MONITORING_DSN is required when monitoring is enabled');
  }
  
  return errors;
}

// Get configuration with validation
export function getConfig(): EnvironmentConfig {
  const config = { ...defaultConfig };
  const errors = validateConfig(config);
  
  if (errors.length > 0) {
    console.error('Configuration validation errors:', errors);
    if (config.app.environment === 'production') {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
  
  return config;
}

// Environment-specific configurations
export const developmentConfig = {
  app: {
    debug: true,
  },
  features: {
    ai: true,
    realtime: true,
    analytics: true,
    collaboration: true,
    sso: false,
    mfa: false,
    audit: true,
  },
} satisfies Partial<EnvironmentConfig>;

export const productionConfig = {
  app: {
    debug: false,
  },
  features: {
    ai: true,
    realtime: true,
    analytics: true,
    collaboration: true,
    sso: true,
    mfa: true,
    audit: true,
  },
} satisfies Partial<EnvironmentConfig>;

// Configuration utilities
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isStaging(): boolean {
  return process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';
}

export function getEnvironment(): EnvironmentConfig['app']['environment'] {
  return (process.env.NODE_ENV as EnvironmentConfig['app']['environment']) || 'development';
}

// Feature flag utilities
export function isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
  const config = getConfig();
  return config.features[feature];
}

// Configuration for different environments
export function getEnvironmentConfig(): EnvironmentConfig {
  const baseConfig = getConfig();
  const environment = getEnvironment();
  
  switch (environment) {
    case 'development':
      return { ...baseConfig, ...developmentConfig };
    case 'production':
      return { ...baseConfig, ...productionConfig };
    case 'staging':
      return { ...baseConfig, ...productionConfig, app: { ...baseConfig.app, debug: true } };
    default:
      return baseConfig;
  }
}

// Export the main configuration
export const config = getEnvironmentConfig();

// Type-safe configuration access
export type Config = EnvironmentConfig;
export type ConfigKey = keyof EnvironmentConfig;
export type ConfigValue<T extends ConfigKey> = EnvironmentConfig[T]; 