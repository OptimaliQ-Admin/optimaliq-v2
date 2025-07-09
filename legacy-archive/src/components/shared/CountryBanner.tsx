"use client";

import { useCountry } from '@/hooks/useCountry';
import { motion } from 'framer-motion';

export default function CountryBanner() {
  const { countryCode, isLoaded, isFromUS, isFromEU, settings } = useCountry();

  if (!isLoaded) {
    return null; // Don't show anything while loading
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-4 py-2"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">🌍</span>
          <span className="text-gray-700">
            Welcome from <strong>{countryCode}</strong>
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-gray-600">
          {isFromUS && (
            <span className="flex items-center gap-1">
              💰 Prices in USD
            </span>
          )}
          
          {isFromEU && (
            <span className="flex items-center gap-1">
              🇪🇺 EU Data Protection Compliant
            </span>
          )}
          
          <span className="flex items-center gap-1">
            🕐 {settings.timezone}
          </span>
        </div>
      </div>
    </motion.div>
  );
} 