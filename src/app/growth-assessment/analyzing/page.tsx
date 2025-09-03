/**
 * OptimaliQ Growth Assessment Analyzing Page
 * AI processing page with animations and progress indicators
 * Following original GTM flow
 */

'use client'

import React, { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Brain, 
  ChartLine, 
  Rocket, 
  Zap,
  CheckCircle,
  TrendingUp,
  Target
} from 'lucide-react'

function AnalyzingComponent() {
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem('growth_assessment_user');
    if (!userInfo) {
      router.push('/growth-assessment');
      return;
    }

    const generateInsights = async () => {
      try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Redirect to results page
        router.push('/growth-assessment/results');
      } catch (error) {
        console.error('Error generating insights:', error);
        router.push('/growth-assessment');
      }
    };

    generateInsights();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 text-blue-200 text-4xl opacity-30"
      >
        <Brain />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-40 right-20 text-indigo-200 text-3xl opacity-30"
      >
        <ChartLine />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 3, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-40 left-1/4 text-purple-200 text-2xl opacity-30"
      >
        <Rocket />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-2xl border border-white/20 max-w-2xl mx-auto">
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="text-white text-3xl" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Analyzing Your Business...
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Our AI is processing your responses to generate personalized insights and recommendations.
          </p>

          {/* Processing Steps */}
          <div className="space-y-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white w-4 h-4" />
              </div>
              <span className="text-gray-700">Processing your responses</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white w-4 h-4" />
              </div>
              <span className="text-gray-700">Analyzing market trends</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white w-4 h-4" />
              </div>
              <span className="text-gray-700">Generating strategic insights</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="flex items-center gap-3 text-left"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  backgroundColor: ['#3b82f6', '#10b981', '#3b82f6']
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Zap className="text-white w-4 h-4" />
              </motion.div>
              <span className="text-gray-700">Creating your growth roadmap</span>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 w-full max-w-md mx-auto">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 8,
                  ease: "easeInOut"
                }}
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">Processing your data...</p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI-powered analysis</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
          <span>Powered by</span>
          <span className="text-blue-600 font-semibold">OptimaliQ.ai</span>
        </p>
      </motion.div>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white text-2xl" />
          </div>
          <p className="text-gray-600">Preparing your insights...</p>
        </div>
      </div>
    }>
      <AnalyzingComponent />
    </Suspense>
  );
}
