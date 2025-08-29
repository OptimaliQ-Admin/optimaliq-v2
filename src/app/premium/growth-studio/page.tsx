'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Rocket,
  CheckCircle,
  Clock,
  ArrowRight,
  Play,
  Pause,
  BarChart3,
  Zap,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

// Mock growth levers data
const mockGrowthData = {
  activeLevers: [
    {
      id: '1',
      title: 'Digital Marketing Automation',
      description: 'Implement AI-driven email sequences and social media automation',
      category: 'Marketing',
      impact: 'High',
      effort: 'Medium',
      timeline: '6 weeks',
      progress: 65,
      status: 'active',
      roi: '+234%',
      priority: 1
    },
    {
      id: '2', 
      title: 'Customer Onboarding Optimization',
      description: 'Streamline new customer experience with interactive tutorials',
      category: 'Process',
      impact: 'High',
      effort: 'Low',
      timeline: '3 weeks',
      progress: 40,
      status: 'active',
      roi: '+156%',
      priority: 2
    },
    {
      id: '3',
      title: 'Sales Process Automation',
      description: 'Deploy CRM workflows and lead scoring system',
      category: 'Sales',
      impact: 'Medium',
      effort: 'High',
      timeline: '8 weeks',
      progress: 20,
      status: 'planning',
      roi: '+189%',
      priority: 3
    }
  ],
  availableLevers: [
    {
      id: '4',
      title: 'AI-Powered Customer Support',
      description: 'Implement chatbot with human handoff capabilities',
      category: 'Technology',
      impact: 'Medium',
      effort: 'Medium',
      timeline: '4 weeks',
      roi: '+112%'
    },
    {
      id: '5',
      title: 'Referral Program Launch',
      description: 'Create incentivized customer referral system',
      category: 'Marketing',
      impact: 'High',
      effort: 'Low',
      timeline: '2 weeks',
      roi: '+278%'
    }
  ],
  metrics: {
    totalROI: '+198%',
    activeProjects: 3,
    completedLevers: 12,
    projectedGrowth: '42%'
  }
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

function getStatusBadge(status: string) {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    planning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paused: 'bg-gray-100 text-gray-800 border-gray-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  
  return (
    <Badge variant="secondary" className={`${variants[status as keyof typeof variants]} border text-xs`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function getImpactColor(impact: string) {
  switch (impact) {
    case 'High': return 'text-green-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-gray-600';
    default: return 'text-gray-600';
  }
}

export default function GrowthStudioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [growthData, setGrowthData] = useState(mockGrowthData);

  useEffect(() => {
    // Simulate loading growth data
    const loadGrowthData = async () => {
      try {
        setTimeout(() => {
          setGrowthData(mockGrowthData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load growth studio data');
        setIsLoading(false);
      }
    };

    loadGrowthData();
  }, []);

  const handleActivateLever = (leverId: string) => {
    toast.success('Growth lever activated! Implementation plan generated.');
  };

  const handlePauseLever = (leverId: string) => {
    toast.info('Growth lever paused. Progress saved.');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
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
              Growth Studio
            </h1>
            <p className="text-muted-foreground">
              AI-powered growth levers and strategic implementation roadmap
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="bg-gradient-primary">
              <Lightbulb className="h-4 w-4 mr-2" />
              Discover New Levers
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {growthData.metrics.totalROI}
            </div>
            <p className="text-sm text-green-600 dark:text-green-500">Total ROI</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Rocket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {growthData.metrics.activeProjects}
            </div>
            <p className="text-sm text-muted-foreground">Active Projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {growthData.metrics.completedLevers}
            </div>
            <p className="text-sm text-muted-foreground">Completed Levers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {growthData.metrics.projectedGrowth}
            </div>
            <p className="text-sm text-muted-foreground">Projected Growth</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Growth Levers */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Active Growth Levers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {growthData.activeLevers.map((lever) => (
              <motion.div
                key={lever.id}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.01 }}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{lever.title}</h3>
                        {getStatusBadge(lever.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lever.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {lever.roi}
                      </div>
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{lever.progress}%</span>
                    </div>
                    <Progress value={lever.progress} className="h-2" />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{lever.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Impact</p>
                      <p className={`font-medium ${getImpactColor(lever.impact)}`}>
                        {lever.impact}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeline</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {lever.timeline}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Priority</p>
                      <p className="font-medium">#{lever.priority}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {lever.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePauseLever(lever.id)}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleActivateLever(lever.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Growth Levers */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recommended Growth Levers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {growthData.availableLevers.map((lever) => (
              <motion.div
                key={lever.id}
                className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-solid hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{lever.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {lever.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lever.description}
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <span>Impact: <strong className={getImpactColor(lever.impact)}>{lever.impact}</strong></span>
                      <span>Effort: <strong>{lever.effort}</strong></span>
                      <span>Timeline: <strong>{lever.timeline}</strong></span>
                      <span>ROI: <strong className="text-green-600">{lever.roi}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      size="sm"
                      onClick={() => handleActivateLever(lever.id)}
                      className="bg-gradient-primary"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Discover More */}
            <motion.div 
              className="p-6 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Discover More Growth Opportunities</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Let our AI analyze your business for personalized growth strategies
              </p>
              <Button className="bg-gradient-primary">
                <Rocket className="h-4 w-4 mr-2" />
                Run Growth Analysis
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
