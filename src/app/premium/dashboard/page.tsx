'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeDashboard, useRealtimeTeamActivity, useRealtimeAssessments } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Zap,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - in production this would come from our API
const mockDashboardData = {
  overallScore: 8.4,
  scores: {
    strategy: 8.7,
    process: 7.9,
    technology: 9.2,
    team: 8.1
  },
  insights: [
    {
      id: '1',
      type: 'opportunity',
      title: 'Digital Marketing Optimization',
      description: 'AI analysis shows 34% improvement potential in your digital marketing ROI through automation and targeting refinement.',
      priority: 'high',
      impact: 'high',
      effort: 'medium',
      category: 'Strategy'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Process Bottleneck Detected',
      description: 'Customer onboarding process has 3 identified friction points causing 23% drop-off rate.',
      priority: 'medium',
      impact: 'medium',
      effort: 'low',
      category: 'Process'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Technology Stack Excellence',
      description: 'Your current tech infrastructure scores in the 95th percentile for your industry.',
      priority: 'low',
      impact: 'high',
      effort: 'low',
      category: 'Technology'
    }
  ],
  metrics: [
    { label: 'Growth Potential', value: 42, unit: '%', trend: 'up', change: '+12%' },
    { label: 'Efficiency Score', value: 87, unit: '/100', trend: 'up', change: '+5 pts' },
    { label: 'Market Position', value: 73, unit: 'percentile', trend: 'stable', change: '0%' },
    { label: 'Team Performance', value: 91, unit: '%', trend: 'up', change: '+8%' }
  ],
  recentActivities: [
    { id: '1', action: 'Assessment completed', time: '2 hours ago', type: 'success' },
    { id: '2', action: 'New growth opportunity identified', time: '5 hours ago', type: 'info' },
    { id: '3', action: 'Team member added', time: '1 day ago', type: 'neutral' },
    { id: '4', action: 'Market intelligence updated', time: '2 days ago', type: 'info' }
  ]
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

function getInsightIcon(type: string) {
  switch (type) {
    case 'opportunity': return <Lightbulb className="h-5 w-5 text-green-500" />;
    case 'risk': return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'achievement': return <CheckCircle className="h-5 w-5 text-blue-500" />;
    default: return <Brain className="h-5 w-5 text-gray-500" />;
  }
}

function getPriorityBadge(priority: string) {
  const variants = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <Badge variant="secondary" className={`${variants[priority as keyof typeof variants]} border text-xs`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  
  // Mock organization ID - in production this would come from user context
  const organizationId = 'mock-org-id';

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboard = async () => {
      try {
        // In production, this would be:
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        
        setTimeout(() => {
          setDashboardData(mockDashboardData);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Real-time dashboard updates
  useRealtimeDashboard(organizationId, (event) => {
    setDashboardData(prev => ({
      ...prev,
      overallScore: event.metrics.overallScore || prev.overallScore,
      metrics: prev.metrics.map(metric => {
        if (metric.label === 'Growth Potential' && event.metrics.growthPotential) {
          return { ...metric, value: event.metrics.growthPotential };
        }
        if (metric.label === 'Efficiency Score' && event.metrics.efficiencyScore) {
          return { ...metric, value: event.metrics.efficiencyScore };
        }
        if (metric.label === 'Team Performance' && event.metrics.teamPerformance) {
          return { ...metric, value: event.metrics.teamPerformance };
        }
        return metric;
      })
    }));
    toast.success('Dashboard updated with latest insights!');
  });

  // Real-time team activity updates
  useRealtimeTeamActivity(organizationId, (event) => {
    setDashboardData(prev => ({
      ...prev,
      recentActivities: [
        {
          id: Date.now().toString(),
          action: event.activity.action,
          time: 'Just now',
          type: 'info'
        },
        ...prev.recentActivities.slice(0, 3)
      ]
    }));
  });

  // Real-time assessment completion updates
  useRealtimeAssessments(organizationId, (event) => {
    setDashboardData(prev => ({
      ...prev,
      recentActivities: [
        {
          id: Date.now().toString(),
          action: `${event.assessment.completedBy} completed ${event.assessment.type} assessment`,
          time: 'Just now',
          type: 'success'
        },
        ...prev.recentActivities.slice(0, 3)
      ]
    }));
    toast.success(`New assessment completed by ${event.assessment.completedBy}!`);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Growth Dashboard
            </h1>
            <p className="text-muted-foreground">
              AI-powered insights and strategic recommendations for your business
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
            <Button className="bg-gradient-primary">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Insights
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overall Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Overall Business Health Score
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {dashboardData.overallScore}/10
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      +0.3 this month
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Above industry average (7.2)
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 relative">
                {/* Circular progress indicator */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(dashboardData.overallScore / 10) * 314} 314`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            variants={itemVariants}
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 
                      'text-gray-500'
                    }`}>
                      {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> :
                       metric.trend === 'down' ? <ArrowDown className="h-3 w-3" /> :
                       <MoreHorizontal className="h-3 w-3" />}
                      {metric.change}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h4 className="font-semibold">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {insight.category}
                          </p>
                        </div>
                      </div>
                      {getPriorityBadge(insight.priority)}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Impact: <strong>{insight.impact}</strong></span>
                      <span>Effort: <strong>{insight.effort}</strong></span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dashboardData.scores).map(([category, score]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{category}</span>
                    <span className="font-bold">{score}/10</span>
                  </div>
                  <Progress value={score * 10} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Run New Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Set Growth Goals
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                View ROI Analysis
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
