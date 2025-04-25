"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup04Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["acquisition_channels"]) &&
    answers["acquisition_channels"].length > 0 &&

    typeof answers["tech_maturity"] === "string" &&
    answers["tech_maturity"].trim().length > 0 &&

    typeof answers["retention_strategy"] === "string" &&
    answers["retention_strategy"].trim().length > 0
  );
}


type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group04_GrowthStack({ answers, onAnswer }: Props) {
  const acquisitionSelected = answers["acquisition_channels"] || [];

  return (
    <div className="space-y-10">
      {/* Question 10: Acquisition Channels */}
      <MultiSelectQuestion
        question="Which acquisition channels are driving meaningful results today?"
        description="Select all that apply."
        options={[
          { value: "seo", label: "Organic Search / SEO" },
          { value: "paid_media", label: "Paid Media (Google, Meta, TikTok, etc.)" },
          { value: "email", label: "Email Marketing" },
          { value: "outbound", label: "Outbound Sales" },
          { value: "partnerships", label: "Partnerships / Affiliates" },
          { value: "events", label: "Events / Webinars" },
          { value: "influencers", label: "Influencer Marketing" },
          { value: "pr", label: "PR / Earned Media" },
          { value: "referrals", label: "Word of Mouth / Referrals" },
          { value: "retail", label: "Retail or Channel Distribution" },
          { value: "other", label: "Other (please describe)" },
        ]}
        selected={Array.isArray(getArrayAnswer(acquisitionSelected)) ? getArrayAnswer(acquisitionSelected) : []}
        onChange={(val) => onAnswer("acquisition_channels", val)}
        maxSelect={6}
      />

      {/* Conditionally show "Other" field */}
      {getArrayAnswer(acquisitionSelected).includes("other") && (
        <TextAreaQuestion
          question="Please describe the acquisition channels that are driving meaningful results"
          placeholder="Describe the acquisition channels..."
          value={getStringAnswer(answers["acquisition_channels_other"])}
          onChange={(val) => onAnswer("acquisition_channels_other", val)}
          maxLength={50}
        />
      )}

      {/* Question 11: Tech Maturity */}
      <MultipleChoiceQuestion
        question="What is your current tech maturity level?"
        description="How well-integrated and effective is your current tech stack?"
        options={[
          { value: "integrated", label: "Everything is integrated and works seamlessly" },
          { value: "partially_integrated", label: "Some systems talk to each other, others don’t" },
          { value: "siloed", label: "Tools are siloed or require manual workarounds" },
          { value: "early_stage", label: "We’re still selecting or onboarding core platforms" },
          { value: "unsure", label: "Unsure / Other" },
        ]}
        value={getStringAnswer(answers["tech_maturity"])}
        onChange={(val) => onAnswer("tech_maturity", val)}
      />

      {/* Question 12: Retention Strategy */}
      <TextAreaQuestion
        question="What are your current retention levers?"
        description="How do you keep customers coming back? What’s your hook or lifecycle play?"
        placeholder="E.g., Email drip campaigns, customer success outreach, loyalty programs..."
        value={getStringAnswer(answers["retention_strategy"])}
        onChange={(val) => onAnswer("retention_strategy", val)}
        maxLength={300}
      />
    </div>
  );
}
