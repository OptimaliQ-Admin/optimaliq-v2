'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Users, 
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  BarChart3,
  Rocket,
  Sparkles,
  MessageSquare,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  Eye,
  BarChart,
  PieChart,
  LineChart,
  Clock,
  DollarSign,
  Building2,
  Globe,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Share2,
  Download,
  Settings,
  EyeOff,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  Info,
  HelpCircle,
  Activity,
  Calendar,
  Filter,
  Search,
  Bookmark,
  Flag,
  Archive,
  ExternalLink,
  Upload,
  FileText,
  Image,
  Table,
  Grid,
  List,
  Layout,
  Layers,
  Play,
  Pause,
  Stop,
  AreaChart,
  ScatterChart,
  RadarChart,
  DoughnutChart,
  PolarChart,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Move,
  Resize,
  Lock,
  Unlock,
  Maximize,
  Minimize,
  Circle,
  CircleDot,
  CircleCheck,
  CircleX,
  CirclePause,
  CirclePlay,
  CircleStop,
  CircleAlert,
  CircleInfo,
  CircleQuestion,
  CircleHelp,
  CircleZap,
  CircleBrain,
  CircleLightbulb,
  CircleStar,
  CircleAward,
  CircleTarget,
  CircleActivity,
  CircleUsers,
  CircleBuilding2,
  CircleGlobe,
  CircleCalendar,
  CircleClock,
  CircleFilter,
  CircleSearch,
  CircleBookmark,
  CircleFlag,
  CircleArchive,
  CircleExternalLink,
  CircleUpload,
  CircleFileText,
  CircleImage,
  CircleTable,
  CircleGrid,
  CircleList,
  CircleLayout,
  CircleLayers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  type: 'textarea' | 'select' | 'multiselect' | 'radio' | 'scale' | 'input';
  category: 'strategy' | 'operations' | 'team' | 'technology' | 'market';
  weight: number;
  followUp?: string;
  aiPrompt: string;
  suggestedResponses?: string[];
  options?: {
    choices?: string[];
    scale_min?: number;
    scale_max?: number;
    labels?: { [key: number]: string };
    placeholder?: string;
  };
  required?: boolean;
  aiInsights?: string[];
}

interface AssessmentData {
  currentStep: number;
  totalSteps: number;
  responses: { [key: string]: any };
  insights: string[];
  score: number;
  categoryScores: {
    strategy: number;
    operations: number;
    team: number;
    technology: number;
    market: number;
  };
  recommendations: string[];
  actionPlan: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  realTimeInsights: { [key: string]: string[] };
}

