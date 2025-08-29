/**
 * OptimaliQ Privacy Policy Page
 * Comprehensive privacy policy with GDPR and CCPA compliance
 */

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'

const privacyData = {
  lastUpdated: 'August 29, 2024',
  effectiveDate: 'August 29, 2024',
  sections: [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect personal information that you provide directly to us, including your name, email address, phone number, company name, job title, and other contact information when you register for an account, complete assessments, or contact us.'
        },
        {
          subtitle: 'Assessment Data',
          text: 'When you complete assessments, we collect your responses, scores, and related metadata. This information is used to generate insights and recommendations tailored to your organization.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you use our platform, including pages visited, features used, time spent, and interaction patterns to improve our services.'
        },
        {
          subtitle: 'Technical Information',
          text: 'We collect technical information such as IP address, browser type, device information, operating system, and other technical identifiers for security and functionality purposes.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our assessment and analytics services, generate personalized insights, and deliver recommendations.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send you service-related communications, updates, marketing materials (with your consent), and respond to your inquiries.'
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage patterns and feedback to improve our platform, develop new features, and enhance user experience.'
        },
        {
          subtitle: 'Security and Compliance',
          text: 'We use information for security monitoring, fraud prevention, legal compliance, and to protect our users and platform integrity.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share information with trusted third-party service providers who assist us in operating our platform, conducting business, or serving users, provided they agree to keep information confidential.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction, subject to equivalent privacy protections.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, court order, or government request, or when we believe disclosure is necessary to protect our rights or comply with legal obligations.'
        },
        {
          subtitle: 'Aggregated Data',
          text: 'We may share aggregated, de-identified information that cannot reasonably be used to identify you for research, analytics, or business purposes.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures including encryption, secure data transmission, access controls, and regular security audits to protect your information.'
        },
        {
          subtitle: 'Data Storage',
          text: 'Your data is stored in secure, SOC 2 compliant data centers with redundant backups and disaster recovery procedures to ensure data availability and integrity.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We maintain strict access controls, ensuring only authorized personnel can access your information on a need-to-know basis for legitimate business purposes.'
        },
        {
          subtitle: 'Incident Response',
          text: 'We have established incident response procedures to quickly identify, contain, and address any security incidents that may affect your information.'
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, review, and correct your personal information. You can update most information through your account settings or by contacting us.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You have the right to request a copy of your personal information in a structured, machine-readable format for transfer to another service provider.'
        },
        {
          subtitle: 'Deletion Rights',
          text: 'You can request deletion of your personal information, subject to certain exceptions for legal compliance, security, or legitimate business interests.'
        },
        {
          subtitle: 'Marketing Communications',
          text: 'You can opt out of marketing communications at any time by using the unsubscribe link in emails or updating your communication preferences in your account.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      content: [
        {
          subtitle: 'Cookie Usage',
          text: 'We use cookies and similar technologies to enhance user experience, remember preferences, analyze usage patterns, and provide personalized content and advertisements.'
        },
        {
          subtitle: 'Cookie Types',
          text: 'We use essential cookies for platform functionality, analytics cookies to understand usage patterns, and marketing cookies to deliver relevant advertisements (with your consent).'
        },
        {
          subtitle: 'Cookie Management',
          text: 'You can manage cookie preferences through your browser settings or our cookie preference center. Note that disabling certain cookies may affect platform functionality.'
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'We may allow trusted third parties to place cookies on our platform for analytics and advertising purposes, subject to their own privacy policies.'
        }
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      content: [
        {
          subtitle: 'Global Operations',
          text: 'As a global service, we may transfer your information to countries outside your residence, including the United States, where our primary servers and operations are located.'
        },
        {
          subtitle: 'Transfer Safeguards',
          text: 'We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses, adequacy decisions, or other approved mechanisms.'
        },
        {
          subtitle: 'EU-US Transfers',
          text: 'For transfers from the EU to the US, we comply with applicable frameworks and regulations, including GDPR requirements for international transfers.'
        }
      ]
    },
    {
      id: 'retention',
      title: 'Data Retention',
      content: [
        {
          subtitle: 'Retention Periods',
          text: 'We retain personal information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.'
        },
        {
          subtitle: 'Assessment Data',
          text: 'Assessment responses and results are retained to provide ongoing insights and track progress over time, unless you request deletion or close your account.'
        },
        {
          subtitle: 'Account Deletion',
          text: 'When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.'
        }
      ]
    }
  ],
  contact: {
    email: 'privacy@optimaliq.ai',
    address: '123 Market Street, Suite 400\nSan Francisco, CA 94105\nUnited States',
    phone: '+1 (555) 123-4567'
  }
}

export default function PrivacyPage() {
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
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Button asChild>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </nav>
        </Container>
      </header>

      {/* Hero Section */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Your Privacy is Our{' '}
              <span className="text-primary">Top Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We are committed to protecting your privacy and being transparent about how we collect, 
              use, and protect your information. This policy explains our practices in detail.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: {privacyData.lastUpdated}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Effective: {privacyData.effectiveDate}</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Key Highlights */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={3} gap={6} className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="p-6 text-center">
                <div className="p-3 bg-green-500/10 text-green-600 rounded-lg inline-flex mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level encryption and SOC 2 compliant data centers protect your information
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-6 text-center">
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg inline-flex mb-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  Access, correct, or delete your data anytime with full control over your information
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="p-6 text-center">
                <div className="p-3 bg-purple-500/10 text-purple-600 rounded-lg inline-flex mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  GDPR, CCPA, and international privacy law compliance across all regions
                </p>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Privacy Policy Content */}
      <Section className="pb-20">
        <Container className="max-w-4xl">
          <div className="space-y-16">
            {privacyData.sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                id={section.id}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-semibold mb-3 text-primary">
                          {item.subtitle}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Information */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Questions About Privacy?</h2>
            <p className="text-xl text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
          </motion.div>

          <Card className="p-8">
            <Grid cols={1} gap={6}>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">Privacy Officer Contact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium">{privacyData.contact.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium">{privacyData.contact.phone}</span>
                  </div>
                  
                  <div className="flex items-start justify-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="font-medium whitespace-pre-line text-center">
                      {privacyData.contact.address}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button asChild>
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Grid>
          </Card>
        </Container>
      </Section>

      {/* Important Notice */}
      <Section className="pb-20">
        <Container className="max-w-4xl">
          <Alert
            variant="info"
            title="Policy Updates"
            description="We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our platform. Your continued use of our services after such changes constitutes acceptance of the updated policy."
            icon={<Info className="h-4 w-4" />}
          />
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <Container className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
            
            <nav className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-sm text-primary font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            <div className="text-sm text-muted-foreground">
              © 2024 OptimaliQ. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
