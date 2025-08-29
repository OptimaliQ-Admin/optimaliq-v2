'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  Sparkles, 
  ArrowRight,
  Play,
  Shield,
  Clock,
  Award
} from 'lucide-react';

// Animation variants
const heroVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const dashboardVariants = {
  initial: { opacity: 0, scale: 0.8, rotateX: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Mock dashboard metrics for animation
const mockMetrics = [
  { label: 'Growth Score', value: 8.7, trend: 'up', color: 'text-green-500' },
  { label: 'Strategy Score', value: 7.9, trend: 'up', color: 'text-blue-500' },
  { label: 'Process Score', value: 6.8, trend: 'stable', color: 'text-yellow-500' },
  { label: 'Tech Score', value: 9.2, trend: 'up', color: 'text-purple-500' }
];

export function HeroSection() {
  const [animatedValues, setAnimatedValues] = useState(mockMetrics.map(() => 0));

  // Animate numbers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(mockMetrics.map(metric => metric.value));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="space-y-8"
            variants={heroVariants}
            initial="initial"
            animate="animate"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-4 py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Business Intelligence
              </Badge>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Transform Your Business with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI-Driven Insights
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Get McKinsey-level strategic insights, personalized growth plans, and competitive benchmarking 
                through our sophisticated AI assessment platform.
              </motion.p>
            </div>

            {/* Trust Signals */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>5-Minute Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                <span>Instant Results</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/growth-assessment">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Start Free Growth Audit
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Trusted by 500+ growing companies
              </p>
              <div className="flex items-center gap-8 opacity-60">
                {/* Company logos would go here */}
                <div className="text-2xl font-bold text-gray-400">TechCorp</div>
                <div className="text-2xl font-bold text-gray-400">GrowthCo</div>
                <div className="text-2xl font-bold text-gray-400">ScaleUp</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Animated Dashboard Preview */}
          <motion.div 
            className="relative"
            variants={dashboardVariants}
            initial="initial"
            animate="animate"
          >
            {/* Main Dashboard Card */}
            <div className="relative">
              <Card className="glass-card border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-6">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Growth Dashboard</h3>
                        <p className="text-xs text-muted-foreground">Real-time insights</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Live
                    </Badge>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {mockMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">{metric.label}</p>
                            <motion.p 
                              className={`text-2xl font-bold ${metric.color}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 + index * 0.1 }}
                            >
                              {animatedValues[index]?.toFixed(1) || '0.0'}
                            </motion.p>
                          </div>
                          <TrendingUp className={`h-4 w-4 ${metric.color}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    {['Strategy', 'Process', 'Technology'].map((category, index) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span className="text-muted-foreground">
                            {mockMetrics[index]?.value || 0}/10
                          </span>
                        </div>
                        <motion.div 
                          className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 1.5 + index * 0.2, duration: 0.8 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(mockMetrics[index]?.value || 0) * 10}%` }}
                            transition={{ delay: 1.7 + index * 0.2, duration: 1 }}
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Floating Metrics */}
              <motion.div
                className="absolute -top-4 -right-4"
                variants={floatingVariants}
                animate="animate"
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Growth Target</p>
                        <p className="text-lg font-bold text-green-600">+42%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4"
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Team Score</p>
                        <p className="text-lg font-bold text-blue-600">94%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <p className="text-sm">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
