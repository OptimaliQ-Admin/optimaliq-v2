"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ConversationalOnboardingChat from '@/components/onboarding/ConversationalOnboardingChat';

export default function WorldClassOnboardingPage() {
  const router = useRouter();
  const { user, loading, error } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Onboarding page useEffect:', { 
      loading, 
      hasUser: !!user,
      error 
    });
    
    if (loading) {
      console.log('⏳ Auth still loading...');
      return;
    }

    if (error) {
      console.log('❌ Auth error:', error);
      return;
    }

    if (!user?.id) {
      console.log('❌ No user found');
      return;
    }

    console.log('✅ User authenticated, initializing session');
    initializeSession();
  }, [user, loading, error]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setSessionError(null);

      // Create new structured onboarding session
      const response = await fetch('/api/onboarding/structured/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to create onboarding session');
      }

      const data = await response.json();
      setSessionId(data.session.id);

    } catch (err) {
      console.error('Error initializing session:', err);
      setSessionError('Failed to start onboarding session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/premium/dashboard');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your conversational onboarding...</p>
        </div>
      </div>
    );
  }

  if (error || sessionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error || sessionError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return null; // useAuth will handle redirect
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing your business discovery session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100vh-4rem)]"
        >
          <ConversationalOnboardingChat
            sessionId={sessionId}
            onComplete={handleComplete}
          />
        </motion.div>
      </div>
    </div>
  );
} 