const questions: Question[] = [
  {
    id: 'challenges',
    question: "What are your biggest growth challenges right now?",
    type: 'multiselect',
    category: 'strategy',
    weight: 25,
    followUp: "Tell me more about how these challenges are impacting your business.",
    aiPrompt: "Analyze the user's growth challenges and provide specific, actionable insights. Consider their industry, company size, and role. Identify the root causes and suggest immediate and long-term solutions. Be specific and avoid generic advice.",
    suggestedResponses: [
      "We're struggling with customer acquisition and lead generation",
      "Our conversion rates are too low and we need to improve them",
      "We have trouble scaling our team and hiring the right people",
      "Our technology stack is holding us back from growing faster",
      "We need better data and metrics to make decisions",
      "We're facing increased competition in our market",
      "Our pricing strategy isn't working effectively",
      "We have cash flow and funding challenges"
    ],
    options: {
      choices: [
        "Customer acquisition and lead generation",
        "Low conversion rates",
        "Team scaling and hiring",
        "Technology limitations",
        "Data and metrics gaps",
        "Market competition",
        "Pricing strategy issues",
        "Cash flow and funding",
        "Other"
      ]
    },
    required: true
  },
  {
    id: 'strategy',
    question: "How would you describe your current growth strategy?",
    type: 'radio',
    category: 'strategy',
    weight: 20,
    followUp: "What specific tactics are you using to drive growth?",
    aiPrompt: "Evaluate their growth strategy based on best practices for their industry and company size. Identify gaps, strengths, and opportunities for improvement. Provide specific recommendations for strategy enhancement.",
    suggestedResponses: [
      "We focus on digital marketing and content creation",
      "We're using a product-led growth approach",
      "We rely on partnerships and referrals",
      "We're still figuring out our strategy",
      "We use a mix of sales and marketing tactics"
    ],
    options: {
      choices: [
        "Digital marketing and content creation",
        "Product-led growth approach",
        "Partnerships and referrals",
        "Still figuring out our strategy",
        "Mix of sales and marketing tactics",
        "Other"
      ]
    },
    required: true
  },
  {
    id: 'team',
    question: "How is your team structured for growth?",
    type: 'radio',
    category: 'team',
    weight: 20,
    followUp: "What roles are you missing or need to strengthen?",
    aiPrompt: "Analyze their team structure for growth readiness. Consider their company size, industry, and growth goals. Identify missing roles, skill gaps, and organizational improvements needed for scaling.",
    suggestedResponses: [
      "We're a small team wearing multiple hats",
      "We have dedicated sales and marketing roles",
      "We need to hire more people but don't know where to start",
      "We have the right people but need better processes",
      "We're struggling to find and retain talent"
    ],
    options: {
      choices: [
        "Small team wearing multiple hats",
        "Dedicated sales and marketing roles",
        "Need to hire but don't know where to start",
        "Right people but need better processes",
        "Struggling to find and retain talent",
        "Other"
      ]
    },
    required: true
  },
  {
    id: 'metrics',
    question: "What key metrics do you track for growth?",
    type: 'multiselect',
    category: 'operations',
    weight: 15,
    followUp: "How often do you review these metrics and make decisions?",
    aiPrompt: "Evaluate their metrics framework for growth tracking. Identify missing KPIs, suggest improvements to their measurement approach, and recommend data-driven decision-making processes.",
    suggestedResponses: [
      "Revenue, customer count, and basic conversion rates",
      "We track detailed funnel metrics and customer lifetime value",
      "We mainly look at website traffic and social media metrics",
      "We don't really track metrics systematically",
      "We have too many metrics and don't know which ones matter"
    ],
    options: {
      choices: [
        "Revenue and customer count",
        "Conversion rates",
        "Customer lifetime value (CLV)",
        "Customer acquisition cost (CAC)",
        "Website traffic and engagement",
        "Social media metrics",
        "Sales pipeline metrics",
        "Team performance metrics",
        "We don't track metrics systematically",
        "Too many metrics, unclear priorities",
        "Other"
      ]
    },
    required: true
  },
  {
    id: 'technology',
    question: "How is your technology stack supporting growth?",
    type: 'radio',
    category: 'technology',
    weight: 20,
    followUp: "What tools and systems are you using?",
    aiPrompt: "Assess their technology stack for growth scalability. Identify bottlenecks, suggest tool improvements, and recommend technology investments that will support their growth goals.",
    suggestedResponses: [
      "We use basic tools like email and spreadsheets",
      "We have a CRM and some marketing automation",
      "Our tech stack is outdated and needs upgrading",
      "We have good tools but don't use them effectively",
      "We're overwhelmed by too many tools and systems"
    ],
    options: {
      choices: [
        "Basic tools (email, spreadsheets)",
        "CRM and marketing automation",
        "Outdated tech stack needs upgrading",
        "Good tools but not using effectively",
        "Overwhelmed by too many tools",
        "Modern, integrated tech stack",
        "Other"
      ]
    },
    required: true
  }
];

const categoryIcons = {
  strategy: Target,
  operations: BarChart3,
  team: Users,
  technology: Zap,
  market: Globe
};

const categoryColors = {
  strategy: 'text-blue-600',
  operations: 'text-green-600',
  team: 'text-purple-600',
  technology: 'text-orange-600',
  market: 'text-pink-600'
};

