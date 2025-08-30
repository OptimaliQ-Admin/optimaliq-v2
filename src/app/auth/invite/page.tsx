/**
 * OptimaliQ Team Invitation Acceptance Page
 * Accept team invitations and join organization workspaces
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users,
  Mail,
  Building,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Clock,
  Star,
  Award,
  Target,
  BarChart3,
  Calendar,
  Settings,
  Eye,
  EyeOff,
  Key,
  Crown,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  Info,
  Warning,
  HelpCircle,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Input } from '@/components/ui/input'
import { Select, Checkbox } from '@/components/ui/form'

// Invitation data
const invitationData = {
  invitation: {
    id: 'inv-abc123xyz',
    organization: 'HealthForward',
    organizationType: 'Healthcare Non-Profit',
    invitedBy: {
      name: 'Jennifer Walsh',
      role: 'CEO & Executive Director',
      email: 'jennifer.walsh@healthforward.org'
    },
    role: 'Team Member',
    permissions: ['View assessments', 'Complete assessments', 'View team results', 'Add comments'],
    invitedOn: '2024-08-28',
    expiresOn: '2024-09-11',
    message: 'Join our team to collaborate on strategic assessments and help drive our organizational growth initiatives.',
    organizationInfo: {
      size: '150 employees',
      industry: 'Healthcare',
      location: 'Portland, OR',
      website: 'https://healthforward.org',
      description: 'Leading healthcare non-profit focused on community health and wellness initiatives.'
    }
  },
  roles: [
    { value: 'viewer', label: 'Viewer', description: 'View-only access to assessments and results' },
    { value: 'member', label: 'Team Member', description: 'Complete assessments and collaborate on action plans' },
    { value: 'manager', label: 'Manager', description: 'Manage team assessments and view detailed analytics' },
    { value: 'admin', label: 'Administrator', description: 'Full access to all features and settings' }
  ],
  benefits: [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Collaborative Assessments',
      description: 'Work together on organizational assessments and strategic planning'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Shared Analytics',
      description: 'Access team dashboards and progress tracking'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Insights',
      description: 'Compare perspectives and align on organizational goals'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Growth Planning',
      description: 'Participate in action planning and implementation tracking'
    }
  ]
}

export default function InvitationPage() {
  const [step, setStep] = React.useState<'review' | 'signup' | 'complete'>('review')
  const [accountData, setAccountData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    department: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  // Get invitation token from URL (in real app)
  const [inviteToken] = React.useState(new URLSearchParams(window.location.search).get('token'))
  const [hasAccount, setHasAccount] = React.useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setAccountData(prev => ({ ...prev, [field]: value }))
  }

  const handleAcceptInvitation = async () => {
    if (hasAccount) {
      // Redirect to login with invitation context
      window.location.href = `/auth/login?invite=${inviteToken}`
      return
    }

    setStep('signup')
  }

  const handleCompleteSignup = async () => {
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!accountData.agreeToTerms) {
      setError('Please agree to the terms of service')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      setStep('complete')
    } catch (error) {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isSignupValid = accountData.firstName && accountData.lastName && 
                      accountData.email && accountData.password && 
                      accountData.confirmPassword && accountData.agreeToTerms

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilExpiry = () => {
    const expiry = new Date(invitationData.invitation.expiresOn)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
            <StatusBadge status="info" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Team Invitation
            </StatusBadge>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-4xl">
          {/* Review Invitation */}
          {step === 'review' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-16">
                <StatusBadge status="primary" className="mb-6">
                  <Mail className="h-4 w-4 mr-2" />
                  Team Invitation
                </StatusBadge>
                <h1 className="text-4xl font-bold mb-6">
                  You're Invited to Join{' '}
                  <span className="text-primary">{invitationData.invitation.organization}</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  {invitationData.invitation.invitedBy.name} has invited you to collaborate 
                  on OptimaliQ assessments and strategic planning.
                </p>
              </div>

              <Grid cols={2} gap={8}>
                {/* Invitation Details */}
                <Card className="p-8">
                  <h2 className="text-xl font-bold mb-6">Invitation Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Building className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{invitationData.invitation.organization}</h3>
                        <p className="text-sm text-muted-foreground">{invitationData.invitation.organizationType}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invited by:</span>
                        <span className="font-medium">{invitationData.invitation.invitedBy.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium">{invitationData.invitation.invitedBy.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Role:</span>
                        <StatusBadge status="info" size="sm">{invitationData.invitation.role}</StatusBadge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invited:</span>
                        <span className="font-medium">{formatDate(invitationData.invitation.invitedOn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium">
                          {formatDate(invitationData.invitation.expiresOn)}
                          <StatusBadge status="warning" size="xs" className="ml-2">
                            {getDaysUntilExpiry()} days left
                          </StatusBadge>
                        </span>
                      </div>
                    </div>

                    {invitationData.invitation.message && (
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-2">Personal Message:</h4>
                        <p className="text-sm text-muted-foreground italic">
                          "{invitationData.invitation.message}"
                        </p>
                      </div>
                    )}

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Your Permissions:</h4>
                      <div className="space-y-2">
                        {invitationData.invitation.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Organization Info */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">About {invitationData.invitation.organization}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{invitationData.invitation.organizationInfo.size}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{invitationData.invitation.organizationInfo.industry}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{invitationData.invitation.organizationInfo.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={invitationData.invitation.organizationInfo.website} 
                           className="text-primary hover:underline" 
                           target="_blank" 
                           rel="noopener noreferrer">
                          {invitationData.invitation.organizationInfo.website}
                        </a>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {invitationData.invitation.organizationInfo.description}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">What You'll Get</h3>
                    <div className="space-y-4">
                      {invitationData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                            {benefit.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">{benefit.title}</h4>
                            <p className="text-xs text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </Grid>

              <div className="mt-8 text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Checkbox
                      id="has-account"
                      checked={hasAccount}
                      onCheckedChange={(checked) => setHasAccount(checked as boolean)}
                    />
                    <label htmlFor="has-account" className="text-sm">
                      I already have an OptimaliQ account
                    </label>
                  </div>
                </div>

                <Button onClick={handleAcceptInvitation} size="lg" className="mr-4">
                  {hasAccount ? 'Sign In & Join Team' : 'Accept Invitation'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Signup Step */}
          {step === 'signup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
                <p className="text-muted-foreground mb-6">
                  Complete your profile to join {invitationData.invitation.organization} on OptimaliQ.
                </p>
                
                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <form className="space-y-6">
                  <Grid cols={2} gap={4}>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <Input
                        value={accountData.firstName}
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
                        value={accountData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </Grid>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <Grid cols={2} gap={4}>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Job Title
                      </label>
                      <Input
                        value={accountData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="e.g., Program Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Department
                      </label>
                      <Input
                        value={accountData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        placeholder="e.g., Operations"
                      />
                    </div>
                  </Grid>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={accountData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a secure password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm Password *
                    </label>
                    <Input
                      type="password"
                      value={accountData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={accountData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                      required
                    />
                    <label htmlFor="terms" className="text-sm">
                      I agree to OptimaliQ's{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </form>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep('review')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleCompleteSignup}
                    disabled={!isSignupValid}
                    loading={isLoading}
                    loadingText="Creating account..."
                  >
                    Join Team
                    <Users className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Complete */}
          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="p-4 bg-green-500/10 text-green-600 rounded-lg inline-flex mb-6">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Welcome to the Team!</h2>
                  <p className="text-muted-foreground mb-8">
                    You've successfully joined {invitationData.invitation.organization} on OptimaliQ. 
                    You can now collaborate on assessments and strategic planning.
                  </p>

                  <Alert
                    variant="success"
                    title="Account Created"
                    description="Your account has been created and you've been added to the team workspace."
                    className="mb-8"
                  />

                  <div className="space-y-3">
                    <Button asChild>
                      <Link href="/dashboard">
                        Go to Team Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/assessment">
                        Start First Assessment
                        <Target className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Expiry Warning */}
          {step === 'review' && getDaysUntilExpiry() <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <Alert
                variant="warning"
                title="Invitation Expires Soon"
                description={`This invitation expires in ${getDaysUntilExpiry()} days. Accept it now to join the team.`}
                icon={<Clock className="h-4 w-4" />}
              />
            </motion.div>
          )}

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Questions about this invitation?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/faq">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  View FAQ
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
