/**
 * OptimaliQ Reports Page
 * Comprehensive reporting with templates, generation, and export capabilities
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FileText, Download, Share2, Filter, Search, Eye, Edit,
  Calendar, Clock, Users, Target, BarChart3, TrendingUp,
  ArrowRight, Zap, Settings, Bell, HelpCircle, MessageSquare,
  Plus, Trash, Copy, Star, Bookmark, Send, Mail, Printer,
  FileDown, FileUp, Database, Cloud, Shield, Key, Lock,
  Unlock, PieChart, LineChart, AreaChart, Gauge, CheckSquare,
  Clock as ClockIcon, Calendar as CalendarIcon, User, Building,
  Globe, Star as StarIcon, Award, Rocket, Lightbulb, Folder,
  FolderOpen, File, FileCheck, FileX, FileSearch, FileBarChart
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

// Reports data
const reportsData = {
  templates: [
    {
      id: 1,
      name: 'Executive Summary',
      description: 'High-level overview of organizational performance',
      category: 'Leadership',
      lastUsed: '2024-08-15',
      usage: 23,
      favorite: true,
      icon: <FileBarChart className="h-5 w-5" />
    },
    {
      id: 2,
      name: 'Team Performance',
      description: 'Detailed analysis of team effectiveness and collaboration',
      category: 'Team Management',
      lastUsed: '2024-08-20',
      usage: 45,
      favorite: false,
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 3,
      name: 'Process Optimization',
      description: 'Workflow efficiency and improvement opportunities',
      category: 'Operations',
      lastUsed: '2024-08-18',
      usage: 18,
      favorite: true,
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 4,
      name: 'Customer Insights',
      description: 'Customer satisfaction and experience metrics',
      category: 'Customer Success',
      lastUsed: '2024-08-22',
      usage: 32,
      favorite: false,
      icon: <BarChart3 className="h-5 w-5" />
    }
  ],
  recentReports: [
    {
      id: 1,
      name: 'Q3 Performance Review',
      template: 'Executive Summary',
      generatedBy: 'Jennifer Walsh',
      generatedAt: '2024-08-25',
      status: 'completed',
      size: '2.4 MB',
      downloads: 12
    },
    {
      id: 2,
      name: 'Team Assessment Results',
      template: 'Team Performance',
      generatedBy: 'Michael Chen',
      generatedAt: '2024-08-24',
      status: 'completed',
      size: '1.8 MB',
      downloads: 8
    },
    {
      id: 3,
      name: 'Process Efficiency Report',
      template: 'Process Optimization',
      generatedBy: 'Sarah Johnson',
      generatedAt: '2024-08-23',
      status: 'processing',
      size: '3.1 MB',
      downloads: 0
    }
  ],
  categories: [
    { value: 'all', label: 'All Categories' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'team', label: 'Team Management' },
    { value: 'operations', label: 'Operations' },
    { value: 'customer', label: 'Customer Success' },
    { value: 'financial', label: 'Financial' }
  ],
  exportFormats: [
    { value: 'pdf', label: 'PDF', icon: <FileText className="h-4 w-4" /> },
    { value: 'excel', label: 'Excel', icon: <FileBarChart className="h-4 w-4" /> },
    { value: 'csv', label: 'CSV', icon: <FileDown className="h-4 w-4" /> },
    { value: 'json', label: 'JSON', icon: <Database className="h-4 w-4" /> }
  ]
}

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedTemplate, setSelectedTemplate] = React.useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FileCheck className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'failed': return <FileX className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const filteredTemplates = reportsData.templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || 
      template.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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
            <span className="text-sm text-muted-foreground">Reports</span>
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
                <h1 className="text-3xl font-bold mb-2">Reports</h1>
                <p className="text-muted-foreground">
                  Generate, manage, and share comprehensive organizational reports
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Grid cols={4} gap={6}>
              <MetricCard
                title="Total Reports"
                value={reportsData.recentReports.length}
                subtitle="This month"
                icon={<FileText className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Templates"
                value={reportsData.templates.length}
                subtitle="Available"
                icon={<Folder className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Downloads"
                value="156"
                subtitle="This month"
                icon={<Download className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Shared Reports"
                value="23"
                subtitle="This month"
                icon={<Share2 className="h-5 w-5" />}
                className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports and templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  options={reportsData.categories}
                />
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Report Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Report Templates</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {template.favorite && (
                          <Button variant="ghost" size="sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                        {template.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Used {template.usage} times
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Last used: {template.lastUsed}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Recent Reports</h2>
              <div className="space-y-4">
                {reportsData.recentReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Template: {report.template} • Generated by {report.generatedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getStatusColor(report.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(report.status)}
                            <span className="capitalize">{report.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Generated: {report.generatedAt}</span>
                      <span>Size: {report.size}</span>
                      <span>Downloads: {report.downloads}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Export Options</h2>
              <div className="grid grid-cols-4 gap-4">
                {reportsData.exportFormats.map((format) => (
                  <Button key={format.value} variant="outline" className="h-20 flex-col space-y-2">
                    {format.icon}
                    <span>{format.label}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>New Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Folder className="h-6 w-6" />
                  <span>Manage Templates</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Share2 className="h-6 w-6" />
                  <span>Share Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Configure</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
