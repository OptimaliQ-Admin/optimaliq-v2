/**
 * OptimaliQ Growth Assessment Page
 * AI-powered growth analysis with GTM-style lead capture optimization
 * Recreated from original GMF Plus v3.1 design with enterprise-grade feel
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3,
  Lightbulb,
  Rocket,
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Brain,
  Clock,
  Award,
  Sparkles,
  User,
  Mail,
  Building,
  Briefcase,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/form'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GrowthAssessmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    industry: 'Technology',
    role: '',
    companySize: '11-50',
    revenueRange: '$100K-$500K'
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!userInfo.name || !userInfo.email || !userInfo.industry || !userInfo.role || !userInfo.companySize || !userInfo.revenueRange) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!privacyConsent) {
      toast.error('Please accept our privacy policy to continue');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store user info in localStorage for the assessment
      localStorage.setItem('growth_assessment_user', JSON.stringify(userInfo));
      
      // Show success message
      toast.success('Great! Redirecting you to your personalized assessment...');
      
      // Redirect to assessment after a brief delay
      setTimeout(() => {
        router.push('/assessment');
      }, 1500);
      
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = userInfo.name && userInfo.email && userInfo.industry && userInfo.role && userInfo.companySize && userInfo.revenueRange && privacyConsent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-4 lg:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-4"
        >
          {/* Left Side - Form Header (GTM Style) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-left flex flex-col justify-center h-full space-y-4"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold w-fit"
            >
              <BarChart3 className="text-sm" />
              <span>AI-Powered Growth Analysis</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Unlock{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Scalable Growth
              </span>{" "}
              Backed by Data
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl"
            >
              Make <strong className="text-gray-900">confident decisions</strong> backed by{" "}
              <strong className="text-gray-900">data-driven insights</strong>. Our analysis{" "}
              <strong className="text-gray-900">pinpoints hidden opportunities</strong> to refine strategy, 
              boost efficiency, and scale — <strong className="text-gray-900">fast</strong>.
            </motion.p>

            {/* Feature Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Lightbulb className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Strategic Insights</h3>
                <p className="text-xs text-gray-600">Discover hidden growth opportunities with AI-powered analysis</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Data-Driven</h3>
                <p className="text-xs text-gray-600">Benchmark against industry leaders and track your progress</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Rocket className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Actionable Plans</h3>
                <p className="text-xs text-gray-600">Get personalized roadmaps to accelerate your growth</p>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-6 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">2-minute assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Instant insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">100% free</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Lead Capture Form (GTM Style) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Background Card */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-5 lg:p-6 w-full max-w-lg mx-auto">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Tell Us About Yourself</h2>
                <p className="text-sm text-gray-600">We&rsquo;ll tailor insights to your business needs.</p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Step 1 of 2</span>
                  <span className="text-sm text-gray-500">Business Overview</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full w-1/2"></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        placeholder="Enter your full name"
                        required
                        maxLength={30}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">We'll use this to personalize your experience</p>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        placeholder="Enter your email address"
                        required
                        maxLength={250}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">We'll send your assessment results here</p>
                  </div>
                  
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry *
                    </label>
                    <Select value={userInfo.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                        <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Nonprofit">Nonprofit</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">This helps us provide industry-specific insights</p>
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Role *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="role"
                        name="role"
                        type="text"
                        value={userInfo.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="pl-10"
                        placeholder="e.g., CEO, Marketing Manager, Founder"
                        required
                        maxLength={250}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Your role helps us tailor recommendations</p>
                  </div>
                  
                  <div>
                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size *
                    </label>
                    <Select value={userInfo.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Company size affects growth strategies</p>
                  </div>
                  
                  <div>
                    <label htmlFor="revenueRange" className="block text-sm font-medium text-gray-700 mb-1">
                      Revenue Range *
                    </label>
                    <Select value={userInfo.revenueRange} onValueChange={(value) => handleInputChange('revenueRange', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<$100K">Under $100K</SelectItem>
                        <SelectItem value="$100K-$500K">$100K - $500K</SelectItem>
                        <SelectItem value="$500K-$1M">$500K - $1M</SelectItem>
                        <SelectItem value="$1M-$10M">$1M - $10M</SelectItem>
                        <SelectItem value="$10M-$50M">$10M - $50M</SelectItem>
                        <SelectItem value="$50M+">$50M+</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Revenue helps us benchmark your performance</p>
                  </div>
                </div>

                {/* Privacy Consent */}
                <div className="space-y-1">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Shield className="text-blue-600 mt-1 flex-shrink-0 w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Checkbox
                          id="privacyConsent"
                          checked={privacyConsent}
                          onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
                        />
                        <label htmlFor="privacyConsent" className="text-sm font-medium text-gray-900">
                          I agree to let OptimaliQ collect and use my answers to personalize my experience.
                        </label>
                      </div>
                      <p className="text-xs text-gray-600">
                        By checking this box, you agree to our{" "}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyDetails(true)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Privacy Policy
                        </button>{" "}
                        and consent to receive your personalized business insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Continue to Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Trust Message */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                    <Shield className="text-green-500 w-3 h-3" />
                    <span>No spam. No sales pitches. Just data-driven insights.</span>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="text-blue-600 w-5 h-5" />
                  Privacy Policy
                </h3>
                <button
                  onClick={() => setShowPrivacyDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Collection</h4>
                  <p>We collect the following information to provide you with personalized business insights:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Name and email address for communication</li>
                    <li>Industry, role, company size, and revenue range for analysis</li>
                    <li>Assessment responses for generating insights</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How We Use Your Data</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Generate personalized business insights and recommendations</li>
                    <li>Provide you with your assessment results</li>
                    <li>Improve our services and user experience</li>
                    <li>Send you relevant business insights (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your data is stored securely using industry-standard encryption</li>
                    <li>We do not sell, rent, or share your personal data with third parties</li>
                    <li>Access to your data is restricted to authorized personnel only</li>
                    <li>We implement appropriate security measures to protect your information</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Rights</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access your personal data at any time</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Contact us with any privacy concerns</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p>For privacy-related questions or requests, please contact us at:</p>
                  <p className="mt-1">Email: privacy@optimaliq.ai</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    <strong>Note:</strong> This privacy policy applies to the growth assessment lead form. 
                    For our full privacy policy covering all services, please visit our main privacy page.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPrivacyDetails(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPrivacyConsent(true);
                    setShowPrivacyDetails(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
