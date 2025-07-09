'use client';

import React, { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/caching/CacheService';
import { initializePerformanceMonitors } from '@/lib/performance/BundleAnalyzer';
import { initializePerformanceMonitoring } from '@/components/performance/PerformanceMonitor';

export const PerformanceInitializer: React.FC = () => {
  useEffect(() => {
    // Register service worker for offline support
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('Service Worker registered successfully');
      }
    });

    // Initialize performance monitoring
    initializePerformanceMonitoring();
    initializePerformanceMonitors();

    // Monitor online/offline status
    const handleOnline = () => {
      console.log('Application is back online');
      // Process any queued offline actions
      const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
      if (offlineQueue.length > 0) {
        console.log(`Processing ${offlineQueue.length} offline actions`);
        localStorage.removeItem('offlineQueue');
      }
    };

    const handleOffline = () => {
      console.log('Application is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/images/logo.svg',
        '/images/hero-bg.jpg',
        '/manifest.json',
      ];

      criticalResources.forEach((resource) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.svg') ? 'image' : 'fetch';
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();

    // Monitor and report performance metrics
    const reportPerformanceMetrics = () => {
      if (typeof window === 'undefined') return;

      // Report navigation timing
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const metrics = {
          dns: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
          tcp: navigationEntry.connectEnd - navigationEntry.connectStart,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
          domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          load: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        };

        // Send to analytics
        if ((window as any).gtag) {
          (window as any).gtag('event', 'page_performance', metrics);
        }

        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Page Performance Metrics:', metrics);
        }
      }
    };

    // Report metrics after page load
    if (document.readyState === 'complete') {
      reportPerformanceMetrics();
    } else {
      window.addEventListener('load', reportPerformanceMetrics);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('load', reportPerformanceMetrics);
    };
  }, []);

  return null; // This component doesn't render anything
};

// Hook for easy performance initialization
export const usePerformanceInitialization = () => {
  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    initializePerformanceMonitors();

    // Register service worker
    registerServiceWorker();
  }, []);
}; 