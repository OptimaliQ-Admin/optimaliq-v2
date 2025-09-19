'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DynamicQuestionRenderer } from './dynamic-question-renderer';
import { LiveScoreDisplay } from './live-score-display';
import { AdaptiveProgressIndicator } from './adaptive-progress-indicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Brain, 
  Sparkles,

  Award
} from 'lucide-react';

// Assessment Wizard Interface
interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text' | 'boolean' | 'ranking';
  options?: string[];
  context: {
    industry: string;
    previousResponses: Record<string, any>;
    adaptationReason: string;
    difficulty: 'basic' | 'intermediate' | 'advanced';
    importance: number;
  };
  confidence: {
    required: boolean;
    scale: 1 | 5 | 10;
  };
  validation?: {
    required: boolean;
    min?: number;
    max?: number;
  };
}

interface AssessmentWizardProps {
  assessmentType: string;
  industry: string;
  companySize: string;
  onComplete: (responses: Record<string, any>) => void;
  onProgress?: (step: number, total: number) => void;
  allowBack?: boolean;
}

// Mock question generator (in production, this would call our AI agents)
const generateNextQuestion = (
  responses: Record<string, any>,
  _assessmentType: string,
  industry: string,
  questionCount: number
): AssessmentQuestion | null => {
  // Simple question generation logic for demo
  const questions = [
    {
      id: 'strategy_1',
      text: `How would you rate your ${industry} company's strategic planning process?`,
      type: 'scale' as const,
      context: {
        industry,
        previousResponses: responses,
        adaptationReason: 'Strategic planning is fundamental to business growth',
        difficulty: 'basic' as const,
        importance: 9
      },
      confidence: { required: true, scale: 5 as const },
      validation: { required: true, min: 1, max: 5 }
    },
    {
      id: 'process_1',
      text: 'How documented and standardized are your core business processes?',
      type: 'scale' as const,
      context: {
        industry,
        previousResponses: responses,
        adaptationReason: 'Process maturity directly impacts scalability and efficiency',
        difficulty: 'intermediate' as const,
        importance: 7
      },
      confidence: { required: true, scale: 5 as const },
      validation: { required: true, min: 1, max: 5 }
    },
    {
      id: 'technology_1',
      text: 'How would you rate your current technology infrastructure and digital capabilities?',
      type: 'scale' as const,
      context: {
        industry,
        previousResponses: responses,
        adaptationReason: 'Technology infrastructure enables competitive advantage',
        difficulty: 'intermediate' as const,
        importance: 8
      },
      confidence: { required: true, scale: 5 as const },
      validation: { required: true, min: 1, max: 5 }
    }
  ];

  return questions[questionCount] || null;
};

export function AssessmentWizard({
  assessmentType,
  industry,
  _companySize,
  onComplete,
  onProgress,
  allowBack = true
}: AssessmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(10); // Dynamic
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adaptationCount, setAdaptationCount] = useState(0);
  const [completionProbability, setCompletionProbability] = useState(0.85);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(8);

  // Live scores (mock data - in production, calculated by AI agents)
  const [liveScores, setLiveScores] = useState({
    strategy: { current: 0, target: 4.5, trend: 'stable' as const },
    process: { current: 0, target: 4.2, trend: 'stable' as const },
    technology: { current: 0, target: 4.0, trend: 'stable' as const },
    market: { current: 0, target: 4.3, trend: 'stable' as const },
    overall: { current: 0, target: 4.25, confidence: 0.75 }
  });

  const [benchmarks] = useState({
    industryAverage: { strategy: 3.2, process: 3.0, technology: 3.5, market: 3.1 },
    topPerformers: { strategy: 4.8, process: 4.6, technology: 4.9, market: 4.7 },
    percentileRanking: { strategy: 65, process: 70, technology: 60, market: 68 }
  });

  // Generate initial question
  useEffect(() => {
    const question = generateNextQuestion(responses, assessmentType, industry, 0);
    setCurrentQuestion(question);
  }, [assessmentType, industry]);

  // Update progress callback
  useEffect(() => {
    onProgress?.(currentStep, totalSteps);
  }, [currentStep, totalSteps, onProgress]);

  const handleResponse = useCallback(async (response: any, confidence?: number) => {
    if (!currentQuestion) return;

    setIsProcessing(true);

    // Store response
    const newResponses = {
      ...responses,
      [currentQuestion.id]: { value: response, confidence }
    };
    setResponses(newResponses);

    // Update live scores (mock calculation)
    const mockScoreUpdate = () => {
      const responseCount = Object.keys(newResponses).length;
      const avgResponse = typeof response === 'number' ? response : 3;
      
      setLiveScores(prev => ({
        strategy: { 
          ...prev.strategy, 
          current: currentQuestion.id.includes('strategy') ? avgResponse : prev.strategy.current 
        },
        process: { 
          ...prev.process, 
          current: currentQuestion.id.includes('process') ? avgResponse : prev.process.current 
        },
        technology: { 
          ...prev.technology, 
          current: currentQuestion.id.includes('technology') ? avgResponse : prev.technology.current 
        },
        market: { 
          ...prev.market, 
          current: currentQuestion.id.includes('market') ? avgResponse : prev.market.current 
        },
        overall: {
          ...prev.overall,
          current: (prev.strategy.current + prev.process.current + prev.technology.current + prev.market.current) / 4,
          confidence: Math.min(0.95, 0.5 + (responseCount * 0.1))
        }
      }));
    };

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    mockScoreUpdate();

    // Generate next question or complete
    const nextQuestion = generateNextQuestion(newResponses, assessmentType, industry, currentStep);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setCurrentStep(prev => prev + 1);
      
      // Simulate dynamic step adjustment
      if (Math.random() > 0.7) {
        setTotalSteps(prev => prev + 1);
        setAdaptationCount(prev => prev + 1);
      }
      
      // Update completion probability
      setCompletionProbability(prev => Math.min(0.95, prev + 0.05));
      
      // Update estimated time
      setEstimatedTimeRemaining(prev => Math.max(1, prev - 1.5));
    } else {
      // Assessment complete
      onComplete(newResponses);
    }

    setIsProcessing(false);
  }, [currentQuestion, responses, currentStep, assessmentType, industry, onComplete]);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // In production, would regenerate previous question
    }
  };

  const handleSkip = () => {
    if (currentQuestion) {
      handleResponse(null, 0);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Preparing your personalized assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <AdaptiveProgressIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        estimatedTimeRemaining={estimatedTimeRemaining}
        adaptationCount={adaptationCount}
        completionProbability={completionProbability}
        category={currentQuestion.id.split('_')[0]}
        difficulty={currentQuestion.context.difficulty}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <DynamicQuestionRenderer
              key={currentQuestion.id}
              question={currentQuestion}
              onResponse={handleResponse}
              onSkip={handleSkip}
              isLoading={isProcessing}
              showContext={true}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {allowBack && currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isProcessing}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>AI is analyzing your responses...</span>
            </div>
          </div>
        </div>

        {/* Live Score Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <LiveScoreDisplay
              scores={liveScores}
              benchmarks={benchmarks}
              isCalculating={isProcessing}
              lastUpdated={new Date()}
              showDetails={false}
            />

            {/* Motivation Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm text-blue-900 dark:text-blue-100">
                    Your Progress
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      Current Overall Score: {liveScores.overall.current.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You're performing {liveScores.overall.current > 3.5 ? 'above' : 'at'} industry average. 
                    Keep going to unlock personalized growth recommendations!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
