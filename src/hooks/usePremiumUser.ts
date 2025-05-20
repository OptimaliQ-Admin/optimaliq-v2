"use client";

import { useContext } from 'react';
import { PremiumUserContext } from '@/context/PremiumUserContext';

export function usePremiumUser() {
  const context = useContext(PremiumUserContext);
  if (!context) {
    throw new Error('usePremiumUser must be used within a PremiumUserProvider');
  }
  return context;
} 