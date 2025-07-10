/**
 * TradingView Ticker Demo Component
 * 
 * Demonstrates the usage of the TradingViewTicker component
 * with different industries and themes.
 */

'use client';

import React, { useState } from 'react';
import TradingViewTicker from './TradingViewTicker';

const TradingViewTickerDemo: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('technology');
  const [colorTheme, setColorTheme] = useState<'light' | 'dark'>('light');

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'retail', label: 'Retail' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'energy', label: 'Energy' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'telecommunications', label: 'Telecommunications' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">TradingView Ticker Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demo of the TradingView Ticker component with different industries
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex flex-col space-y-2">
          <label htmlFor="industry" className="text-sm font-medium">
            Industry:
          </label>
          <select
            id="industry"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="theme" className="text-sm font-medium">
            Theme:
          </label>
          <select
            id="theme"
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value as 'light' | 'dark')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Showing: {industries.find(i => i.value === selectedIndustry)?.label} stocks
          </span>
        </div>
      </div>

      {/* TradingView Ticker Component */}
      <div className="w-full">
        <TradingViewTicker 
          industry={selectedIndustry}
          colorTheme={colorTheme}
          className="w-full h-16"
        />
      </div>

      {/* Usage Examples */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Usage Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium mb-2">Basic Usage</h3>
            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
              {`<TradingViewTicker industry="technology" />`}
            </code>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium mb-2">With Dark Theme</h3>
            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
              {`<TradingViewTicker industry="finance" colorTheme="dark" />`}
            </code>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium mb-2">With Custom Styling</h3>
            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
              {`<TradingViewTicker 
  industry="healthcare" 
  className="my-4 border rounded-lg" 
/>`}
            </code>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium mb-2">Base Tickers Only</h3>
            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
              {`<TradingViewTicker colorTheme="light" />`}
            </code>
          </div>
        </div>
      </div>

      {/* Available Industries */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Available Industries</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((industry) => (
            <div 
              key={industry.value}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => setSelectedIndustry(industry.value)}
            >
              <div className="font-medium text-sm">{industry.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {industry.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingViewTickerDemo; 