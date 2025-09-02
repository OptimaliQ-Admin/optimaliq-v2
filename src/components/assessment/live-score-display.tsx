'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Brain,
  Clock
} from 'lucide-react';

// Live Score Interface
interface LiveScoreData {
  strategy: { current: number; target: number; trend: 'up' | 'down' | 'stable' };
  process: { current: number; target: number; trend: 'up' | 'down' | 'stable' };
  technology: { current: number; target: number; trend: 'up' | 'down' | 'stable' };
  market: { current: number; target: number; trend: 'up' | 'down' | 'stable' };
  overall: { current: number; target: number; confidence: number };
}

interface BenchmarkData {
  industryAverage: Record<string, number>;
  topPerformers: Record<string, number>;
  percentileRanking: Record<string, number>;
}

interface LiveScoreDisplayProps {
  scores: LiveScoreData;
  benchmarks: BenchmarkData;
  isCalculating: boolean;
  lastUpdated: Date;
  showDetails?: boolean;
  onCategoryClick?: (category: string) => void;
}

// Animation variants
const scoreVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const numberVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

export function LiveScoreDisplay({
  scores,
  benchmarks,
  isCalculating,
  lastUpdated,
  showDetails = true,
  onCategoryClick
}: LiveScoreDisplayProps) {
  const [animatedScores, setAnimatedScores] = useState(scores);

  // Animate score changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(scores);
    }, 100);
    return () => clearTimeout(timer);
  }, [scores]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-green-600 bg-green-50';
    if (percentile >= 75) return 'text-blue-600 bg-blue-50';
    if (percentile >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatScore = (score: number) => {
    return score.toFixed(1);
  };

  const categories = [
    { key: 'strategy', label: 'Strategy', icon: Target },
    { key: 'process', label: 'Process', icon: TrendingUp },
    { key: 'technology', label: 'Technology', icon: Brain },
    { key: 'market', label: 'Market', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div variants={scoreVariants} initial="initial" animate="animate">
        <Card className="relative overflow-hidden bg-gradient-primary text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-20" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white/90">Overall Score</CardTitle>
              {isCalculating && (
                <div className="flex items-center gap-2 text-white/70">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span className="text-sm">Calculating...</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <motion.div 
                className="text-5xl font-bold"
                variants={numberVariants}
                key={animatedScores.overall.current}
              >
                {formatScore(animatedScores.overall.current)}
              </motion.div>
              <div className="text-right">
                <div className="text-white/70 text-sm">Target</div>
                <div className="text-2xl font-semibold">
                  {formatScore(animatedScores.overall.target)}
                </div>
              </div>
            </div>
            
            {/* Confidence Indicator */}
            <div className="mt-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70">
                Confidence: {Math.round(animatedScores.overall.confidence * 100)}%
              </span>
              <div className="flex-1">
                <Progress 
                  value={animatedScores.overall.confidence * 100} 
                  className="h-2 bg-white/20"
                />
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-3 flex items-center gap-1 text-xs text-white/60">
              <Clock className="h-3 w-3" />
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(({ key, label, icon: Icon }) => {
          const categoryScore = animatedScores[key as keyof LiveScoreData] as any;
          const percentile = benchmarks.percentileRanking[key] || 0;
          
          return (
            <motion.div
              key={key}
              variants={scoreVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="cursor-pointer"
              onClick={() => onCategoryClick?.(key)}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium">
                        {label}
                      </CardTitle>
                    </div>
                    {getTrendIcon(categoryScore.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Score Display */}
                    <div className="flex items-baseline gap-2">
                      <motion.span 
                        className="text-3xl font-bold text-primary"
                        variants={numberVariants}
                        key={categoryScore.current}
                      >
                        {formatScore(categoryScore.current)}
                      </motion.span>
                      <span className="text-muted-foreground">/ 5.0</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Progress 
                        value={(categoryScore.current / 5) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current</span>
                        <span>Target: {formatScore(categoryScore.target)}</span>
                      </div>
                    </div>

                    {/* Percentile Ranking */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Industry Ranking
                      </span>
                      <Badge 
                        variant="secondary"
                        className={getPercentileColor(percentile)}
                      >
                        {Math.round(percentile)}th percentile
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Benchmarks (if enabled) */}
      {showDetails && (
        <motion.div
          variants={scoreVariants}
          initial="initial"
          animate="animate"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map(({ key, label }) => {
                  const userScore = animatedScores[key as keyof LiveScoreData] as any;
                  const industryAvg = benchmarks.industryAverage[key] || 0;
                  const topPerformers = benchmarks.topPerformers[key] || 0;
                  
                  return (
                    <div key={key} className="space-y-3">
                      <h4 className="font-medium text-sm">{label}</h4>
                      <div className="space-y-2">
                        {/* Your Score */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Your Score</span>
                          <span className="font-semibold text-primary">
                            {formatScore(userScore.current)}
                          </span>
                        </div>
                        
                        {/* Industry Average */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Industry Avg</span>
                          <span className="font-medium">
                            {formatScore(industryAvg)}
                          </span>
                        </div>
                        
                        {/* Top Performers */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Top 10%</span>
                          <span className="font-medium text-green-600">
                            {formatScore(topPerformers)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
