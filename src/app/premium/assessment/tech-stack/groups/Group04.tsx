"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import {
  getStringArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isGroup04Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["crm_tools"]) &&
    answers["crm_tools"].length > 0 &&
    Array.isArray(answers["esp_tools"]) &&
    answers["esp_tools"].length > 0 &&
    Array.isArray(answers["analytics_tools"]) &&
    answers["analytics_tools"].length > 0 &&
    Array.isArray(answers["cms_tools"]) &&
    answers["cms_tools"].length > 0
  );
}

export default function Group04({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Tech Stack Tools</h2>
        <p className="text-gray-600">
          Select the tools you currently use in each category. This helps us provide more relevant recommendations.
        </p>
      </div>

      <MultiSelectQuestion
        question="CRM Tools"
        options={[
          { value: "salesforce", label: "Salesforce" },
          { value: "hubspot", label: "HubSpot" },
          { value: "zoho", label: "Zoho CRM" },
          { value: "pipedrive", label: "Pipedrive" },
          { value: "freshsales", label: "Freshsales" },
          { value: "zendesk", label: "Zendesk Sell" },
          { value: "other", label: "Other" },
        ]}
        selected={getStringArrayAnswer(answers["crm_tools"])}
        onChange={(val) => onAnswer("crm_tools", val)}
        maxSelect={5}
      />

      <MultiSelectQuestion
        question="Email Service Providers"
        options={[
          { value: "mailchimp", label: "Mailchimp" },
          { value: "klaviyo", label: "Klaviyo" },
          { value: "emarsys", label: "SAP Emarsys" },
          { value: "sendgrid", label: "SendGrid" },
          { value: "customerio", label: "Customer.io" },
          { value: "activecampaign", label: "ActiveCampaign" },
          { value: "other", label: "Other" },
        ]}
        selected={getStringArrayAnswer(answers["esp_tools"])}
        onChange={(val) => onAnswer("esp_tools", val)}
        maxSelect={5}
      />

      <MultiSelectQuestion
        question="Analytics Tools"
        options={[
          { value: "ga4", label: "Google Analytics 4" },
          { value: "mixpanel", label: "Mixpanel" },
          { value: "segment", label: "Segment" },
          { value: "hotjar", label: "Hotjar" },
          { value: "amplitude", label: "Amplitude" },
          { value: "heap", label: "Heap" },
          { value: "other", label: "Other" },
        ]}
        selected={getStringArrayAnswer(answers["analytics_tools"])}
        onChange={(val) => onAnswer("analytics_tools", val)}
        maxSelect={5}
      />

      <MultiSelectQuestion
        question="Content Management Systems"
        options={[
          { value: "wordpress", label: "WordPress" },
          { value: "webflow", label: "Webflow" },
          { value: "shopify", label: "Shopify" },
          { value: "squarespace", label: "Squarespace" },
          { value: "wix", label: "Wix" },
          { value: "drupal", label: "Drupal" },
          { value: "other", label: "Other" },
        ]}
        selected={getStringArrayAnswer(answers["cms_tools"])}
        onChange={(val) => onAnswer("cms_tools", val)}
        maxSelect={5}
      />
    </div>
  );
} 