"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePremiumUser } from '@/hooks/usePremiumUser';
import ConversationalInterface from '@/components/onboarding/ConversationalInterface';
import VisualBusinessModelBuilder from '@/components/onboarding/VisualBusinessModelBuilder';
import GamifiedInterface from '@/components/onboarding/GamifiedInterface';
import RealTimeInsightsPanel from '@/components/onboarding/RealTimeInsightsPanel';
import { OnboardingSession, ConversationMessage } from '@/lib/types/database';

type InterfaceMode = 'conversational' | 'visual' | 'gamified';

export default function WorldClassOnboardingPage() {
  const router = useRouter();
  const { user, loading: isUserLoaded } = usePremiumUser();
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('conversational');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (!user?.id) {
      router.push('/subscribe/create-account');
      return;
    }

    initializeSession();
  }, [user, isUserLoaded, router]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create new onboarding session
      const response = await fetch('/api/onboarding/session', {
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
      setSession(data.session);

      // Get initial messages
      const messagesResponse = await fetch(`/api/onboarding/session?sessionId=${data.session.id}`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.messages || []);
      }

      // Get initial insights
      await loadInsights(data.session.id);

    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Failed to start onboarding session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadInsights = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/onboarding/session/${sessionId}/insights`);
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleMessage = async (message: string) => {
    if (!session) return;

    try {
      // Send message and get response
      const response = await fetch(`/api/onboarding/session/${session.id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Reload messages and insights
        const messagesResponse = await fetch(`/api/onboarding/session?sessionId=${session.id}`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.messages || []);
        }

        await loadInsights(session.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCanvasUpdate = async (canvasData: any) => {
    if (!session) return;

    try {
      // Save canvas data to database
      const response = await fetch(`/api/onboarding/session/${session.id}/canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasData }),
      });

      if (response.ok) {
        console.log('Canvas data saved');
      }
    } catch (error) {
      console.error('Error saving canvas data:', error);
    }
  };

  const handleAchievement = (achievement: any) => {
    console.log('Achievement earned:', achievement);
    // Could trigger additional actions like notifications, rewards, etc.
  };

  const handleInsightClick = (insight: any) => {
    console.log('Insight clicked:', insight);
    // Could open detailed insight modal or take specific actions
  };

  const handleComplete = async () => {
    if (!session) return;

    try {
      // Complete the session
      const response = await fetch(`/api/onboarding/session/${session.id}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log('Onboarding completed');
        router.push('/premium/dashboard');
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  if (!isUserLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your session...</h2>
          <p className="text-gray-600">Preparing your AI Business Strategist</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={initializeSession}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-900">World-Class Onboarding</span>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {/* Interface Mode Switcher */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                {(['conversational', 'visual', 'gamified'] as InterfaceMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setInterfaceMode(mode)}
                    className={`
                      px-3 py-1 text-sm rounded-md transition-colors
                      ${interfaceMode === mode 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div className="text-sm text-gray-500">
                Session: {session.id.slice(0, 8)}...
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${session.progress_percentage || 0}%` }}
                ></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Main Interface */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            <motion.div
              key={interfaceMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {interfaceMode === 'conversational' && (
                <ConversationalInterface
                  sessionId={session.id}
                  initialMessages={messages}
                  onMessage={handleMessage}
                  onComplete={handleComplete}
                />
              )}
              
              {interfaceMode === 'visual' && (
                <VisualBusinessModelBuilder
                  sessionId={session.id}
                  onCanvasUpdate={handleCanvasUpdate}
                />
              )}
              
              {interfaceMode === 'gamified' && (
                <GamifiedInterface
                  sessionId={session.id}
                  progress={session.progress_percentage || 0}
                  onAchievement={handleAchievement}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Real-Time Insights Panel */}
        <RealTimeInsightsPanel
          sessionId={session.id}
          insights={insights}
          onInsightClick={handleInsightClick}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Powered by AI Business Intelligence</span>
              <span>•</span>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/premium/dashboard')}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Skip to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 