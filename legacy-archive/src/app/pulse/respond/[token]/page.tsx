'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Send, 
  Target, 
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { showToast } from '@/lib/utils/toast';

interface PulseQuestion {
  id: string;
  text: string;
  type: 'scale_1_5' | 'text';
}

interface PulseData {
  id: string;
  title: string;
  department: string;
  areas_of_focus: string[];
  questions: PulseQuestion[];
}

interface ResponseData {
  id: string;
  respondentName: string;
  respondentEmail: string;
  submittedAt: string | null;
}

export default function PulseRespondPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    loadResponseData();
  }, []);

  const loadResponseData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/strategic-pulse/respond/${token}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load response data');
      }

      const data = await response.json();
      setPulse(data.pulse);
      setResponse(data.response);
      
    } catch (error) {
      console.error('Error loading response data:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to load response data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate all questions are answered
    if (!pulse) return;
    
    const unansweredQuestions = pulse.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      showToast.error('Please answer all questions before submitting');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/strategic-pulse/respond/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit response');
      }

      showToast.success('Response submitted successfully!');
      
      // Show success state
      setTimeout(() => {
        window.location.href = '/pulse/respond/thank-you';
      }, 2000);

    } catch (error) {
      console.error('Error submitting response:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading pulse check...</p>
        </div>
      </div>
    );
  }

  if (!pulse || !response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid or Expired Link</h2>
          <p className="text-gray-600">
            This response link is invalid or has expired. Please contact your team lead for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (response.submittedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Submitted</h2>
          <p className="text-gray-600">
            You have already submitted your response to this pulse check. Thank you for participating!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategic Pulse Check</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your feedback helps leadership understand team sentiment and identify areas for improvement. 
              This survey is anonymous and will take about 2-3 minutes to complete.
            </p>
          </div>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{pulse.title}</h2>
                <p className="text-sm text-gray-600">Please answer all questions below</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {pulse.questions.map((question, index) => (
              <div key={question.id} className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Q{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                    <Badge variant="secondary" className="text-xs">
                      {question.type === 'scale_1_5' ? 'Scale (1-5)' : 'Text Response'}
                    </Badge>
                  </div>
                </div>

                {question.type === 'scale_1_5' ? (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Rate from 1 (Strongly Disagree) to 5 (Strongly Agree)</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleAnswerChange(question.id, rating)}
                          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                            answers[question.id] === rating
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${answers[question.id] === rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 - Strongly Disagree</span>
                      <span>5 - Strongly Agree</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`answer-${question.id}`} className="text-sm font-medium">
                      Your response
                    </Label>
                    <Textarea
                      id={`answer-${question.id}`}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Response
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-gray-500 text-center">
              <p>Your responses are anonymous and will be aggregated with other team member responses.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 