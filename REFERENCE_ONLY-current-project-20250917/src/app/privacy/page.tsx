/**
 * OptimaliQ Privacy Policy Page
 * Enterprise AI platform privacy and data protection
 * Recreated with enterprise-grade feel and AI platform specific privacy
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
  Server,
  Key,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

const privacyData = {
  lastUpdated: 'August 29, 2024',
  effectiveDate: 'August 29, 2024',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction and Scope',
      content: [
        {
          subtitle: 'About This Policy',
          text: 'This Privacy Policy describes how OptimaliQ ("we," "us," or "our") collects, uses, and protects your information when you use our enterprise AI platform. We are committed to protecting your privacy and maintaining the highest standards of data protection.'
        },
        {
          subtitle: 'Platform Overview',
          text: 'OptimaliQ is a next-generation, multi-tier agentic AI platform that provides AI-powered business intelligence, strategic assessments, and growth optimization tools. Our platform utilizes advanced AI models and RAG capabilities to deliver enterprise-grade insights.'
        },
        {
          subtitle: 'Applicability',
          text: 'This policy applies to all users of our platform, including individual users, enterprise customers, and organizations. It covers our website, mobile applications, API services, and all related services.'
        }
      ]
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Information You Provide',
          text: 'We collect information you provide directly to us, including account registration details, assessment responses, company information, contact details, and any other information you choose to share through our platform.'
        },
        {
          subtitle: 'AI Assessment Data',
          text: 'We collect your responses to AI-powered assessments, including strategic planning data, operational metrics, technology evaluations, and growth objectives. This data is essential for generating personalized AI insights and recommendations.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you use our platform, including features accessed, time spent on assessments, interaction patterns, and technical information such as IP addresses, browser types, and device information.'
        },
        {
          subtitle: 'AI Processing Data',
          text: 'When you use our AI services, we collect data necessary for AI model processing, including assessment responses, industry context, organizational size, and other relevant factors that enable our AI systems to generate accurate insights.'
        }
      ]
    },
    {
      id: 'ai-data-processing',
      title: 'AI Data Processing and Privacy',
      content: [
        {
          subtitle: 'AI Model Training',
          text: 'Our AI models are trained on aggregated, anonymized data to improve accuracy and relevance. We never use your individual data to train models without explicit consent, and all training data is thoroughly anonymized and secured.'
        },
        {
          subtitle: 'Multi-Provider AI Orchestration',
          text: 'We utilize AI models from multiple providers including OpenAI, Anthropic, Google, and Mistral. Your data is processed according to our strict privacy standards, and we maintain complete control over data handling and security.'
        },
        {
          subtitle: 'RAG Capabilities and Privacy',
          text: 'Our RAG (Retrieval-Augmented Generation) system accesses real-time market data and industry trends to enhance AI insights. This process maintains your privacy by using only publicly available information and your own organizational data.'
        },
        {
          subtitle: 'Data Isolation',
          text: 'We maintain complete data isolation between organizations. Your data is never shared with other users or organizations, and our multi-tenant architecture ensures strict separation of data and insights.'
        }
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Providing Our Services',
          text: 'We use your information to provide, maintain, and improve our AI platform services, including generating personalized insights, conducting assessments, and delivering strategic recommendations tailored to your organization.'
        },
        {
          subtitle: 'AI Insight Generation',
          text: 'Your assessment responses and organizational data are processed by our AI systems to generate strategic insights, operational recommendations, and growth optimization strategies. This processing is essential for delivering the core value of our platform.'
        },
        {
          subtitle: 'Platform Improvement',
          text: 'We use aggregated, anonymized data to improve our AI models, enhance platform functionality, and develop new features. This analysis never includes personally identifiable information and is conducted in strict compliance with privacy regulations.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to communicate with you about our services, send important updates, provide support, and share relevant information about platform improvements and new features.'
        }
      ]
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing and Disclosure',
      content: [
        {
          subtitle: 'No Sale of Personal Data',
          text: 'We do not sell, rent, or trade your personal information to third parties. Your data is used solely to provide our services and improve our platform, always in accordance with this privacy policy.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share information with trusted service providers who assist us in operating our platform, such as cloud hosting providers, AI model providers, and customer support services. All service providers are bound by strict confidentiality agreements.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, regulation, or legal process, or if we believe in good faith that such disclosure is necessary to protect our rights, investigate fraud, or respond to government requests.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change and ensure your privacy rights are protected.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security and Protection',
      content: [
        {
          subtitle: 'Enterprise-Grade Security',
          text: 'We implement enterprise-grade security measures including SOC 2 Type II compliance, end-to-end encryption, secure data centers, and strict access controls. Our security protocols meet or exceed industry standards for enterprise software.'
        },
        {
          subtitle: 'Encryption and Access Controls',
          text: 'All data is encrypted in transit and at rest using bank-level encryption standards. We implement strict access controls, multi-factor authentication, and regular security audits to protect your information.'
        },
        {
          subtitle: 'AI System Security',
          text: 'Our AI systems are protected by advanced security measures including model isolation, secure inference pipelines, and comprehensive monitoring. We maintain strict control over AI model access and data processing.'
        },
        {
          subtitle: 'Regular Security Audits',
          text: 'We undergo regular security audits, penetration testing, and compliance reviews to ensure our security measures remain effective and up-to-date with the latest threats and best practices.'
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention and Deletion',
      content: [
        {
          subtitle: 'Retention Periods',
          text: 'We retain your data for as long as your account is active and as needed to provide our services. Assessment data and AI insights are retained to enable ongoing analysis and progress tracking.'
        },
        {
          subtitle: 'Account Deletion',
          text: 'Upon account termination, we will delete or anonymize your personal data according to our data retention policy. You may request immediate deletion of your data, subject to legal and regulatory requirements.'
        },
        {
          subtitle: 'AI Model Data',
          text: 'Data used for AI model training is retained in anonymized form to maintain model accuracy and performance. This data cannot be linked back to individual users or organizations.'
        },
        {
          subtitle: 'Backup and Recovery',
          text: 'We maintain secure backups of your data for disaster recovery purposes. These backups are subject to the same security and privacy protections as your primary data.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      content: [
        {
          subtitle: 'Access and Portability',
          text: 'You have the right to access your personal information and request a copy of your data in a portable format. We provide comprehensive data export tools for all your assessment data and AI insights.'
        },
        {
          subtitle: 'Correction and Updates',
          text: 'You can update, correct, or modify your personal information at any time through your account settings. We encourage you to keep your information current to ensure accurate AI insights.'
        },
        {
          subtitle: 'Deletion Rights',
          text: 'You have the right to request deletion of your personal data, subject to legal and regulatory requirements. We will process deletion requests promptly and confirm completion.'
        },
        {
          subtitle: 'AI Processing Controls',
          text: 'You can control how your data is processed by our AI systems, including opting out of certain AI features or limiting data processing for specific purposes. These controls are available in your account settings.'
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance and Regulations',
      content: [
        {
          subtitle: 'GDPR Compliance',
          text: 'We are fully compliant with the General Data Protection Regulation (GDPR) and provide all required rights and protections for European users. Our data processing activities are conducted with appropriate legal bases and user consent.'
        },
        {
          subtitle: 'CCPA Compliance',
          text: 'We comply with the California Consumer Privacy Act (CCPA) and provide California residents with all required privacy rights and protections. Our platform is designed to meet CCPA requirements.'
        },
        {
          subtitle: 'Industry Standards',
          text: 'We maintain compliance with industry standards including SOC 2 Type II, ISO 27001, and other relevant security and privacy frameworks. Our compliance is regularly audited and verified by independent third parties.'
        },
        {
          subtitle: 'International Transfers',
          text: 'For international users, we ensure that data transfers comply with applicable regulations. We use approved transfer mechanisms and maintain appropriate safeguards for cross-border data processing.'
        }
      ]
    },
    {
      id: 'ai-ethics',
      title: 'AI Ethics and Responsible Use',
      content: [
        {
          subtitle: 'Bias Prevention',
          text: 'We are committed to preventing bias in our AI systems. Our models are trained on diverse datasets and regularly audited for fairness and accuracy. We implement bias detection and mitigation techniques.'
        },
        {
          subtitle: 'Transparency',
          text: 'We believe in AI transparency and provide clear explanations of how our AI systems work, what data they use, and how they generate insights. Our AI processes are explainable and auditable.'
        },
        {
          subtitle: 'Human Oversight',
          text: 'Our AI systems operate under human oversight and control. AI-generated insights are presented as recommendations that should be validated against human expertise and organizational context.'
        },
        {
          subtitle: 'Continuous Improvement',
          text: 'We continuously monitor and improve our AI systems for accuracy, fairness, and ethical compliance. We welcome feedback and work to address any concerns about AI behavior or outcomes.'
        }
      ]
    },
    {
      id: 'contact-information',
      title: 'Contact Information and Support',
      content: [
        {
          subtitle: 'Privacy Team',
          text: 'For privacy-related questions, concerns, or requests, please contact our dedicated privacy team. We are committed to addressing all privacy inquiries promptly and thoroughly.'
        },
        {
          subtitle: 'Data Protection Officer',
          text: 'We have appointed a Data Protection Officer (DPO) to oversee our privacy practices and ensure compliance with applicable regulations. The DPO can be contacted for complex privacy matters.'
        },
        {
          subtitle: 'Support Channels',
          text: 'You can reach our privacy team through multiple channels including email, phone, and our support portal. We provide comprehensive support for all privacy-related requests and concerns.'
        }
      ]
    }
  ]
}

export default function PrivacyPage() {
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
                Privacy & Security
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Privacy{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Policy
                </span>
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Enterprise-grade data protection for our AI platform
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Your privacy and data security are our top priorities. Learn how we protect your information while delivering powerful AI-powered insights and maintaining the highest standards of enterprise security and compliance.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Privacy Content Section */}
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
                Last Updated: {privacyData.lastUpdated}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h2>
              <p className="text-lg text-gray-700">
                Effective Date: {privacyData.effectiveDate}
              </p>
            </motion.div>

            {/* Privacy Sections */}
            <div className="space-y-12">
              {privacyData.sections.map((section, sectionIndex) => (
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

            {/* Contact Privacy Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Questions About Privacy?
                </h3>
                <p className="text-gray-700 mb-6">
                  Our privacy team is here to help clarify any questions about data protection, AI processing, or your privacy rights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Contact Privacy Team
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

      {/* Security & Compliance Section */}
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
                Enterprise Security & Compliance
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                OptimaliQ maintains the highest standards of data protection and security for enterprise organizations
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    icon: <Key className="h-8 w-8" />,
                    title: 'End-to-End Encryption',
                    description: 'Bank-level encryption for all data in transit and at rest'
                  },
                  {
                    icon: <Users className="h-8 w-8" />,
                    title: 'Multi-Tenant Security',
                    description: 'Complete data isolation between organizations'
                  }
                ].map((security, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {security.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{security.title}</h3>
                    <p className="text-gray-600 text-sm">{security.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* AI Ethics Section */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                AI Ethics & Responsible Use
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                We are committed to ethical AI development and responsible use of artificial intelligence
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Brain className="h-8 w-8" />,
                    title: 'Bias Prevention',
                    description: 'Advanced techniques to detect and prevent AI bias in our systems'
                  },
                  {
                    icon: <Eye className="h-8 w-8" />,
                    title: 'Transparency',
                    description: 'Clear explanations of how our AI systems work and make decisions'
                  },
                  {
                    icon: <UserCheck className="h-8 w-8" />,
                    title: 'Human Oversight',
                    description: 'AI insights are presented as recommendations under human control'
                  }
                ].map((ethics, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-600">
                      {ethics.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{ethics.title}</h3>
                    <p className="text-gray-600">{ethics.description}</p>
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
