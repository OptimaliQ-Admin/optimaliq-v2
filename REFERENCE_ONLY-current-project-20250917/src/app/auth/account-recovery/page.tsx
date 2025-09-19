/**
 * OptimaliQ Account Recovery Page
 * Comprehensive account recovery with multiple verification methods
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield,
  Key,
  Mail,
  Phone,
  Smartphone,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Clock,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  HelpCircle,
  MessageSquare,
  Calendar,
  Info,
  Warning,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Account recovery data
const recoveryData = {
  verificationMethods: [
    {
      id: 'email',
      name: 'Email Verification',
      description: 'Verify your identity using your registered email address',
      icon: <Mail className="h-6 w-6" />,
      security: 'Medium',
      timeRequired: '5-10 minutes',
      available: true,
      steps: [
        'Enter your email address',
        'Check your email for verification code',
        'Enter the 6-digit verification code',
        'Reset your password or recover account'
      ]
    },
    {
      id: 'phone',
      name: 'Phone Verification',
      description: 'Verify using your registered phone number via SMS',
      icon: <Smartphone className="h-6 w-6" />,
      security: 'Medium',
      timeRequired: '2-5 minutes',
      available: true,
      steps: [
        'Enter your phone number',
        'Receive SMS with verification code',
        'Enter the verification code',
        'Complete account recovery'
      ]
    },
    {
      id: 'backup-codes',
      name: 'Backup Codes',
      description: 'Use your saved backup codes from 2FA setup',
      icon: <Key className="h-6 w-6" />,
      security: 'High',
      timeRequired: '1-2 minutes',
      available: true,
      steps: [
        'Locate your backup codes',
        'Enter one unused backup code',
        'Verify your identity',
        'Access your account'
      ]
    },
    {
      id: 'admin-verification',
      name: 'Administrator Verification',
      description: 'Have your organization administrator verify your identity',
      icon: <Building className="h-6 w-6" />,
      security: 'High',
      timeRequired: '1-24 hours',
      available: false,
      steps: [
        'Submit recovery request',
        'Administrator receives notification',
        'Administrator verifies your identity',
        'Account access is restored'
      ]
    },
    {
      id: 'support-verification',
      name: 'Support Team Verification',
      description: 'Manual verification by our support team',
      icon: <HelpCircle className="h-6 w-6" />,
      security: 'Highest',
      timeRequired: '24-48 hours',
      available: true,
      steps: [
        'Submit detailed recovery request',
        'Provide identity verification documents',
        'Support team manual review',
        'Account recovery completion'
      ]
    }
  ],
  securityQuestions: [
    'What was the name of your first pet?',
    'What city were you born in?',
    'What was your mother\'s maiden name?',
    'What was the name of your first school?',
    'What was your childhood nickname?'
  ]
}

export default function AccountRecoveryPage() {
  const [step, setStep] = React.useState<'method' | 'verify' | 'reset' | 'complete'>('method')
  const [selectedMethod, setSelectedMethod] = React.useState(recoveryData.verificationMethods[0])
  const [contactInfo, setContactInfo] = React.useState('')
  const [verificationCode, setVerificationCode] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleMethodSelect = (method: typeof recoveryData.verificationMethods[0]) => {
    setSelectedMethod(method)
    setError('')
  }

  const handleSendVerification = async () => {
    if (!contactInfo) {
      setError('Please enter your email address or phone number')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('verify')
    } catch (error) {
      setError('Failed to send verification. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code')
      return
    }

    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('reset')
    } catch (error) {
      setError('Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('complete')
    } catch (error) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'Highest': return 'error'
      case 'High': return 'warning'
      case 'Medium': return 'info'
      default: return 'success'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center">
          <Link href="/auth/login" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">OptimaliQ</span>
            </Link>

            <StatusBadge status="warning" className="mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Account Recovery
            </StatusBadge>
            <h1 className="text-4xl font-bold mb-6">Recover Your Account</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a verification method to recover access to your OptimaliQ account safely and securely.
            </p>

            {/* Progress */}
            <div className="max-w-2xl mx-auto mt-8">
              <Progress 
                value={step === 'method' ? 25 : step === 'verify' ? 50 : step === 'reset' ? 75 : 100} 
                showLabel 
                labelPosition="top"
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Choose Method</span>
                <span>Verify Identity</span>
                <span>Reset Access</span>
                <span>Complete</span>
              </div>
            </div>
          </motion.div>

          {/* Method Selection */}
          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Choose Recovery Method</h2>
                
                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <div className="space-y-4 mb-8">
                  {recoveryData.verificationMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod.id === method.id 
                          ? 'border-primary bg-primary/5' 
                          : method.available 
                            ? 'hover:bg-muted/50' 
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => method.available && handleMethodSelect(method)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{method.name}</h3>
                            <StatusBadge status={getSecurityColor(method.security) as any} size="sm">
                              {method.security} Security
                            </StatusBadge>
                            {!method.available && (
                              <StatusBadge status="warning" size="sm">Enterprise Only</StatusBadge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{method.timeRequired}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedMethod.id === 'email' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Enter your registered email address"
                      autoFocus
                    />
                  </div>
                )}

                {selectedMethod.id === 'phone' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Enter your registered phone number"
                      autoFocus
                    />
                  </div>
                )}

                {selectedMethod.id === 'backup-codes' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Backup Code
                    </label>
                    <Input
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Enter one of your backup codes"
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter one of the backup codes you saved during 2FA setup
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                  
                  {selectedMethod.available ? (
                    <Button 
                      onClick={handleSendVerification}
                      disabled={!contactInfo && selectedMethod.id !== 'support-verification'}
                      loading={isLoading}
                      loadingText="Sending..."
                    >
                      {selectedMethod.id === 'backup-codes' ? 'Verify Code' : 'Send Verification'}
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={() => window.location.href = '/contact?inquiry=enterprise'}>
                      Contact Sales
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Verification Step */}
          {step === 'verify' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Verify Your Identity</h2>
                
                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <div className="text-center mb-8">
                  <div className="p-4 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                    {selectedMethod.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{selectedMethod.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedMethod.id === 'email' 
                      ? `We've sent a verification code to ${contactInfo}`
                      : selectedMethod.id === 'phone'
                      ? `We've sent an SMS code to ${contactInfo}`
                      : 'Enter your backup code to verify your identity'
                    }
                  </p>
                </div>

                <div className="max-w-sm mx-auto mb-8">
                  <label className="block text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('method')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Method
                  </Button>
                  <Button 
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6}
                    loading={isLoading}
                    loadingText="Verifying..."
                  >
                    Verify Code
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Password Reset */}
          {step === 'reset' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Create New Password</h2>
                
                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        autoFocus
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
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="font-medium">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center space-x-2 ${newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${newPassword.length >= 8 ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${/[0-9]/.test(newPassword) ? 'text-green-600' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>One number</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep('verify')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handlePasswordReset}
                    disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                    loading={isLoading}
                    loadingText="Resetting..."
                  >
                    Reset Password
                    <Key className="h-4 w-4 ml-2" />
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
                  <h2 className="text-2xl font-bold mb-4">Account Recovered!</h2>
                  <p className="text-muted-foreground mb-8">
                    Your account has been successfully recovered. You can now sign in with your new password.
                  </p>

                  <Alert
                    variant="success"
                    title="Security Recommendation"
                    description="Consider enabling two-factor authentication to further secure your account."
                    className="mb-8"
                  />

                  <div className="space-y-3">
                    <Button asChild>
                      <Link href="/auth/login">
                        Sign In to Your Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/auth/2fa">
                        Set Up 2FA
                        <Shield className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security Information */}
          {step !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Account Recovery Security</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>• All recovery attempts are logged for security monitoring</p>
                      <p>• Verification codes expire after 15 minutes</p>
                      <p>• Multiple failed attempts will temporarily lock recovery</p>
                      <p>• We'll notify you via email when account recovery is completed</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Still having trouble accessing your account?
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
