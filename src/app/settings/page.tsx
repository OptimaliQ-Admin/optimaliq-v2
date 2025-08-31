/**
 * OptimaliQ Settings Page
 * Comprehensive settings management with user preferences and organization configuration
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Settings, User, Building, Shield, Bell, Globe, Database, 
  Key, Lock, Unlock, Eye, EyeOff, Download, Upload, Trash,
  Plus, Edit, Save, X, Check, AlertCircle, Info, HelpCircle,
  ArrowRight, Zap, Users, Target, BarChart3, Activity, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('profile')
  const [showPassword, setShowPassword] = React.useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'organization', label: 'Organization', icon: <Building className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe className="h-4 w-4" /> },
    { id: 'billing', label: 'Billing', icon: <Database className="h-4 w-4" /> }
  ]

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
            <span className="text-sm text-muted-foreground">Settings</span>
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
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account, organization, and system preferences
              </p>
            </div>
          </motion.div>

          <div className="flex space-x-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-64 flex-shrink-0"
            >
              <Card className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <Button variant="outline">Change Photo</Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">First Name</label>
                        <Input defaultValue="Jennifer" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Last Name</label>
                        <Input defaultValue="Walsh" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input defaultValue="jennifer.walsh@healthforward.org" type="email" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job Title</label>
                      <Input defaultValue="CEO & Executive Director" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bio</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        defaultValue="Experienced healthcare executive focused on organizational growth and patient outcomes."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Organization Settings */}
              {activeTab === 'organization' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Organization Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Organization Name</label>
                      <Input defaultValue="HealthForward" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Industry</label>
                      <Select
                        defaultValue="healthcare"
                        options={[
                          { value: 'healthcare', label: 'Healthcare' },
                          { value: 'technology', label: 'Technology' },
                          { value: 'finance', label: 'Financial Services' },
                          { value: 'manufacturing', label: 'Manufacturing' }
                        ]}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Organization Size</label>
                      <Select
                        defaultValue="50-200"
                        options={[
                          { value: '1-10', label: '1-10 employees' },
                          { value: '11-50', label: '11-50 employees' },
                          { value: '50-200', label: '50-200 employees' },
                          { value: '200+', label: '200+ employees' }
                        ]}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Website</label>
                      <Input defaultValue="https://healthforward.org" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        defaultValue="Leading healthcare organization focused on improving patient outcomes through innovative solutions and strategic planning."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Password</label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">New Password</label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="2fa" className="rounded" />
                      <label htmlFor="2fa" className="text-sm">Enable Two-Factor Authentication</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="session" className="rounded" />
                      <label htmlFor="session" className="text-sm">Remember login sessions</label>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Update Security</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Assessment reminders</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team updates</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Progress reports</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">In-App Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">New assessments</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Action item updates</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">System alerts</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Integrations</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 border-2 border-muted hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">Slack</h4>
                            <p className="text-xs text-muted-foreground">Team communication</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Connect</Button>
                      </Card>
                      
                      <Card className="p-4 border-2 border-muted hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-8 w-8 rounded bg-green-500 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">Google Analytics</h4>
                            <p className="text-xs text-muted-foreground">Website analytics</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Connect</Button>
                      </Card>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>View All Integrations</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Current Plan</h3>
                        <Badge variant="secondary">Enterprise</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">$299/month - Unlimited users and features</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Payment Method</h3>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">Update Payment</Button>
                      <Button>Change Plan</Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
