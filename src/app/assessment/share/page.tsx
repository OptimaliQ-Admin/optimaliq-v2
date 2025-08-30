/**
 * OptimaliQ Assessment Sharing Page
 * Share assessments and results with team members and stakeholders
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Share2,
  Users,
  Mail,
  Link as LinkIcon,
  Copy,
  Download,
  Eye,
  EyeOff,
  Settings,
  ArrowLeft,
  ArrowRight,
  Target,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Calendar,
  User,
  Building,
  Globe,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Info,
  Send,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Star,
  Award,
  MessageSquare,
  Phone,
  Smartphone,
  AtSign,
  ExternalLink,
  QrCode,
  Printer,
  FileText,
  Image,
  Video
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Select, Checkbox } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Assessment sharing data
const sharingData = {
  assessment: {
    id: 'strategic-assessment-001',
    title: 'Strategic Assessment - Q3 2024',
    type: 'Strategic Assessment',
    completed: '2024-08-29',
    score: 72,
    category: 'Strategy',
    owner: 'John Smith',
    organization: 'HealthForward'
  },
  shareOptions: [
    {
      id: 'public-link',
      name: 'Public Link',
      description: 'Anyone with the link can view the results',
      icon: <LinkIcon className="h-5 w-5" />,
      security: 'Low',
      features: ['No login required', 'View-only access', 'Customizable permissions']
    },
    {
      id: 'email-invite',
      name: 'Email Invitation',
      description: 'Send personalized invitations to specific people',
      icon: <Mail className="h-5 w-5" />,
      security: 'Medium',
      features: ['Email verification', 'Personalized message', 'Access control']
    },
    {
      id: 'team-workspace',
      name: 'Team Workspace',
      description: 'Share within your organization\'s workspace',
      icon: <Users className="h-5 w-5" />,
      security: 'High',
      features: ['Organization members only', 'Role-based access', 'Audit trail']
    },
    {
      id: 'external-embed',
      name: 'External Embed',
      description: 'Embed results in presentations or documents',
      icon: <ExternalLink className="h-5 w-5" />,
      security: 'Medium',
      features: ['Embeddable widget', 'Customizable display', 'Real-time updates']
    }
  ],
  permissions: [
    { id: 'view', name: 'View Only', description: 'Can view results and insights' },
    { id: 'comment', name: 'View & Comment', description: 'Can view and add comments' },
    { id: 'edit', name: 'View & Edit', description: 'Can view, comment, and edit action plans' },
    { id: 'admin', name: 'Full Access', description: 'Can view, edit, and manage sharing settings' }
  ],
  exportFormats: [
    { id: 'pdf', name: 'PDF Report', icon: <FileText className="h-4 w-4" />, description: 'Comprehensive PDF with all insights' },
    { id: 'pptx', name: 'PowerPoint', icon: <Image className="h-4 w-4" />, description: 'Presentation-ready slides' },
    { id: 'excel', name: 'Excel Data', icon: <BarChart3 className="h-4 w-4" />, description: 'Raw data and analytics' },
    { id: 'json', name: 'JSON Data', icon: <FileText className="h-4 w-4" />, description: 'Structured data for integrations' }
  ],
  sharedWith: [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@healthforward.org',
      role: 'COO',
      permission: 'admin',
      status: 'accepted',
      lastAccessed: '2024-08-28',
      invitedBy: 'John Smith',
      invitedOn: '2024-08-25'
    },
    {
      id: 2,
      name: 'Michael Davis',
      email: 'michael.davis@healthforward.org',
      role: 'Director of Operations',
      permission: 'edit',
      status: 'pending',
      lastAccessed: null,
      invitedBy: 'John Smith',
      invitedOn: '2024-08-27'
    },
    {
      id: 3,
      name: 'Lisa Chen',
      email: 'lisa.chen@healthforward.org',
      role: 'Program Manager',
      permission: 'view',
      status: 'accepted',
      lastAccessed: '2024-08-29',
      invitedBy: 'Sarah Johnson',
      invitedOn: '2024-08-26'
    }
  ],
  analytics: {
    totalViews: 47,
    uniqueViewers: 12,
    avgTimeSpent: '8m 34s',
    lastViewed: '2024-08-29',
    downloadCount: 8,
    shareCount: 3
  }
}

export default function AssessmentSharingPage() {
  const [selectedShareOption, setSelectedShareOption] = React.useState(sharingData.shareOptions[0])
  const [inviteEmails, setInviteEmails] = React.useState('')
  const [inviteMessage, setInviteMessage] = React.useState('')
  const [selectedPermission, setSelectedPermission] = React.useState('view')
  const [isLoading, setIsLoading] = React.useState(false)
  const [shareLink, setShareLink] = React.useState('')
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const handleGenerateLink = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setShareLink(`https://app.optimaliq.ai/shared/assessment/${sharingData.assessment.id}?token=abc123xyz`)
    } catch (error) {
      console.error('Failed to generate share link', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendInvites = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Invites sent')
      setInviteEmails('')
      setInviteMessage('')
    } catch (error) {
      console.error('Failed to send invites', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success'
      case 'pending': return 'warning'
      case 'declined': return 'error'
      default: return 'info'
    }
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'error'
      case 'edit': return 'warning'
      case 'comment': return 'info'
      case 'view': return 'success'
      default: return 'info'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Share Assessment</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <StatusBadge status="primary" className="mb-4">
              <Share2 className="h-4 w-4 mr-2" />
              Assessment Sharing
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Share Your Assessment Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Collaborate with your team and stakeholders by sharing assessment results, 
              insights, and action plans with customizable permissions and security controls.
            </p>
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Assessment Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold mb-4">Assessment Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{sharingData.assessment.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{sharingData.assessment.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <StatusBadge status="warning" size="sm">{sharingData.assessment.score}/100</StatusBadge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium">{sharingData.assessment.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium">{sharingData.assessment.owner}</span>
                  </div>
                </div>
              </Card>

              {/* Sharing Analytics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Sharing Analytics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Views:</span>
                    <span className="font-medium">{sharingData.analytics.totalViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unique Viewers:</span>
                    <span className="font-medium">{sharingData.analytics.uniqueViewers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Time:</span>
                    <span className="font-medium">{sharingData.analytics.avgTimeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{sharingData.analytics.downloadCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Viewed:</span>
                    <span className="font-medium">{sharingData.analytics.lastViewed}</span>
                  </div>
                </div>
              </Card>

              {/* Export Options */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Export Formats</h3>
                <div className="space-y-3">
                  {sharingData.exportFormats.map((format) => (
                    <Button
                      key={format.id}
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      {format.icon}
                      <span className="ml-3">{format.name}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Main Sharing Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2 space-y-8"
            >
              {/* Share Options */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Choose Sharing Method</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                  {sharingData.shareOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShareOption.id === option.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedShareOption(option)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{option.name}</h3>
                            <StatusBadge 
                              status={option.security === 'High' ? 'success' : option.security === 'Medium' ? 'warning' : 'error'} 
                              size="xs"
                            >
                              {option.security} Security
                            </StatusBadge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                          <div className="space-y-1">
                            {option.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center space-x-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Share Configuration */}
                {selectedShareOption.id === 'public-link' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Access Level
                      </label>
                      <Select
                        options={sharingData.permissions.map(p => ({
                          value: p.id,
                          label: `${p.name} - ${p.description}`
                        }))}
                        value={selectedPermission}
                        onValueChange={setSelectedPermission}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Require password</span>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Set expiration date</span>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Track views</span>
                        <Checkbox checked={true} />
                      </div>
                    </div>

                    <Button onClick={handleGenerateLink} loading={isLoading} className="w-full">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Generate Share Link
                    </Button>

                    {shareLink && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <label className="block text-sm font-medium mb-2">Share Link</label>
                        <div className="flex items-center space-x-2">
                          <Input value={shareLink} readOnly className="flex-1" />
                          <Button size="sm" onClick={() => copyToClipboard(shareLink)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedShareOption.id === 'email-invite' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Addresses
                      </label>
                      <textarea
                        value={inviteEmails}
                        onChange={(e) => setInviteEmails(e.target.value)}
                        placeholder="Enter email addresses (one per line)"
                        rows={4}
                        className="w-full p-3 border rounded-lg resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter one email address per line
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Permission Level
                      </label>
                      <Select
                        options={sharingData.permissions.map(p => ({
                          value: p.id,
                          label: `${p.name} - ${p.description}`
                        }))}
                        value={selectedPermission}
                        onValueChange={setSelectedPermission}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Personal Message (Optional)
                      </label>
                      <textarea
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        placeholder="Add a personal message to your invitation..."
                        rows={3}
                        className="w-full p-3 border rounded-lg resize-none"
                      />
                    </div>

                    <Button 
                      onClick={handleSendInvites} 
                      loading={isLoading} 
                      className="w-full"
                      disabled={!inviteEmails.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitations
                    </Button>
                  </div>
                )}
              </Card>

              {/* Currently Shared With */}
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Currently Shared With</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Person
                  </Button>
                </div>

                {sharingData.sharedWith.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      This assessment hasn't been shared with anyone yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sharingData.sharedWith.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{person.name}</div>
                            <div className="text-sm text-muted-foreground">{person.email}</div>
                            <div className="text-xs text-muted-foreground">{person.role}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm">
                            <StatusBadge status={getStatusColor(person.status) as any} size="sm">
                              {person.status}
                            </StatusBadge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {person.lastAccessed ? `Last: ${person.lastAccessed}` : 'Never accessed'}
                            </div>
                          </div>
                          
                          <StatusBadge status={getPermissionColor(person.permission) as any} size="sm">
                            {sharingData.permissions.find(p => p.id === person.permission)?.name}
                          </StatusBadge>
                          
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
