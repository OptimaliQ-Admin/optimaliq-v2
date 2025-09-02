/**
 * Assessment Recommendations UI Components
 * Surface AI-derived recommendations in assessment UI with break banners, difficulty stepper, and content format switch
 */

'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Zap,
  Shield,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Recommendation Schema
export const RecommendationSchema = z.object({
  id: z.string(),
  type: z.enum(['break', 'difficulty', 'content', 'strategy', 'insight']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  description: z.string(),
  action: z.string().optional(),
  confidence: z.number().finite().min(0).max(1),
  impact: z.enum(['low', 'medium', 'high']),
  timeframe: z.enum(['immediate', 'short_term', 'long_term']),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

// Assessment State Schema
export const AssessmentStateSchema = z.object({
  currentQuestion: z.number().finite(),
  totalQuestions: z.number().finite(),
  timeSpent: z.number().finite(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  performance: z.object({
    accuracy: z.number().finite().min(0).max(1),
    confidence: z.number().finite().min(0).max(1),
    speed: z.number().finite().min(0).max(1)
  }),
  fatigue: z.number().finite().min(0).max(1),
  engagement: z.number().finite().min(0).max(1)
});

export type AssessmentState = z.infer<typeof AssessmentStateSchema>;

interface AssessmentRecommendationsProps {
  assessmentState: AssessmentState;
  recommendations: Recommendation[];
  onRecommendationAction?: (recommendationId: string, action: string) => void;
  onDifficultyChange?: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onFormatChange?: (format: 'visual' | 'text' | 'interactive') => void;
  onBreakTaken?: () => void;
  className?: string;
}

/**
 * Break Banner Component
 */
const BreakBanner: React.FC<{
  recommendation: Recommendation;
  onBreakTaken?: () => void;
}> = ({ recommendation, onBreakTaken }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || recommendation.type !== 'break') return null;

  const getBreakIcon = () => {
    switch (recommendation.priority) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBannerColor = () => {
    switch (recommendation.priority) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <Alert className={cn('mb-4', getBannerColor())}>
      {getBreakIcon()}
      <AlertTitle className="flex items-center justify-between">
        {recommendation.title}
        <Badge variant="outline" className="ml-2">
          {Math.round(recommendation.confidence * 100)}% confidence
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{recommendation.description}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              onBreakTaken?.();
              setDismissed(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Take Break
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDismissed(true)}
          >
            Continue
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

/**
 * Difficulty Stepper Component
 */
const DifficultySepper: React.FC<{
  currentDifficulty: 'easy' | 'medium' | 'hard';
  recommendation?: Recommendation;
  onDifficultyChange?: (difficulty: 'easy' | 'medium' | 'hard') => void;
}> = ({ currentDifficulty, recommendation, onDifficultyChange }) => {
  const difficulties = ['easy', 'medium', 'hard'] as const;
  const currentIndex = difficulties.indexOf(currentDifficulty);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRecommendedDifficulty = () => {
    if (recommendation?.type === 'difficulty' && recommendation.metadata?.recommendedDifficulty) {
      return recommendation.metadata.recommendedDifficulty as 'easy' | 'medium' | 'hard';
    }
    return null;
  };

  const recommendedDifficulty = getRecommendedDifficulty();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          Difficulty Level
          {recommendation && (
            <Badge variant="secondary" className="ml-auto">
              AI Suggestion
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {difficulties.map((difficulty, index) => (
              <div
                key={difficulty}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onDifficultyChange?.(difficulty)}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all',
                    index <= currentIndex ? getDifficultyColor(difficulty) : 'bg-gray-200',
                    recommendedDifficulty === difficulty && 'ring-2 ring-blue-500 ring-offset-2',
                    'hover:scale-110'
                  )}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 capitalize">{difficulty}</span>
                {recommendedDifficulty === difficulty && (
                  <Lightbulb className="h-3 w-3 text-blue-500 mt-1" />
                )}
              </div>
            ))}
          </div>
          
          {recommendation && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>AI Recommendation:</strong> {recommendation.description}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-blue-600 dark:text-blue-300">
                  Confidence: {Math.round(recommendation.confidence * 100)}%
                </span>
                {recommendation.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDifficultyChange?.(recommendedDifficulty!)}
                  >
                    {recommendation.action}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Content Format Switch Component
 */
const ContentFormatSwitch: React.FC<{
  currentFormat: 'visual' | 'text' | 'interactive';
  recommendation?: Recommendation;
  onFormatChange?: (format: 'visual' | 'text' | 'interactive') => void;
}> = ({ currentFormat, recommendation, onFormatChange }) => {
  const formats = [
    { id: 'visual', label: 'Visual', icon: BarChart3 },
    { id: 'text', label: 'Text', icon: Brain },
    { id: 'interactive', label: 'Interactive', icon: Zap }
  ] as const;

  const getRecommendedFormat = () => {
    if (recommendation?.type === 'content' && recommendation.metadata?.recommendedFormat) {
      return recommendation.metadata.recommendedFormat as 'visual' | 'text' | 'interactive';
    }
    return null;
  };

  const recommendedFormat = getRecommendedFormat();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Content Format
          {recommendation && (
            <Badge variant="secondary" className="ml-auto">
              AI Optimized
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentFormat} onValueChange={onFormatChange}>
          <TabsList className="grid w-full grid-cols-3">
            {formats.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className={cn(
                  'flex items-center gap-1',
                  recommendedFormat === id && 'ring-2 ring-blue-500'
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
                {recommendedFormat === id && (
                  <Lightbulb className="h-3 w-3 text-blue-500 ml-1" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {recommendation && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>AI Insight:</strong> {recommendation.description}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-green-600 dark:text-green-300">
                Impact: {recommendation.impact} | Confidence: {Math.round(recommendation.confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Performance Insights Component
 */
const PerformanceInsights: React.FC<{
  assessmentState: AssessmentState;
  insights: Recommendation[];
}> = ({ assessmentState, insights }) => {
  const progress = (assessmentState.currentQuestion / assessmentState.totalQuestions) * 100;
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {Math.round(assessmentState.performance.accuracy * 100)}%
              </div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(assessmentState.performance.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(assessmentState.engagement * 100)}%
              </div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>

          {/* AI Insights */}
          {insights.filter(i => i.type === 'insight').map((insight) => (
            <div
              key={insight.id}
              className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    {insight.title}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.impact} impact
                    </Badge>
                    <span className="text-xs text-purple-500">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Main Assessment Recommendations Component
 */
export const AssessmentRecommendations: React.FC<AssessmentRecommendationsProps> = ({
  assessmentState,
  recommendations,
  onRecommendationAction,
  onDifficultyChange,
  onFormatChange,
  onBreakTaken,
  className
}) => {
  const [currentFormat, setCurrentFormat] = useState<'visual' | 'text' | 'interactive'>('visual');
  
  // Filter recommendations by type
  const breakRecommendations = recommendations.filter(r => r.type === 'break');
  const difficultyRecommendation = recommendations.find(r => r.type === 'difficulty');
  const contentRecommendation = recommendations.find(r => r.type === 'content');
  const insights = recommendations.filter(r => r.type === 'insight');

  const handleFormatChange = (format: string) => {
    const newFormat = format as 'visual' | 'text' | 'interactive';
    setCurrentFormat(newFormat);
    onFormatChange?.(newFormat);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Break Banners */}
      {breakRecommendations.map((recommendation) => (
        <BreakBanner
          key={recommendation.id}
          recommendation={recommendation}
          onBreakTaken={onBreakTaken}
        />
      ))}

      {/* Performance Insights */}
      <PerformanceInsights
        assessmentState={assessmentState}
        insights={insights}
      />

      {/* Difficulty Stepper */}
      <DifficultySepper
        currentDifficulty={assessmentState.difficulty}
        recommendation={difficultyRecommendation}
        onDifficultyChange={onDifficultyChange}
      />

      {/* Content Format Switch */}
      <ContentFormatSwitch
        currentFormat={currentFormat}
        recommendation={contentRecommendation}
        onFormatChange={handleFormatChange}
      />
    </div>
  );
};

export default AssessmentRecommendations;
