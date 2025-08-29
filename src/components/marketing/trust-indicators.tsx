'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Clock, 
  Award, 
  Users, 
  TrendingUp, 
  Brain,
  Star,
  CheckCircle
} from 'lucide-react';

const trustMetrics = [
  {
    icon: Users,
    value: '500+',
    label: 'Growing Companies',
    description: 'Trust OptimaliQ for growth'
  },
  {
    icon: TrendingUp,
    value: '42%',
    label: 'Average Growth',
    description: 'Achieved by our users'
  },
  {
    icon: Brain,
    value: '10M+',
    label: 'AI Insights',
    description: 'Generated and validated'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Success Rate',
    description: 'User satisfaction score'
  }
];

const trustBadges = [
  {
    icon: Shield,
    text: 'SOC 2 Compliant',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    icon: Clock,
    text: '5-Minute Setup',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    icon: CheckCircle,
    text: 'No Credit Card',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    icon: Star,
    text: 'Free Assessment',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
];

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export function TrustIndicators() {
  return (
    <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Trusted Platform
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Join the Growth Revolution
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Thousands of businesses trust OptimaliQ to unlock their growth potential 
              with AI-powered insights and strategic planning.
            </p>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="text-center border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <metric.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <motion.div 
                          className="text-3xl font-bold text-gray-900 dark:text-white"
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        >
                          {metric.value}
                        </motion.div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {metric.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {metric.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge 
                  variant="secondary" 
                  className={`${badge.color} px-4 py-2 text-sm font-medium border`}
                >
                  <badge.icon className="h-4 w-4 mr-2" />
                  {badge.text}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Customer Testimonial Preview */}
          <motion.div 
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                    "OptimaliQ transformed our strategic planning process. The AI insights helped us 
                    identify growth opportunities we never knew existed. We've grown 40% in 6 months."
                  </blockquote>
                  <div className="pt-4">
                    <div className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">CEO, TechGrowth Inc.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
