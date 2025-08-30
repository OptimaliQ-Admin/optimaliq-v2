/**
 * OptimaliQ Referral Program Page
 * Comprehensive referral program with rewards and tracking
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Gift,
  Users,
  Share2,
  DollarSign,
  Award,
  Target,
  TrendingUp,
  Star,
  Crown,
  Heart,
  Rocket,
  CheckCircle,
  ArrowRight,
  Copy,
  Mail,
  MessageSquare,
  Linkedin,
  Twitter,
  Facebook,
  Link as LinkIcon,
  QrCode,
  Download,
  Eye,
  Clock,
  Calendar,
  Zap,
  Sparkles,
  Trophy,
  Medal,
  Building,
  Globe,
  Phone,
  AtSign,
  Send,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'
import { Input } from '@/components/ui/input'

// Referral program data
const referralData = {
  program: {
    name: 'OptimaliQ Partner Program',
    description: 'Earn rewards by referring organizations to OptimaliQ',
    commission: '30%',
    cookieDuration: '90 days',
    minimumPayout: '$100'
  },
  rewards: [
    {
      tier: 'Bronze',
      referrals: '1-5',
      commission: '20%',
      bonus: '$50',
      perks: ['Referral dashboard', 'Basic analytics', 'Email support'],
      icon: <Medal className="h-8 w-8" />,
      color: 'bg-orange-500'
    },
    {
      tier: 'Silver',
      referrals: '6-15',
      commission: '25%',
      bonus: '$200',
      perks: ['Priority support', 'Advanced analytics', 'Co-marketing opportunities'],
      icon: <Award className="h-8 w-8" />,
      color: 'bg-gray-400'
    },
    {
      tier: 'Gold',
      referrals: '16-30',
      commission: '30%',
      bonus: '$500',
      perks: ['Dedicated account manager', 'Custom materials', 'Speaking opportunities'],
      icon: <Trophy className="h-8 w-8" />,
      color: 'bg-yellow-500'
    },
    {
      tier: 'Platinum',
      referrals: '31+',
      commission: '35%',
      bonus: '$1,000',
      perks: ['Revenue sharing', 'Joint ventures', 'Executive access'],
      icon: <Crown className="h-8 w-8" />,
      color: 'bg-purple-500'
    }
  ],
  stats: {
    totalPartners: '1,200+',
    avgCommission: '$2,450',
    topEarner: '$45,000',
    successRate: '87%'
  },
  materials: [
    {
      id: 'email-templates',
      name: 'Email Templates',
      description: 'Pre-written email templates for different audiences',
      type: 'Templates',
      downloads: 2340,
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'presentation-deck',
      name: 'Presentation Deck',
      description: 'Professional slides for presenting OptimaliQ',
      type: 'Presentation',
      downloads: 1560,
      icon: <PieChart className="h-5 w-5" />
    },
    {
      id: 'case-studies',
      name: 'Case Studies',
      description: 'Success stories and ROI examples',
      type: 'Documents',
      downloads: 1890,
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      id: 'social-media',
      name: 'Social Media Kit',
      description: 'Graphics and copy for social media sharing',
      type: 'Graphics',
      downloads: 980,
      icon: <Share2 className="h-5 w-5" />
    }
  ],
  userStats: {
    currentTier: 'Silver',
    totalReferrals: 12,
    successfulReferrals: 8,
    totalCommissions: '$3,240',
    pendingCommissions: '$580',
    nextTierReferrals: 4
  }
}

export default function ReferralPage() {
  const [referralCode] = React.useState('OPTIQ-JW2024')
  const [referralLink] = React.useState(`https://optimaliq.ai/signup?ref=${referralCode}`)
  const [customMessage, setCustomMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const shareViaEmail = () => {
    const subject = 'Transform Your Organization with OptimaliQ'
    const body = `Hi there!\n\nI wanted to share OptimaliQ with you - it's an amazing AI-powered platform that helps organizations optimize their performance and growth.\n\n${customMessage}\n\nCheck it out: ${referralLink}\n\nBest regards`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const shareViaSocial = (platform: string) => {
    const text = `Discover OptimaliQ - AI-powered business intelligence for organizational excellence! ${referralLink}`
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    }
    window.open(urls[platform as keyof typeof urls], '_blank')
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
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/referral" className="text-sm text-primary font-medium">Referral Program</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Button asChild>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </nav>
        </Container>
      </header>

      {/* Hero Section */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <Gift className="h-4 w-4 mr-2" />
              Partner Program
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Earn by Sharing{' '}
              <span className="text-primary">OptimaliQ</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join our partner program and earn up to 35% commission by referring organizations 
              to OptimaliQ. Help others transform their business while earning rewards.
            </p>

            {/* Program Stats */}
            <Grid cols={4} gap={6} className="max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{referralData.stats.totalPartners}</div>
                <div className="text-sm text-muted-foreground">Active Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{referralData.stats.avgCommission}</div>
                <div className="text-sm text-muted-foreground">Avg Monthly Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{referralData.stats.topEarner}</div>
                <div className="text-sm text-muted-foreground">Top Partner Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{referralData.stats.successRate}</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Reward Tiers */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Partner Reward Tiers</h2>
            <p className="text-xl text-muted-foreground">
              Earn more as you refer more organizations to OptimaliQ
            </p>
          </motion.div>

          <Grid cols={4} gap={6}>
            {referralData.rewards.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className={`p-6 text-center h-full ${
                  tier.tier === referralData.userStats.currentTier ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}>
                  <div className={`p-3 ${tier.color} text-white rounded-lg inline-flex mb-4`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{tier.tier}</h3>
                  <div className="text-sm text-muted-foreground mb-4">{tier.referrals} referrals</div>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">{tier.commission}</div>
                      <div className="text-xs text-muted-foreground">Commission Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{tier.bonus}</div>
                      <div className="text-xs text-muted-foreground">Tier Bonus</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tier.perks.map((perk, perkIndex) => (
                      <div key={perkIndex} className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  {tier.tier === referralData.userStats.currentTier && (
                    <StatusBadge status="primary" className="mt-4">
                      Current Tier
                    </StatusBadge>
                  )}
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Sharing Tools */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Referral Tools */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Your Referral Tools</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Referral Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input value={referralCode} readOnly className="font-mono" />
                      <Button size="sm" onClick={() => copyToClipboard(referralCode)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Referral Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input value={referralLink} readOnly className="text-sm" />
                      <Button size="sm" onClick={() => copyToClipboard(referralLink)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to your referrals..."
                      rows={3}
                      className="w-full p-3 border rounded-lg resize-none"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Share Via</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={shareViaEmail} className="justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" onClick={() => shareViaSocial('linkedin')} className="justify-start">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" onClick={() => shareViaSocial('twitter')} className="justify-start">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="outline" onClick={() => shareViaSocial('facebook')} className="justify-start">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Marketing Materials */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Marketing Materials</h3>
                <div className="space-y-3">
                  {referralData.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          {material.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{material.name}</div>
                          <div className="text-xs text-muted-foreground">{material.description}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Performance Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Current Status */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="text-center">
                  <div className="p-3 bg-gray-400 text-white rounded-lg inline-flex mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{referralData.userStats.currentTier} Partner</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {referralData.userStats.totalReferrals}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Total Referrals</div>
                  
                  <Progress 
                    value={(referralData.userStats.totalReferrals / 16) * 100} 
                    className="mb-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {referralData.userStats.nextTierReferrals} more referrals to Gold tier
                  </div>
                </div>
              </Card>

              {/* Earnings */}
              <Grid cols={2} gap={4}>
                <MetricCard
                  title="Total Earned"
                  value={referralData.userStats.totalCommissions}
                  icon={<DollarSign className="h-5 w-5" />}
                  trend="up"
                />
                <MetricCard
                  title="Pending"
                  value={referralData.userStats.pendingCommissions}
                  icon={<Clock className="h-5 w-5" />}
                />
                <MetricCard
                  title="Success Rate"
                  value={`${Math.round((referralData.userStats.successfulReferrals / referralData.userStats.totalReferrals) * 100)}%`}
                  icon={<Target className="h-5 w-5" />}
                  trend="up"
                />
                <MetricCard
                  title="This Month"
                  value="$420"
                  icon={<TrendingUp className="h-5 w-5" />}
                  trend="up"
                />
              </Grid>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New referral signup', organization: 'TechStart Inc', amount: '$29.70', date: '2 hours ago', status: 'pending' },
                    { action: 'Commission earned', organization: 'EduForward', amount: '$99.00', date: '1 day ago', status: 'paid' },
                    { action: 'Referral converted', organization: 'GreenTech Solutions', amount: '$74.25', date: '3 days ago', status: 'confirmed' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.organization} • {activity.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{activity.amount}</div>
                        <StatusBadge 
                          status={activity.status === 'paid' ? 'success' : activity.status === 'confirmed' ? 'info' : 'warning'} 
                          size="xs"
                        >
                          {activity.status}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to start earning with our referral program
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Share Your Link',
                description: 'Share your unique referral link with organizations that could benefit from OptimaliQ',
                icon: <Share2 className="h-6 w-6" />
              },
              {
                step: '2',
                title: 'They Sign Up',
                description: 'When someone signs up using your link, they\'re tracked as your referral',
                icon: <Users className="h-6 w-6" />
              },
              {
                step: '3',
                title: 'You Earn Commission',
                description: 'Earn commission when your referrals upgrade to paid plans',
                icon: <DollarSign className="h-6 w-6" />
              },
              {
                step: '4',
                title: 'Get Paid',
                description: 'Receive monthly payments once you reach the minimum payout threshold',
                icon: <Award className="h-6 w-6" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex items-center space-x-6"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary-foreground">{step.step}</span>
                </div>
                <div className="flex-1">
                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join our partner program today and start earning commissions by sharing OptimaliQ 
                with organizations that need AI-powered business intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/register?ref=partner">
                    Join Partner Program
                    <Gift className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Learn More
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
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
