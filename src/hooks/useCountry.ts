"use client";

import { useState, useEffect } from 'react';
import { getCountryCode, isFromCountry, isFromUS, isFromCanada, isFromEU, getCountrySettings } from '@/lib/utils/country';

export const useCountry = () => {
  const [countryCode, setCountryCode] = useState<string>('US');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get country code on client-side
    const country = getCountryCode();
    setCountryCode(country);
    setIsLoaded(true);
  }, []);

  return {
    countryCode,
    isLoaded,
    isFromCountry: (code: string) => isFromCountry(code),
    isFromUS: isFromUS(),
    isFromCanada: isFromCanada(),
    isFromEU: isFromEU(),
    settings: getCountrySettings(),
  };
}; 