'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QuestionDelegation {
  id: string;
  delegator_u_id: string;
  delegate_email: string;
  delegate_name: string;
  assessment_type: string;
  question_keys: string[];
  delegation_token: string;
  status: 'pending' | 'completed' | 'expired';
  expires_at: string;
  created_at: string;
  completed_at: string | null;
  answers: any;
  custom_message: string | null;
}

interface DelegatorInfo {
  email: string;
  first_name: string;
  last_name: string;
  company: string;
}

export default function QuestionDelegationPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [delegation, setDelegation] = useState<QuestionDelegation | null>(null);
  const [delegatorInfo, setDelegatorInfo] = useState<DelegatorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [delegateName, setDelegateName] = useState('');
  const [delegateEmail, setDelegateEmail] = useState('');

  useEffect(() => {
    loadDelegation();
  }, [token]);

  const loadDelegation = async () => {
    try {
      setLoading(true);
      
      // Get delegation details
      const { data: delegationData, error: delegationError } = await supabase
        .from('question_delegations')
        .select('*')
        .eq('delegation_token', token)
        .single();

      if (delegationError) {
        throw new Error('Invalid or expired delegation');
      }

      if (!delegationData) {
        throw new Error('Delegation not found');
      }

      setDelegation(delegationData);
      setDelegateName(delegationData.delegate_name || '');
      setDelegateEmail(delegationData.delegate_email || '');

      // Get delegator information
      const { data: delegatorData, error: delegatorError } = await supabase
        .from('tier2_users')
        .select('email, first_name, last_name, company')
        .eq('u_id', delegationData.delegator_u_id)
        .single();

      if (!delegatorError && delegatorData) {
        setDelegatorInfo(delegatorData);
      }

      // Load existing answers if any
      if (delegationData.answers) {
        setAnswers(delegationData.answers);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionText = (questionKey: string) => {
    const questionMap: Record<string, string> = {
      'sales_process': 'What is your current sales process?',
      'sales_team_size': 'How many sales representatives do you have?',
      'sales_tools': 'What sales tools do you currently use?',
      'sales_goals': 'What are your primary sales goals?',
      'sales_challenges': 'What are your biggest sales challenges?',
      'marketing_channels': 'Which marketing channels do you use?',
      'marketing_budget': 'What is your monthly marketing budget?',
      'marketing_metrics': 'What metrics do you track?',
      'marketing_goals': 'What are your marketing objectives?',
      'current_tools': 'What technology tools do you currently use?',
      'integration_needs': 'What integration challenges do you face?',
      'tech_budget': 'What is your technology budget?',
      'tech_goals': 'What technology improvements are you seeking?'
    };

    return questionMap[questionKey] || questionKey;
  };

  const handleAnswerChange = (questionKey: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('question_delegations')
        .update({
          answers,
          status: 'completed',
          completed_at: new Date().toISOString(),
          delegate_name: delegateName,
          delegate_email: delegateEmail
        })
        .eq('delegation_token', token);

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = delegation && new Date(delegation.expires_at) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading delegation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invalid Delegation</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Questions Completed!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for completing the delegated questions. Your responses have been submitted successfully.
              </p>
              <p className="text-sm text-gray-500">
                The manager will be notified of your completion.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!delegation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {delegation.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {isExpired && <Clock className="h-5 w-5 text-red-500" />}
              Question Delegation
            </h2>
          </div>
          <CardContent>
            <div className="space-y-4">
              {delegatorInfo && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Delegated by:</p>
                  <p className="font-medium">
                    {delegatorInfo.first_name} {delegatorInfo.last_name}
                    {delegatorInfo.company && ` from ${delegatorInfo.company}`}
                  </p>
                </div>
              )}

              {delegation.custom_message && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Message:</p>
                  <p className="italic">{delegation.custom_message}</p>
                </div>
              )}

              {isExpired && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-red-800">
                      This delegation has expired. Please contact the sender for a new delegation.
                    </p>
                  </div>
                </div>
              )}

              {delegation.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-green-800">
                      These questions have already been completed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!isExpired && delegation.status === 'pending' && (
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Complete Delegated Questions</h3>
              <p className="text-gray-600 mt-1">
                Please provide your information and answer the following questions about{' '}
                <span className="font-medium">{delegation.assessment_type.replace('_', ' ')}</span>.
              </p>
            </div>
            <CardContent>
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="delegateName">Full Name</Label>
                      <Input
                        id="delegateName"
                        value={delegateName}
                        onChange={(e) => setDelegateName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delegateEmail">Email Address</Label>
                      <Input
                        id="delegateEmail"
                        type="email"
                        value={delegateEmail}
                        onChange={(e) => setDelegateEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Delegated Questions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delegated Questions</h3>
                  {delegation.question_keys.map((questionKey, index) => (
                    <div key={questionKey} className="space-y-2">
                      <Label htmlFor={questionKey}>
                        {index + 1}. {getQuestionText(questionKey)}
                      </Label>
                      <textarea
                        id={questionKey}
                        value={answers[questionKey] || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(questionKey, e.target.value)}
                        placeholder="Enter your response..."
                        rows={4}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !delegateName || !delegateEmail}
                    className="w-full md:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Responses'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 