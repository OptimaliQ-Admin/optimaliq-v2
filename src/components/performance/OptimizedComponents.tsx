'use client';

import React, { lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'framer-motion';

// Lazy load heavy components
const HeavyChart = lazy(() => import('../charts/HeavyChart'));
const DataTable = lazy(() => import('../tables/DataTable'));
const AnalyticsDashboard = lazy(() => import('../dashboard/AnalyticsDashboard'));

// Loading fallback component
const LoadingFallback = memo(function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
});

// Optimized Score Card with React.memo
export const OptimizedScoreCard = memo(function ScoreCard({
  title,
  score,
  industryAvg,
  topPerformer,
  trend,
  className = ''
}: {
  title: string;
  score: number;
  industryAvg: number;
  topPerformer: number;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}) {
  const scoreColor = useMemo(() => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }, [score]);

  const trendIcon = useMemo(() => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  }, [trend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {trend && (
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
            {trendIcon}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className={`text-sm font-medium ${scoreColor}`}>
            {score >= industryAvg ? '+' : ''}{score - industryAvg} vs avg
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Industry Avg: {industryAvg}</span>
            <span>Top: {topPerformer}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(score / topPerformer) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Virtual scrolling for large lists
export const VirtualizedList = memo(function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  height = 400,
  className = ''
}: {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number;
  className?: string;
}) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="px-4 py-2">
      {renderItem(items[index], index)}
    </div>
  ), [items, renderItem]);

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
});

// Optimized Data Grid
export const OptimizedDataGrid = memo(function DataGrid({
  data,
  columns,
  pageSize = 20,
  className = ''
}: {
  data: any[];
  columns: Array<{
    key: string;
    header: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  pageSize?: number;
  className?: string;
}) {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Lazy Loaded Component Wrapper
export const LazyLoadedComponent = memo(function LazyLoadedComponent({
  component: Component,
  fallback = <LoadingFallback />,
  ...props
}: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
});

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 16) { // Longer than one frame (16ms)
        console.warn(`Performance warning: ${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};

// Debounced search hook
export const useDebouncedSearch = (delay: number = 300) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
};

// Export lazy components for easy access
export { HeavyChart, DataTable, AnalyticsDashboard }; 