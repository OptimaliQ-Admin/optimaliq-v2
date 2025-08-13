"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import WorldClassOnboardingChat from '@/components/onboarding/WorldClassOnboardingChat';
import { growthAssessmentQuestionGroups } from '@/lib/services/growthAssessment/QuestionFlow';
import { showToast } from '@/lib/utils/toast';

export default function GrowthAssessmentChat() {
  const router = useRouter();
  const sessionId = useMemo(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`), []);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <WorldClassOnboardingChat
      sessionId={sessionId}
      questionGroupsOverride={growthAssessmentQuestionGroups}
      disableQuestionAI={false}
      completeWithoutScoring={true}
      aiTimeoutMs={6000}
      onComplete={async (answers) => {
        try {
          // Use the user ID generated at Step 1 lead form (with ReCAPTCHA)
          const uid = userId || (typeof window !== 'undefined' ? localStorage.getItem('u_id') : null);
          if (!uid) {
            showToast.error('Session expired. Please restart the assessment.');
            router.push('/growth-assessment');
            return;
          }

          // Save assessment responses using existing API
          const payload = {
            u_id: uid,
            obstacles: answers.obstacles,
            strategy: answers.strategy,
            process: answers.process,
            customers: answers.customers,
            technology: answers.technology,
            submittedat: new Date().toISOString(),
          };

          const res = await fetch('/api/growth-assessment/save-assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            showToast.error('Failed to save your responses.');
            return;
          }

          router.push('/growth-assessment/analyzing');
        } catch (e) {
          console.error(e);
          showToast.error('Unexpected error. Please try again.');
        }
      }}
    />
  );
}


