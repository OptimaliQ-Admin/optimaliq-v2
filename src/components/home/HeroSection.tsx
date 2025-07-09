//src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Grid, Badge, Button, Icon } from "@/components/ui";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Hero_Background.jpeg"
          alt="OptimaliQ Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-blue-900/75 to-indigo-900/80" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Enhanced Content */}
      <div className="relative z-10 w-full">
        <Grid.Container maxWidth="7xl" padding="lg">
          <Grid.Row cols={12} gap="xl" alignItems="center">
            <Grid.Col span={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Enhanced Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Badge variant="primary" size="lg" icon="rocket">
                    AI-Powered Growth Platform
                  </Badge>
                </motion.div>

                {/* Enhanced Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-bold text-white leading-tight"
                >
                  Smarter Decisions.
                  <br />
                  <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Faster Growth.
                  </span>
                </motion.h1>

                {/* Enhanced Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl"
                >
                  Unlock predictable growth with AI-driven strategy insights and real-time competitive benchmarking.
                </motion.p>

                {/* Enhanced CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    variant="primary"
                    href="/growth-assessment"
                    icon="target"
                    iconPosition="left"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  >
                    Start Free Growth Audit
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    href="/#how-it-works"
                    icon="play"
                    iconPosition="left"
                    className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
                  >
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Enhanced Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex items-center gap-6 pt-4"
                >
                  <div className="flex items-center gap-2 text-gray-300">
                    <Icon name="check" size="sm" className="text-green-400" />
                    <span className="text-sm">Free Assessment</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Icon name="check" size="sm" className="text-green-400" />
                    <span className="text-sm">No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Icon name="check" size="sm" className="text-green-400" />
                    <span className="text-sm">Instant Results</span>
                  </div>
                </motion.div>
              </motion.div>
            </Grid.Col>
            
            {/* Enhanced Visual Section */}
            <Grid.Col span={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                {/* Dashboard Preview */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white font-medium">Live Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">85.2</div>
                        <div className="text-xs text-gray-300">Performance</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">+12.5%</div>
                        <div className="text-xs text-gray-300">Growth</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">92%</div>
                        <div className="text-xs text-gray-300">Efficiency</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Market Position</span>
                        <span className="text-sm text-green-400">Top 10%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="trending-up" size="sm" className="text-blue-400" />
                    <span className="text-xs text-white">+15% ROI</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="target" size="sm" className="text-green-400" />
                    <span className="text-xs text-white">Goal Achieved</span>
                  </div>
                </motion.div>
              </motion.div>
            </Grid.Col>
          </Grid.Row>
        </Grid.Container>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/60"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <Icon name="arrow-down" size="sm" />
        </motion.div>
      </motion.div>
    </section>
  );
}
