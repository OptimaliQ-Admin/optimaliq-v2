//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group04_GrowthStack.tsx
"use client";

import React from "react";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import EnhancedMultiSelectQuestion from "@/components/questions/EnhancedMultiSelectQuestion";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";

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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Question 1: Acquisition Channels */}
      <EnhancedMultiSelectQuestion
        question="Which acquisition channels are driving meaningful results today?"
        description="Select all that apply. This helps us understand your current growth engine and identify optimization opportunities."
        options={[
          { value: "seo", label: "Organic Search / SEO", description: "Traffic from search engines" },
          { value: "paid_media", label: "Paid Media (Google, Meta, TikTok, etc.)", description: "Paid advertising across platforms" },
          { value: "email", label: "Email Marketing", description: "Direct email campaigns and automation" },
          { value: "outbound", label: "Outbound Sales", description: "Proactive sales outreach" },
          { value: "partnerships", label: "Partnerships / Affiliates", description: "Strategic partnerships and affiliate programs" },
          { value: "events", label: "Events / Webinars", description: "Live events and virtual presentations" },
          { value: "influencers", label: "Influencer Marketing", description: "Collaborations with influencers" },
          { value: "pr", label: "PR / Earned Media", description: "Public relations and media coverage" },
          { value: "referrals", label: "Word of Mouth / Referrals", description: "Customer referrals and recommendations" },
          { value: "retail", label: "Retail or Channel Distribution", description: "Physical retail or distribution channels" },
          { value: "other", label: "Other", description: "Unique channels specific to your business" },
        ]}
        selected={Array.isArray(acquisitionSelected) ? acquisitionSelected : []}
        onChange={(val) => onAnswer("acquisition_channels", val)}
        maxSelect={6}
        variant="cards"
      />
  
      {/* Conditionally show "Other" field */}
      {Array.isArray(acquisitionSelected) && acquisitionSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the acquisition channels that are driving meaningful results"
          description="Tell us about any unique or industry-specific channels that aren't in our standard list."
          placeholder="Describe the acquisition channels..."
          value={getStringAnswer(answers["acquisition_channels_other"])}
          onChange={(val) => onAnswer("acquisition_channels_other", val)}
          maxLength={200}
          rows={3}
        />
      )}

      {/* Question 2: Tech Maturity */}
      <EnhancedMultipleChoiceQuestion
        question="What is your current tech maturity level?"
        description="How well-integrated and effective is your current tech stack? This helps us understand your technical foundation."
        options={[
          { 
            value: "integrated", 
            label: "Everything is integrated and works seamlessly", 
            description: "All systems communicate and data flows automatically" 
          },
          { 
            value: "partially_integrated", 
            label: "Some systems talk to each other, others don't", 
            description: "Partial integration with some manual processes" 
          },
          { 
            value: "siloed", 
            label: "Tools are siloed or require manual workarounds", 
            description: "Systems operate independently with manual data transfer" 
          },
          { 
            value: "early_stage", 
            label: "We're still selecting or onboarding core platforms", 
            description: "In the process of building the tech foundation" 
          },
          { 
            value: "unsure", 
            label: "Unsure / Other", 
            description: "Not certain about current tech integration status" 
          },
        ]}
        value={getStringAnswer(answers["tech_maturity"])}
        onChange={(val) => onAnswer("tech_maturity", val)}
        variant="cards"
      />

      {/* Question 3: Retention Strategy */}
      <EnhancedTextAreaQuestion
        question="What are your current retention levers?"
        description="How do you keep customers coming back? What's your hook or lifecycle play? This helps us understand your customer success strategy."
        placeholder="E.g., Email drip campaigns, customer success outreach, loyalty programs, product features, community building..."
        value={getStringAnswer(answers["retention_strategy"])}
        onChange={(val) => onAnswer("retention_strategy", val)}
        maxLength={400}
        rows={4}
      />
    </div>
  );
}
