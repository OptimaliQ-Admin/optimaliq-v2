"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  getStringArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import { stripUnusedOtherFields } from "@/lib/utils/assessmentUtils";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "@/components/shared/ProgressBar";
import StepGroupRenderer from "./StepGroupRenderer";

// Score 1.0 Group
import Score1_Step01 from "./groups/score_1/Group01";
import Score1_Step02 from "./groups/score_1/Group02";
import Score1_Step03 from "./groups/score_1/Group03";
import { isScore_1Group1Complete } from "./groups/score_1/Group01";
import { isScore_1Group2Complete } from "./groups/score_1/Group02";
import { isScore_1Group3Complete } from "./groups/score_1/Group03";

// Score 1.5 Group
import Score1_5_Step01 from "./groups/score_1_5/Group01";
import Score1_5_Step02 from "./groups/score_1_5/Group02";
import Score1_5_Step03 from "./groups/score_1_5/Group03";
import { isScore_1_5Group1Complete } from "./groups/score_1_5/Group01";
import { isScore_1_5Group2Complete } from "./groups/score_1_5/Group02";
import { isScore_1_5Group3Complete } from "./groups/score_1_5/Group03";

// Score 2.0 Group
import Score2_Step01 from "./groups/score_2/Group01";
import Score2_Step02 from "./groups/score_2/Group02";
import { isScore_2Group1Complete } from "./groups/score_2/Group01";
import { isScore_2Group2Complete } from "./groups/score_2/Group02";

// Score 2.5 Group
import Score2_5_Step01 from "./groups/score_2_5/Group01";
import Score2_5_Step02 from "./groups/score_2_5/Group02";
import Score2_5_Step03 from "./groups/score_2_5/Group03";
import { isScore_2_5Group1Complete } from "./groups/score_2_5/Group01";
import { isScore_2_5Group2Complete } from "./groups/score_2_5/Group02";
import { isScore_2_5Group3Complete } from "./groups/score_2_5/Group03";

// Score 3.0 Group
import Score3_Step01 from "./groups/score_3/Group01";
import Score3_Step02 from "./groups/score_3/Group02";
import Score3_Step03 from "./groups/score_3/Group03";
import { isScore_3Group1Complete } from "./groups/score_3/Group01";
import { isScore_3Group2Complete } from "./groups/score_3/Group02";
import { isScore_3Group3Complete } from "./groups/score_3/Group03";

// Score 3.5 Group
import Score3_5_Step01 from "./groups/score_3_5/Group01";
import Score3_5_Step02 from "./groups/score_3_5/Group02";
import Score3_5_Step03 from "./groups/score_3_5/Group03";
import { isScore_3_5Group1Complete } from "./groups/score_3_5/Group01";
import { isScore_3_5Group2Complete } from "./groups/score_3_5/Group02";
import { isScore_3_5Group3Complete } from "./groups/score_3_5/Group03";

// Score 4.0 Group
import Score4_Step01 from "./groups/score_4/Group01";
import Score4_Step02 from "./groups/score_4/Group02";
import Score4_Step03 from "./groups/score_4/Group03";
import { isScore_4Group1Complete } from "./groups/score_4/Group01";
import { isScore_4Group2Complete } from "./groups/score_4/Group02";
import { isScore_4Group3Complete } from "./groups/score_4/Group03";

// Score 4.5 Group
import Score4_5_Step01 from "./groups/score_4_5/Group01";
import Score4_5_Step02 from "./groups/score_4_5/Group02";
import Score4_5_Step03 from "./groups/score_4_5/Group03";
import { isScore_4_5Group1Complete } from "./groups/score_4_5/Group01";
import { isScore_4_5Group2Complete } from "./groups/score_4_5/Group02";
import { isScore_4_5Group3Complete } from "./groups/score_4_5/Group03";

// Score 5.0 Group
import Score5_Step01 from "./groups/score_5/Group01";
import Score5_Step02 from "./groups/score_5/Group02";
import Score5_Step03 from "./groups/score_5/Group03";
import { isScore_5Group1Complete } from "./groups/score_5/Group01";
import { isScore_5Group2Complete } from "./groups/score_5/Group02";
import { isScore_5Group3Complete } from "./groups/score_5/Group03";

// Final Tools Step
import Group04 from "./groups/Group04";
import { isGroup04Complete } from "./groups/Group04";

const validatorSets: Record<string, Record<number, (answers: AssessmentAnswers) => boolean>> = {
  score_1: {
    0: isScore_1Group1Complete,
    1: isScore_1Group2Complete,
    2: isScore_1Group3Complete,
    3: isGroup04Complete,
  },
  score_1_5: {
    0: isScore_1_5Group1Complete,
    1: isScore_1_5Group2Complete,
    2: isScore_1_5Group3Complete,
    3: isGroup04Complete,
  },
  score_2: {
    0: isScore_2Group1Complete,
    1: isScore_2Group2Complete,
    2: isGroup04Complete,
  },
  score_2_5: {
    0: isScore_2_5Group1Complete,
    1: isScore_2_5Group2Complete,
    2: isScore_2_5Group3Complete,
    3: isGroup04Complete,
  },
  score_3: {
    0: isScore_3Group1Complete,
    1: isScore_3Group2Complete,
    2: isScore_3Group3Complete,
    3: isGroup04Complete,
  },
  score_3_5: {
    0: isScore_3_5Group1Complete,
    1: isScore_3_5Group2Complete,
    2: isScore_3_5Group3Complete,
    3: isGroup04Complete,
  },
  score_4: {
    0: isScore_4Group1Complete,
    1: isScore_4Group2Complete,
    2: isScore_4Group3Complete,
    3: isGroup04Complete,
  },
  score_4_5: {
    0: isScore_4_5Group1Complete,
    1: isScore_4_5Group2Complete,
    2: isScore_4_5Group3Complete,
    3: isGroup04Complete,
  },
  score_5: {
    0: isScore_5Group1Complete,
    1: isScore_5Group2Complete,
    2: isScore_5Group3Complete,
    3: isGroup04Complete,
  },
};

