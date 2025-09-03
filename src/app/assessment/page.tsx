/**
 * OptimaliQ Assessment Selection Page
 * AI-powered assessment selection with comprehensive configuration and personalization
 */

'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Lightbulb, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  Award,
  Play,
  Settings,
  Info,
  User,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/data-display'

// Assessment Types Data
const assessmentTypes = [
  {
    id: 'strategic',
    title: 'Strategic Assessment',
    description: 'Comprehensive evaluation of your organization\'s strategy, vision, and competitive positioning.',
    duration: '15-20 minutes',
    questions: 25,
    category: 'Strategy',
    icon: <Target className="h-8 w-8" />,
    color: 'primary',
    features: [
      'Strategic vision analysis',
      'Competitive positioning',
      'Market opportunity assessment',
      'Resource allocation review',
      'Risk evaluation'
    ],
    benefits: [
      'Clear strategic direction',
      'Identified growth opportunities',
      'Resource optimization insights',
      'Risk mitigation strategies'
    ],
    popular: true
  },
  {
    id: 'operational',
    title: 'Operational Excellence',
    description: 'Evaluate your operational processes, efficiency, and performance optimization opportunities.',
    duration: '12-15 minutes',
    questions: 20,
    category: 'Operations',
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'success',
    features: [
      'Process efficiency analysis',
      'Performance metrics review',
      'Technology utilization assessment',
      'Workflow optimization',
      'Quality management evaluation'
    ],
    benefits: [
      'Improved operational efficiency',
      'Cost reduction opportunities',
      'Technology optimization insights',
      'Quality improvement strategies'
    ],
    popular: false
  },
  {
    id: 'team',
    title: 'Team & Culture Assessment',
    description: 'Analyze your team dynamics, culture, leadership, and organizational health.',
    duration: '10-12 minutes',
    questions: 18,
    category: 'People',
    icon: <Users className="h-8 w-8" />,
    color: 'warning',
    features: [
      'Team dynamics analysis',
      'Culture assessment',
      'Leadership effectiveness',
      'Communication patterns',
      'Employee engagement'
    ],
    benefits: [
      'Improved team collaboration',
      'Enhanced organizational culture',
      'Leadership development insights',
      'Communication optimization'
    ],
    popular: false
  }
];

function AssessmentPageContent() {
  const searchParams = useSearchParams();
  const [userContext, setUserContext] = React.useState<any>(null);
  const [selectedType, setSelectedType] = React.useState<string>('strategic');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Get user context from URL parameters and localStorage
    const userId = searchParams.get('user');
    const industry = searchParams.get('industry');
    const role = searchParams.get('role');
    
    // Get additional user info from localStorage
    const storedUserInfo = localStorage.getItem('growth_assessment_user');
    let userInfo = null;
    
    if (storedUserInfo) {
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
      }
    }

    // Combine URL params with localStorage data
    const context = {
      userId: userId || userInfo?.userId,
      industry: industry || userInfo?.industry || 'Technology',
      role: role || userInfo?.role || 'Business Professional',
      companySize: userInfo?.companySize || '11-50',
      revenueRange: userInfo?.revenueRange || '$100K-$500K',
      name: userInfo?.name || 'Business Professional'
    };

    setUserContext(context);
    setIsLoading(false);
  }, [searchParams]);

  const getPersonalizedRecommendation = () => {
    if (!userContext) return assessmentTypes[0];

    // Industry-based recommendations
    if (userContext.industry === 'Technology' || userContext.industry === 'SaaS') {
      return assessmentTypes.find(type => type.id === 'strategic') || assessmentTypes[0];
    } else if (userContext.industry === 'Manufacturing' || userContext.industry === 'Retail') {
      return assessmentTypes.find(type => type.id === 'operational') || assessmentTypes[0];
    } else if (userContext.industry === 'Consulting' || userContext.industry === 'Healthcare') {
      return assessmentTypes.find(type => type.id === 'team') || assessmentTypes[0];
    }

    // Role-based recommendations
    if (userContext.role.toLowerCase().includes('ceo') || userContext.role.toLowerCase().includes('founder')) {
      return assessmentTypes.find(type => type.id === 'strategic') || assessmentTypes[0];
    } else if (userContext.role.toLowerCase().includes('operations') || userContext.role.toLowerCase().includes('manager')) {
      return assessmentTypes.find(type => type.id === 'operational') || assessmentTypes[0];
    } else if (userContext.role.toLowerCase().includes('hr') || userContext.role.toLowerCase().includes('people')) {
      return assessmentTypes.find(type => type.id === 'team') || assessmentTypes[0];
    }

    return assessmentTypes[0];
  };

  const startAssessment = (type: string) => {
    setSelectedType(type);
    
    // Store selected assessment type
    if (userContext) {
      localStorage.setItem('selected_assessment_type', type);
      localStorage.setItem('assessment_user_context', JSON.stringify(userContext));
    }
    
    // Redirect to questions with context
    const questionsUrl = `/assessment/questions?type=${type}&user=${userContext?.userId || 'new'}&industry=${encodeURIComponent(userContext?.industry || 'Technology')}`;
    window.location.href = questionsUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized assessment...</p>
        </div>
      </div>
    );
  }

  const recommendedAssessment = getPersonalizedRecommendation() || assessmentTypes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Welcome Message */}
          {userContext && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <User className="text-sm" />
                Welcome, {userContext.name}!
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{userContext.industry} Industry</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>{userContext.role}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Target className="text-sm" />
            Assessment Selection
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Assessment Path
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {userContext ? 
              `Based on your ${userContext.industry} industry and ${userContext.role} role, we've personalized these assessment options to provide the most relevant insights for your business.` :
              'Select the assessment that best aligns with your current business priorities and growth objectives.'
            }
          </p>
        </motion.div>

        {/* Recommended Assessment Highlight */}
        {userContext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {recommendedAssessment.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {recommendedAssessment.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recommendedAssessment.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {recommendedAssessment.questions} questions
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => startAssessment(recommendedAssessment.id)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Recommended
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assessment Types Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {assessmentTypes.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="relative group"
            >
              <Card className="h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${
                      assessment.color === 'primary' ? 'from-blue-500 to-blue-600' :
                      assessment.color === 'success' ? 'from-green-500 to-green-600' :
                      'from-orange-500 to-orange-600'
                    } rounded-xl flex items-center justify-center text-white`}>
                      {assessment.icon}
                    </div>
                    {assessment.popular && (
                      <StatusBadge status="primary" size="sm">
                        Popular
                      </StatusBadge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {assessment.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {assessment.description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-3">What You'll Get:</h4>
                  <ul className="space-y-2 mb-6">
                    {assessment.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {assessment.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {assessment.questions} questions
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="p-6 border-t border-gray-100">
                  <Button
                    onClick={() => startAssessment(assessment.id)}
                    className={`w-full ${
                      assessment.id === recommendedAssessment.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-all duration-300 hover:scale-105`}
                  >
                    {assessment.id === recommendedAssessment.id ? (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        Start Recommended
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Assessment
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Ready to Unlock Your Growth Potential?
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Each assessment provides personalized insights, actionable recommendations, and a clear roadmap for your business growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => startAssessment(recommendedAssessment.id)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-gray-500">No credit card required • Instant results</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment options...</p>
        </div>
      </div>
    }>
      <AssessmentPageContent />
    </Suspense>
  );
}
