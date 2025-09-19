'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown,
  Search,
  Globe,
  Eye,
  Clock,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Mock market intelligence data
const mockMarketData = {
  trends: [
    {
      id: '1',
      title: 'AI Automation Adoption Surge',
      description: 'Businesses in your sector are rapidly adopting AI automation tools, showing 340% growth in implementation.',
      category: 'Technology',
      impact: 'High',
      trend: 'up',
      confidence: 94,
      timeframe: '6 months',
      source: 'Industry Reports',
      relevanceScore: 9.2,
      actionable: true
    },
    {
      id: '2',
      title: 'Remote Work Policy Changes',
      description: 'Major shifts in remote work policies affecting talent acquisition and retention strategies.',
      category: 'Workforce',
      impact: 'Medium',
      trend: 'stable',
      confidence: 87,
      timeframe: '3 months',
      source: 'HR Analytics',
      relevanceScore: 8.1,
      actionable: true
    },
    {
      id: '3',
      title: 'Sustainability Compliance Requirements',
      description: 'New environmental regulations creating both challenges and opportunities for growth.',
      category: 'Regulatory',
      impact: 'High',
      trend: 'up',
      confidence: 91,
      timeframe: '12 months',
      source: 'Government Data',
      relevanceScore: 8.7,
      actionable: false
    }
  ],
  competitorInsights: [
    {
      id: '1',
      competitor: 'TechCorp Solutions',
      insight: 'Launched new AI-powered customer service platform',
      impact: 'Medium',
      date: '2 days ago',
      category: 'Product Launch'
    },
    {
      id: '2',
      competitor: 'GrowthCo Inc',
      insight: 'Expanded into European markets with 3 new offices',
      impact: 'High',
      date: '1 week ago',
      category: 'Market Expansion'
    },
    {
      id: '3',
      competitor: 'ScaleUp Ltd',
      insight: 'Acquired smaller competitor for $50M',
      impact: 'High',
      date: '2 weeks ago',
      category: 'M&A Activity'
    }
  ],
  marketMetrics: {
    marketGrowth: '+12.4%',
    competitorActivity: 'High',
    opportunityIndex: 8.3,
    threatLevel: 'Medium'
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

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
    default: return <Activity className="h-4 w-4 text-gray-500" />;
  }
}

function getImpactBadge(impact: string) {
  const variants = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <Badge variant="secondary" className={`${variants[impact as keyof typeof variants]} border text-xs`}>
      {impact}
    </Badge>
  );
}

export default function MarketIntelligencePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState(mockMarketData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate loading market data
    const loadMarketData = async () => {
      try {
        setTimeout(() => {
          setMarketData(mockMarketData);
          setIsLoading(false);
        }, 1200);
      } catch (error) {
        toast.error('Failed to load market intelligence data');
        setIsLoading(false);
      }
    };

    loadMarketData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    toast.info('Refreshing market intelligence...');
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Market data updated successfully');
    }, 2000);
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
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
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
              Market Intelligence
            </h1>
            <p className="text-muted-foreground">
              Real-time market trends, competitor insights, and strategic opportunities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-primary">
              <Zap className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Market Metrics Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {marketData.marketMetrics.marketGrowth}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-500">Market Growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {marketData.marketMetrics.competitorActivity}
            </div>
            <p className="text-sm text-muted-foreground">Competitor Activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {marketData.marketMetrics.opportunityIndex}/10
            </div>
            <p className="text-sm text-muted-foreground">Opportunity Index</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {marketData.marketMetrics.threatLevel}
            </div>
            <p className="text-sm text-muted-foreground">Threat Level</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trends, competitors, or market insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="workforce">Workforce</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Trends */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData.trends.map((trend) => (
                <motion.div
                  key={trend.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(trend.trend)}
                        <div>
                          <h4 className="font-semibold">{trend.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {trend.category}
                            </Badge>
                            {getImpactBadge(trend.impact)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {trend.relevanceScore}/10
                        </div>
                        <p className="text-xs text-muted-foreground">Relevance</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {trend.description}
                    </p>

                    {/* Metrics */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>Confidence: <strong>{trend.confidence}%</strong></span>
                        <span>Timeframe: <strong>{trend.timeframe}</strong></span>
                        <span>Source: <strong>{trend.source}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        {trend.actionable ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Clock className="h-3 w-3 text-gray-400" />
                        )}
                        <span>{trend.actionable ? 'Actionable' : 'Monitor'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Deep Dive
                      </Button>
                      {trend.actionable && (
                        <Button variant="outline" size="sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Create Action Plan
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Competitor Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Competitor Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData.competitorInsights.map((insight) => (
                <div key={insight.id} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{insight.competitor}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.insight}
                      </p>
                    </div>
                    {getImpactBadge(insight.impact)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{insight.date}</span>
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>
                </div>
              ))}
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
                <PieChart className="h-4 w-4 mr-2" />
                Market Analysis Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Competitive Benchmark
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Industry Deep Dive
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Market Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Market Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm">High Priority</span>
                </div>
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  New regulation affecting your industry expected Q2 2024
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Opportunity</span>
                </div>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Emerging market segment showing 45% growth potential
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
