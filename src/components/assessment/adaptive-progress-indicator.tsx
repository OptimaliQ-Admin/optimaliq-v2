'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Brain, 
  TrendingUp, 
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

interface AdaptiveProgressProps {
  currentStep: number;
  totalSteps: number; // Dynamic based on responses
  estimatedTimeRemaining: number; // in minutes
  adaptationCount: number; // How many questions were added/removed
  completionProbability: number; // AI prediction of completion (0-1)
  category?: string | undefined;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

const progressVariants = {
  initial: { width: 0 },
  animate: { 
    width: '100%',
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const stepVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  completed: { scale: 1.1, opacity: 1 }
};

export function AdaptiveProgressIndicator({
  currentStep,
  totalSteps,
  estimatedTimeRemaining,
  adaptationCount,
  completionProbability,
  category,
  difficulty = 'intermediate'
}: AdaptiveProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const isNearCompletion = progressPercentage > 80;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600 bg-green-50';
    if (probability >= 0.6) return 'text-blue-600 bg-blue-50';
    if (probability >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 1) return 'Less than 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = Math.round(minutes % 60);
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Step Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold">Assessment Progress</span>
              </div>
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTimeRemaining(estimatedTimeRemaining)}
              </div>
              <Badge 
                variant="secondary"
                className={getDifficultyColor(difficulty)}
              >
                {difficulty}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            
            <div className="relative">
              <Progress value={progressPercentage} className="h-3" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full"
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* Adaptive Intelligence Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AI Adaptation Count */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Smart Adaptation</div>
                <div className="text-xs text-muted-foreground">
                  {adaptationCount} questions adapted
                </div>
              </div>
            </div>

            {/* Completion Probability */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">Completion Likelihood</div>
                <Badge 
                  variant="secondary"
                  className={getCompletionProbabilityColor(completionProbability)}
                >
                  {Math.round(completionProbability * 100)}%
                </Badge>
              </div>
            </div>

            {/* Current Category */}
            {category && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Current Focus</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {category} Assessment
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Visualization */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {Array.from({ length: Math.min(totalSteps, 10) }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const _isUpcoming = stepNumber > currentStep;
                
                return (
                  <motion.div
                    key={stepNumber}
                    variants={stepVariants}
                    initial="initial"
                    animate={isCompleted ? "completed" : "animate"}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-200
                      ${isCompleted 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : isCurrent 
                        ? 'bg-primary/20 text-primary border-2 border-primary' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </motion.div>
                );
              })}
              
              {/* Show ellipsis if more than 10 steps */}
              {totalSteps > 10 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-1 h-1 bg-current rounded-full" />
                  <div className="w-1 h-1 bg-current rounded-full" />
                  <div className="w-1 h-1 bg-current rounded-full" />
                </div>
              )}
            </div>
          </div>

          {/* Motivational Message */}
          {isNearCompletion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Almost there!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                You're doing great. Just a few more questions to unlock your personalized insights.
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
