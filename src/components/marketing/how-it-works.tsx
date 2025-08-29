'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BarChart3, 
  Target, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Take AI Assessment',
    description: 'Complete our intelligent 5-minute assessment that adapts to your business',
    icon: Brain,
    features: ['Dynamic questioning', 'Industry-specific', 'Real-time scoring']
  },
  {
    number: '02', 
    title: 'Get Instant Insights',
    description: 'Receive personalized analysis with benchmarks and growth opportunities',
    icon: BarChart3,
    features: ['AI-powered analysis', 'Industry benchmarks', 'Growth recommendations']
  },
  {
    number: '03',
    title: 'Execute Growth Plan',
    description: 'Follow your personalized roadmap with actionable steps and milestones',
    icon: Target,
    features: ['30-day action plan', 'Progress tracking', 'Team collaboration']
  },
  {
    number: '04',
    title: 'Track & Optimize',
    description: 'Monitor progress and continuously optimize with real-time market intelligence',
    icon: TrendingUp,
    features: ['Real-time analytics', 'Market intelligence', 'Continuous optimization']
  }
];

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const stepVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-16"
        >
          {/* Section Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              How It Works
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              From Assessment to Growth in 4 Simple Steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform guides you through a comprehensive growth journey, 
              from initial assessment to strategic execution.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <Card className="h-full border-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Step Number */}
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {step.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-blue-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
