"use client";

import React from "react";
import DynamicQuestion from "./DynamicQuestion";
import {
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type QuestionType = "select" | "multi_select" | "text_area";

type QuestionOption = {
  value: string;
  label: string;
  score: number;
};

type Question = {
  key: string;
  label: string;
  type: QuestionType;
  options?: QuestionOption[];
  categories?: Record<string, string[]>;
};

type ScoreConfigGroup = {
  groups: {
    [key: string]: Question[];
  };
  finalQuestions?: Question[];
};

type ScoreConfig = {
  [key: string]: ScoreConfigGroup;
};

type Props = {
  config: ScoreConfig;
  score: number;
  step: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
  assessmentType?: string;
};

function normalizeScore(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}

function convertToQuestionValue(
  value: AssessmentAnswerValue
): string | string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();
  return "";
}

function flattenedOptions(
  categories: Record<string, string[]>
): Record<string, { label: string; score: number }> {
  const result: Record<string, { label: string; score: number }> = {};
  const score = 1;
  Object.entries(categories).forEach(([group, tools]) => {
    tools.forEach((tool) => {
      const key = `${group}:${tool}`;
      result[key] = { label: `${group}: ${tool}`, score };
    });
  });
  return result;
}

export default function DynamicStepRenderer({
  config,
  score,
  step,
  answers,
  onAnswer,
  assessmentType,
}: Props) {
  const normalizedScore = normalizeScore(score);
  const scoreConfig = config[normalizedScore];

  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return null;
  }

  const groupStepCount = Object.keys(scoreConfig.groups || {}).length;
  const isTechStackStep = step === groupStepCount && assessmentType === "tech_stack";

  // Standard group questions
  if (step < groupStepCount) {
    const group = scoreConfig.groups?.[step.toString()];
    if (!group) return null;

    return (
      <div className="space-y-8 p-6 max-w-2xl mx-auto">
        {group.map((question) => {
          const optionsRecord = question.options?.reduce(
            (acc, opt) => ({
              ...acc,
              [opt.value]: { label: opt.label, score: opt.score },
            }),
            {} as Record<string, { label: string; score: number }>
          );

          return (
            <DynamicQuestion
              key={question.key}
              question={question.label}
              type={question.type}
              options={optionsRecord}
              selected={convertToQuestionValue(answers[question.key])}
              onChange={(value: string | string[]) => onAnswer(question.key, value)}
              maxSelect={question.type === "multi_select" ? 5 : undefined}
            />
          );
        })}
      </div>
    );
  }

  // Tech stack tool selection questions
  if (isTechStackStep) {
    const techStackQuestion = {
      key: "current_tech_stack",
      label: "Which technologies does your team currently use?",
      type: "multi_select" as const,
      categories: {
        "CRM": [
          "Agile CRM",
          "Apptivo",
          "Bigin by Zoho CRM",
          "Capsule CRM",
          "Close CRM",
          "Copper",
          "Creatio",
          "Freshsales (Freshworks)",
          "HubSpot CRM",
          "Insightly",
          "Keap (formerly Infusionsoft)",
          "Less Annoying CRM",
          "Microsoft Dynamics 365",
          "Monday.com CRM",
          "Nimble",
          "Nutshell",
          "Oracle NetSuite CRM",
          "Pipedrive",
          "SAP Sales Cloud",
          "Salesforce",
          "SugarCRM",
          "Vtiger",
          "Zendesk Sell",
          "Zoho CRM",
          "None",
          "Other"
        ],
        "ESP": [
          "Acoustic Campaign (formerly IBM Watson)",
          "ActiveCampaign",
          "Adobe Campaign",
          "AWeber",
          "Benchmark Email",
          "Blueshift",
          "Braze",
          "Campaign Monitor",
          "Constant Contact",
          "dotdigital",
          "Drip",
          "GetResponse",
          "HubSpot Marketing Hub",
          "Iterable",
          "Klaviyo",
          "Listrak",
          "Mailchimp",
          "MailerLite",
          "Mailjet",
          "Moosend",
          "Omnisend",
          "Oracle Eloqua",
          "SAP Emarsys",
          "Salesforce Marketing Cloud",
          "Sendinblue (Brevo)",
          "SharpSpring",
          "None",
          "Other"
        ],
        "Analytics": [
          "Adobe Analytics",
          "Amplitude",
          "Chartio (acquired by Atlassian)",
          "Countly",
          "Crazy Egg",
          "Domo",
          "FullStory",
          "Google Analytics (GA4)",
          "Heap",
          "Hotjar (behavior + feedback)",
          "Kissmetrics",
          "Looker (Google)",
          "Matomo",
          "Metabase",
          "Mixpanel",
          "Piwik PRO",
          "Plausible Analytics",
          "Power BI",
          "Qlik Sense",
          "Redash",
          "Segment (for behavioral tracking)",
          "Sisense",
          "Snowplow",
          "Tableau",
          "Zoho Analytics",
          "None",
          "Other"
        ],
        "CDP": [
          "ActionIQ",
          "Adobe Real-Time CDP",
          "Amperity",
          "Bloomreach Engagement",
          "BlueConic",
          "Celebrus",
          "Commanders Act",
          "Exponea (Bloomreach)",
          "Lexer",
          "Lytics",
          "Meiro",
          "MetaRouter",
          "mParticle",
          "NGDATA",
          "Oracle Unity",
          "RudderStack",
          "Salesforce Data Cloud (formerly Customer 360 Audiences)",
          "SAP Customer Data Cloud",
          "Segment (Twilio)",
          "Simon Data",
          "Tealium AudienceStream",
          "Totango",
          "Treasure Data",
          "Zeotap",
          "Zeta Global",
          "None",
          "Other"
        ]
      }
    };

    return (
      <div className="space-y-8 p-6 max-w-2xl mx-auto">
        <DynamicQuestion
          key={techStackQuestion.key}
          question={techStackQuestion.label}
          type={techStackQuestion.type}
          options={flattenedOptions(techStackQuestion.categories)}
          selected={convertToQuestionValue(answers[techStackQuestion.key])}
          onChange={(value: string | string[]) => onAnswer(techStackQuestion.key, value)}
          maxSelect={10}
        />
      </div>
    );
  }

  return null;
}
