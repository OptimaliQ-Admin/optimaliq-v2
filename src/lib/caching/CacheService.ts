// Cache Service for optimal performance
export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key);
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() - item.timestamp > item.ttl;
  }
}

// Service Worker Registration
export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null);
  }

  return navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);
      return registration;
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
      return null;
    });
}

// React Query Configuration
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
};

// Cache Keys
export const CACHE_KEYS = {
  DASHBOARD: 'dashboard',
  USER_PROFILE: 'user_profile',
  ASSESSMENT_DATA: 'assessment_data',
  ANALYTICS: 'analytics',
  GROWTH_STUDIO: 'growth_studio',
  PREMIUM_FEATURES: 'premium_features',
} as const;

// Prefetch Strategy
export const prefetchStrategy = {
  // Prefetch critical data
  critical: async (queryClient: any) => {
    // Prefetch user profile
    await queryClient.prefetchQuery({
      queryKey: [CACHE_KEYS.USER_PROFILE],
      queryFn: () => fetch('/api/user/profile').then(res => res.json()),
    });
  },

  // Prefetch on route change
  routeChange: async (queryClient: any, route: string) => {
    switch (route) {
      case '/dashboard':
        await queryClient.prefetchQuery({
          queryKey: [CACHE_KEYS.DASHBOARD],
          queryFn: () => fetch('/api/dashboard').then(res => res.json()),
        });
        break;
      case '/growth-studio':
        await queryClient.prefetchQuery({
          queryKey: [CACHE_KEYS.GROWTH_STUDIO],
          queryFn: () => fetch('/api/growth-studio').then(res => res.json()),
        });
        break;
    }
  },
};

// Offline Support
export const offlineSupport = {
  // Check if user is online
  isOnline: (): boolean => {
    return typeof navigator !== 'undefined' && navigator.onLine;
  },

  // Queue offline actions
  queueAction: (action: () => Promise<void>): void => {
    if (!offlineSupport.isOnline()) {
      const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      offlineQueue.push(action.toString());
      localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
    } else {
      action();
    }
  },

  // Process offline queue when back online
  processOfflineQueue: async (): Promise<void> => {
    const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    if (offlineQueue.length > 0) {
      for (const action of offlineQueue) {
        try {
          await eval(action)();
        } catch (error) {
          console.error('Failed to process offline action:', error);
        }
      }
      localStorage.removeItem('offlineQueue');
    }
  },
};

// Performance Monitoring
export const performanceMonitor = {
  // Measure API response time
  measureApiCall: async <T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow API calls
      if (duration > 1000) {
        console.warn(`Slow API call to ${endpoint}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`API call failed to ${endpoint} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Measure component render time
  measureRender: (componentName: string, renderFn: () => void): void => {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 16) { // Longer than one frame
      console.warn(`Slow render for ${componentName}: ${duration.toFixed(2)}ms`);
    }
  },
};

// Export singleton instance
export const cacheService = CacheService.getInstance(); 