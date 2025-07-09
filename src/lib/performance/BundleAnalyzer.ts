// Bundle Analyzer for performance monitoring
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private bundleSizes: Map<string, number> = new Map();
  private loadTimes: Map<string, number> = new Map();

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  // Track bundle size
  trackBundleSize(name: string, size: number): void {
    this.bundleSizes.set(name, size);
    
    // Log large bundles
    if (size > 500 * 1024) { // 500KB
      console.warn(`Large bundle detected: ${name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
    }
  }

  // Track load time
  trackLoadTime(resource: string, loadTime: number): void {
    this.loadTimes.set(resource, loadTime);
    
    // Log slow resources
    if (loadTime > 3000) { // 3 seconds
      console.warn(`Slow resource detected: ${resource} (${loadTime.toFixed(0)}ms)`);
    }
  }

  // Get bundle analysis report
  getReport(): {
    totalBundleSize: number;
    averageLoadTime: number;
    slowResources: Array<{ resource: string; loadTime: number }>;
    largeBundles: Array<{ name: string; size: number }>;
  } {
    const totalBundleSize = Array.from(this.bundleSizes.values()).reduce((sum, size) => sum + size, 0);
    const loadTimes = Array.from(this.loadTimes.values());
    const averageLoadTime = loadTimes.length > 0 ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length : 0;

    const slowResources = Array.from(this.loadTimes.entries())
      .filter(([_, loadTime]) => loadTime > 1000)
      .map(([resource, loadTime]) => ({ resource, loadTime }))
      .sort((a, b) => b.loadTime - a.loadTime);

    const largeBundles = Array.from(this.bundleSizes.entries())
      .filter(([_, size]) => size > 100 * 1024) // 100KB
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => b.size - a.size);

    return {
      totalBundleSize,
      averageLoadTime,
      slowResources,
      largeBundles,
    };
  }

  // Clear data
  clear(): void {
    this.bundleSizes.clear();
    this.loadTimes.clear();
  }
}

// Resource timing observer
export const resourceTimingObserver = {
  start(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const analyzer = BundleAnalyzer.getInstance();

      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
          
          analyzer.trackLoadTime(resourceEntry.name, loadTime);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Resource timing observer not supported:', error);
    }
  },
};

// Web Vitals monitoring
export const webVitalsMonitor = {
  // Monitor Core Web Vitals
  monitorCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        const lcp = lastEntry.startTime;
        this.reportWebVital('LCP', lcp);
      }
    });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          this.reportWebVital('FID', fid);
        }
      });
    });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.reportWebVital('CLS', clsValue);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Web Vitals observer not supported:', error);
    }
  },

  // Report Web Vital metric
  reportWebVital(metric: string, value: number): void {
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vital', {
        custom_map: {
          [metric.toLowerCase()]: metric,
        },
        [metric.toLowerCase()]: value,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital - ${metric}:`, value);
    }
  },
};

// Memory monitoring
export const memoryMonitor = {
  start(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    setInterval(() => {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.jsHeapSizeLimit / 1024 / 1024;
      const usagePercent = (usedMB / totalMB) * 100;

      if (usagePercent > 80) {
        console.warn(`High memory usage: ${usagePercent.toFixed(1)}% (${usedMB.toFixed(1)}MB / ${totalMB.toFixed(1)}MB)`);
      }

      // Report to analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'memory_usage', {
          memory_used_mb: usedMB,
          memory_total_mb: totalMB,
          memory_usage_percent: usagePercent,
        });
      }
    }, 30000); // Check every 30 seconds
  },
};

// Network monitoring
export const networkMonitor = {
  start(): void {
    if (typeof window === 'undefined' || !(navigator as any).connection) return;

    const connection = (navigator as any).connection;
    
    // Monitor connection changes
    connection.addEventListener('change', () => {
      const effectiveType = connection.effectiveType || 'unknown';
      const downlink = connection.downlink || 0;
      const rtt = connection.rtt || 0;

      console.log(`Network changed: ${effectiveType}, ${downlink}Mbps, ${rtt}ms RTT`);

      // Report to analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'network_change', {
          effective_type: effectiveType,
          downlink: downlink,
          rtt: rtt,
        });
      }
    });
  },
};

// Initialize all monitors
export const initializePerformanceMonitors = () => {
  resourceTimingObserver.start();
  webVitalsMonitor.monitorCoreWebVitals();
  memoryMonitor.start();
  networkMonitor.start();
};

// Export singleton
export const bundleAnalyzer = BundleAnalyzer.getInstance(); 