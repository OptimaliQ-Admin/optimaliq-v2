'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fmp: number | null;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  showUI?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  showUI = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        const fcp = fcpEntry.startTime;
        setMetrics(prev => ({ ...prev, fcp }));
        onMetricsUpdate?.({ ...metrics, fcp });
      }
    });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        const lcp = lastEntry.startTime;
        setMetrics(prev => ({ ...prev, lcp }));
        onMetricsUpdate?.({ ...metrics, lcp });
      }
    });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
          onMetricsUpdate?.({ ...metrics, fid });
        }
      });
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics(prev => ({ ...prev, cls: clsValue }));
      onMetricsUpdate?.({ ...metrics, cls: clsValue });
    });

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
      onMetricsUpdate?.({ ...metrics, ttfb });
    }

    // First Meaningful Paint (FMP) - approximated
    const fmpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fmpEntry = entries.find(entry => entry.name === 'first-meaningful-paint');
      if (fmpEntry) {
        const fmp = fmpEntry.startTime;
        setMetrics(prev => ({ ...prev, fmp }));
        onMetricsUpdate?.({ ...metrics, fmp });
      }
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      fmpObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Send metrics to analytics
    const sendMetricsToAnalytics = () => {
      const validMetrics = Object.fromEntries(
        Object.entries(metrics).filter(([_, value]) => value !== null)
      );

      if (Object.keys(validMetrics).length > 0) {
        // Send to analytics service
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'performance_metrics', {
            custom_map: {
              fcp: 'first_contentful_paint',
              lcp: 'largest_contentful_paint',
              fid: 'first_input_delay',
              cls: 'cumulative_layout_shift',
              ttfb: 'time_to_first_byte',
              fmp: 'first_meaningful_paint',
            },
            ...validMetrics,
          });
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', validMetrics);
        }
      }
    };

    // Send metrics after a delay to ensure all are collected
    const timeoutId = setTimeout(sendMetricsToAnalytics, 5000);

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      fmpObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [onMetricsUpdate, metrics]);

  // Performance grade calculation
  const getPerformanceGrade = (metric: keyof PerformanceMetrics): string => {
    const value = metrics[metric];
    if (value === null) return 'N/A';

    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      ttfb: { good: 800, needsImprovement: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'N/A';

    if (value <= threshold.good) return 'Good';
    if (value <= threshold.needsImprovement) return 'Needs Improvement';
    return 'Poor';
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'Good': return 'text-green-600';
      case 'Needs Improvement': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  if (!showUI) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>
      <div className="space-y-2 text-xs">
        {Object.entries(metrics).map(([key, value]) => {
          const grade = getPerformanceGrade(key as keyof PerformanceMetrics);
          const color = getGradeColor(grade);
          
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-600 uppercase font-medium">{key}:</span>
              <div className="flex items-center space-x-2">
                <span className={color}>{grade}</span>
                {value !== null && (
                  <span className="text-gray-500">
                    {typeof value === 'number' ? `${value.toFixed(0)}ms` : value.toFixed(3)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Hook for easy performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
  });

  return {
    metrics,
    PerformanceMonitor: () => (
      <PerformanceMonitor
        onMetricsUpdate={setMetrics}
        showUI={process.env.NODE_ENV === 'development'}
      />
    ),
  };
};

// Global performance monitoring
export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Monitor long tasks
  const longTaskObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.duration > 50) {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
      }
    });
  });

  try {
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.warn('Long task observer not supported:', error);
  }

  // Monitor memory usage
  if ('memory' in performance) {
    setInterval(() => {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        console.warn('High memory usage detected');
      }
    }, 30000);
  }
}; 