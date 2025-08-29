'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentWizard } from '@/components/assessment/assessment-wizard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  Shield, 
  Award,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export default function GrowthAssessmentPage() {
  const router = useRouter();
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [userInfo, setUserInfo] = useState({
    industry: 'Technology',
    companySize: '11-50'
  });

  const handleAssessmentComplete = async (responses: Record<string, any>) => {
    try {
      // Process assessment through our API
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'onboarding',
          responses,
          metadata: {
            source: 'growth_assessment_page',
            userAgent: navigator.userAgent,
            completedAt: new Date().toISOString()
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Assessment completed! Generating your insights...');
        router.push('/premium/dashboard');
      } else {
        toast.error('Assessment processing failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const startAssessment = () => {
    setAssessmentStarted(true);
  };

  if (assessmentStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Brain className="h-3 w-3 mr-1" />
              AI Assessment
            </Badge>
          </div>

          {/* Assessment Wizard */}
          <AssessmentWizard
            assessmentType="onboarding"
            industry={userInfo.industry}
            companySize={userInfo.companySize}
            onComplete={handleAssessmentComplete}
            allowBack={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Sparkles className="h-4 w-4 mr-2" />
              Free Growth Assessment
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Discover Your Business{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Growth Potential
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take our AI-powered assessment to get personalized insights, 
              strategic recommendations, and a custom growth plan in just 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Assessment Card */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-0 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
                  <p className="text-muted-foreground">
                    Our AI will adapt questions based on your industry and responses, 
                    providing the most relevant insights for your business.
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Quick Setup */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Quick Setup</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="industry" className="text-sm font-medium">Industry</label>
                        <select
                          id="industry"
                          value={userInfo.industry}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, industry: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                        >
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Financial Services">Financial Services</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Non-Profit">Non-Profit</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="companySize" className="text-sm font-medium">Company Size</label>
                        <select
                          id="companySize"
                          value={userInfo.companySize}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, companySize: e.target.value }))}
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                        >
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-1000">201-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <Button
                    onClick={startAssessment}
                    className="w-full bg-gradient-primary hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
                    size="lg"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    Start AI Assessment
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    No account required • Get instant results • Completely free
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              {/* What You'll Get */}
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">What You'll Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Brain, text: 'AI-powered business analysis' },
                    { icon: TrendingUp, text: 'Industry benchmarking' },
                    { icon: Award, text: 'Personalized growth plan' },
                    { icon: Clock, text: 'Instant results in 5 minutes' }
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.text}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                        <benefit.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {benefit.text}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Badge */}
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Your data is secure
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    SOC 2 compliant • Enterprise encryption
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
