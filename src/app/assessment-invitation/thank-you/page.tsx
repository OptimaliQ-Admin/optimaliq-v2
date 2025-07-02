'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, ArrowRight } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [invitationData, setInvitationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvitationData = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/assessment-delegation/get-invitations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invitationToken: token }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.invitation) {
            setInvitationData(data.invitation);
          }
        }
      } catch (error) {
        console.error('Error loading invitation data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvitationData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Assessment Completed!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Thank you for completing the assessment. Your responses have been submitted successfully and will help improve the organization&apos;s capabilities.
              </p>

              {invitationData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900">
                        Assessment: {invitationData.assessment_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-blue-700">
                        Invited by: {invitationData.inviter_name || 'Team Member'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      Your responses are being processed
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      The business owner will be notified
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      Results will be integrated into their dashboard
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-gray-500">
                  You can close this window. The business owner will receive your assessment results shortly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
} 