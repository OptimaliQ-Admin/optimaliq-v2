'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Award, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';

interface ScorecardProps {
  title: string;
  score: number;
  maxScore: number;
  trend?: 'up' | 'down' | 'stable';
  benchmark?: {
    industry: number;
    topPerformers: number;
  };
  category?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  showDetails?: boolean;
  priority?: 'high' | 'medium' | 'low';
  lastUpdated?: string;
}

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'stable':
      return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
  }
};

const getScoreColor = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export function Scorecard({
  title,
  score,
  maxScore,
  trend = 'stable',
  benchmark,
  category,
  description,
  onClick,
  className = '',
  showDetails = false,
  priority,
  lastUpdated
}: ScorecardProps) {
  const percentage = (score / maxScore) * 100;
  const scoreColor = getScoreColor(score, maxScore);

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card 
        className={`hover:shadow-lg transition-all duration-300 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <div className="flex items-center gap-2">
              {trend && getTrendIcon(trend)}
              {priority && (
                <Badge 
                  variant="secondary" 
                  className={`${getPriorityColor(priority)} border text-xs`}
                >
                  {priority}
                </Badge>
              )}
            </div>
          </div>
          {category && (
            <p className="text-sm text-muted-foreground">{category}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Score Display */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreColor}`}>
              {score.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              out of {maxScore}
            </div>
            <Progress value={percentage} className="mt-2 h-2" />
          </div>

          {/* Benchmark Comparison */}
          {benchmark && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Industry Avg</span>
                <span className="font-medium">{benchmark.industry.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Top Performers</span>
                <span className="font-medium text-green-600">
                  {benchmark.topPerformers.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Your Position</span>
                <span className={scoreColor}>
                  {score > benchmark.topPerformers ? 'Above Top' : 
                   score > benchmark.industry ? 'Above Avg' : 'Below Avg'}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {/* Details Section */}
          {showDetails && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last Updated</span>
                <span>{lastUpdated || 'Just now'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Confidence</span>
                <span className="text-green-600">High</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {onClick && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Scorecard Grid Component
interface ScorecardGridProps {
  scorecards: ScorecardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ScorecardGrid({ 
  scorecards, 
  columns = 3, 
  className = '' 
}: ScorecardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {scorecards.map((scorecard, index) => (
        <Scorecard key={index} {...scorecard} />
      ))}
    </div>
  );
}

// Mini Scorecard for compact displays
interface MiniScorecardProps {
  title: string;
  score: number;
  maxScore: number;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function MiniScorecard({
  title,
  score,
  maxScore,
  trend = 'stable',
  className = ''
}: MiniScorecardProps) {
  const percentage = (score / maxScore) * 100;
  const scoreColor = getScoreColor(score, maxScore);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${scoreColor}`}>
                {score.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/{maxScore}</span>
            </div>
          </div>
          <div className="text-right">
            {trend && getTrendIcon(trend)}
            <div className="text-xs text-muted-foreground mt-1">
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>
        <Progress value={percentage} className="mt-2 h-1" />
      </Card>
    </motion.div>
  );
}
