/**
 * OptimaliQ Profile Setup Page
 * Complete user profile setup after email verification
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  User,
  Building,
  MapPin,
  Phone,
  Globe,
  Target,
  Users,
  Briefcase,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Upload,
  Camera,
  Save,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Profile setup data
const profileData = {
  steps: [
    { id: 'personal', title: 'Personal Information', description: 'Basic profile details' },
    { id: 'organization', title: 'Organization Details', description: 'Company and role information' },
    { id: 'preferences', title: 'Preferences', description: 'Customization and settings' },
    { id: 'complete', title: 'Complete', description: 'Finish setup' }
  ],
  roles: [
    { value: 'ceo', label: 'CEO/Executive Director' },
    { value: 'coo', label: 'COO/Operations Director' },
    { value: 'cfo', label: 'CFO/Finance Director' },
    { value: 'manager', label: 'Department Manager' },
    { value: 'director', label: 'Program Director' },
    { value: 'analyst', label: 'Analyst/Specialist' },
    { value: 'consultant', label: 'Consultant/Advisor' },
    { value: 'other', label: 'Other' }
  ],
  departments: [
    { value: 'executive', label: 'Executive Leadership' },
    { value: 'operations', label: 'Operations' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'it', label: 'Information Technology' },
    { value: 'programs', label: 'Programs/Services' },
    { value: 'development', label: 'Development/Fundraising' },
    { value: 'other', label: 'Other' }
  ],
  organizationSizes: [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ],
  industries: [
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'nonprofit', label: 'Non-Profit' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ],
  timezones: [
    { value: 'PST', label: 'Pacific Time (PST)' },
    { value: 'MST', label: 'Mountain Time (MST)' },
    { value: 'CST', label: 'Central Time (CST)' },
    { value: 'EST', label: 'Eastern Time (EST)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'GMT', label: 'GMT' }
  ]
}

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [profileData, setProfileData] = React.useState({
    // Personal Information
    firstName: '',
    lastName: '',
    jobTitle: '',
    role: '',
    department: '',
    phone: '',
    timezone: '',
    bio: '',
    // Organization Details
    organizationName: '',
    organizationSize: '',
    industry: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    // Preferences
    emailNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    assessmentReminders: true,
    marketingEmails: false,
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < profileData.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Redirect to dashboard
      window.location.href = '/dashboard?welcome=true'
    } catch (error) {
      console.error('Failed to complete profile setup', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return profileData.firstName && profileData.lastName && profileData.jobTitle && profileData.role
      case 1: // Organization Details
        return profileData.organizationName && profileData.organizationSize && profileData.industry
      case 2: // Preferences
        return true // All preferences are optional
      default:
        return true
    }
  }

  const getStepProgress = () => {
    return ((currentStep + 1) / profileData.steps.length) * 100
  }

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
            <StatusBadge status="info" size="sm">Profile Setup</StatusBadge>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-4xl">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-6">Complete Your Profile</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us personalize your OptimaliQ experience by completing your profile setup.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <Progress 
                value={getStepProgress()} 
                showLabel 
                labelPosition="top"
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                {profileData.steps.map((step, index) => (
                  <div key={step.id} className={`text-center ${index <= currentStep ? 'text-primary font-medium' : ''}`}>
                    <div>{step.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Step Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Setup Steps</h3>
                <div className="space-y-3">
                  {profileData.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        index === currentStep 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : index < currentStep 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'text-muted-foreground'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === currentStep 
                          ? 'bg-primary text-primary-foreground' 
                          : index < currentStep 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted'
                      }`}>
                        {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs opacity-75">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2"
            >
              <Card className="p-8">
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                      <p className="text-muted-foreground mb-6">
                        Tell us about yourself to personalize your OptimaliQ experience.
                      </p>
                    </div>

                    <Grid cols={2} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </Grid>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Job Title *
                      </label>
                      <Input
                        value={profileData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="e.g., Executive Director, Operations Manager"
                        required
                      />
                    </div>

                    <Grid cols={2} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Role *
                        </label>
                        <Select
                          options={profileData.roles}
                          value={profileData.role}
                          onValueChange={(value) => handleInputChange('role', value)}
                          placeholder="Select your role"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Department
                        </label>
                        <Select
                          options={profileData.departments}
                          value={profileData.department}
                          onValueChange={(value) => handleInputChange('department', value)}
                          placeholder="Select department"
                        />
                      </div>
                    </Grid>

                    <Grid cols={2} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Timezone
                        </label>
                        <Select
                          options={profileData.timezones}
                          value={profileData.timezone}
                          onValueChange={(value) => handleInputChange('timezone', value)}
                          placeholder="Select timezone"
                        />
                      </div>
                    </Grid>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bio (Optional)
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us a bit about yourself and your role..."
                        rows={3}
                        className="w-full p-3 border rounded-lg resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Organization Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Organization Details</h2>
                      <p className="text-muted-foreground mb-6">
                        Provide information about your organization to customize assessments and insights.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Organization Name *
                      </label>
                      <Input
                        value={profileData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="Enter your organization name"
                        required
                      />
                    </div>

                    <Grid cols={2} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Organization Size *
                        </label>
                        <Select
                          options={profileData.organizationSizes}
                          value={profileData.organizationSize}
                          onValueChange={(value) => handleInputChange('organizationSize', value)}
                          placeholder="Select size"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Industry *
                        </label>
                        <Select
                          options={profileData.industries}
                          value={profileData.industry}
                          onValueChange={(value) => handleInputChange('industry', value)}
                          placeholder="Select industry"
                          required
                        />
                      </div>
                    </Grid>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website
                      </label>
                      <Input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourorganization.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Address
                      </label>
                      <Input
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </div>

                    <Grid cols={3} gap={4}>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City
                        </label>
                        <Input
                          value={profileData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          State/Province
                        </label>
                        <Input
                          value={profileData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Country
                        </label>
                        <Input
                          value={profileData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          placeholder="Enter country"
                        />
                      </div>
                    </Grid>
                  </div>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Preferences & Settings</h2>
                      <p className="text-muted-foreground mb-6">
                        Customize your OptimaliQ experience with these preference settings.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">Assessment results, updates, and important announcements</div>
                          </div>
                          <Checkbox
                            checked={profileData.emailNotifications}
                            onCheckedChange={(checked) => handleInputChange('emailNotifications', checked as boolean)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">SMS Notifications</div>
                            <div className="text-sm text-muted-foreground">Urgent alerts and reminders</div>
                          </div>
                          <Checkbox
                            checked={profileData.smsNotifications}
                            onCheckedChange={(checked) => handleInputChange('smsNotifications', checked as boolean)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Weekly Digest</div>
                            <div className="text-sm text-muted-foreground">Weekly summary of insights and progress</div>
                          </div>
                          <Checkbox
                            checked={profileData.weeklyDigest}
                            onCheckedChange={(checked) => handleInputChange('weeklyDigest', checked as boolean)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Assessment Reminders</div>
                            <div className="text-sm text-muted-foreground">Reminders for scheduled assessments and follow-ups</div>
                          </div>
                          <Checkbox
                            checked={profileData.assessmentReminders}
                            onCheckedChange={(checked) => handleInputChange('assessmentReminders', checked as boolean)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Marketing Emails</div>
                            <div className="text-sm text-muted-foreground">Product updates, tips, and educational content</div>
                          </div>
                          <Checkbox
                            checked={profileData.marketingEmails}
                            onCheckedChange={(checked) => handleInputChange('marketingEmails', checked as boolean)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Display Preferences</h3>
                      <Grid cols={3} gap={4}>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Language
                          </label>
                          <Select
                            options={[
                              { value: 'en', label: 'English' },
                              { value: 'es', label: 'Spanish' },
                              { value: 'fr', label: 'French' }
                            ]}
                            value={profileData.language}
                            onValueChange={(value) => handleInputChange('language', value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Date Format
                          </label>
                          <Select
                            options={[
                              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                            ]}
                            value={profileData.dateFormat}
                            onValueChange={(value) => handleInputChange('dateFormat', value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Time Format
                          </label>
                          <Select
                            options={[
                              { value: '12h', label: '12 Hour' },
                              { value: '24h', label: '24 Hour' }
                            ]}
                            value={profileData.timeFormat}
                            onValueChange={(value) => handleInputChange('timeFormat', value)}
                          />
                        </div>
                      </Grid>
                    </div>
                  </div>
                )}

                {/* Step 4: Complete */}
                {currentStep === 3 && (
                  <div className="text-center space-y-6">
                    <div className="p-3 bg-green-500/10 text-green-600 rounded-lg inline-flex mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Profile Setup Complete!</h2>
                    <p className="text-muted-foreground">
                      Your profile has been configured. You're ready to start using OptimaliQ 
                      to transform your organization's performance and growth.
                    </p>

                    <Alert
                      variant="success"
                      title="Welcome to OptimaliQ!"
                      description="You now have access to all features including assessments, analytics, and growth planning tools."
                      className="mb-6"
                    />

                    <div className="space-y-3">
                      <Button
                        onClick={handleComplete}
                        className="w-full"
                        size="lg"
                        loading={isLoading}
                        loadingText="Setting up your dashboard..."
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/assessment">
                          Start Your First Assessment
                          <Target className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                    >
                      {currentStep === 2 ? 'Complete Setup' : 'Next Step'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
