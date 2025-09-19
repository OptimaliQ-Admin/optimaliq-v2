/**
 * OptimaliQ Assessment Scoring Configuration Page
 * Advanced scoring algorithms and weighting configuration
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Calculator,
  Settings,
  Target,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Save,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Edit,
  Copy,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Percent,
  Hash,
  Brain,
  Lightbulb,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  BookOpen,
  FileText,
  Download,
  Upload,
  Wand2,
  Star,
  Clock,
  Activity,
  Gauge
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Select, Checkbox, Slider } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Scoring configuration data
const scoringData = {
  algorithms: [
    {
      id: 'weighted-average',
      name: 'Weighted Average',
      description: 'Questions are weighted based on importance and impact',
      recommended: true,
      complexity: 'Medium',
      accuracy: '92%',
      features: [
        'Question-level weighting',
        'Category-level adjustments',
        'Industry-specific weights',
        'Confidence factor integration'
      ]
    },
    {
      id: 'ai-adaptive',
      name: 'AI Adaptive Scoring',
      description: 'Machine learning model adapts scoring based on response patterns',
      recommended: false,
      complexity: 'High',
      accuracy: '96%',
      features: [
        'Dynamic weight adjustment',
        'Pattern recognition',
        'Contextual scoring',
        'Continuous learning'
      ]
    },
    {
      id: 'simple-average',
      name: 'Simple Average',
      description: 'All questions weighted equally for straightforward scoring',
      recommended: false,
      complexity: 'Low',
      accuracy: '85%',
      features: [
        'Equal question weights',
        'Easy to understand',
        'Quick calculation',
        'Baseline scoring'
      ]
    }
  ],
  categories: [
    {
      id: 'strategy',
      name: 'Strategy',
      weight: 1.2,
      questions: 12,
      avgScore: 78,
      impact: 'High',
      description: 'Strategic vision, planning, and execution capabilities'
    },
    {
      id: 'operations',
      name: 'Operations',
      weight: 1.1,
      questions: 10,
      avgScore: 72,
      impact: 'High',
      description: 'Operational efficiency and process optimization'
    },
    {
      id: 'team',
      name: 'Team & Culture',
      weight: 1.0,
      questions: 8,
      avgScore: 85,
      impact: 'Medium',
      description: 'Team dynamics, collaboration, and organizational culture'
    },
    {
      id: 'growth',
      name: 'Growth & Innovation',
      weight: 1.3,
      questions: 9,
      avgScore: 68,
      impact: 'High',
      description: 'Growth strategies and innovation capabilities'
    },
    {
      id: 'technology',
      name: 'Technology',
      weight: 0.9,
      questions: 6,
      avgScore: 65,
      impact: 'Medium',
      description: 'Technology adoption and digital transformation'
    }
  ],
  scoringRules: [
    {
      id: 'confidence-weighting',
      name: 'Confidence Weighting',
      description: 'Adjust scores based on respondent confidence levels',
      enabled: true,
      impact: 'Medium',
      formula: 'score × (confidence / 5)'
    },
    {
      id: 'industry-adjustment',
      name: 'Industry Benchmarking',
      description: 'Normalize scores against industry-specific benchmarks',
      enabled: true,
      impact: 'High',
      formula: 'score × industry_factor'
    },
    {
      id: 'size-adjustment',
      name: 'Organization Size Factor',
      description: 'Account for organization size in scoring calculations',
      enabled: false,
      impact: 'Low',
      formula: 'score × size_multiplier'
    },
    {
      id: 'response-quality',
      name: 'Response Quality Assessment',
      description: 'Weight responses based on quality and completeness',
      enabled: true,
      impact: 'Medium',
      formula: 'score × quality_factor'
    }
  ],
  presets: [
    {
      id: 'balanced',
      name: 'Balanced Scoring',
      description: 'Equal emphasis on all categories with moderate weighting',
      recommended: true,
      weights: { strategy: 1.0, operations: 1.0, team: 1.0, growth: 1.0, technology: 1.0 }
    },
    {
      id: 'strategy-focused',
      name: 'Strategy-Focused',
      description: 'Higher emphasis on strategic planning and vision',
      recommended: false,
      weights: { strategy: 1.5, operations: 1.0, team: 0.8, growth: 1.2, technology: 0.7 }
    },
    {
      id: 'operations-focused',
      name: 'Operations-Focused',
      description: 'Emphasis on operational excellence and efficiency',
      recommended: false,
      weights: { strategy: 0.9, operations: 1.5, team: 1.0, growth: 0.8, technology: 1.1 }
    },
    {
      id: 'growth-focused',
      name: 'Growth-Focused',
      description: 'Higher weight on growth and innovation capabilities',
      recommended: false,
      weights: { strategy: 1.1, operations: 0.9, team: 1.0, growth: 1.6, technology: 1.2 }
    }
  ]
}

export default function ScoringConfigurationPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(scoringData.algorithms[0])
  const [selectedPreset, setSelectedPreset] = React.useState(scoringData.presets[0])
  const [categoryWeights, setCategoryWeights] = React.useState(
    scoringData.categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.weight }), {} as Record<string, number>)
  )
  const [scoringRules, setScoringRules] = React.useState(
    scoringData.scoringRules.reduce((acc, rule) => ({ ...acc, [rule.id]: rule.enabled }), {} as Record<string, boolean>)
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  const handleWeightChange = (categoryId: string, weight: number) => {
    setCategoryWeights(prev => ({ ...prev, [categoryId]: weight }))
  }

  const handleRuleToggle = (ruleId: string, enabled: boolean) => {
    setScoringRules(prev => ({ ...prev, [ruleId]: enabled }))
  }

  const handlePresetApply = (preset: typeof scoringData.presets[0]) => {
    setSelectedPreset(preset)
    setCategoryWeights(preset.weights)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Scoring configuration saved')
    } catch (error) {
      console.error('Failed to save configuration', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalWeight = () => {
    return Object.values(categoryWeights).reduce((sum, weight) => sum + weight, 0)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'success'
      case 'Medium': return 'warning'
      case 'High': return 'error'
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
              Back to Assessment
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Scoring Configuration</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} loading={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
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
              <Calculator className="h-4 w-4 mr-2" />
              Scoring Configuration
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Assessment Scoring Engine
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Configure how assessments are scored and weighted to provide the most accurate 
              and meaningful insights for your organization.
            </p>
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Algorithm Selection */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Scoring Algorithm</h3>
                <div className="space-y-3">
                  {scoringData.algorithms.map((algorithm) => (
                    <div
                      key={algorithm.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAlgorithm.id === algorithm.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedAlgorithm(algorithm)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{algorithm.name}</h4>
                        {algorithm.recommended && (
                          <StatusBadge status="primary" size="xs">Recommended</StatusBadge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{algorithm.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <StatusBadge status={getComplexityColor(algorithm.complexity) as any} size="xs">
                          {algorithm.complexity}
                        </StatusBadge>
                        <span className="text-muted-foreground">Accuracy: {algorithm.accuracy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Presets */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Scoring Presets</h3>
                <div className="space-y-3">
                  {scoringData.presets.map((preset) => (
                    <div key={preset.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePresetApply(preset)}
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Help */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Scoring Help
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Need help configuring your scoring system?
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Optimization
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Main Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2 space-y-8"
            >
              {/* Category Weights */}
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Category Weights</h2>
                  <div className="text-sm text-muted-foreground">
                    Total Weight: {getTotalWeight().toFixed(1)}
                  </div>
                </div>

                <div className="space-y-6">
                  {scoringData.categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{categoryWeights[category.id]?.toFixed(1) || '1.0'}</div>
                          <div className="text-sm text-muted-foreground">Weight</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Weight Factor</span>
                            <span>{categoryWeights[category.id]?.toFixed(1) || '1.0'}</span>
                          </div>
                          <Slider
                            value={[categoryWeights[category.id] || 1.0]}
                            onValueChange={(value) => handleWeightChange(category.id, value[0])}
                            min={0.1}
                            max={2.0}
                            step={0.1}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Low Impact (0.1)</span>
                            <span>High Impact (2.0)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Questions:</span>
                            <span className="ml-2 font-medium">{category.questions}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Score:</span>
                            <span className="ml-2 font-medium">{category.avgScore}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impact:</span>
                            <StatusBadge 
                              status={category.impact === 'High' ? 'error' : 'warning'} 
                              size="xs"
                            >
                              {category.impact}
                            </StatusBadge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Scoring Rules */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Scoring Rules & Adjustments</h2>
                
                <div className="space-y-4">
                  {scoringData.scoringRules.map((rule, index) => (
                    <div key={rule.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <StatusBadge 
                            status={rule.impact === 'High' ? 'error' : rule.impact === 'Medium' ? 'warning' : 'success'} 
                            size="xs"
                          >
                            {rule.impact} Impact
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{rule.formula}</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={scoringRules[rule.id] || false}
                          onCheckedChange={(checked) => handleRuleToggle(rule.id, checked as boolean)}
                        />
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Preview Section */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Scoring Preview</h2>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Sample Calculation</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Strategy (78 × {categoryWeights.strategy?.toFixed(1)}):</span>
                        <span className="font-medium">{(78 * (categoryWeights.strategy || 1)).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operations (72 × {categoryWeights.operations?.toFixed(1)}):</span>
                        <span className="font-medium">{(72 * (categoryWeights.operations || 1)).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team (85 × {categoryWeights.team?.toFixed(1)}):</span>
                        <span className="font-medium">{(85 * (categoryWeights.team || 1)).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth (68 × {categoryWeights.growth?.toFixed(1)}):</span>
                        <span className="font-medium">{(68 * (categoryWeights.growth || 1)).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technology (65 × {categoryWeights.technology?.toFixed(1)}):</span>
                        <span className="font-medium">{(65 * (categoryWeights.technology || 1)).toFixed(1)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Weighted Average:</span>
                        <span className="text-primary">
                          {(
                            (78 * (categoryWeights.strategy || 1) +
                             72 * (categoryWeights.operations || 1) +
                             85 * (categoryWeights.team || 1) +
                             68 * (categoryWeights.growth || 1) +
                             65 * (categoryWeights.technology || 1)) / getTotalWeight()
                          ).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Configuration Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Algorithm:</span>
                        <span className="font-medium">{selectedAlgorithm.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preset:</span>
                        <span className="font-medium">{selectedPreset.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Rules:</span>
                        <span className="font-medium">
                          {Object.values(scoringRules).filter(Boolean).length}/
                          {Object.keys(scoringRules).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Categories:</span>
                        <span className="font-medium">{scoringData.categories.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
