"use client";

import React, { useState } from 'react';
import ConversationalOnboardingChat from '@/components/onboarding/ConversationalOnboardingChat';

export default function OnboardingDemoPage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [scores, setScores] = useState<any>(null);

  const handleComplete = (assessmentScores: any) => {
    setScores(assessmentScores);
    setIsCompleted(true);
  };

  const handleProgress = (progress: number) => {
    console.log('Progress:', progress);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Assessment Complete!
            </h1>
            <p className="text-gray-600 mb-6">
              Your business assessment has been completed successfully.
            </p>
            
            {scores && (
              <div className="text-left space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Scores</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Overall Score:</span>
                      <span className="ml-2 font-medium">{scores.scores?.overall_score}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Bracket:</span>
                      <span className="ml-2 font-medium capitalize">{scores.scores?.bracket}</span>
                    </div>
                  </div>
                </div>
                
                {scores.scores?.recommendations && scores.scores.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Key Recommendations</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {scores.scores.recommendations.slice(0, 3).map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ConversationalOnboardingChat
        sessionId="demo-session-123"
        onComplete={handleComplete}
        onProgress={handleProgress}
      />
    </div>
  );
} 