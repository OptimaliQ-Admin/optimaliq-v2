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

interface AssessmentInvitation {
  id: string;
  inviter_u_id: string;
  invitee_email: string;
  invitee_name: string;
  assessment_type: string;
  invitation_token: string;
  status: 'pending' | 'completed' | 'expired';
  expires_at: string;
  created_at: string;
  completed_at: string | null;
  answers: any;
  score: number | null;
  custom_message: string | null;
}

interface InviterInfo {
  email: string;
  first_name: string;
  last_name: string;
  company: string;
}

export default function AssessmentInvitationPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [invitation, setInvitation] = useState<AssessmentInvitation | null>(null);
  const [inviterInfo, setInviterInfo] = useState<InviterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');

  useEffect(() => {
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      
      // Get invitation details
      const { data: invitationData, error: invitationError } = await supabase
        .from('assessment_invitations')
        .select('*')
        .eq('invitation_token', token)
        .single();

      if (invitationError) {
        throw new Error('Invalid or expired invitation');
      }

      if (!invitationData) {
        throw new Error('Invitation not found');
      }

      setInvitation(invitationData);
      setInviteeName(invitationData.invitee_name || '');
      setInviteeEmail(invitationData.invitee_email || '');

      // Get inviter information
      const { data: inviterData, error: inviterError } = await supabase
        .from('users')
        .select('email, first_name, last_name, company')
        .eq('u_id', invitationData.inviter_u_id)
        .single();

      if (!inviterError && inviterData) {
        setInviterInfo(inviterData);
      }

      // Load existing answers if any
      if (invitationData.answers) {
        setAnswers(invitationData.answers);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentQuestions = (type: string) => {
    const questionConfigs = {
      sales: [
        { key: 'sales_process', label: 'What is your current sales process?', type: 'textarea' },
        { key: 'sales_team_size', label: 'How many sales representatives do you have?', type: 'number' },
        { key: 'sales_tools', label: 'What sales tools do you currently use?', type: 'textarea' },
        { key: 'sales_goals', label: 'What are your primary sales goals?', type: 'textarea' },
        { key: 'sales_challenges', label: 'What are your biggest sales challenges?', type: 'textarea' }
      ],
      marketing_effectiveness: [
        { key: 'marketing_channels', label: 'Which marketing channels do you use?', type: 'textarea' },
        { key: 'marketing_budget', label: 'What is your monthly marketing budget?', type: 'number' },
        { key: 'marketing_metrics', label: 'What metrics do you track?', type: 'textarea' },
        { key: 'marketing_goals', label: 'What are your marketing objectives?', type: 'textarea' }
      ],
      tech_stack: [
        { key: 'current_tools', label: 'What technology tools do you currently use?', type: 'textarea' },
        { key: 'integration_needs', label: 'What integration challenges do you face?', type: 'textarea' },
        { key: 'tech_budget', label: 'What is your technology budget?', type: 'number' },
        { key: 'tech_goals', label: 'What technology improvements are you seeking?', type: 'textarea' }
      ]
    };

    return questionConfigs[type as keyof typeof questionConfigs] || [];
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
        .from('assessment_invitations')
        .update({
          answers,
          status: 'completed',
          completed_at: new Date().toISOString(),
          invitee_name: inviteeName,
          invitee_email: inviteeEmail
        })
        .eq('invitation_token', token);

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = invitation && new Date(invitation.expires_at) < new Date();
  const questions = invitation ? getAssessmentQuestions(invitation.assessment_type) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading invitation...</p>
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
              <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
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
              <h2 className="text-xl font-semibold mb-2">Assessment Completed!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for completing the assessment. Your responses have been submitted successfully.
              </p>
              <p className="text-sm text-gray-500">
                The business owner will be notified of your completion.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {invitation.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {isExpired && <Clock className="h-5 w-5 text-red-500" />}
              Assessment Invitation
            </h2>
          </div>
          <CardContent>
            <div className="space-y-4">
              {inviterInfo && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Invited by:</p>
                  <p className="font-medium">
                    {inviterInfo.first_name} {inviterInfo.last_name}
                    {inviterInfo.company && ` from ${inviterInfo.company}`}
                  </p>
                </div>
              )}

              {invitation.custom_message && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Message:</p>
                  <p className="italic">{invitation.custom_message}</p>
                </div>
              )}

              {isExpired && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-red-800">
                      This invitation has expired. Please contact the sender for a new invitation.
                    </p>
                  </div>
                </div>
              )}

              {invitation.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-green-800">
                      This assessment has already been completed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!isExpired && invitation.status === 'pending' && (
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Complete Assessment</h3>
              <p className="text-gray-600 mt-1">
                Please provide your information and answer the following questions about{' '}
                <span className="font-medium">{invitation.assessment_type.replace('_', ' ')}</span>.
              </p>
            </div>
            <CardContent>
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inviteeName">Full Name</Label>
                      <Input
                        id="inviteeName"
                        value={inviteeName}
                        onChange={(e) => setInviteeName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inviteeEmail">Email Address</Label>
                      <Input
                        id="inviteeEmail"
                        type="email"
                        value={inviteeEmail}
                        onChange={(e) => setInviteeEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Assessment Questions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Assessment Questions</h3>
                  {questions.map((question, index) => (
                    <div key={question.key} className="space-y-2">
                      <Label htmlFor={question.key}>
                        {index + 1}. {question.label}
                      </Label>
                      {question.type === 'textarea' ? (
                        <textarea
                          id={question.key}
                          value={answers[question.key] || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(question.key, e.target.value)}
                          placeholder="Enter your response..."
                          rows={4}
                          className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : question.type === 'number' ? (
                        <Input
                          id={question.key}
                          type="number"
                          value={answers[question.key] || ''}
                          onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                          placeholder="Enter a number..."
                        />
                      ) : (
                        <Input
                          id={question.key}
                          value={answers[question.key] || ''}
                          onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                          placeholder="Enter your response..."
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !inviteeName || !inviteeEmail}
                    className="w-full md:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Assessment'
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