//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group03_Operations.tsx
"use client";

import React, { useState, useMemo } from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; 
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

// Categorized tech stack options
const TECH_STACK_OPTIONS: Record<string, { value: string; label: string }[]> = {
  "CRM & Sales": [
    { value: "salesforce", label: "Salesforce" },
    { value: "hubspot_crm", label: "HubSpot CRM" },
    { value: "pipedrive", label: "Pipedrive" },
    { value: "zoho_crm", label: "Zoho CRM" },
    { value: "microsoft_dynamics", label: "Microsoft Dynamics 365" },
    { value: "oracle_netsuite_crm", label: "Oracle NetSuite CRM" },
    { value: "sap_sales_cloud", label: "SAP Sales Cloud" },
    { value: "sugarcrm", label: "SugarCRM" },
    { value: "freshsales", label: "Freshsales" },
    { value: "close_crm", label: "Close CRM" },
    { value: "copper", label: "Copper" },
    { value: "zendesk_sell", label: "Zendesk Sell" },
    { value: "monday_crm", label: "Monday.com CRM" },
    { value: "nimble", label: "Nimble" },
    { value: "nutshell", label: "Nutshell" },
    { value: "insightly", label: "Insightly" },
    { value: "keap", label: "Keap (formerly Infusionsoft)" },
    { value: "less_annoying_crm", label: "Less Annoying CRM" },
    { value: "capsule_crm", label: "Capsule CRM" },
    { value: "vtiger", label: "Vtiger" },
    { value: "creatio", label: "Creatio" },
    { value: "agile_crm", label: "Agile CRM" },
    { value: "apptivo", label: "Apptivo" },
    { value: "bigin_zoho", label: "Bigin by Zoho CRM" },
  ],
  "Marketing & Email": [
    { value: "mailchimp", label: "Mailchimp" },
    { value: "klaviyo", label: "Klaviyo" },
    { value: "activecampaign", label: "ActiveCampaign" },
    { value: "hubspot_marketing", label: "HubSpot Marketing Hub" },
    { value: "salesforce_marketing_cloud", label: "Salesforce Marketing Cloud" },
    { value: "oracle_eloqua", label: "Oracle Eloqua" },
    { value: "sap_emarsys", label: "SAP Emarsys" },
    { value: "emarsys", label: "Emarsys" },
    { value: "braze", label: "Braze" },
    { value: "iterable", label: "Iterable" },
    { value: "blueshift", label: "Blueshift" },
    { value: "campaign_monitor", label: "Campaign Monitor" },
    { value: "constant_contact", label: "Constant Contact" },
    { value: "getresponse", label: "GetResponse" },
    { value: "drip", label: "Drip" },
    { value: "aweber", label: "AWeber" },
    { value: "benchmark_email", label: "Benchmark Email" },
    { value: "mailerlite", label: "MailerLite" },
    { value: "mailjet", label: "Mailjet" },
    { value: "sendinblue", label: "Sendinblue (Brevo)" },
    { value: "sharpspring", label: "SharpSpring" },
    { value: "dotdigital", label: "dotdigital" },
    { value: "listrak", label: "Listrak" },
    { value: "moosend", label: "Moosend" },
    { value: "omnisend", label: "Omnisend" },
    { value: "acoustic_campaign", label: "Acoustic Campaign" },
    { value: "adobe_campaign", label: "Adobe Campaign" },
  ],
  "Ecommerce & POS": [
    { value: "shopify", label: "Shopify" },
    { value: "woocommerce", label: "WooCommerce" },
    { value: "magento", label: "Magento" },
    { value: "bigcommerce", label: "BigCommerce" },
    { value: "squarespace", label: "Squarespace" },
    { value: "wix", label: "Wix" },
    { value: "prestashop", label: "PrestaShop" },
    { value: "opencart", label: "OpenCart" },
    { value: "volusion", label: "Volusion" },
    { value: "3dcart", label: "3dcart" },
    { value: "ecwid", label: "Ecwid" },
    { value: "square", label: "Square" },
    { value: "stripe", label: "Stripe" },
    { value: "paypal", label: "PayPal" },
    { value: "quickbooks_commerce", label: "QuickBooks Commerce" },
  ],
  "Analytics & BI": [
    { value: "google_analytics", label: "Google Analytics (GA4)" },
    { value: "looker", label: "Looker" },
    { value: "tableau", label: "Tableau" },
    { value: "power_bi", label: "Power BI" },
    { value: "domo", label: "Domo" },
    { value: "mixpanel", label: "Mixpanel" },
    { value: "amplitude", label: "Amplitude" },
    { value: "hotjar", label: "Hotjar" },
    { value: "fullstory", label: "FullStory" },
    { value: "heap", label: "Heap" },
    { value: "segment", label: "Segment" },
    { value: "metabase", label: "Metabase" },
    { value: "redash", label: "Redash" },
    { value: "sisense", label: "Sisense" },
    { value: "qlik_sense", label: "Qlik Sense" },
    { value: "zoho_analytics", label: "Zoho Analytics" },
    { value: "adobe_analytics", label: "Adobe Analytics" },
    { value: "kissmetrics", label: "Kissmetrics" },
    { value: "crazy_egg", label: "Crazy Egg" },
    { value: "matomo", label: "Matomo" },
    { value: "piwik_pro", label: "Piwik PRO" },
    { value: "plausible_analytics", label: "Plausible Analytics" },
    { value: "snowplow", label: "Snowplow" },
    { value: "countly", label: "Countly" },
    { value: "chartio", label: "Chartio" },
  ],
  "Project Management": [
    { value: "asana", label: "Asana" },
    { value: "trello", label: "Trello" },
    { value: "monday", label: "Monday.com" },
    { value: "clickup", label: "ClickUp" },
    { value: "notion", label: "Notion" },
    { value: "slack", label: "Slack" },
    { value: "microsoft_teams", label: "Microsoft Teams" },
    { value: "zoom", label: "Zoom" },
    { value: "google_workspace", label: "Google Workspace" },
    { value: "microsoft_365", label: "Microsoft 365" },
    { value: "jira", label: "Jira" },
    { value: "confluence", label: "Confluence" },
    { value: "basecamp", label: "Basecamp" },
    { value: "wrike", label: "Wrike" },
    { value: "smartsheet", label: "Smartsheet" },
    { value: "airtable", label: "Airtable" },
    { value: "figma", label: "Figma" },
    { value: "canva", label: "Canva" },
    { value: "mural", label: "Mural" },
    { value: "miro", label: "Miro" },
  ],
  "Finance & Accounting": [
    { value: "quickbooks", label: "QuickBooks" },
    { value: "oracle_netsuite", label: "Oracle NetSuite" },
    { value: "sap_business_one", label: "SAP Business One" },
    { value: "xero", label: "Xero" },
    { value: "freshbooks", label: "FreshBooks" },
    { value: "wave", label: "Wave" },
    { value: "sage", label: "Sage" },
    { value: "bill_com", label: "Bill.com" },
    { value: "expensify", label: "Expensify" },
    { value: "gusto", label: "Gusto" },
    { value: "bamboo_hr", label: "BambooHR" },
    { value: "workday", label: "Workday" },
    { value: "adp", label: "ADP" },
    { value: "paychex", label: "Paychex" },
    { value: "square_payroll", label: "Square Payroll" },
  ],
  "Customer Support": [
    { value: "zendesk", label: "Zendesk" },
    { value: "intercom", label: "Intercom" },
    { value: "freshdesk", label: "Freshdesk" },
    { value: "help_scout", label: "Help Scout" },
    { value: "desk_com", label: "Desk.com" },
    { value: "kayako", label: "Kayako" },
    { value: "livechat", label: "LiveChat" },
    { value: "drift", label: "Drift" },
    { value: "crisp", label: "Crisp" },
    { value: "tawk_to", label: "Tawk.to" },
    { value: "olark", label: "Olark" },
    { value: "zoho_desk", label: "Zoho Desk" },
    { value: "salesforce_service_cloud", label: "Salesforce Service Cloud" },
    { value: "hubspot_service_hub", label: "HubSpot Service Hub" },
    { value: "freshservice", label: "Freshservice" },
    { value: "jira_service_management", label: "Jira Service Management" },
  ],
  "Customer Data Platforms": [
    { value: "segment", label: "Segment" },
    { value: "mparticle", label: "mParticle" },
    { value: "rudderstack", label: "RudderStack" },
    { value: "salesforce_data_cloud", label: "Salesforce Data Cloud" },
    { value: "oracle_unity", label: "Oracle Unity" },
    { value: "sap_customer_data_cloud", label: "SAP Customer Data Cloud" },
    { value: "adobe_real_time_cdp", label: "Adobe Real-Time CDP" },
    { value: "actioniq", label: "ActionIQ" },
    { value: "amperity", label: "Amperity" },
    { value: "blueconic", label: "BlueConic" },
    { value: "lexer", label: "Lexer" },
    { value: "lytics", label: "Lytics" },
    { value: "tealium_audiencestream", label: "Tealium AudienceStream" },
    { value: "bloomreach_engagement", label: "Bloomreach Engagement" },
    { value: "celebrus", label: "Celebrus" },
    { value: "commanders_act", label: "Commanders Act" },
    { value: "exponea", label: "Exponea (Bloomreach)" },
    { value: "meiro", label: "Meiro" },
    { value: "metarouter", label: "MetaRouter" },
    { value: "ngdata", label: "NGDATA" },
    { value: "simon_data", label: "Simon Data" },
    { value: "totango", label: "Totango" },
    { value: "treasure_data", label: "Treasure Data" },
    { value: "zeotap", label: "Zeotap" },
    { value: "zeta_global", label: "Zeta Global" },
  ],
  "Other Tools": [
    { value: "other", label: "Other (please describe)" },
  ]
};

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
  const [selectedCategory, setSelectedCategory] = useState<string>("CRM & Sales");
  const [search, setSearch] = useState("");
  const techSelected: string[] = Array.isArray(answers["tech_stack"]) ? (answers["tech_stack"] as string[]) : [];

  // Flatten all options for the multi-select component
  const allOptions: { value: string; label: string }[] = useMemo(() => Object.values(TECH_STACK_OPTIONS).flat(), []);

  // Filtered options for search
  const filteredOptions: { value: string; label: string }[] = useMemo(() => {
    if (!search.trim()) return TECH_STACK_OPTIONS[selectedCategory] || [];
    return (TECH_STACK_OPTIONS[selectedCategory] || []).filter((option: { value: string; label: string }) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Question 1: Tech Stack Overview */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            What platforms or tools are central to your operations?
          </h3>
          <p className="text-gray-600 mb-4">
            Select the platforms you actively use. Browse by category or search for specific tools. Enjoy a modern, fast, and accessible experience.
          </p>
        </div>
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(TECH_STACK_OPTIONS).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedCategory === category
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Search for a tool..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search for a tool"
          />
        </div>
        {/* Category-specific selection */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">{selectedCategory}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredOptions.length === 0 && (
              <span className="text-gray-400 col-span-full">No tools found.</span>
            )}
            {filteredOptions.map((option: { value: string; label: string }) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors group shadow-sm ${
                  techSelected.includes(option.value)
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
                tabIndex={0}
                aria-checked={techSelected.includes(option.value)}
              >
                <input
                  type="checkbox"
                  checked={techSelected.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onAnswer("tech_stack", [...techSelected, option.value]);
                    } else {
                      onAnswer("tech_stack", techSelected.filter((item: string) => item !== option.value));
                    }
                  }}
                  className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label={option.label}
                />
                <span className="text-base font-medium text-gray-900 group-hover:text-blue-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Selected tools summary */}
        {techSelected.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-4 shadow-inner">
            <h4 className="font-semibold text-blue-900 mb-2">
              Selected Tools ({techSelected.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {techSelected.map((tool: string) => {
                const toolInfo = allOptions.find((opt: { value: string; label: string }) => opt.value === tool);
                return (
                  <span
                    key={tool}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                  >
                    {toolInfo?.label || tool}
                    <button
                      onClick={() => onAnswer("tech_stack", techSelected.filter((item: string) => item !== tool))}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      aria-label={`Remove ${toolInfo?.label || tool}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Conditionally show "Other" field */}
      {Array.isArray(answers["tech_stack"]) && answers["tech_stack"].includes("other") && (
        <TextAreaQuestion
          question="Please describe the other platforms or tools that are central to your operations"
          placeholder="Describe any additional platforms or tools used..."
          value={getStringAnswer(answers["tech_stack_other"])}
          onChange={(val) => onAnswer("tech_stack_other", val)}
          maxLength={200}
        />
      )}
      {/* Question 2: Rank Business Priorities */}
      <DragSortQuestion
        question="Rank the following priorities from most to least important to your business right now."
        description="Drag to reorder. Top = most important."
        items={
          Array.isArray(answers["business_priorities"])
            ? answers["business_priorities"]
            : ["Growth", "Profitability", "Efficiency", "Innovation", "Brand Equity"]
        }
        onChange={(val) => onAnswer("business_priorities", val)}
      />
      {/* Question 3: Process Maturity */}
      <MultipleChoiceQuestion
        question="Describe your internal process discipline."
        description="Select the statement that best reflects your company today."
        options={[
          { value: "1", label: "Everything is ad hoc" },
          { value: "2", label: "Some structure, but mostly reactive" },
          { value: "3", label: "We have defined processes, but they're not consistently followed" },
          { value: "4", label: "Most departments follow documented processes" },
          { value: "5", label: "Processes are standardized, automated, and continuously optimized" },
        ]}
        value={getStringAnswer(answers["process_discipline"])}
        onChange={(val) => onAnswer("process_discipline", val)}
      />
    </div>
  );
}
