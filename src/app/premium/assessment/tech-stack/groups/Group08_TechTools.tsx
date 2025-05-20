//src/app/premium/assessment/tech-stack/groups/Group08_TechTools.tsx
"use client";

import React from "react";
import {
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import ToolSelectorGroup from "@/components/questions/ToolSelectorGroup";

export function isGroup08Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["tech_tools_crm"]) &&
    Array.isArray(answers["tech_tools_esp"]) &&
    Array.isArray(answers["tech_tools_analytics"]) &&
    Array.isArray(answers["tech_tools_cms"])
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group08_TechTools({ answers, onAnswer }: Props) {
  const toolCategories = [
    {
      categoryKey: "tech_tools_crm",
      question: "CRM Tools",
      description: "Select the CRM platforms you use",
      options: [
        { value: "salesforce", label: "Salesforce" },
        { value: "hubspot", label: "HubSpot" },
        { value: "zoho", label: "Zoho CRM" },
        { value: "pipedrive", label: "Pipedrive" },
        { value: "freshsales", label: "Freshsales" },
      ],
    },
    {
      categoryKey: "tech_tools_esp",
      question: "Email Service Providers",
      description: "Select the email marketing platforms you use",
      options: [
        { value: "mailchimp", label: "Mailchimp" },
        { value: "klaviyo", label: "Klaviyo" },
        { value: "sendgrid", label: "SendGrid" },
        { value: "activecampaign", label: "ActiveCampaign" },
        { value: "customerio", label: "Customer.io" },
      ],
    },
    {
      categoryKey: "tech_tools_analytics",
      question: "Analytics Tools",
      description: "Select the analytics platforms you use",
      options: [
        { value: "ga4", label: "Google Analytics 4" },
        { value: "mixpanel", label: "Mixpanel" },
        { value: "amplitude", label: "Amplitude" },
        { value: "segment", label: "Segment" },
        { value: "hotjar", label: "Hotjar" },
      ],
    },
    {
      categoryKey: "tech_tools_cms",
      question: "Content Management Systems",
      description: "Select the CMS platforms you use",
      options: [
        { value: "wordpress", label: "WordPress" },
        { value: "shopify", label: "Shopify" },
        { value: "webflow", label: "Webflow" },
        { value: "squarespace", label: "Squarespace" },
        { value: "wix", label: "Wix" },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold mb-6">Your Tech Stack Tools</h2>
      <p className="text-gray-600 mb-8">
        Please select the tools you currently use in each category. This helps us provide more relevant recommendations.
      </p>

      {toolCategories.map((category) => (
        <ToolSelectorGroup
          key={category.categoryKey}
          categoryKey={category.categoryKey}
          question={category.question}
          description={category.description}
          options={category.options}
          answers={answers}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
} 