/**
 * OptimaliQ SSO Login Options Page
 * Single Sign-On configuration and login options for enterprise customers
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield,
  Building,
  Key,
  Globe,
  Users,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Lock,
  Unlock,
  Star,
  Award,
  Target,
  BarChart3,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Chrome,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Apple,
  Microsoft,
  Google,
  Slack,
  AtSign,
  Database,
  Server,
  Cloud,
  Network,
  Cpu,
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'

// SSO data
const ssoData = {
  providers: [
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Sign in with your Google Workspace account',
      icon: <Google className="h-6 w-6" />,
      color: 'bg-red-500',
      popular: true,
      features: ['Single sign-on', 'Directory sync', 'Group management', 'Security policies'],
      setup: 'Contact support for Google Workspace SSO setup'
    },
    {
      id: 'microsoft',
      name: 'Microsoft Azure AD',
      description: 'Sign in with your Microsoft Azure Active Directory',
      icon: <Microsoft className="h-6 w-6" />,
      color: 'bg-blue-500',
      popular: true,
      features: ['Azure AD integration', 'Conditional access', 'Multi-factor auth', 'Compliance'],
      setup: 'Enterprise feature - contact sales'
    },
    {
      id: 'okta',
      name: 'Okta',
      description: 'Enterprise identity and access management',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-blue-600',
      popular: false,
      features: ['Universal directory', 'Adaptive MFA', 'Lifecycle management', 'API access'],
      setup: 'Enterprise feature - contact sales'
    },
    {
      id: 'saml',
      name: 'SAML 2.0',
      description: 'Custom SAML 2.0 identity provider integration',
      icon: <Key className="h-6 w-6" />,
      color: 'bg-purple-500',
      popular: false,
      features: ['Custom IdP support', 'Attribute mapping', 'Encryption', 'Federation'],
      setup: 'Enterprise feature - contact sales'
    },
    {
      id: 'ldap',
      name: 'LDAP/Active Directory',
      description: 'Connect with your existing LDAP or AD infrastructure',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-green-500',
      popular: false,
      features: ['Directory integration', 'Group sync', 'Password policies', 'Audit logs'],
      setup: 'Enterprise feature - contact sales'
    }
  ],
  socialProviders: [
    {
      id: 'google-social',
      name: 'Google',
      icon: <Google className="h-5 w-5" />,
      color: 'bg-red-500',
      available: true
    },
    {
      id: 'microsoft-social',
      name: 'Microsoft',
      icon: <Microsoft className="h-5 w-5" />,
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-blue-600',
      available: false
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      color: 'bg-gray-800',
      available: false
    }
  ],
  benefits: [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Enhanced Security',
      description: 'Centralized authentication with your existing security policies'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'User Management',
      description: 'Automatic user provisioning and de-provisioning'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Improved Productivity',
      description: 'Seamless access without additional passwords to remember'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Compliance',
      description: 'Meet enterprise security and compliance requirements'
    }
  ],
  requirements: [
    'Enterprise plan subscription',
    'Domain verification',
    'Administrator access to identity provider',
    'SSL certificate configuration',
    'Security policy alignment'
  ]
}

export default function SSOPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(ssoData.providers[0])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSSOLogin = async (providerId: string) => {
    setIsLoading(true)
    try {
      // Simulate SSO redirect
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (providerId === 'google' || providerId === 'microsoft-social') {
        // Simulate successful social login
        window.location.href = '/dashboard?sso=success'
      } else {
        // Enterprise SSO requires setup
        console.log('Enterprise SSO requires configuration')
      }
    } catch (error) {
      console.error('SSO login failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSales = () => {
    window.location.href = '/contact?inquiry=enterprise-sso'
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
              <Shield className="h-4 w-4 mr-1" />
              Enterprise Login
            </StatusBadge>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Standard Login</Link>
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <Building className="h-4 w-4 mr-2" />
              Enterprise Single Sign-On
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Secure Enterprise{' '}
              <span className="text-primary">Authentication</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Sign in securely using your organization's existing identity provider. 
              OptimaliQ integrates with leading enterprise authentication systems.
            </p>
          </motion.div>

          <Grid cols={2} gap={12} className="items-start">
            {/* Social Login Options */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Quick Sign-In Options</h2>
                <p className="text-muted-foreground mb-6">
                  Sign in quickly with your existing accounts
                </p>

                <div className="space-y-4">
                  {ssoData.socialProviders.map((provider) => (
                    <Button
                      key={provider.id}
                      variant="outline"
                      className="w-full justify-start h-12"
                      onClick={() => handleSSOLogin(provider.id)}
                      disabled={!provider.available || isLoading}
                      loading={isLoading}
                    >
                      <div className={`p-2 ${provider.color} text-white rounded mr-3`}>
                        {provider.icon}
                      </div>
                      <span>Continue with {provider.name}</span>
                      {!provider.available && (
                        <StatusBadge status="warning" size="xs" className="ml-auto">
                          Coming Soon
                        </StatusBadge>
                      )}
                    </Button>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Use Email & Password Instead
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* SSO Benefits */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">SSO Benefits</h3>
                <div className="space-y-4">
                  {ssoData.benefits.map((benefit, index) => (
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
            </motion.div>

            {/* Enterprise SSO Options */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Enterprise SSO Providers</h2>
                <p className="text-muted-foreground mb-6">
                  Connect OptimaliQ with your enterprise identity management system
                </p>

                <div className="space-y-4">
                  {ssoData.providers.map((provider) => (
                    <div
                      key={provider.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedProvider.id === provider.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 ${provider.color} text-white rounded-lg`}>
                          {provider.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{provider.name}</h3>
                            {provider.popular && (
                              <StatusBadge status="primary" size="xs">Popular</StatusBadge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {provider.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center space-x-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            {provider.setup}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button onClick={handleContactSales} className="w-full">
                    <Building className="h-4 w-4 mr-2" />
                    Contact Sales for Enterprise SSO
                  </Button>
                </div>
              </Card>

              {/* Requirements */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">SSO Requirements</h3>
                <div className="space-y-2">
                  {ssoData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Support */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Our enterprise team can help you set up SSO for your organization.
                  </p>
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link href="/contact">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Enterprise Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link href="/demo">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule SSO Demo
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
