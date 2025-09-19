/**
 * OptimaliQ Profile Setup Page
 * Complete user profile setup after email verification
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  User,
  Zap
} from 'lucide-react'
import { Container, Section } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'

export default function ProfileSetupPage() {
  // Temporary fallback to prevent build errors
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
          
          <div className="flex items-center space-x-4">
            <StatusBadge status="info" size="sm">
              <User className="h-4 w-4 mr-1" />
              Profile Setup
            </StatusBadge>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <StatusBadge status="primary" className="mb-6">
              <User className="h-4 w-4 mr-2" />
              Profile Setup
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Profile Setup
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              This page is temporarily unavailable during build optimization. Please check back later.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-8 border border-muted">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                We're optimizing the profile setup experience. This page will be fully functional soon.
              </p>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
