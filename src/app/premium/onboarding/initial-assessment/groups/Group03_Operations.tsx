//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group03_Operations.tsx
"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; 
import {
  getStringAnswer,
  getStringArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup03Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["tech_stack"]) && answers["tech_stack"].length > 0 &&

    Array.isArray(answers["business_priorities"]) && answers["business_priorities"].length > 0 &&

    typeof answers["process_discipline"] === "string" && answers["process_discipline"].trim().length > 0
  );
}


type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group03_Operations({ answers, onAnswer }: Props) {
  const techSelected = getStringArrayAnswer(answers["tech_stack"]);

  // Enhanced categorized tech stack options
  const techStackOptions = [
    // CRM & Sales
    { value: "salesforce", label: "Salesforce", category: "CRM & Sales" },
    { value: "hubspot", label: "HubSpot", category: "CRM & Sales" },
    { value: "pipedrive", label: "Pipedrive", category: "CRM & Sales" },
    { value: "zoho_crm", label: "Zoho CRM", category: "CRM & Sales" },
    { value: "freshsales", label: "Freshsales", category: "CRM & Sales" },
    
    // Marketing & Email
    { value: "mailchimp", label: "Mailchimp", category: "Marketing & Email" },
    { value: "klaviyo", label: "Klaviyo", category: "Marketing & Email" },
    { value: "convertkit", label: "ConvertKit", category: "Marketing & Email" },
    { value: "active_campaign", label: "ActiveCampaign", category: "Marketing & Email" },
    { value: "drip", label: "Drip", category: "Marketing & Email" },
    
    // Analytics & Data
    { value: "google_analytics", label: "Google Analytics", category: "Analytics & Data" },
    { value: "mixpanel", label: "Mixpanel", category: "Analytics & Data" },
    { value: "amplitude", label: "Amplitude", category: "Analytics & Data" },
    { value: "hotjar", label: "Hotjar", category: "Analytics & Data" },
    { value: "fullstory", label: "FullStory", category: "Analytics & Data" },
    
    // E-commerce & Payments
    { value: "shopify", label: "Shopify", category: "E-commerce & Payments" },
    { value: "woocommerce", label: "WooCommerce", category: "E-commerce & Payments" },
    { value: "stripe", label: "Stripe", category: "E-commerce & Payments" },
    { value: "paypal", label: "PayPal", category: "E-commerce & Payments" },
    { value: "square", label: "Square", category: "E-commerce & Payments" },
    
    // Project Management
    { value: "asana", label: "Asana", category: "Project Management" },
    { value: "trello", label: "Trello", category: "Project Management" },
    { value: "monday", label: "Monday.com", category: "Project Management" },
    { value: "clickup", label: "ClickUp", category: "Project Management" },
    { value: "notion", label: "Notion", category: "Project Management" },
    
    // Communication & Collaboration
    { value: "slack", label: "Slack", category: "Communication & Collaboration" },
    { value: "microsoft_teams", label: "Microsoft Teams", category: "Communication & Collaboration" },
    { value: "zoom", label: "Zoom", category: "Communication & Collaboration" },
    { value: "discord", label: "Discord", category: "Communication & Collaboration" },
    { value: "google_meet", label: "Google Meet", category: "Communication & Collaboration" },
    
    // Customer Support
    { value: "zendesk", label: "Zendesk", category: "Customer Support" },
    { value: "intercom", label: "Intercom", category: "Customer Support" },
    { value: "freshdesk", label: "Freshdesk", category: "Customer Support" },
    { value: "help_scout", label: "Help Scout", category: "Customer Support" },
    { value: "crisp", label: "Crisp", category: "Customer Support" },
    
    // Accounting & Finance
    { value: "quickbooks", label: "QuickBooks", category: "Accounting & Finance" },
    { value: "xero", label: "Xero", category: "Accounting & Finance" },
    { value: "freshbooks", label: "FreshBooks", category: "Accounting & Finance" },
    { value: "wave", label: "Wave", category: "Accounting & Finance" },
    { value: "sage", label: "Sage", category: "Accounting & Finance" },
    
    // Development & Design
    { value: "github", label: "GitHub", category: "Development & Design" },
    { value: "figma", label: "Figma", category: "Development & Design" },
    { value: "canva", label: "Canva", category: "Development & Design" },
    { value: "adobe_creative", label: "Adobe Creative Suite", category: "Development & Design" },
    { value: "sketch", label: "Sketch", category: "Development & Design" },
    
    // Automation & Integration
    { value: "zapier", label: "Zapier", category: "Automation & Integration" },
    { value: "make", label: "Make (Integromat)", category: "Automation & Integration" },
    { value: "ifttt", label: "IFTTT", category: "Automation & Integration" },
    { value: "automate_io", label: "Automate.io", category: "Automation & Integration" },
    { value: "n8n", label: "n8n", category: "Automation & Integration" },
    
    // Cloud & Infrastructure
    { value: "aws", label: "Amazon Web Services", category: "Cloud & Infrastructure" },
    { value: "google_cloud", label: "Google Cloud Platform", category: "Cloud & Infrastructure" },
    { value: "azure", label: "Microsoft Azure", category: "Cloud & Infrastructure" },
    { value: "digitalocean", label: "DigitalOcean", category: "Cloud & Infrastructure" },
    { value: "heroku", label: "Heroku", category: "Cloud & Infrastructure" },
    
    // Social Media & Content
    { value: "buffer", label: "Buffer", category: "Social Media & Content" },
    { value: "hootsuite", label: "Hootsuite", category: "Social Media & Content" },
    { value: "later", label: "Later", category: "Social Media & Content" },
    { value: "canva_pro", label: "Canva Pro", category: "Social Media & Content" },
    { value: "unsplash", label: "Unsplash", category: "Social Media & Content" },
    
    // HR & Recruitment
    { value: "bamboo_hr", label: "BambooHR", category: "HR & Recruitment" },
    { value: "workday", label: "Workday", category: "HR & Recruitment" },
    { value: "greenhouse", label: "Greenhouse", category: "HR & Recruitment" },
    { value: "lever", label: "Lever", category: "HR & Recruitment" },
    { value: "gusto", label: "Gusto", category: "HR & Recruitment" },
    
    // Other Tools
    { value: "google_workspace", label: "Google Workspace", category: "Productivity" },
    { value: "microsoft_365", label: "Microsoft 365", category: "Productivity" },
    { value: "dropbox", label: "Dropbox", category: "File Storage" },
    { value: "box", label: "Box", category: "File Storage" },
    { value: "airtable", label: "Airtable", category: "Database & Spreadsheets" },
    { value: "typeform", label: "Typeform", category: "Forms & Surveys" },
    { value: "calendly", label: "Calendly", category: "Scheduling" },
    { value: "acuity", label: "Acuity Scheduling", category: "Scheduling" },
    { value: "lastpass", label: "LastPass", category: "Security" },
    { value: "1password", label: "1Password", category: "Security" },
  ];

  return (
    <div className="space-y-12">
      {/* Question 1: Enhanced Tech Stack Overview */}
      <MultiSelectQuestion
        question="What platforms or tools are central to your operations?"
        description="Select the tools your team uses most frequently. This helps us understand your current tech ecosystem and identify optimization opportunities."
        options={techStackOptions}
        selected={techSelected}
        onChange={(val) => onAnswer("tech_stack", val)}
        maxSelect={15}
        showCategories={true}
        allowReorder={true}
      />

      {/* Question 2: Business Priorities */}
      <DragSortQuestion
        question="Rank your top business priorities for the next 12 months"
        description="Drag and drop to reorder. What matters most to your business right now?"
        items={
          getStringArrayAnswer(answers["business_priorities"]).length > 0
            ? getStringArrayAnswer(answers["business_priorities"])
            : ["revenue_growth", "customer_acquisition", "customer_retention", "operational_efficiency", "product_development", "market_expansion", "team_scaling", "process_automation", "brand_building", "cost_optimization"]
        }
        onChange={(val) => onAnswer("business_priorities", val)}
      />

      {/* Question 3: Process Discipline */}
      <MultipleChoiceQuestion
        question="How would you describe your team's approach to processes and workflows?"
        description="This helps us understand your operational maturity and identify areas for improvement."
        options={[
          { 
            value: "1", 
            label: "Ad-hoc & Reactive", 
            description: "We handle things as they come up, with minimal formal processes"
          },
          { 
            value: "2", 
            label: "Basic & Informal", 
            description: "We have some processes but they're not consistently followed"
          },
          { 
            value: "3", 
            label: "Structured & Documented", 
            description: "We have clear processes that are documented and mostly followed"
          },
          { 
            value: "4", 
            label: "Optimized & Automated", 
            description: "Our processes are well-optimized and heavily automated"
          },
          { 
            value: "5", 
            label: "Data-Driven & Predictive", 
            description: "We use data and AI to continuously improve and predict outcomes"
          },
        ]}
        value={getStringAnswer(answers["process_discipline"])}
        onChange={(val) => onAnswer("process_discipline", val)}
        required={true}
      />
    </div>
  );
}
