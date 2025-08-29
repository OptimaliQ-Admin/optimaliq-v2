/**
 * OptimaliQ Register Page
 * AI-powered registration with comprehensive onboarding and organization setup
 */

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  ArrowRight, 
  Shield, 
  Zap,
  CheckCircle,
  Users,
  Target,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Alert } from '@/components/ui/feedback'
import { Checkbox, Select } from '@/components/ui/form'
import { Progress } from '@/components/ui/data-display'

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [agreeToTerms, setAgreeToTerms] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: '',
    organizationSize: '',
    industry: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const organizationTypes = [
    { value: 'non_profit', label: 'Non-Profit Organization' },
    { value: 'charity', label: 'Charity Foundation' },
    { value: 'ngo', label: 'NGO' },
    { value: 'social_enterprise', label: 'Social Enterprise' },
    { value: 'community_group', label: 'Community Group' },
    { value: 'religious_organization', label: 'Religious Organization' }
  ]

  const organizationSizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ]

  const industries = [
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'social_services', label: 'Social Services' },
    { value: 'arts_culture', label: 'Arts & Culture' },
    { value: 'youth_development', label: 'Youth Development' },
    { value: 'community_development', label: 'Community Development' },
    { value: 'international_aid', label: 'International Aid' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    if (step === 2) {
      if (!formData.organizationName) newErrors.organizationName = 'Organization name is required'
      if (!formData.organizationType) newErrors.organizationType = 'Organization type is required'
      if (!formData.organizationSize) newErrors.organizationSize = 'Organization size is required'
      if (!formData.industry) newErrors.industry = 'Industry is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return
    if (!agreeToTerms) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the terms and conditions' }))
      return
    }

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('Registration successful', formData)
      // Handle successful registration
    } catch (error) {
      console.error('Registration failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Strategic Planning",
      description: "AI-powered strategic assessment and planning tools"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth Optimization",
      description: "Data-driven insights to maximize your impact"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Seamless team management and collaboration"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OptimaliQ</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                  <p className="text-muted-foreground">
                    Join OptimaliQ and transform your organization with AI-powered insights
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <Progress 
                    value={(currentStep / 3) * 100} 
                    showLabel 
                    labelPosition="top"
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Personal Info</span>
                    <span>Organization</span>
                    <span>Complete</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <Grid cols={2} gap={4}>
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            leftIcon={<User className="h-4 w-4" />}
                            validation={errors.firstName ? { type: 'error', message: errors.firstName } : undefined}
                            fullWidth
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            leftIcon={<User className="h-4 w-4" />}
                            validation={errors.lastName ? { type: 'error', message: errors.lastName } : undefined}
                            fullWidth
                          />
                        </div>
                      </Grid>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          leftIcon={<Mail className="h-4 w-4" />}
                          validation={errors.email ? { type: 'error', message: errors.email } : undefined}
                          fullWidth
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                          Password
                        </label>
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          leftIcon={<Lock className="h-4 w-4" />}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                          validation={errors.password ? { type: 'error', message: errors.password } : undefined}
                          fullWidth
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                          Confirm Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          leftIcon={<Lock className="h-4 w-4" />}
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                          validation={errors.confirmPassword ? { type: 'error', message: errors.confirmPassword } : undefined}
                          fullWidth
                        />
                      </div>

                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="w-full group"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 2: Organization Information */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="organizationName" className="block text-sm font-medium mb-2">
                          Organization Name
                        </label>
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder="Enter your organization name"
                          value={formData.organizationName}
                          onChange={(e) => handleInputChange('organizationName', e.target.value)}
                          leftIcon={<Building className="h-4 w-4" />}
                          validation={errors.organizationName ? { type: 'error', message: errors.organizationName } : undefined}
                          fullWidth
                        />
                      </div>

                      <div>
                        <label htmlFor="organizationType" className="block text-sm font-medium mb-2">
                          Organization Type
                        </label>
                        <Select
                          options={organizationTypes}
                          placeholder="Select organization type"
                          value={formData.organizationType}
                          onValueChange={(value) => handleInputChange('organizationType', value)}
                          fullWidth
                        />
                      </div>

                      <Grid cols={2} gap={4}>
                        <div>
                          <label htmlFor="organizationSize" className="block text-sm font-medium mb-2">
                            Organization Size
                          </label>
                          <Select
                            options={organizationSizes}
                            placeholder="Select size"
                            value={formData.organizationSize}
                            onValueChange={(value) => handleInputChange('organizationSize', value)}
                            fullWidth
                          />
                        </div>
                        <div>
                          <label htmlFor="industry" className="block text-sm font-medium mb-2">
                            Industry
                          </label>
                          <Select
                            options={industries}
                            placeholder="Select industry"
                            value={formData.industry}
                            onValueChange={(value) => handleInputChange('industry', value)}
                            fullWidth
                          />
                        </div>
                      </Grid>

                      <Flex gap={4}>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleNext}
                          className="flex-1 group"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Flex>
                    </motion.div>
                  )}

                  {/* Step 3: Complete Registration */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <Alert
                        variant="success"
                        title="Almost Done!"
                        description="Please review your information and agree to our terms to complete your registration."
                        icon={<CheckCircle className="h-4 w-4" />}
                      />

                      <div className="space-y-4">
                        <h3 className="font-semibold">Review Your Information</h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium">{formData.firstName} {formData.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium">{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Organization:</span>
                            <span className="text-sm font-medium">{formData.organizationName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            <span className="text-sm font-medium">
                              {organizationTypes.find(t => t.value === formData.organizationType)?.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        label="I agree to the Terms of Service and Privacy Policy"
                        description="By checking this box, you agree to our terms and conditions."
                      />

                      {errors.terms && (
                        <p className="text-sm text-destructive">{errors.terms}</p>
                      )}

                      <Flex gap={4}>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 group"
                          loading={isLoading}
                          loadingText="Creating account..."
                        >
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Flex>
                    </motion.div>
                  )}
                </form>
              </Card>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Why Choose OptimaliQ?</h2>
                  <p className="text-muted-foreground mb-6">
                    Join hundreds of non-profit organizations already transforming their impact with AI-powered insights.
                  </p>
                  
                  <Stack spacing={6}>
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </Stack>
                </div>

                {/* Security Notice */}
                <Alert
                  variant="info"
                  title="Secure & Compliant"
                  description="Your data is protected with enterprise-grade security and SOC 2 Type II compliance."
                  icon={<Shield className="h-4 w-4" />}
                />

                {/* Quick Stats */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">2.5x</div>
                      <div className="text-sm text-muted-foreground">Growth</div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
