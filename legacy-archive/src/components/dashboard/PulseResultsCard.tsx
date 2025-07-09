'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface PulseQuestion {
  id: string;
  text: string;
  type: 'scale_1_5' | 'text';
}

interface PulseResult {
  id: string;
  title: string;
  department: string;
  areas_of_focus: string[];
  questions: PulseQuestion[];
  created_at: string;
  status: string;
  totalResponses: number;
  submittedResponses: number;
  completionRate: number;
  questionAverages: Record<string, number>;
  textResponses: Record<string, string[]>;
  delegations: Array<{
    id: string;
    delegateName: string;
    delegateEmail: string;
    status: string;
    responseCount: number;
    submittedCount: number;
  }>;
}

interface PulseResultsCardProps {
  user: {
    u_id: string;
  };
}

export default function PulseResultsCard({ user }: PulseResultsCardProps) {
  const [pulses, setPulses] = useState<PulseResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPulse, setExpandedPulse] = useState<string | null>(null);

  const loadPulseResults = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/strategic-pulse/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id: user.u_id }),
      });

      if (response.ok) {
        const data = await response.json();
        setPulses(data.pulses || []);
      }
    } catch (error) {
      console.error('Error loading pulse results:', error);
    } finally {
      setLoading(false);
    }
  }, [user.u_id]);

  useEffect(() => {
    loadPulseResults();
  }, [loadPulseResults]);

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 4) return 'Good';
    if (score >= 3) return 'Fair';
    if (score >= 2) return 'Poor';
    return 'Very Poor';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pulse Check Results</h2>
              <p className="text-sm text-gray-600">Loading results...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pulses.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pulse Check Results</h2>
              <p className="text-sm text-gray-600">No pulse checks created yet</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No pulse check results available</p>
            <p className="text-sm text-gray-400">Create your first pulse check to see results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pulse Check Results</h2>
            <p className="text-sm text-gray-600">View aggregated team feedback</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pulses.map((pulse) => (
            <div key={pulse.id} className="border border-gray-200 rounded-lg p-4">
              {/* Pulse Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{pulse.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(pulse.created_at), "MMM d, yyyy")}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {pulse.department}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedPulse(expandedPulse === pulse.id ? null : pulse.id)}
                >
                  {expandedPulse === pulse.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{pulse.submittedResponses}</div>
                  <div className="text-sm text-gray-600">Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {pulse.completionRate.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(pulse.questionAverages).length}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPulse === pulse.id && (
                <div className="border-t border-gray-200 pt-4 space-y-6">
                  {/* Scale Question Results */}
                  {pulse.questions
                    .filter(q => q.type === 'scale_1_5')
                    .map((question, index) => {
                      const average = pulse.questionAverages[question.id];
                      return (
                        <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Q{index + 1}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                              {average && (
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= Math.round(average)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getScoreColor(average)}`}
                                  >
                                    {average.toFixed(1)} - {getScoreLabel(average)}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Text Question Results */}
                  {pulse.questions
                    .filter(q => q.type === 'text')
                    .map((question, index) => {
                      const responses = pulse.textResponses[question.id] || [];
                      return (
                        <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Q{pulse.questions.filter(q => q.type === 'scale_1_5').length + index + 1}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MessageSquare className="w-4 h-4" />
                                <span>{responses.length} responses</span>
                              </div>
                            </div>
                          </div>
                          
                          {responses.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-sm font-medium text-gray-700">Sample responses:</p>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {responses.slice(0, 3).map((response, idx) => (
                                  <div key={idx} className="text-sm text-gray-600 bg-white p-2 rounded border">
                                    &ldquo;{response.length > 100 ? response.substring(0, 100) + '...' : response}&rdquo;
                                  </div>
                                ))}
                                {responses.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    +{responses.length - 3} more responses
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {/* Delegation Status */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Delegation Status</h4>
                    <div className="space-y-2">
                      {pulse.delegations.map((delegation) => (
                        <div key={delegation.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{delegation.delegateName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                              {delegation.submittedCount}/{delegation.responseCount} responses
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCompletionColor((delegation.submittedCount / delegation.responseCount) * 100)}`}
                            >
                              {delegation.responseCount > 0 
                                ? Math.round((delegation.submittedCount / delegation.responseCount) * 100)
                                : 0}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 