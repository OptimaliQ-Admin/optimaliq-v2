/**
 * OptimaliQ Real-time Collaboration
 * Live collaboration with WebSocket integration
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, MessageSquare, Activity, Eye, Edit, Save, Share2,
  Settings, Bell, Zap, Sparkles, Wifi, WifiOff, User, UserCheck,
  UserX, Clock, Calendar, Target, BarChart3, TrendingUp,
  ChevronDown, ChevronUp, Loader2, Smile, ThumbsUp, ThumbsDown,
  RefreshCw, Volume2, VolumeX, Mic, MicOff, Video, Phone,
  MoreVertical, Search, Filter, Download, ExternalLink, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'
import ChatComponent from '@/components/realtime/chat'

// Collaboration data types
interface Collaborator {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'busy'
  lastSeen: Date
  currentActivity: string
  cursor?: { x: number; y: number }
  color: string
}

interface ActivityItem {
  id: string
  type: 'edit' | 'comment' | 'share' | 'join' | 'leave'
  user: string
  description: string
  timestamp: Date
  metadata?: any
}

interface DocumentSection {
  id: string
  title: string
  content: string
  lastEdited: Date
  editedBy: string
  version: number
  collaborators: string[]
}

// Real-time collaboration data
const collaborationData = {
  document: {
    id: 'doc-001',
    title: 'Q4 Strategic Planning Document',
    sections: [
      {
        id: 'sec-1',
        title: 'Executive Summary',
        content: 'Our Q4 strategy focuses on three key pillars: market expansion, product innovation, and operational efficiency. We aim to achieve 25% growth while maintaining our commitment to customer satisfaction.',
        lastEdited: new Date(Date.now() - 300000),
        editedBy: 'Sarah Johnson',
        version: 3,
        collaborators: ['sarah', 'michael', 'emily']
      },
      {
        id: 'sec-2',
        title: 'Market Analysis',
        content: 'Market research indicates strong demand for our solutions in the healthcare and technology sectors. We\'ve identified 15 new market opportunities with high growth potential.',
        lastEdited: new Date(Date.now() - 180000),
        editedBy: 'Michael Chen',
        version: 2,
        collaborators: ['michael', 'david']
      },
      {
        id: 'sec-3',
        title: 'Action Plan',
        content: 'Phase 1: Launch new product features (Weeks 1-4)\nPhase 2: Expand into new markets (Weeks 5-8)\nPhase 3: Optimize operations (Weeks 9-12)',
        lastEdited: new Date(Date.now() - 60000),
        editedBy: 'Emily Rodriguez',
        version: 1,
        collaborators: ['emily', 'sarah']
      }
    ]
  },
  collaborators: [
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      status: 'online',
      lastSeen: new Date(),
      currentActivity: 'Editing Executive Summary',
      color: '#3B82F6'
    },
    {
      id: 'michael',
      name: 'Michael Chen',
      status: 'online',
      lastSeen: new Date(),
      currentActivity: 'Reviewing Market Analysis',
      color: '#10B981'
    },
    {
      id: 'emily',
      name: 'Emily Rodriguez',
      status: 'away',
      lastSeen: new Date(Date.now() - 300000),
      currentActivity: 'Working on Action Plan',
      color: '#F59E0B'
    },
    {
      id: 'david',
      name: 'David Kim',
      status: 'busy',
      lastSeen: new Date(Date.now() - 600000),
      currentActivity: 'In a meeting',
      color: '#EF4444'
    }
  ],
  activities: [
    {
      id: '1',
      type: 'edit',
      user: 'Sarah Johnson',
      description: 'Updated Executive Summary',
      timestamp: new Date(Date.now() - 300000),
      metadata: { section: 'Executive Summary', changes: 3 }
    },
    {
      id: '2',
      type: 'comment',
      user: 'Michael Chen',
      description: 'Added comment to Market Analysis',
      timestamp: new Date(Date.now() - 240000),
      metadata: { section: 'Market Analysis', comment: 'Great insights on market opportunities' }
    },
    {
      id: '3',
      type: 'share',
      user: 'Emily Rodriguez',
      description: 'Shared document with stakeholders',
      timestamp: new Date(Date.now() - 180000),
      metadata: { recipients: 5, permissions: 'view' }
    },
    {
      id: '4',
      type: 'join',
      user: 'David Kim',
      description: 'Joined the collaboration',
      timestamp: new Date(Date.now() - 120000)
    }
  ]
}

export default function LiveCollaborationPage() {
  const [selectedSection, setSelectedSection] = React.useState('sec-1')
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState('')
  const [isConnected, setIsConnected] = React.useState(true)
  const [showChat, setShowChat] = React.useState(true)
  const [currentUser] = React.useState({
    id: 'current-user',
    name: 'Jennifer Walsh'
  })

  const selectedSectionData = collaborationData.document.sections.find(
    section => section.id === selectedSection
  )

  React.useEffect(() => {
    if (selectedSectionData) {
      setEditContent(selectedSectionData.content)
    }
  }, [selectedSectionData])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would send the update via WebSocket
    // collaborationService?.sendUpdate(selectedSection, editContent)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(selectedSectionData?.content || '')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return <Edit className="h-4 w-4" />
      case 'comment': return <MessageSquare className="h-4 w-4" />
      case 'share': return <Share2 className="h-4 w-4" />
      case 'join': return <UserCheck className="h-4 w-4" />
      case 'leave': return <UserX className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Live Collaboration</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              <Sparkles className="h-3 w-3 mr-1" />
              Live
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{collaborationData.document.title}</h1>
                  <p className="text-muted-foreground">
                    Real-time collaboration with live editing and instant updates
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save All
                  </Button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-8">
              {/* Main Document Area */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-3 space-y-6"
              >
                {/* Document Sections */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Document Sections</h2>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                        {collaborationData.collaborators.filter(c => c.status === 'online').length} online
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Mode
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {collaborationData.document.sections.map((section) => (
                      <div key={section.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">{section.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              v{section.version}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Last edited by {section.editedBy}
                            </span>
                            {selectedSection === section.id && isEditing && (
                              <div className="flex items-center space-x-2">
                                <Button size="sm" onClick={handleSave}>
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                  Cancel
                                </Button>
                              </div>
                            )}
                            {selectedSection === section.id && !isEditing && (
                              <Button size="sm" variant="outline" onClick={handleEdit}>
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>

                        {selectedSection === section.id && isEditing ? (
                          <div className="space-y-4">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full p-3 border rounded-lg resize-none"
                              rows={8}
                              placeholder="Start editing..."
                            />
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                              <span>Live editing - others can see your changes</span>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-line">{section.content}</p>
                          </div>
                        )}

                        {/* Collaborator cursors */}
                        <div className="mt-4 flex items-center space-x-2">
                          {section.collaborators.map((collaboratorId) => {
                            const collaborator = collaborationData.collaborators.find(c => c.id === collaboratorId)
                            if (!collaborator) return null
                            
                            return (
                              <div key={collaboratorId} className="flex items-center space-x-1">
                                <div 
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: collaborator.color }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {collaborator.name}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Activity Feed */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Live Activity Feed</h2>
                  
                  <div className="space-y-4">
                    {collaborationData.activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{activity.user}</span>
                            <span className="text-xs text-muted-foreground">
                              {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          
                          {activity.metadata && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              {activity.type === 'edit' && (
                                <span>Changes: {activity.metadata.changes}</span>
                              )}
                              {activity.type === 'comment' && (
                                <span>"{activity.metadata.comment}"</span>
                              )}
                              {activity.type === 'share' && (
                                <span>Shared with {activity.metadata.recipients} people</span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Collaborators */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Active Collaborators</h3>
                  <div className="space-y-3">
                    {collaborationData.collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{collaborator.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {collaborator.currentActivity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Chat */}
                {showChat && (
                  <Card className="h-96">
                    <ChatComponent
                      room="collaboration-doc-001"
                      currentUser={currentUser}
                    />
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Collaborators
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Document
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Collaboration Settings
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
