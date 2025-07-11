'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { RefreshCw } from 'lucide-react';

interface Headline {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsTickerProps {
  className?: string;
  showRefreshButton?: boolean;
  maxHeadlines?: number;
}

export default function NewsTicker({ 
  className = '', 
  showRefreshButton = true,
  maxHeadlines = 5 
}: NewsTickerProps) {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchHeadlines = async (forceRefresh = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const url = forceRefresh 
        ? '/api/news/headlines?refresh=true'
        : '/api/news/headlines';

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch headlines: ${response.status}`);
      }

      const data = await response.json();
      setHeadlines(data.slice(0, maxHeadlines));
      setLastRefresh(new Date());
      
    } catch (err) {
      console.error('Error fetching headlines:', err);
      setError(err instanceof Error ? err.message : 'Failed to load headlines');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchHeadlines(true);
  };

  useEffect(() => {
    fetchHeadlines();
  }, [maxHeadlines]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (error && headlines.length === 0) {
    return (
      <div className={`bg-red-50 rounded-lg border border-red-200 p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-700">News Ticker</span>
          </div>
          <span className="text-xs text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-yellow-50 rounded-lg border border-yellow-200 p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <SparklesIcon className="w-4 h-4 text-yellow-600 mr-2" />
          <span className="text-sm font-semibold text-yellow-700">Trending Business News</span>
        </div>
        
        {showRefreshButton && (
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded transition-colors disabled:opacity-50"
            title="Refresh headlines"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* News Ticker */}
      {headlines.length > 0 ? (
        <div className="overflow-hidden">
          <div className="flex items-center space-x-6 animate-scroll">
            {headlines.map((headline, index) => (
              <Link
                key={index}
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-700 group-hover:text-blue-800 group-hover:underline transition-colors">
                    {headline.title}
                  </span>
                  <span className="text-xs text-gray-500">|</span>
                  <span className="text-xs text-gray-600">{headline.source}</span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(headline.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
            
            {/* Duplicate headlines for seamless loop */}
            {headlines.map((headline, index) => (
              <Link
                key={`duplicate-${index}`}
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-700 group-hover:text-blue-800 group-hover:underline transition-colors">
                    {headline.title}
                  </span>
                  <span className="text-xs text-gray-500">|</span>
                  <span className="text-xs text-gray-600">{headline.source}</span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(headline.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-2">
          <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin mr-2" />
          <span className="text-sm text-yellow-700">Loading headlines...</span>
        </div>
      ) : (
        <div className="text-center py-2">
          <span className="text-sm text-yellow-600">No headlines available</span>
        </div>
      )}

      {/* Last Updated */}
      {lastRefresh && (
        <div className="mt-2 text-center">
          <span className="text-xs text-yellow-600">
            Last updated {formatTimeAgo(lastRefresh.toISOString())}
          </span>
        </div>
      )}
    </div>
  );
} 