'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp as ChartLine, 
  Lightbulb, 
  Rocket,
  Shield, 
  CheckCircle,
  Lock,
  User as UserIcon,
  Mail,
  Building2,
  Briefcase,
  Building,
  DollarSign,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import ReCAPTCHA from 'react-google-recaptcha'

// FormHeader component matching GMF exactly
function FormHeader() {
  return (
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
        <ChartLine className="text-sm" />
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
            <ChartLine className="text-white text-lg" />
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
  )
}

// ProgressIndicator component
function ProgressIndicator({ currentStep, totalSteps, steps, className = "" }: {
  currentStep: number
  totalSteps: number
  steps: Array<{ title: string; description: string; status: 'completed' | 'current' | 'upcoming' }>
  className?: string
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step.status === 'completed' 
                ? 'bg-green-500 text-white' 
                : step.status === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
            <div>
              <p className={`text-sm font-medium ${
                step.status === 'current' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// FormField component
function FormField({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required, 
  maxLength, 
  icon, 
  helperText 
}: {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  placeholder: string
  error?: string
  required?: boolean
  maxLength?: number
  icon?: React.ReactNode
  helperText?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`h-12 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        />
      </div>
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

// FormSelect component
function FormSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder, 
  error, 
  required, 
  icon, 
  helperText 
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  placeholder: string
  error?: string
  required?: boolean
  icon?: React.ReactNode
  helperText?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <Select value={value} onValueChange={(value) => onChange({ target: { name, value } } as any)}>
          <SelectTrigger className={`h-12 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

// FormNavigation component
function FormNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  isValid, 
  isSubmitting, 
  nextLabel, 
  previousLabel, 
  className = "" 
}: {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isValid: boolean
  isSubmitting: boolean
  nextLabel: string
  previousLabel: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="px-6 py-3"
      >
        {previousLabel}
      </Button>
      
      <Button
        type="button"
        onClick={onNext}
        disabled={!isValid || isSubmitting}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          nextLabel
        )}
      </Button>
    </div>
  )
}

// Form component with reCAPTCHA
function GrowthAssessmentForm() {
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    industry: "",
    role: "",
    companySize: "",
    revenueRange: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
  
    // Validate required fields
    for (const [key, value] of Object.entries(userInfo)) {
      if (!value) {
        toast.warning("All fields are required.")
        setIsSubmitting(false)
        return
      }
    }

    if (!privacyConsent) {
      toast.warning("Please accept our privacy policy to continue.")
      setIsSubmitting(false)
      return
    }
  
    try {
      // Execute reCAPTCHA
      let recaptchaToken = ''
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('growth_assessment')
        } catch (recaptchaError) {
          console.warn('reCAPTCHA failed, continuing without token:', recaptchaError)
        }
      }

      // Use API endpoint to handle user creation/update
      const response = await fetch('/api/leads/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userInfo, 
          privacyConsent,
          recaptchaToken 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to process user data. Try again.")
        setIsSubmitting(false)
        return
      }

      const { userId } = await response.json()
  
      // Store ID securely in localStorage
      localStorage.setItem("u_id", userId)
  
      // Navigate to next step
      router.push("/growth-assessment/step2")
  
    } catch (err) {
      console.error("Unexpected error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unexpected error. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
      setIsSubmitting(false)
    }
  }

  return (
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


        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {/* Form Fields */}
          <div className="space-y-2">
            <FormField
              label="Full Name"
              name="name" 
              type="text"
              value={userInfo.name} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              error={validationErrors.name}
              required
              maxLength={30}
              icon={<UserIcon className="w-5 h-5" />}
              helperText="We'll use this to personalize your experience"
            />
            
            <FormField
              label="Email Address"
              name="email" 
              type="email" 
              value={userInfo.email} 
              onChange={handleChange} 
              placeholder="Enter your email address"
              error={validationErrors.email}
              required
              maxLength={250}
              icon={<Mail className="w-5 h-5" />}
              helperText="We'll send your assessment results here"
            />
            
            <FormSelect
              label="Industry"
              name="industry" 
              value={userInfo.industry} 
              onChange={handleChange} 
              options={[
                { value: "E-commerce", label: "E-commerce" },
                { value: "Finance", label: "Finance" },
                { value: "SaaS", label: "SaaS" },
                { value: "Education", label: "Education" },
                { value: "Technology", label: "Technology" },
                { value: "Healthcare", label: "Healthcare" },
                { value: "Retail", label: "Retail" },
                { value: "Manufacturing", label: "Manufacturing" },
                { value: "Consulting", label: "Consulting" },
                { value: "Entertainment", label: "Entertainment" },
                { value: "Real Estate", label: "Real Estate" },
                { value: "Transportation", label: "Transportation" },
                { value: "Hospitality", label: "Hospitality" },
                { value: "Energy", label: "Energy" },
                { value: "Telecommunications", label: "Telecommunications" },
                { value: "Pharmaceuticals", label: "Pharmaceuticals" },
                { value: "Automotive", label: "Automotive" },
                { value: "Construction", label: "Construction" },
                { value: "Legal", label: "Legal" },
                { value: "Nonprofit", label: "Nonprofit" },
                { value: "Other", label: "Other" }
              ]}
              placeholder="Select your industry"
              error={validationErrors.industry}
              required
              icon={<Building2 className="w-5 h-5" />}
              helperText="This helps us provide industry-specific insights"
            />
            
            <FormField
              label="Job Role"
              name="role" 
              type="text"
              value={userInfo.role} 
              onChange={handleChange} 
              placeholder="e.g., CEO, Marketing Manager, Founder"
              error={validationErrors.role}
              required
              maxLength={250}
              icon={<Briefcase className="w-5 h-5" />}
              helperText="Your role helps us tailor recommendations"
            />
            
            <FormSelect
              label="Company Size"
              name="companySize" 
              value={userInfo.companySize} 
              onChange={handleChange} 
              options={[
                { value: "1-10", label: "1-10 employees" },
                { value: "11-50", label: "11-50 employees" },
                { value: "51-200", label: "51-200 employees" },
                { value: "201-500", label: "201-500 employees" },
                { value: "501-1000", label: "501-1000 employees" },
                { value: "1000+", label: "1000+ employees" }
              ]}
              placeholder="Select company size"
              error={validationErrors.companySize}
              required
              icon={<Building className="w-5 h-5" />}
              helperText="Company size affects growth strategies"
            />
            
            <FormSelect
              label="Revenue Range"
              name="revenueRange" 
              value={userInfo.revenueRange} 
              onChange={handleChange} 
              options={[
                { value: "Under $100K", label: "Under $100K" },
                { value: "$100K-$500K", label: "$100K - $500K" },
                { value: "$500K-$1M", label: "$500K - $1M" },
                { value: "$1M-$10M", label: "$1M - $10M" },
                { value: "$10M-$50M", label: "$10M - $50M" },
                { value: "$50M+", label: "$50M+" }
              ]}
              placeholder="Select revenue range"
              error={validationErrors.revenueRange}
              required
              icon={<DollarSign className="w-5 h-5" />}
              helperText="Revenue helps us benchmark your performance"
            />
          </div>

          {/* Privacy Consent */}
          <div className="space-y-1">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Lock className="text-blue-600 mt-1 flex-shrink-0 w-4 h-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Checkbox
                    id="privacyConsent"
                    checked={privacyConsent}
                    onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

          {/* reCAPTCHA */}
          <div className="flex justify-center py-2">
            <div className="transform scale-75">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                onChange={(token) => {
                  // Token is automatically handled by useGoogleReCaptcha hook
                }}
              />
            </div>
          </div>

          {/* Form Navigation */}
          <FormNavigation
            currentStep={1}
            totalSteps={2}
            onNext={() => handleSubmit(new Event('submit') as any)}
            onPrevious={() => {}}
            isValid={Object.values(userInfo).every(value => value.trim() !== '') && privacyConsent}
            isSubmitting={isSubmitting}
            nextLabel="Continue to Assessment"
            previousLabel="Back"
            className="mt-4"
          />

          {/* Trust Message */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Shield className="text-green-500 w-3 h-3" />
              <span>No spam. No sales pitches. Just data-driven insights.</span>
            </p>
          </div>
        </form>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="text-blue-600 w-5 h-5" />
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
                    setPrivacyConsent(true)
                    setShowPrivacyDetails(false)
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
    </motion.div>
  )
}

// TrustFooter component
function TrustFooter() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white/60 backdrop-blur-sm border-t border-white/20 py-12"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by 2,000+ Businesses</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join industry leaders who have transformed their growth strategy with data-driven insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChartLine className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3x Faster Growth</h4>
              <p className="text-sm text-gray-600">Average growth rate improvement</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">40% Efficiency Boost</h4>
              <p className="text-sm text-gray-600">Operational improvements</p>
                      </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Insights</h4>
              <p className="text-sm text-gray-600">AI-powered recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main component
function GrowthAssessmentPageContent() {
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
          <FormHeader />
          <GrowthAssessmentForm />
        </motion.div>
      </div>

      {/* Enhanced Trust Footer */}
      <TrustFooter />
    </div>
  )
}

// Main component with reCAPTCHA provider
export default function GrowthAssessmentPage() {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
  
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    console.warn('reCAPTCHA site key not found, using test key. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY for production.')
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <GrowthAssessmentPageContent />
    </GoogleReCaptchaProvider>
  )
}