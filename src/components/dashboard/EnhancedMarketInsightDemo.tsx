'use client';

import React from 'react';
import EnhancedMarketInsightCard from './EnhancedMarketInsightCard';

const EnhancedMarketInsightDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Market Intelligence Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the next generation of market intelligence with AI-powered insights, 
          real-time data, and comprehensive analysis across multiple industries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technology Industry */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Sector</h2>
          <EnhancedMarketInsightCard 
            industry="technology" 
            className="h-full"
          />
        </div>

        {/* Healthcare Industry */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Healthcare Sector</h2>
          <EnhancedMarketInsightCard 
            industry="healthcare" 
            className="h-full"
          />
        </div>

        {/* Retail Industry */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Retail Sector</h2>
          <EnhancedMarketInsightCard 
            industry="retail" 
            className="h-full"
          />
        </div>

        {/* Finance Industry */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Finance Sector</h2>
          <EnhancedMarketInsightCard 
            industry="finance" 
            className="h-full"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Market Size Analysis</h4>
            <p className="text-sm text-gray-600">Comprehensive market sizing with growth trends</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Growth Projections</h4>
            <p className="text-sm text-gray-600">AI-powered growth rate analysis and trends</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Competition Analysis</h4>
            <p className="text-sm text-gray-600">Detailed competitive landscape insights</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Market Sentiment</h4>
            <p className="text-sm text-gray-600">Real-time sentiment analysis and trends</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Backend Infrastructure</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enhanced AI analysis service with rate limiting</li>
              <li>• Structured database schema with RLS policies</li>
              <li>• RESTful API endpoints with caching</li>
              <li>• Real-time data integration</li>
              <li>• Model versioning and performance tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Frontend Components</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Reusable market metric cards</li>
              <li>• Enhanced insights modal with charts</li>
              <li>• TradingView ticker integration</li>
              <li>• Responsive design with Tailwind CSS</li>
              <li>• TypeScript for type safety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMarketInsightDemo; 