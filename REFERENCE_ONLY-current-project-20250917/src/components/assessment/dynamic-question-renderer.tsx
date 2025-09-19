'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Brain, 
  TrendingUp, 
  Info, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

// Dynamic Question Interface
interface DynamicQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text' | 'boolean' | 'ranking';
  options?: string[];
  context: {
    industry: string;
    previousResponses: Record<string, any>;
    adaptationReason: string;
    difficulty: 'basic' | 'intermediate' | 'advanced';
    importance: number; // 1-10
  };
  confidence: {
    required: boolean;
    scale: 1 | 5 | 10;
  };
  validation?: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface DynamicQuestionRendererProps {
  question: DynamicQuestion;
  onResponse: (response: any, confidence?: number) => void;
  onSkip?: () => void;
  isLoading?: boolean;
  showContext?: boolean;
}

// Animation variants
const questionVariants = {
  initial: { opacity: 0, x: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.1, duration: 0.2 }
  }
};

export function DynamicQuestionRenderer({
  question,
  onResponse,
  onSkip,
  isLoading = false,
  showContext = true
}: DynamicQuestionRendererProps) {
  const [response, setResponse] = useState<any>(null);
  const [confidence, setConfidence] = useState<number>(5);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Validate response
  useEffect(() => {
    if (question.validation?.required && !response) {
      setIsValid(false);
      return;
    }

    if (question.type === 'scale' && typeof response === 'number') {
      const min = question.validation?.min || 1;
      const max = question.validation?.max || 10;
      setIsValid(response >= min && response <= max);
    } else if (question.type === 'text' && typeof response === 'string') {
      setIsValid(response.trim().length > 0);
    } else if (response !== null && response !== undefined) {
      setIsValid(true);
    }
  }, [response, question]);

  const handleSubmit = () => {
    if (isValid) {
      onResponse(
        response, 
        question.confidence.required ? confidence : undefined
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceIcon = (importance: number) => {
    if (importance >= 8) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (importance >= 6) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'scale':
        const max = question.validation?.max || 10;
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
            <div className="px-3">
              <input
                type="range"
                min={question.validation?.min || 1}
                max={max}
                value={response || Math.ceil(max / 2)}
                onChange={(e) => setResponse(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">
                {response || Math.ceil(max / 2)}
              </span>
              <span className="text-muted-foreground">/{max}</span>
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <Select value={response || ''} onValueChange={setResponse}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'text':
        return (
          <Textarea
            placeholder="Enter your response..."
            value={response || ''}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[100px]"
          />
        );

      case 'boolean':
        return (
          <div className="flex gap-4">
            <Button
              variant={response === true ? 'default' : 'outline'}
              onClick={() => setResponse(true)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Yes
            </Button>
            <Button
              variant={response === false ? 'default' : 'outline'}
              onClick={() => setResponse(false)}
              className="flex-1"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              No
            </Button>
          </div>
        );

      case 'ranking':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  const newResponse = [...(response || [])];
                  const existingIndex = newResponse.indexOf(option);
                  if (existingIndex > -1) {
                    newResponse.splice(existingIndex, 1);
                  } else {
                    newResponse.push(option);
                  }
                  setResponse(newResponse);
                }}
              >
                <div className="flex-shrink-0">
                  {response?.includes(option) ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
                {response?.includes(option) && (
                  <Badge variant="secondary">
                    #{response.indexOf(option) + 1}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderConfidenceSlider = () => {
    if (!question.confidence.required) return null;

    return (
      <motion.div 
        className="mt-6 p-4 bg-muted/30 rounded-lg"
        variants={contentVariants}
      >
        <Label className="text-sm font-medium mb-3 block">
          How confident are you in this response?
        </Label>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
          <input
            type="range"
            min={1}
            max={question.confidence.scale}
            value={confidence}
            onChange={(e) => setConfidence(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-center">
            <span className="text-lg font-semibold text-primary">
              {confidence}
            </span>
            <span className="text-muted-foreground">/{question.confidence.scale}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        variants={questionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            {/* Question Metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(question.context.difficulty)}
                >
                  {question.context.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  {getImportanceIcon(question.context.importance)}
                  <span className="text-xs text-muted-foreground">
                    Impact: {question.context.importance}/10
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {question.context.industry}
              </Badge>
            </div>

            {/* Question Title */}
            <CardTitle className="text-xl leading-relaxed">
              {question.text}
            </CardTitle>

            {/* Context Information */}
            {showContext && question.context.adaptationReason && (
              <motion.div 
                className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
                variants={contentVariants}
              >
                <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Why this question?
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {question.context.adaptationReason}
                  </p>
                </div>
              </motion.div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Input */}
            <motion.div variants={contentVariants}>
              {renderQuestionInput()}
            </motion.div>

            {/* Confidence Slider */}
            {renderConfidenceSlider()}

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-between pt-4"
              variants={contentVariants}
            >
              {onSkip && (
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  disabled={isLoading}
                >
                  Skip Question
                </Button>
              )}
              
              <div className="flex gap-3 ml-auto">
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
