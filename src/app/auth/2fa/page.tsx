/**
 * OptimaliQ Two-Factor Authentication Page
 * Secure 2FA setup and verification with multiple methods
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield,
  Smartphone,
  Mail,
  Key,
  QrCode,
  Copy,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Clock,
  Settings,
  Bell,
  Info,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Input } from '@/components/ui/input'

// 2FA data
const twoFAData = {
  methods: [
    {
      id: 'app',
      name: 'Authenticator App',
      description: 'Use Google Authenticator, Authy, or similar apps',
      icon: <Smartphone className="h-6 w-6" />,
      recommended: true,
      security: 'High',
      setup: [
        'Download an authenticator app',
        'Scan the QR code with your app',
        'Enter the 6-digit code to verify',
        'Save your backup codes'
      ]
    },
    {
      id: 'sms',
      name: 'SMS Text Message',
      description: 'Receive codes via text message',
      icon: <Mail className="h-6 w-6" />,
      recommended: false,
      security: 'Medium',
      setup: [
        'Enter your phone number',
        'Verify your phone with a test code',
        'Choose SMS as your 2FA method',
        'Save backup options'
      ]
    },
    {
      id: 'email',
      name: 'Email Verification',
      description: 'Receive codes via email (backup only)',
      icon: <Mail className="h-6 w-6" />,
      recommended: false,
      security: 'Medium',
      setup: [
        'Confirm your email address',
        'Set up primary 2FA method first',
        'Enable email as backup method',
        'Test the backup system'
      ]
    }
  ],
  backupCodes: [
    '1a2b-3c4d-5e6f',
    '7g8h-9i0j-1k2l',
    '3m4n-5o6p-7q8r',
    '9s0t-1u2v-3w4x',
    '5y6z-7a8b-9c0d',
    '1e2f-3g4h-5i6j',
    '7k8l-9m0n-1o2p',
    '3q4r-5s6t-7u8v'
  ],
  qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K',
  secretKey: 'JBSWY3DPEHPK3PXP'
}

export default function TwoFactorAuthPage() {
  const [step, setStep] = React.useState<'setup' | 'verify' | 'backup' | 'complete'>('setup')
  const [selectedMethod, setSelectedMethod] = React.useState(twoFAData.methods[0])
  const [verificationCode, setVerificationCode] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showSecret, setShowSecret] = React.useState(false)
  const [savedCodes, setSavedCodes] = React.useState<string[]>([])

  const handleMethodSelect = (method: typeof twoFAData.methods[0]) => {
    setSelectedMethod(method)
    setError('')
  }

  const handleSetupNext = () => {
    if (selectedMethod.id === 'sms' && !phoneNumber) {
      setError('Please enter your phone number')
      return
    }
    setStep('verify')
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('backup')
    } catch (error) {
      setError('Invalid verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    if (savedCodes.length === 0) {
      setError('Please save your backup codes before completing setup')
      return
    }

    setIsLoading(true)
    try {
      // Simulate completion
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('complete')
    } catch (error) {
      setError('Failed to complete 2FA setup')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadBackupCodes = () => {
    const content = twoFAData.backupCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optimaliq-backup-codes.txt'
    a.click()
    setSavedCodes(twoFAData.backupCodes)
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
            <StatusBadge status="warning" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              Security Setup
            </StatusBadge>
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
            <h1 className="text-4xl font-bold mb-6">Secure Your Account</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Add an extra layer of security to your OptimaliQ account with two-factor authentication.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <Progress 
                value={step === 'setup' ? 25 : step === 'verify' ? 50 : step === 'backup' ? 75 : 100} 
                showLabel 
                labelPosition="top"
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Choose Method</span>
                <span>Verify</span>
                <span>Backup Codes</span>
                <span>Complete</span>
              </div>
            </div>
          </motion.div>

          {/* Setup Step */}
          {step === 'setup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Choose Your 2FA Method</h2>
                
                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <div className="space-y-4 mb-8">
                  {twoFAData.methods.map((method, index) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod.id === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleMethodSelect(method)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{method.name}</h3>
                            {method.recommended && (
                              <StatusBadge status="primary" size="sm">Recommended</StatusBadge>
                            )}
                            <StatusBadge 
                              status={method.security === 'High' ? 'success' : 'warning'} 
                              size="sm"
                            >
                              {method.security} Security
                            </StatusBadge>
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedMethod.id === 'sms' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Skip for Now
                    </Link>
                  </Button>
                  <Button onClick={handleSetupNext}>
                    Continue Setup
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Verify Step */}
          {step === 'verify' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Verify Your Setup</h2>
                
                {error && (
                  <Alert
                    variant="error"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                {selectedMethod.id === 'app' && (
                  <div className="text-center mb-8">
                    <h3 className="font-semibold mb-4">Scan QR Code</h3>
                    <div className="inline-block p-4 bg-white rounded-lg mb-4">
                      <img 
                        src={twoFAData.qrCode} 
                        alt="QR Code for 2FA setup"
                        className="w-48 h-48"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Can't scan? Enter this key manually:
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <code className="px-3 py-1 bg-muted rounded font-mono text-sm">
                          {showSecret ? twoFAData.secretKey : '••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(twoFAData.secretKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod.id === 'sms' && (
                  <div className="text-center mb-8">
                    <h3 className="font-semibold mb-4">Verify Your Phone</h3>
                    <p className="text-muted-foreground mb-4">
                      We've sent a verification code to {phoneNumber}
                    </p>
                  </div>
                )}

                <div className="max-w-sm mx-auto mb-8">
                  <label className="block text-sm font-medium mb-2">
                    Enter 6-digit verification code
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
                  <Button variant="outline" onClick={() => setStep('setup')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerify}
                    disabled={verificationCode.length !== 6}
                    loading={isLoading}
                    loadingText="Verifying..."
                  >
                    Verify Code
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Backup Codes Step */}
          {step === 'backup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Save Your Backup Codes</h2>
                
                <Alert
                  variant="warning"
                  title="Important!"
                  description="Save these backup codes in a secure location. You'll need them if you lose access to your primary 2FA method."
                  className="mb-6"
                />

                <div className="bg-muted/30 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                    {twoFAData.backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                        <span>{code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <Button onClick={downloadBackupCodes} className="mb-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup Codes
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Each code can only be used once. Store them securely.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('verify')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    disabled={savedCodes.length === 0}
                    loading={isLoading}
                    loadingText="Completing setup..."
                  >
                    Complete Setup
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="p-4 bg-green-500/10 text-green-600 rounded-lg inline-flex mb-6">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">2FA Setup Complete!</h2>
                  <p className="text-muted-foreground mb-8">
                    Your account is now protected with two-factor authentication. 
                    You'll be prompted for a code when signing in from new devices.
                  </p>

                  <Alert
                    variant="success"
                    title="Account Secured"
                    description="Your OptimaliQ account now has enterprise-grade security protection."
                    className="mb-8"
                  />

                  <div className="space-y-3">
                    <Button asChild>
                      <Link href="/dashboard">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/settings/security">
                        Manage Security Settings
                        <Settings className="ml-2 h-4 w-4" />
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
                    <h4 className="font-semibold text-blue-800 mb-2">Why Enable 2FA?</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>• Protects against unauthorized access even if password is compromised</p>
                      <p>• Required for enterprise customers and recommended for all users</p>
                      <p>• Reduces account takeover risk by 99.9%</p>
                      <p>• Complies with security best practices and regulations</p>
                    </div>
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
