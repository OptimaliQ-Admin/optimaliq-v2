/**
 * OptimaliQ Terms of Service Page
 * Comprehensive terms of service with legal compliance
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
  Zap,
  FileText,
  Scale,
  CreditCard,
  Ban,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'

const termsData = {
  lastUpdated: 'August 29, 2024',
  effectiveDate: 'August 29, 2024',
  sections: [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing or using the OptimaliQ platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification. Your continued use of the service after such modifications constitutes acceptance of the updated terms.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old and have the legal authority to enter into agreements to use our services. If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.'
        }
      ]
    },
    {
      id: 'service-description',
      title: 'Service Description',
      content: [
        {
          subtitle: 'Platform Overview',
          text: 'OptimaliQ provides AI-powered business intelligence and assessment services designed to help organizations analyze their performance, identify growth opportunities, and develop strategic action plans.'
        },
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend service for maintenance, updates, or unforeseen circumstances.'
        },
        {
          subtitle: 'Service Modifications',
          text: 'We reserve the right to modify, suspend, or discontinue any part of our service at any time with reasonable notice to users. We will not be liable for any modifications or discontinuation of services.'
        }
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To access certain features, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.'
        },
        {
          subtitle: 'Account Responsibility',
          text: 'You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.'
        },
        {
          subtitle: 'Account Termination',
          text: 'We reserve the right to terminate or suspend your account at our discretion, with or without notice, for violations of these terms or for any other reason we deem appropriate.'
        }
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      content: [
        {
          subtitle: 'Permitted Uses',
          text: 'You may use our service only for lawful purposes and in accordance with these terms. You may use the service to conduct assessments, analyze results, and develop business strategies for legitimate business purposes.'
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You may not: (a) violate any laws or regulations; (b) infringe on intellectual property rights; (c) transmit harmful code or malware; (d) attempt to gain unauthorized access; (e) interfere with service operation; (f) use the service for competitive intelligence against us.'
        },
        {
          subtitle: 'Content Standards',
          text: 'Any content you submit must be accurate, lawful, and not violate any third-party rights. You must not submit false, misleading, or inappropriate content through our platform.'
        }
      ]
    },
    {
      id: 'payment-terms',
      title: 'Payment and Billing',
      content: [
        {
          subtitle: 'Subscription Plans',
          text: 'Our service is offered through various subscription plans with different features and pricing. Current pricing is available on our pricing page and may be subject to change with notice.'
        },
        {
          subtitle: 'Payment Processing',
          text: 'Payments are processed through secure third-party payment processors. By providing payment information, you authorize us to charge the applicable fees to your chosen payment method.'
        },
        {
          subtitle: 'Refund Policy',
          text: 'Refunds are provided according to our refund policy. Generally, we offer refunds for unused portions of prepaid subscriptions within 30 days of cancellation, subject to certain conditions.'
        },
        {
          subtitle: 'Late Payments',
          text: 'Failure to pay fees when due may result in suspension or termination of your account. We reserve the right to charge interest on overdue amounts and recover collection costs.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: [
        {
          subtitle: 'Our Rights',
          text: 'The OptimaliQ platform, including all content, features, functionality, and technology, is owned by OptimaliQ and protected by intellectual property laws. You may not copy, modify, or create derivative works without permission.'
        },
        {
          subtitle: 'User Content',
          text: 'You retain ownership of content you submit to our platform. By submitting content, you grant us a license to use, modify, and display such content as necessary to provide our services.'
        },
        {
          subtitle: 'Feedback',
          text: 'Any feedback, suggestions, or ideas you provide about our service become our property and may be used without compensation or attribution to you.'
        }
      ]
    },
    {
      id: 'privacy-data',
      title: 'Privacy and Data Protection',
      content: [
        {
          subtitle: 'Privacy Policy',
          text: 'Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.'
        },
        {
          subtitle: 'Data Security',
          text: 'We implement appropriate technical and organizational measures to protect your data, but cannot guarantee absolute security. You acknowledge the inherent risks of internet transmission.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your data as necessary to provide services and comply with legal obligations. You may request data deletion subject to our data retention policies and legal requirements.'
        }
      ]
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      content: [
        {
          subtitle: 'Service Warranty',
          text: 'Our service is provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.'
        },
        {
          subtitle: 'Results Disclaimer',
          text: 'While our AI-powered insights are based on sophisticated algorithms and data analysis, we do not guarantee specific results or outcomes from using our service. Business decisions should consider multiple factors beyond our recommendations.'
        },
        {
          subtitle: 'Third-Party Services',
          text: 'Our platform may integrate with third-party services. We are not responsible for the availability, accuracy, or content of such third-party services, and your use of them is subject to their own terms.'
        }
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: [
        {
          subtitle: 'Damage Limitations',
          text: 'To the maximum extent permitted by law, OptimaliQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data, or business opportunities.'
        },
        {
          subtitle: 'Total Liability Cap',
          text: 'Our total liability to you for all claims arising from or related to the service shall not exceed the amount you paid to us in the twelve months preceding the claim.'
        },
        {
          subtitle: 'Force Majeure',
          text: 'We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, government actions, or network failures.'
        }
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      content: [
        {
          subtitle: 'Termination Rights',
          text: 'Either party may terminate the agreement at any time. You may cancel your subscription through your account settings or by contacting us. We may terminate your access for violations of these terms.'
        },
        {
          subtitle: 'Effect of Termination',
          text: 'Upon termination, your right to access the service ceases immediately. We may delete your data according to our data retention policy, though some information may be retained as required by law.'
        },
        {
          subtitle: 'Survival',
          text: 'Provisions relating to intellectual property, disclaimers, liability limitations, and dispute resolution shall survive termination of these terms.'
        }
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of San Francisco County, California.'
        },
        {
          subtitle: 'Dispute Resolution',
          text: 'We encourage informal resolution of disputes. If informal resolution fails, disputes may be subject to binding arbitration under the American Arbitration Association rules, except for claims that may be brought in small claims court.'
        },
        {
          subtitle: 'Class Action Waiver',
          text: 'You agree that any arbitration or court proceeding shall be limited to the dispute between us and you individually. You waive any right to participate in class action lawsuits or class-wide arbitrations.'
        }
      ]
    }
  ],
  contact: {
    email: 'legal@optimaliq.ai',
    address: '123 Market Street, Suite 400\nSan Francisco, CA 94105\nUnited States',
    phone: '+1 (555) 123-4567'
  }
}

export default function TermsPage() {
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
              <FileText className="h-4 w-4 mr-2" />
              Terms of Service
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Terms of Service &{' '}
              <span className="text-primary">User Agreement</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              These terms govern your use of OptimaliQ's services. Please read them carefully 
              as they contain important information about your rights and obligations.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: {termsData.lastUpdated}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Effective: {termsData.effectiveDate}</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Key Points */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={3} gap={6} className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="p-6 text-center">
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg inline-flex mb-4">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Fair & Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  Clear terms that protect both users and OptimaliQ with fair usage policies
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-6 text-center">
                <div className="p-3 bg-green-500/10 text-green-600 rounded-lg inline-flex mb-4">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Billing</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent pricing with flexible cancellation and refund policies
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="p-6 text-center">
                <div className="p-3 bg-red-500/10 text-red-600 rounded-lg inline-flex mb-4">
                  <Ban className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Usage Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Clear acceptable use policies to ensure a safe environment for all users
                </p>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Terms Content */}
      <Section className="pb-20">
        <Container className="max-w-4xl">
          <div className="space-y-16">
            {termsData.sections.map((section, index) => (
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

      {/* Important Notices */}
      <Section className="pb-20">
        <Container className="max-w-4xl">
          <div className="space-y-6">
            <Alert
              variant="warning"
              title="Important Notice"
              description="These terms constitute a legally binding agreement. By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms."
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            
            <Alert
              variant="info"
              title="Questions About Terms"
              description="If you have questions about these terms or need clarification on any provisions, please contact our legal team before using the service."
              icon={<Info className="h-4 w-4" />}
            />
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
            <h2 className="text-3xl font-bold mb-6">Legal Questions?</h2>
            <p className="text-xl text-muted-foreground">
              If you have questions about these terms or need legal clarification, 
              our legal team is available to help.
            </p>
          </motion.div>

          <Card className="p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6">Legal Department Contact</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-medium">{termsData.contact.email}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">{termsData.contact.phone}</span>
                </div>
                
                <div className="flex items-start justify-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="font-medium whitespace-pre-line text-center">
                    {termsData.contact.address}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild>
                  <Link href="/contact">
                    Contact Legal Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
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
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-primary font-medium">
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
