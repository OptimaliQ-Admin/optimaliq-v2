/**
 * OptimaliQ Email Verification Page
 * Email verification flow with resend functionality
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  User,
  Settings,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'

export default function EmailVerificationPage() {
  const [verificationStatus, setVerificationStatus] = React.useState<'pending' | 'verifying' | 'success' | 'error'>('pending')
  const [isResending, setIsResending] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [countdown, setCountdown] = React.useState(0)

  // Get verification token and email from URL (in real app)
  const [verificationToken] = React.useState(new URLSearchParams(window.location.search).get('token'))
  const [emailParam] = React.useState(new URLSearchParams(window.location.search).get('email'))

  React.useEffect(() => {
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [emailParam])

  // Auto-verify if token is present
  React.useEffect(() => {
    if (verificationToken) {
      handleVerification()
    }
  }, [verificationToken])

  // Countdown timer for resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerification = async () => {
    setVerificationStatus('verifying')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate success/failure
      const isSuccess = Math.random() > 0.1 // 90% success rate for demo
      
      if (isSuccess) {
        setVerificationStatus('success')
        // In real app, redirect to dashboard or onboarding
        setTimeout(() => {
          window.location.href = '/auth/login?message=email-verified'
        }, 3000)
      } else {
        setVerificationStatus('error')
      }
    } catch (error) {
      setVerificationStatus('error')
    }
  }

  const handleResendEmail = async () => {
    setIsResending(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCountdown(60) // 60 second cooldown
    } catch (error) {
      console.error('Failed to resend verification email', error)
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
            <StatusBadge status="info" size="sm">Email Verification</StatusBadge>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">OptimaliQ</span>
            </Link>
          </motion.div>

          {/* Pending Verification */}
          {verificationStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg inline-flex mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
                  <p className="text-muted-foreground mb-6">
                    We've sent a verification link to{' '}
                    {email ? <strong>{email}</strong> : 'your email address'}. 
                    Click the link to verify your account and get started.
                  </p>

                  <Alert
                    variant="info"
                    title="Check your email"
                    description="The verification link will expire in 24 hours. If you don't see the email, check your spam folder."
                    className="mb-6"
                  />

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleResendEmail}
                      disabled={countdown > 0 || isResending}
                      loading={isResending}
                      loadingText="Sending..."
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {countdown > 0 ? `Resend in ${formatTime(countdown)}` : 'Resend Verification Email'}
                    </Button>
                    
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/auth/login">
                        Back to Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Verifying */}
          {verificationStatus === 'verifying' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg inline-flex mb-4">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Verifying Your Email</h1>
                  <p className="text-muted-foreground mb-6">
                    Please wait while we verify your email address...
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>This usually takes a few seconds</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Success */}
          {verificationStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="p-3 bg-green-500/10 text-green-600 rounded-lg inline-flex mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
                  <p className="text-muted-foreground mb-6">
                    Your email has been successfully verified. You can now access all OptimaliQ features.
                  </p>

                  <Alert
                    variant="success"
                    title="Welcome to OptimaliQ!"
                    description="You'll be redirected to the login page in a few seconds, or you can click the button below."
                    className="mb-6"
                  />

                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link href="/auth/login">
                        Continue to Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/assessment">
                        Start Free Assessment
                        <Target className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Error */}
          {verificationStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="p-3 bg-red-500/10 text-red-600 rounded-lg inline-flex mb-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                  <p className="text-muted-foreground mb-6">
                    We couldn't verify your email address. The link may have expired or been used already.
                  </p>

                  <Alert
                    variant="error"
                    title="Verification Error"
                    description="The verification link may be invalid or expired. Please request a new verification email."
                    className="mb-6"
                  />

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleResendEmail}
                      disabled={countdown > 0 || isResending}
                      loading={isResending}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Send New Verification Email
                    </Button>
                    
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/contact">
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Next Steps */}
          {verificationStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">What's Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-sm">Complete your first assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-sm">Set up your profile and preferences</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <span className="text-sm">Configure your organization settings</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </Container>
      </Section>
    </div>
  )
}
