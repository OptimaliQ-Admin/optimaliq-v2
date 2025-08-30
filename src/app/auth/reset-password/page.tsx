/**
 * OptimaliQ Password Reset Page
 * Secure password reset flow with email verification
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Clock,
  Key,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Input } from '@/components/ui/input'

export default function PasswordResetPage() {
  const [step, setStep] = React.useState<'request' | 'sent' | 'reset'>('request')
  const [email, setEmail] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  // Get reset token from URL (in real app)
  const [resetToken] = React.useState(new URLSearchParams(window.location.search).get('token'))

  React.useEffect(() => {
    if (resetToken) {
      setStep('reset')
    }
  }, [resetToken])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('sent')
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Redirect to login with success message
      window.location.href = '/auth/login?message=password-reset-success'
    } catch (error) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getStrengthLabel = (strength: number) => {
    if (strength <= 1) return 'Weak'
    if (strength <= 2) return 'Fair'
    if (strength <= 3) return 'Good'
    if (strength <= 4) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'error'
    if (strength <= 2) return 'warning'
    if (strength <= 3) return 'info'
    return 'success'
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

          {step === 'request' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <form onSubmit={handleRequestReset} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!email}
                    loading={isLoading}
                    loadingText="Sending Reset Link..."
                  >
                    Send Reset Link
                    <Mail className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link href="/auth/login" className="text-primary hover:underline">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'sent' && (
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
                  <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                  <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Click the link in the email to reset your password.
                  </p>

                  <Alert
                    variant="info"
                    title="Didn't receive the email?"
                    description="Check your spam folder or wait a few minutes. The link will expire in 1 hour for security."
                    className="mb-6"
                  />

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleRequestReset({ preventDefault: () => {} } as React.FormEvent)}
                      loading={isLoading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Email
                    </Button>
                    
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/auth/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg inline-flex mb-4">
                    <Key className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
                  <p className="text-muted-foreground">
                    Enter a strong new password for your account.
                  </p>
                </div>

                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <form onSubmit={handlePasswordReset} className="space-y-6">
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
                    
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Password Strength</span>
                          <StatusBadge status={getStrengthColor(getPasswordStrength(newPassword)) as any} size="xs">
                            {getStrengthLabel(getPasswordStrength(newPassword))}
                          </StatusBadge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              getPasswordStrength(newPassword) <= 1 ? 'bg-red-500' :
                              getPasswordStrength(newPassword) <= 2 ? 'bg-yellow-500' :
                              getPasswordStrength(newPassword) <= 3 ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(getPasswordStrength(newPassword) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <div className="space-y-3 text-xs text-muted-foreground">
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
                      <div className={`flex items-center space-x-2 ${/[a-z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${/[0-9]/.test(newPassword) ? 'text-green-600' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>One number</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || getPasswordStrength(newPassword) < 3}
                    loading={isLoading}
                    loadingText="Resetting Password..."
                  >
                    Reset Password
                    <Key className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Security Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Security Notice</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• Reset links expire after 1 hour for security</p>
                    <p>• We'll never ask for your password via email</p>
                    <p>• All password resets are logged for security monitoring</p>
                    <p>• Contact support if you need additional assistance</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help with your account?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/faq">
                  <AlertCircle className="h-4 w-4 mr-2" />
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
