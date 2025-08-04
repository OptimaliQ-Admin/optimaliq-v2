"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WorldClassOnboardingChat from '@/components/onboarding/WorldClassOnboardingChat';
import { supabase } from '@/lib/supabase';

export default function WorldClassOnboardingPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scores, setScores] = useState<any>(null);

  useEffect(() => {
    initializeOnboarding();
  }, []);

  const initializeOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/subscribe/login');
        return;
      }

      // Create new onboarding session
      const { data: sessionData, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .insert({
          user_id: user.id,
          status: 'active',
          session_type: 'world_class_conversational',
          metadata: {
            type: 'world_class_conversational'
          }
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        setError('Failed to start onboarding session');
        return;
      }

      setSessionId(sessionData.id);
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      setError('Failed to initialize onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (answers: any, finalScores: any) => {
    try {
      // Update session status
      if (sessionId) {
        await supabase
          .from('onboarding_sessions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            metadata: {
              ...finalScores,
              type: 'world_class_conversational'
            }
          })
          .eq('id', sessionId);
      }

      setScores(finalScores);
      setIsCompleted(true);

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/premium/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still redirect even if there's an error
      router.push('/premium/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Setting up your World-Class Onboarding
          </h2>
          <p className="text-gray-600">
            Preparing your personalized conversational experience...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              World-Class Onboarding Complete!
            </h1>
            <p className="text-gray-600 mb-6">
              Your personalized business assessment is ready. Redirecting to your dashboard...
            </p>
            
            {scores && (
              <div className="text-left space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Assessment Scores</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Overall Score:</span>
                      <span className="ml-2 font-medium">{scores.overall_score}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Strategy:</span>
                      <span className="ml-2 font-medium">{scores.strategy_score}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Process:</span>
                      <span className="ml-2 font-medium">{scores.process_score}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Technology:</span>
                      <span className="ml-2 font-medium">{scores.technology_score}/5</span>
                    </div>
                  </div>
                </div>
                
                {scores.roadmap && scores.roadmap.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Your 30-Day Roadmap</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {scores.roadmap.slice(0, 3).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!sessionId) {
    return null;
  }

  return (
    <div className="h-screen">
      <WorldClassOnboardingChat
        sessionId={sessionId}
        onComplete={handleComplete}
      />
    </div>
  );
} 