export default function SmartFormAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    currentStep: 0,
    totalSteps: questions.length,
    responses: {},
    insights: [],
    score: 0,
    categoryScores: {
      strategy: 0,
      operations: 0,
      team: 0,
      technology: 0,
      market: 0
    },
    recommendations: [],
    actionPlan: [],
    strengths: [],
    weaknesses: [],
    opportunities: [],
    realTimeInsights: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Load user info from localStorage (only on client side)
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('growth_assessment_user');
        if (storedUser) {
          setUserInfo(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user info from localStorage:', error);
      }
    }
  }, []);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Safety check to prevent runtime errors
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Assessment Error</h1>
          <p className="text-blue-200">Unable to load assessment questions. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const handleResponseChange = (questionId: string, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      }
    }));

    // Generate real-time insights
    generateRealTimeInsights(questionId, value);
  };

  const generateRealTimeInsights = async (questionId: string, value: any) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const response = await fetch('/api/ai/real-time-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          response: value,
          category: question.category,
          aiPrompt: question.aiPrompt,
          userInfo: userInfo
        }),
      });

      if (response.ok) {
        const insights = await response.json();
        if (insights && insights.insights) {
          setAssessmentData(prev => ({
            ...prev,
            realTimeInsights: {
              ...prev.realTimeInsights,
              [questionId]: Array.isArray(insights.insights) ? insights.insights : []
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error generating real-time insights:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/growth-assessment/save-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: assessmentData.responses,
          userInfo: userInfo,
          assessmentType: 'smart_form'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAssessmentData(prev => ({
          ...prev,
          ...result,
          currentStep: questions.length
        }));
        setShowResults(true);
        toast.success('Assessment completed successfully!');
      } else {
        throw new Error('Failed to save assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = assessmentData.responses[question.id];

    switch (question.type) {
      case 'multiselect':
        return (
          <div className="space-y-4">
            {question.options?.choices?.map((choice, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  const currentValues = Array.isArray(value) ? value : [];
                  const isChecked = currentValues.includes(choice);
                  if (isChecked) {
                    handleResponseChange(question.id, currentValues.filter(v => v !== choice));
                  } else {
                    handleResponseChange(question.id, [...currentValues, choice]);
                  }
                }}
              >
                <div className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
                  Array.isArray(value) && value.includes(choice)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500'
                    : 'border-white/30 hover:border-white/50'
                )}>
                  {Array.isArray(value) && value.includes(choice) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <Label htmlFor={`${question.id}-${index}`} className="text-white font-medium cursor-pointer flex-1">
                  {choice}
                </Label>
              </motion.div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={(newValue) => handleResponseChange(question.id, newValue)}
            className="space-y-4"
          >
            {question.options?.choices?.map((choice, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                onClick={() => handleResponseChange(question.id, choice)}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  value === choice
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500'
                    : 'border-white/30 hover:border-white/50'
                )}>
                  {value === choice && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <Label htmlFor={`${question.id}-${index}`} className="text-white font-medium cursor-pointer flex-1">
                  {choice}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={question.options?.placeholder || "Tell us more..."}
            value={value || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          />
        );

      case 'input':
        return (
          <Input
            placeholder={question.options?.placeholder || "Enter your answer..."}
            value={value || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
          />
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-white/80 font-medium">
              <span>{question.options?.labels?.[question.options.scale_min || 1]}</span>
              <span>{question.options?.labels?.[question.options.scale_max || 5]}</span>
            </div>
            <div className="flex justify-center space-x-3">
              {Array.from({ length: (question.options?.scale_max || 5) - (question.options?.scale_min || 1) + 1 }, (_, i) => {
                const scaleValue = (question.options?.scale_min || 1) + i;
                return (
                  <motion.button
                    key={scaleValue}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResponseChange(question.id, scaleValue)}
                    className={cn(
                      'w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-300',
                      value === scaleValue
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl'
                        : 'border-white/30 bg-white/5 text-white hover:border-blue-400 hover:bg-white/10'
                    )}
                  >
                    {scaleValue}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRealTimeInsights = (questionId: string) => {
    const insights = assessmentData.realTimeInsights[questionId];
    if (!insights || insights.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-400/20 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">AI Insights</span>
        </div>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 text-white/90"
            >
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{insight}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl border border-white/30 p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
            <p className="text-gray-600">Your growth assessment has been analyzed. Here are your results:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Overall Score</h3>
                <p className="text-2xl font-bold text-blue-600">{assessmentData.score}/100</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Strengths</h3>
                <p className="text-2xl font-bold text-green-600">{assessmentData.strengths.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Opportunities</h3>
                <p className="text-2xl font-bold text-orange-600">{assessmentData.opportunities.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push('/growth-assessment/step3')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Results
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-500"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Growth Assessment
                </h1>
                <p className="text-blue-200 text-lg font-medium">AI-Powered Strategic Analysis</p>
              </div>
            </motion.div>
            
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <div className="flex items-center justify-between text-sm text-blue-200 mb-3">
                <span className="font-medium">Question {currentStep + 1} of {questions.length}</span>
                <span className="font-bold text-white">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Question Header */}
              <div className="bg-gradient-to-r from-white/20 to-white/10 p-8 border-b border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    {React.createElement(categoryIcons[currentQuestion.category], {
                      className: 'h-6 w-6 text-white'
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1 text-xs font-medium">
                        {currentQuestion.category.toUpperCase()}
                      </Badge>
                      <span className="text-blue-200 text-sm font-medium">
                        Question {currentStep + 1}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      {currentQuestion.question}
                    </h2>
                  </div>
                </div>
              </div>
              
              {/* Question Content */}
              <div className="p-8">
                <div className="mb-6">
                  {renderQuestionInput(currentQuestion)}
                </div>
                {renderRealTimeInsights(currentQuestion.id)}
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-3">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-4 h-4 rounded-full transition-all duration-300',
                    index === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                      : index < currentStep
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-white/20'
                  )}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!assessmentData.responses[currentQuestion.id] || isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 rounded-xl font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>{currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>

          {/* AI Analysis Indicator */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-400/20 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">AI Analysis in Progress</p>
                  <p className="text-white/80">Generating personalized insights and recommendations...</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
