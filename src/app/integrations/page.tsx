/**
 * OptimaliQ Integrations Page
 * Third-party service connections and API management
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Link as LinkIcon, Settings, Plus, Trash, Edit, Eye,
  Calendar, Clock, Users, Target, BarChart3, TrendingUp,
  ArrowRight, Zap, Bell, HelpCircle, MessageSquare,
  Database, Cloud, Shield, Key, Lock, Unlock, CheckCircle,
  XCircle, AlertCircle, Info, ExternalLink, RefreshCw,
  Globe, Building, Star, Award, Rocket, Lightbulb, Gauge,
  Activity, PieChart, LineChart, AreaChart, Target as TargetIcon,
  CheckSquare, Clock as ClockIcon, Calendar as CalendarIcon,
  User, Star as StarIcon, Award as AwardIcon, Rocket as RocketIcon,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

// Integrations data
const integrationsData = {
  connected: [
    {
      id: 1,
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'Communication',
      status: 'connected',
      lastSync: '2024-08-25 14:30',
      syncStatus: 'success',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-blue-500',
      apiCalls: 1247,
      dataTransferred: '2.3 GB',
      lastError: null
    },
    {
      id: 2,
      name: 'Google Analytics',
      description: 'Website and user behavior analytics',
      category: 'Analytics',
      status: 'connected',
      lastSync: '2024-08-25 12:15',
      syncStatus: 'success',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-green-500',
      apiCalls: 892,
      dataTransferred: '1.8 GB',
      lastError: null
    },
    {
      id: 3,
      name: 'HubSpot',
      description: 'CRM and marketing automation',
      category: 'CRM',
      status: 'connected',
      lastSync: '2024-08-25 10:45',
      syncStatus: 'warning',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-orange-500',
      apiCalls: 567,
      dataTransferred: '890 MB',
      lastError: 'Rate limit exceeded'
    }
  ],
  available: [
    {
      id: 4,
      name: 'Microsoft Teams',
      description: 'Team collaboration and chat',
      category: 'Communication',
      status: 'available',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-purple-500',
      features: ['Chat', 'Video Calls', 'File Sharing'],
      pricing: 'Free'
    },
    {
      id: 5,
      name: 'Salesforce',
      description: 'Customer relationship management',
      category: 'CRM',
      status: 'available',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-600',
      features: ['Lead Management', 'Sales Tracking', 'Reports'],
      pricing: 'Paid'
    },
    {
      id: 6,
      name: 'Zapier',
      description: 'Workflow automation',
      category: 'Automation',
      status: 'available',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-orange-500',
      features: ['Triggers', 'Actions', 'Webhooks'],
      pricing: 'Freemium'
    },
    {
      id: 7,
      name: 'Stripe',
      description: 'Payment processing',
      category: 'Finance',
      status: 'available',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-purple-600',
      features: ['Payments', 'Subscriptions', 'Invoicing'],
      pricing: 'Paid'
    }
  ],
  categories: [
    { value: 'all', label: 'All Categories' },
    { value: 'communication', label: 'Communication' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'crm', label: 'CRM' },
    { value: 'automation', label: 'Automation' },
    { value: 'finance', label: 'Finance' },
    { value: 'productivity', label: 'Productivity' }
  ],
  apiStats: {
    totalCalls: 2706,
    successRate: 98.5,
    averageResponse: 245,
    errors: 41
  }
}

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showConnected, setShowConnected] = React.useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'connecting': return 'text-yellow-600 bg-yellow-100'
      case 'disconnected': return 'text-red-600 bg-red-100'
      case 'available': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredIntegrations = [...integrationsData.connected, ...integrationsData.available].filter(integration => {
    const matchesCategory = selectedCategory === 'all' || 
      integration.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVisibility = showConnected ? integration.status === 'connected' : integration.status === 'available'
    return matchesCategory && matchesSearch && matchesVisibility
  })

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
            <span className="text-sm text-muted-foreground">Integrations</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Integrations</h1>
                <p className="text-muted-foreground">
                  Connect with third-party services and manage API connections
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>
            </div>
          </motion.div>

          {/* API Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Grid cols={4} gap={6}>
              <MetricCard
                title="Total API Calls"
                value={integrationsData.apiStats.totalCalls.toLocaleString()}
                subtitle="This month"
                icon={<Activity className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Success Rate"
                value={`${integrationsData.apiStats.successRate}%`}
                subtitle="API calls"
                icon={<CheckCircle className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Avg Response"
                value={`${integrationsData.apiStats.averageResponse}ms`}
                subtitle="Response time"
                icon={<Gauge className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Errors"
                value={integrationsData.apiStats.errors}
                subtitle="This month"
                icon={<AlertCircle className="h-5 w-5" />}
                className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
              />
            </Grid>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  options={integrationsData.categories}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    variant={showConnected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowConnected(true)}
                  >
                    Connected ({integrationsData.connected.length})
                  </Button>
                  <Button
                    variant={!showConnected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowConnected(false)}
                  >
                    Available ({integrationsData.available.length})
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Connected Integrations */}
          {showConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Connected Integrations</h2>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All
                  </Button>
                </div>

                <div className="space-y-4">
                  {integrationsData.connected.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-12 w-12 rounded-lg ${integration.color} flex items-center justify-center`}>
                            {integration.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                              <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                {integration.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash className="h-4 w-4 mr-1" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Last Sync:</span>
                          <p className="font-medium">{integration.lastSync}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Sync Status:</span>
                          <div className="flex items-center space-x-1">
                            {getSyncStatusIcon(integration.syncStatus)}
                            <span className="font-medium capitalize">{integration.syncStatus}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">API Calls:</span>
                          <p className="font-medium">{integration.apiCalls.toLocaleString()}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Data:</span>
                          <p className="font-medium">{integration.dataTransferred}</p>
                        </div>
                      </div>
                      
                      {integration.lastError && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <span>Last Error: {integration.lastError}</span>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Available Integrations */}
          {!showConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Available Integrations</h2>
                <div className="grid grid-cols-2 gap-6">
                  {integrationsData.available.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-12 w-12 rounded-lg ${integration.color} flex items-center justify-center`}>
                            {integration.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                              <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                {integration.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Pricing: <span className="font-medium">{integration.pricing}</span>
                        </span>
                        <Button size="sm">
                          <LinkIcon className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* API Documentation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">API Documentation</h2>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <ExternalLink className="h-6 w-6" />
                  <span>API Reference</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Key className="h-6 w-6" />
                  <span>Authentication</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Database className="h-6 w-6" />
                  <span>Webhooks</span>
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Integration</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Configure</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <RefreshCw className="h-6 w-6" />
                  <span>Sync All</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Security</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
