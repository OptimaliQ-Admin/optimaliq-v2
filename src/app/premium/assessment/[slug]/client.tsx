"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import DynamicStepRenderer from "@/components/questions/DynamicStepRenderer";
import { type AssessmentAnswers, type AssessmentAnswerValue } from "@/lib/types/AssessmentAnswers";
import { getErrorMessage } from "@/utils/errorHandler";
import { isDynamicStepValid } from "@/lib/validation/isDynamicStepValid";
import { assessmentIntros, AssessmentType } from "@/components/assessments/AssessmentIntroModal";
import { showToast } from "@/lib/utils/toast";

interface InvitationData {
  id: string;
  inviter_u_id: string;
  invitee_email: string;
  invitee_name: string;
  assessment_type: string;
  invitation_token: string;
  status: 'pending' | 'completed' | 'expired';
  expires_at: string;
  custom_message: string | null;
}

interface SubmissionData {
  assessment: string;
  answers: AssessmentAnswers;
  score: number;
  userId: string;
  invitationToken?: string;
  inviteeName?: string;
  inviteeEmail?: string;
  inviterUserId?: string;
}

export default function DynamicAssessmentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";
  const invitationToken = searchParams.get('invitation');

  const router = useRouter();
  const { user } = usePremiumUser();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<AssessmentAnswers>({});
  const [questionConfig, setQuestionConfig] = useState<any>(null);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isInvitedAssessment, setIsInvitedAssessment] = useState(false);

  const skipCheck = process.env.NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK === "true";

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await import(`@/lib/config/${slug}_question_config.json`);
        setQuestionConfig(config.default);
      } catch (err) {
        console.error("Failed to load question config:", err);
        setError("Invalid assessment type");
      }
    };

    loadConfig();
  }, [slug]);

  // Load invitation data if token is present
  useEffect(() => {
    const loadInvitationData = async () => {
      if (!invitationToken) return;

      console.log('🔍 Loading invitation data for token:', invitationToken);

      try {
        const response = await fetch('/api/assessment-delegation/get-invitations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invitationToken }),
        });

        console.log('📡 API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('📦 API response data:', data);
          
          if (data.invitation) {
            console.log('✅ Setting invitation data:', data.invitation);
            setInvitationData(data.invitation);
            setIsInvitedAssessment(true);
            
            // Check if invitation is expired
            if (new Date(data.invitation.expires_at) < new Date()) {
              setError("This invitation has expired. Please contact the sender for a new invitation.");
              return;
            }

            // Check if already completed
            if (data.invitation.status === 'completed') {
              setError("This assessment has already been completed.");
              return;
            }
          } else {
            console.log('❌ No invitation data in response');
            setError("Invalid or expired invitation link.");
            return;
          }
        } else {
          console.log('❌ API response not ok:', response.status);
          setError("Failed to load invitation data.");
          return;
        }
      } catch (error) {
        console.error("❌ Error loading invitation data:", error);
        setError("Failed to load invitation data.");
        return;
      }
    };

    loadInvitationData();
  }, [invitationToken]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (skipCheck) {
        setLoading(false);
        return;
      }

      // For invited assessments, we don't need to check subscription
      if (isInvitedAssessment) {
        setLoading(false);
        return;
      }

      if (!user?.email) {
        router.push("/pricing");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("tier2_users")
          .select("subscription_status")
          .eq("email", user.email)
          .single();

        if (error || !data || data.subscription_status !== "active") {
          console.warn("🚫 Access denied: not an active tier2 user");
          setError("Access Denied. Please subscribe first.");
          router.push("/pricing");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Error checking subscription:", err);
        setError("Something went wrong. Try again later.");
      }
    };

    checkSubscription();
  }, [router, user?.email, skipCheck, isInvitedAssessment]);

  useEffect(() => {
    const fetchScore = async () => {
      console.log('🔍 Fetching score - isInvitedAssessment:', isInvitedAssessment, 'invitationData:', invitationData);
      
      // For invited assessments, we need to wait for invitation data
      if (isInvitedAssessment && !invitationData) {
        console.log('⏳ Waiting for invitation data...');
        return;
      }
      
      // For regular assessments, we need user ID
      if (!isInvitedAssessment && !user?.u_id && !skipCheck) {
        console.log('⏳ Waiting for user ID...');
        return;
      }

      try {
        let targetUserId = user?.u_id;
        
        // For invited assessments, use the inviter's user ID
        if (isInvitedAssessment && invitationData) {
          targetUserId = invitationData.inviter_u_id;
          console.log('🎯 Using inviter user ID:', targetUserId);
        } else {
          console.log('🎯 Using current user ID:', targetUserId);
        }

        if (!targetUserId) {
          console.log('❌ No target user ID found');
          setError("Unable to determine user for assessment.");
          return;
        }

        console.log('🔍 Fetching score for user ID:', targetUserId);

        const { data, error } = await supabase
          .from("tier2_dashboard_insights")
          .select("overall_score")
          .eq("u_id", targetUserId)
          .single();

        if (error || !data?.overall_score) {
          console.log('❌ Error fetching score:', error, 'data:', data);
          setError("Unable to load assessment score.");
          return;
        }

        console.log('✅ Score loaded:', data.overall_score);
        setScore(data.overall_score);
        setLoading(false);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchScore();
  }, [user?.u_id, skipCheck, isInvitedAssessment, invitationData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleNext = async () => {
    if (score === null) {
      showToast.error("Score is not loaded yet. Please try again.");
      return;
    }

    if (!questionConfig) {
      showToast.error("Question configuration is not loaded yet. Please try again.");
      return;
    }

    const stepIsValid = isDynamicStepValid(score, step, formAnswers, questionConfig);

    if (!stepIsValid) {
      showToast.warning("Please complete all required questions before continuing.");
      return;
    }

    const isLastStep = step >= 2;

    if (!isLastStep) {
      setStep((prev) => prev + 1);
      return;
    }

    if (!user?.u_id) {
      showToast.error("User ID missing. Please try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const submissionData: SubmissionData = {
        assessment: slug,
        answers: formAnswers,
        score: score,
        userId: user.u_id
      };

      // Add invitation data if this is an invited assessment
      if (isInvitedAssessment && invitationData) {
        submissionData.invitationToken = invitationToken || undefined;
        submissionData.inviteeName = invitationData.invitee_name;
        submissionData.inviteeEmail = invitationData.invitee_email;
        submissionData.inviterUserId = invitationData.inviter_u_id;
      }

      const response = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok || result.score === undefined) {
        console.error("❌ Scoring API failed:", result);
        throw new Error(result.error || "Failed to score assessment");
      }

      showToast.success("Assessment submitted successfully!");
      
      // For invited assessments, redirect to a thank you page
      if (isInvitedAssessment) {
        router.push(`/assessment-invitation/thank-you?token=${invitationToken}`);
      } else {
        router.push("/premium/assessment");
      }
    } catch (err: unknown) {
      console.error("❌ Assessment submission failed:", err);
      setError(getErrorMessage(err));
      showToast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleAnswer = (key: string, value: AssessmentAnswerValue) => {
    setFormAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <div className="p-10 text-center">Loading your assessment...</div>;
  }

  if (score === null && !error) {
    return <div className="p-10 text-center">Still waiting for your score...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!questionConfig) {
    return <div className="p-10 text-center">Loading assessment configuration...</div>;
  }
  const slugToAssessmentType: Record<string, AssessmentType> = {
    bpm: "BPM",
    sales: "sales",
    tech_stack: "tech",
    strategic_maturity: "strategy",
    marketing_effectiveness: "marketing",
    ai_readiness: "ai",
    competitive_benchmarking: "benchmarking",
    customer_experience: "cx",
    digital_transformation: "digital",
    leadership: "leadership",
    reassessment: "reassessment",
  };
  
  let title = "Assessment";
if (slug in slugToAssessmentType) {
  const typeKey = slugToAssessmentType[slug];
  title = assessmentIntros[typeKey]?.title ?? "Assessment";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Invitation Header */}
        {isInvitedAssessment && invitationData && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {invitationData.invitee_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  You&apos;ve been invited to complete this assessment
                </h3>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">{invitationData.invitee_name}</span> has been invited to complete the {title} assessment.
                </p>
                {invitationData.custom_message && (
                  <div className="text-sm text-blue-600 italic">
                    &ldquo;{invitationData.custom_message}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <DynamicStepRenderer
          config={questionConfig}
          score={score || 0}
          step={step}
          answers={formAnswers}
          onAnswer={handleAnswer}
  assessmentType={slug}
        />

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`px-6 py-2 rounded ${
              step === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className={`px-6 py-2 rounded ${
              submitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : step === 2 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}