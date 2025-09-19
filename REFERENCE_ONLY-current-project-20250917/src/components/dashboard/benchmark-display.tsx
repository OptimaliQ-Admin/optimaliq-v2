'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  BarChart3, 
  Users,
  Building2,
  Globe,
  Filter,
  Download,
  Share2,
  Info
} from 'lucide-react';

interface BenchmarkData {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPerformers: number;
  bottomQuartile: number;
  sampleSize: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: string;
}

interface BenchmarkDisplayProps {
  data: BenchmarkData[];
  title?: string;
  subtitle?: string;
  showTrends?: boolean;
  showPercentiles?: boolean;
  showSampleSize?: boolean;
  interactive?: boolean;
  className?: string;
  onCategoryClick?: (category: string) => void;
  onExport?: () => void;
  onShare?: () => void;
}

const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
  switch (trend) {
    case 'improving':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'declining':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'stable':
      return <Target className="h-4 w-4 text-gray-500" />;
  }
};

const getTrendColor = (trend: 'improving' | 'declining' | 'stable') => {
  switch (trend) {
    case 'improving':
      return 'text-green-600 bg-green-100';
    case 'declining':
      return 'text-red-600 bg-red-100';
    case 'stable':
      return 'text-gray-600 bg-gray-100';
  }
};

const getPercentileColor = (percentile: number) => {
  if (percentile >= 90) return 'text-green-600';
  if (percentile >= 75) return 'text-blue-600';
  if (percentile >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

const getPercentileLabel = (percentile: number) => {
  if (percentile >= 90) return 'Top 10%';
  if (percentile >= 75) return 'Top 25%';
  if (percentile >= 50) return 'Above Average';
  return 'Below Average';
};

export function BenchmarkDisplay({
  data,
  title = 'Industry Benchmarking',
  subtitle,
  showTrends = true,
  showPercentiles = true,
  showSampleSize = true,
  interactive = true,
  className = '',
  onCategoryClick,
  onExport,
  onShare
}: BenchmarkDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'selected'>('all');

  const handleCategoryClick = (category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
    if (interactive) {
      setSelectedCategory(selectedCategory === category ? null : category);
    }
  };

  const filteredData = viewMode === 'all' ? data : data.filter(item => selectedCategory === item.category);

  const averagePercentile = data.reduce((sum, item) => sum + item.percentile, 0) / data.length;
  const aboveAverageCount = data.filter(item => item.percentile >= 50).length;
  const topQuartileCount = data.filter(item => item.percentile >= 75).length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {averagePercentile.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Average Percentile</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {aboveAverageCount}/{data.length}
            </div>
            <div className="text-sm text-muted-foreground">Above Average</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {topQuartileCount}/{data.length}
            </div>
            <div className="text-sm text-muted-foreground">Top Quartile</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {data.reduce((sum, item) => sum + item.sampleSize, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Sample</div>
          </div>
        </div>

        {/* Benchmark Cards */}
        <div className="space-y-4">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 border rounded-lg transition-all duration-200 ${
                selectedCategory === item.category
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => handleCategoryClick(item.category)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{item.category}</h3>
                    {showTrends && (
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTrendColor(item.trend)}`}
                        >
                          {item.trend}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {showPercentiles && (
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPercentileColor(item.percentile)}`}>
                        {item.percentile}th percentile
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPercentileLabel(item.percentile)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Score Comparison */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {item.yourScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Your Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-600">
                      {item.industryAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Industry Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-600">
                      {item.topPerformers.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Top Performers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-600">
                      {item.bottomQuartile.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Bottom Quartile</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance Range</span>
                    <span className="text-muted-foreground">
                      {item.bottomQuartile.toFixed(1)} - {item.topPerformers.toFixed(1)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={((item.yourScore - item.bottomQuartile) / (item.topPerformers - item.bottomQuartile)) * 100} 
                      className="h-2"
                    />
                    <div className="absolute inset-0 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Bottom</span>
                      <span>Top</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {showSampleSize && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{item.sampleSize.toLocaleString()} companies</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>Updated {item.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.yourScore > item.industryAverage ? 'Above Avg' : 'Below Avg'}
                    </Badge>
                    {item.yourScore > item.topPerformers && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        <Award className="h-3 w-3 mr-1" />
                        Top Performer
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industry Context */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Industry Context</h4>
              <p className="text-sm text-muted-foreground">
                These benchmarks are based on data from {data.reduce((sum, item) => sum + item.sampleSize, 0).toLocaleString()} companies 
                in your industry. Your performance is compared against industry averages, top performers, and bottom quartile companies 
                to provide meaningful context for your growth strategy.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Benchmark Card for smaller displays
interface CompactBenchmarkCardProps {
  category: string;
  yourScore: number;
  industryAverage: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
  className?: string;
}

export function CompactBenchmarkCard({
  category,
  yourScore,
  industryAverage,
  percentile,
  trend,
  className = ''
}: CompactBenchmarkCardProps) {
  const isAboveAverage = yourScore > industryAverage;
  const gap = yourScore - industryAverage;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{category}</h3>
            <div className="flex items-center gap-1">
              {getTrendIcon(trend)}
              <Badge 
                variant="secondary" 
                className={`text-xs ${getTrendColor(trend)}`}
              >
                {trend}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">
                {yourScore.toFixed(1)}
              </span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {percentile}th percentile
                </div>
                <div className="text-xs text-muted-foreground">
                  vs {industryAverage.toFixed(1)} avg
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className={isAboveAverage ? 'text-green-600' : 'text-red-600'}>
                {isAboveAverage ? '+' : ''}{gap.toFixed(1)} vs industry
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${isAboveAverage ? 'border-green-200 text-green-800' : 'border-red-200 text-red-800'}`}
              >
                {isAboveAverage ? 'Above Avg' : 'Below Avg'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