function normalizeScore(score: number): keyof typeof validatorSets {
  if (score >= 1 && score <= 1.4) return "score_1";
  if (score >= 1.5 && score <= 1.9) return "score_1_5";
  if (score >= 2 && score <= 2.4) return "score_2";
  if (score >= 2.5 && score <= 2.9) return "score_2_5";
  if (score >= 3 && score <= 3.4) return "score_3";
  if (score >= 3.5 && score <= 3.9) return "score_3_5";
  if (score >= 4 && score <= 4.4) return "score_4";
  if (score >= 4.5 && score <= 4.9) return "score_4_5";
  return "score_5";
}

export default function TechStackAssessment() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [formAnswers, setFormAnswers] = useState<AssessmentAnswers>({});
  const router = useRouter();
  const { user } = usePremiumUser();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skipCheck, setSkipCheck] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      if (!user?.u_id && !skipCheck) return;

      try {
        const { data, error } = await supabase
          .from("tier2_dashboard_insights")
          .select("overall_score")
          .eq("u_id", user?.u_id)
          .single();

        if (error) {
          console.error("❌ Failed to fetch score:", error);
          setError("Unable to load assessment score.");
          return;
        }

        if (!data?.overall_score) {
          setError("No score found. Please complete the GMF assessment first.");
          return;
        }

        setScore(data.overall_score);
        setLoading(false);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchScore();
  }, [user?.u_id, skipCheck]);

  const handleAnswer = (key: string, value: any) => {
    setFormAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (score === null) {
      alert("Score is not loaded yet. Please try again.");
      return;
    }

    const normalized = normalizeScore(score);
    const validator = validatorSets[normalized]?.[step];
    const isStepValid = validator ? validator(formAnswers) : true;

    if (!isStepValid) {
      alert("Please complete all required questions before continuing.");
      return;
    }

    const isLastStep = step >= 3;
    if (!isLastStep) {
      setStep((prev) => prev + 1);
      return;
    }

    if (!user?.u_id) {
      alert("User ID missing. Please try again.");
      return;
    }

    try {
      const sanitizedAnswers = stripUnusedOtherFields(formAnswers);

      // Step 1: Call your scoring API
      const response = await fetch("/api/assessments/tech_stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: sanitizedAnswers,
          score: score,
          userId: user.u_id
        }),
      });

      const result = await response.json();

      if (!response.ok || result.techStackScore === undefined) {
        console.error("❌ Scoring API failed:", result);
        alert("Something went wrong while scoring the assessment.");
        return;
      }

      const techStackScore = result.techStackScore;

      // Step 2: Save raw answers
      const { error: insertError1 } = await supabase
        .from("tech_stack_assessment")
        .insert({
          ...sanitizedAnswers,
          score: techStackScore,
          u_id: user.u_id
        });

      // Step 3: Save the scored result
      const { error: insertError2 } = await supabase
        .from("score_tech_stack")
        .insert({
          u_id: user.u_id,
          gmf_score: score.toString(),
          bracket_key: normalized,
          score: techStackScore,
          answers: sanitizedAnswers,
          version: 'v1'
        });

      // Step 4: Save selected tools
      const toolsToInsert = [];
      for (const category of ["crm_tools", "esp_tools", "analytics_tools", "cms_tools"]) {
        const tools = getStringArrayAnswer(sanitizedAnswers[category]);
        for (const tool of tools) {
          toolsToInsert.push({
            u_id: user.u_id,
            category,
            tool_name: tool,
            updated_at: new Date().toISOString(),
          });
        }
      }

      const { error: insertError3 } = await supabase
        .from("tech_stack_tools")
        .upsert(toolsToInsert);

      if (insertError1 || insertError2 || insertError3) {
        console.error("❌ Database insert failed:", { insertError1, insertError2, insertError3 });
        alert("Something went wrong while saving your assessment.");
        return;
      }

      router.push("/premium/assessment/tech-stack/results");
    } catch (error) {
      console.error("❌ Assessment submission failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading your assessment...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (score === null) {
    return <div className="p-10 text-center">Still waiting for your score...</div>;
  }

  const normalized = normalizeScore(score);
  const totalSteps = normalized === "score_2" ? 3 : 4;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <ProgressBar current={step} total={totalSteps} />

        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {score !== null && (
                <StepGroupRenderer
                  step={step}
                  score={score}
                  answers={formAnswers}
                  onAnswer={handleAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <button
              disabled={step === 0}
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {step === totalSteps - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 