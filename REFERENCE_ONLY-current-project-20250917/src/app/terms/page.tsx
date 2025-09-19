/**
 * OptimaliQ Terms of Service Page
 * Enterprise AI platform legal compliance and terms
 * Recreated with enterprise-grade feel and AI platform specific terms
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
  AlertCircle,
  Brain,
  Rocket,
  Cpu,
  Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

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
          text: 'OptimaliQ provides a next-generation, multi-tier agentic AI platform that revolutionizes how organizations assess and optimize their Strategy, Process, and Technology. Our platform uses advanced AI algorithms, including cutting-edge RAG (Retrieval-Augmented Generation) capabilities, to provide McKinsey-level strategic insights and actionable recommendations.'
        },
        {
          subtitle: 'AI-Powered Services',
          text: 'Our services include AI-powered business intelligence, strategic assessments, operational analysis, technology evaluation, and growth optimization tools. We utilize multi-provider AI orchestration systems and real-time market intelligence to deliver enterprise-grade insights.'
        },
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend service for maintenance, updates, or unforeseen circumstances. Enterprise customers receive priority support and dedicated infrastructure.'
        }
      ]
    },
    {
      id: 'ai-platform-terms',
      title: 'AI Platform Specific Terms',
      content: [
        {
          subtitle: 'AI Model Usage',
          text: 'Our platform utilizes advanced AI models from multiple providers including OpenAI, Anthropic, Google, and Mistral. Users acknowledge that AI-generated insights are probabilistic and should be used as strategic inputs rather than definitive decisions.'
        },
        {
          subtitle: 'Data Processing',
          text: 'By using our AI services, you consent to the processing of your data by our AI systems for the purpose of generating insights and recommendations. We implement strict data protection measures and maintain complete data isolation between organizations.'
        },
        {
          subtitle: 'AI Accuracy Disclaimer',
          text: 'While we maintain high accuracy standards, AI-generated insights may contain errors or inaccuracies. Users are responsible for validating AI recommendations against their domain expertise and organizational context. We are not liable for decisions made based on AI insights.'
        }
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To access certain features, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
        },
        {
          subtitle: 'Account Responsibility',
          text: 'You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security. Enterprise accounts may have additional security requirements and compliance obligations.'
        },
        {
          subtitle: 'Account Termination',
          text: 'We reserve the right to terminate or suspend your account at our discretion, with or without notice, for violations of these terms or for any other reason we deem appropriate. Enterprise customers receive advance notice and transition support.'
        }
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      content: [
        {
          subtitle: 'Permitted Uses',
          text: 'You may use our services for legitimate business purposes, including organizational assessments, strategic planning, operational optimization, and growth analysis. Use must comply with all applicable laws and regulations.'
        },
        {
          subtitle: 'Prohibited Uses',
          text: 'You may not use our services to: violate any laws or regulations, infringe on intellectual property rights, attempt to reverse engineer our AI systems, or use our platform for competitive intelligence gathering against other users.'
        },
        {
          subtitle: 'AI System Integrity',
          text: 'Users may not attempt to manipulate, exploit, or interfere with our AI systems, including attempting to bias AI responses, reverse engineer AI models, or use automated tools to extract AI training data.'
        }
      ]
    },
    {
      id: 'data-privacy',
      title: 'Data Privacy and Security',
      content: [
        {
          subtitle: 'Data Protection',
          text: 'We implement enterprise-grade security measures including SOC 2 Type II compliance, GDPR readiness, end-to-end encryption, and secure data centers. Your data is protected with bank-level security standards and strict access controls.'
        },
        {
          subtitle: 'Data Ownership',
          text: 'You retain ownership of all data you submit to our platform. We process your data solely to provide our services and generate AI insights. We do not sell, rent, or share your data with third parties except as required by law.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your data for as long as your account is active and as needed to provide our services. Upon account termination, we will delete or anonymize your data according to our data retention policy and applicable regulations.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: [
        {
          subtitle: 'Platform Ownership',
          text: 'OptimaliQ retains all rights, title, and interest in and to our platform, including all intellectual property rights. This includes our AI models, algorithms, software, and platform design, but excludes your data and content.'
        },
        {
          subtitle: 'User Content',
          text: 'You retain ownership of content you create using our platform. By using our services, you grant us a limited license to process your content for the purpose of providing AI insights and improving our services.'
        },
        {
          subtitle: 'AI-Generated Content',
          text: 'AI-generated insights and recommendations are provided for your use but remain subject to our intellectual property rights. You may use these insights for internal business purposes but may not redistribute or commercialize them.'
        }
      ]
    },
    {
      id: 'enterprise-features',
      title: 'Enterprise Features and Compliance',
      content: [
        {
          subtitle: 'Enterprise Security',
          text: 'Enterprise customers receive enhanced security features including dedicated infrastructure, advanced access controls, custom compliance frameworks, and dedicated security reviews. We maintain SOC 2 Type II compliance and undergo regular security audits.'
        },
        {
          subtitle: 'Compliance Support',
          text: 'We provide compliance documentation and support for enterprise customers, including GDPR, CCPA, and industry-specific compliance requirements. Our platform is designed to meet enterprise security and compliance standards.'
        },
        {
          subtitle: 'Custom Implementations',
          text: 'Enterprise customers may request custom implementations, including custom AI model training, industry-specific assessment frameworks, and white-labeling options. These services are subject to separate agreements and additional fees.'
        }
      ]
    },
    {
      id: 'limitations-liability',
      title: 'Limitations of Liability',
      content: [
        {
          subtitle: 'AI Insight Disclaimer',
          text: 'Our AI-generated insights are provided "as is" without warranties of any kind. We are not liable for decisions made based on AI recommendations, business outcomes, or any indirect or consequential damages arising from use of our services.'
        },
        {
          subtitle: 'Service Availability',
          text: 'We are not liable for any damages resulting from service interruptions, data loss, or system failures. Our liability is limited to the amount paid for our services in the 12 months preceding the claim.'
        },
        {
          subtitle: 'Force Majeure',
          text: 'We are not liable for any failure to perform due to circumstances beyond our reasonable control, including natural disasters, government actions, or third-party service failures.'
        }
      ]
    },
    {
      id: 'termination',
      title: 'Termination and Suspension',
      content: [
        {
          subtitle: 'Termination by User',
          text: 'You may terminate your account at any time by contacting our support team. Upon termination, you will lose access to our services and your data will be handled according to our data retention policy.'
        },
        {
          subtitle: 'Termination by OptimaliQ',
          text: 'We may terminate or suspend your account for violations of these terms, non-payment, or other reasons. Enterprise customers receive advance notice and transition support to ensure business continuity.'
        },
        {
          subtitle: 'Post-Termination',
          text: 'After termination, you may request a copy of your data for up to 30 days. We will delete or anonymize your data according to our data retention policy and applicable regulations.'
        }
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any disputes will be resolved in the courts of San Francisco County, California.'
        },
        {
          subtitle: 'Dispute Resolution',
          text: 'We encourage resolution of disputes through direct communication. If disputes cannot be resolved, they will be subject to binding arbitration in San Francisco, California, in accordance with the American Arbitration Association rules.'
        },
        {
          subtitle: 'Class Action Waiver',
          text: 'You agree to resolve disputes individually and waive any right to participate in class action lawsuits or class-wide arbitration against OptimaliQ.'
        }
      ]
    }
  ]
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <Section className="py-20 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-indigo-900/85 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/25 backdrop-blur-md rounded-xl border border-blue-400/40 shadow-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500/25 backdrop-blur-md rounded-xl border border-indigo-400/40 shadow-lg animate-pulse delay-1000"></div>
        
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Legal & Compliance
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Terms of{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Enterprise AI platform terms and legal compliance
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Comprehensive terms governing your use of OptimaliQ's enterprise AI platform. Our terms ensure transparency, protect your rights, and maintain the highest standards of security and compliance for enterprise organizations.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Terms Content Section */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Last Updated Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm mb-4">
                <Calendar className="h-4 w-4" />
                Last Updated: {termsData.lastUpdated}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h2>
              <p className="text-lg text-gray-700">
                Effective Date: {termsData.effectiveDate}
              </p>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-12">
              {termsData.sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {sectionIndex + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-4 border-blue-200 pl-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          {item.subtitle}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Legal Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-gray-700 mb-6">
                  Our legal team is here to help clarify any questions about our terms of service or compliance requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Contact Legal Team
                    <Mail className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    Download PDF
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Compliance Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise Compliance & Security
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                OptimaliQ maintains the highest standards of compliance and security for enterprise organizations
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Shield className="h-8 w-8" />,
                    title: 'SOC 2 Type II',
                    description: 'Certified compliance with industry-leading security standards'
                  },
                  {
                    icon: <Lock className="h-8 w-8" />,
                    title: 'GDPR Ready',
                    description: 'Full compliance with European data protection regulations'
                  },
                  {
                    icon: <Server className="h-8 w-8" />,
                    title: 'Enterprise Security',
                    description: 'Bank-level encryption and secure data centers'
                  }
                ].map((compliance, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {compliance.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{compliance.title}</h3>
                    <p className="text-gray-600">{compliance.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
