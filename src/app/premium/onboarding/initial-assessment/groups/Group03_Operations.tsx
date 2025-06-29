//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group03_Operations.tsx
"use client";

import React, { useState, useMemo } from "react";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion"; 
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";

// Categorized tech stack options
const TECH_STACK_OPTIONS: Record<string, { value: string; label: string; description?: string }[]> = {
  "CRM & Sales": [
    { value: "salesforce", label: "Salesforce", description: "Enterprise CRM platform" },
    { value: "hubspot_crm", label: "HubSpot CRM", description: "All-in-one CRM solution" },
    { value: "pipedrive", label: "Pipedrive", description: "Sales-focused CRM" },
    { value: "zoho_crm", label: "Zoho CRM", description: "Comprehensive CRM suite" },
    { value: "microsoft_dynamics", label: "Microsoft Dynamics 365", description: "Enterprise business applications" },
    { value: "oracle_netsuite_crm", label: "Oracle NetSuite CRM", description: "Cloud ERP with CRM" },
    { value: "sap_sales_cloud", label: "SAP Sales Cloud", description: "Enterprise sales solution" },
    { value: "sugarcrm", label: "SugarCRM", description: "Flexible CRM platform" },
    { value: "freshsales", label: "Freshsales", description: "AI-powered CRM" },
    { value: "close_crm", label: "Close CRM", description: "Built for inside sales" },
    { value: "copper", label: "Copper", description: "CRM for Google Workspace" },
    { value: "zendesk_sell", label: "Zendesk Sell", description: "CRM with customer service integration" },
    { value: "monday_crm", label: "Monday.com CRM", description: "Visual CRM platform" },
    { value: "nimble", label: "Nimble", description: "Social CRM solution" },
    { value: "nutshell", label: "Nutshell", description: "Simple CRM for small teams" },
    { value: "insightly", label: "Insightly", description: "CRM with project management" },
    { value: "keap", label: "Keap (formerly Infusionsoft)", description: "CRM with marketing automation" },
    { value: "less_annoying_crm", label: "Less Annoying CRM", description: "Simple CRM for small businesses" },
    { value: "capsule_crm", label: "Capsule CRM", description: "Simple contact management" },
    { value: "vtiger", label: "Vtiger", description: "Open-source CRM" },
    { value: "creatio", label: "Creatio", description: "Low-code CRM platform" },
    { value: "agile_crm", label: "Agile CRM", description: "All-in-one CRM" },
    { value: "apptivo", label: "Apptivo", description: "Business app suite" },
    { value: "bigin_zoho", label: "Bigin by Zoho CRM", description: "Simple CRM from Zoho" },
  ],
  "Marketing & Email": [
    { value: "mailchimp", label: "Mailchimp", description: "Email marketing platform" },
    { value: "klaviyo", label: "Klaviyo", description: "Ecommerce marketing automation" },
    { value: "activecampaign", label: "ActiveCampaign", description: "Marketing automation platform" },
    { value: "hubspot_marketing", label: "HubSpot Marketing Hub", description: "All-in-one marketing platform" },
    { value: "salesforce_marketing_cloud", label: "Salesforce Marketing Cloud", description: "Enterprise marketing automation" },
    { value: "oracle_eloqua", label: "Oracle Eloqua", description: "B2B marketing automation" },
    { value: "sap_emarsys", label: "SAP Emarsys", description: "Customer engagement platform" },
    { value: "emarsys", label: "Emarsys", description: "Marketing automation" },
    { value: "braze", label: "Braze", description: "Customer engagement platform" },
    { value: "iterable", label: "Iterable", description: "Cross-channel marketing platform" },
    { value: "blueshift", label: "Blueshift", description: "AI-powered marketing" },
    { value: "campaign_monitor", label: "Campaign Monitor", description: "Email marketing platform" },
    { value: "constant_contact", label: "Constant Contact", description: "Email marketing for small business" },
    { value: "getresponse", label: "GetResponse", description: "Marketing automation platform" },
    { value: "drip", label: "Drip", description: "Ecommerce marketing automation" },
    { value: "aweber", label: "AWeber", description: "Email marketing platform" },
    { value: "benchmark_email", label: "Benchmark Email", description: "Email marketing solution" },
    { value: "mailerlite", label: "MailerLite", description: "Email marketing platform" },
    { value: "mailjet", label: "Mailjet", description: "Email service provider" },
    { value: "sendinblue", label: "Sendinblue (Brevo)", description: "Digital marketing platform" },
    { value: "sharpspring", label: "SharpSpring", description: "Marketing automation platform" },
    { value: "dotdigital", label: "dotdigital", description: "Customer engagement platform" },
    { value: "listrak", label: "Listrak", description: "Retail marketing platform" },
    { value: "moosend", label: "Moosend", description: "Email marketing platform" },
    { value: "omnisend", label: "Omnisend", description: "Ecommerce marketing automation" },
    { value: "acoustic_campaign", label: "Acoustic Campaign", description: "Marketing automation platform" },
    { value: "adobe_campaign", label: "Adobe Campaign", description: "Cross-channel campaign orchestration" },
  ],
  "Ecommerce & POS": [
    { value: "shopify", label: "Shopify", description: "Ecommerce platform" },
    { value: "woocommerce", label: "WooCommerce", description: "WordPress ecommerce plugin" },
    { value: "magento", label: "Magento", description: "Enterprise ecommerce platform" },
    { value: "bigcommerce", label: "BigCommerce", description: "SaaS ecommerce platform" },
    { value: "squarespace", label: "Squarespace", description: "Website builder with ecommerce" },
    { value: "wix", label: "Wix", description: "Website builder with ecommerce" },
    { value: "prestashop", label: "PrestaShop", description: "Open-source ecommerce platform" },
    { value: "opencart", label: "OpenCart", description: "Open-source ecommerce platform" },
    { value: "volusion", label: "Volusion", description: "Ecommerce platform" },
    { value: "3dcart", label: "3dcart", description: "Ecommerce platform" },
    { value: "ecwid", label: "Ecwid", description: "Ecommerce widget" },
    { value: "square", label: "Square", description: "Payment processing and POS" },
    { value: "stripe", label: "Stripe", description: "Payment processing platform" },
    { value: "paypal", label: "PayPal", description: "Payment processing" },
    { value: "quickbooks_commerce", label: "QuickBooks Commerce", description: "Ecommerce and inventory management" },
  ],
  "Analytics & BI": [
    { value: "google_analytics", label: "Google Analytics (GA4)", description: "Web analytics platform" },
    { value: "looker", label: "Looker", description: "Business intelligence platform" },
    { value: "tableau", label: "Tableau", description: "Data visualization platform" },
    { value: "power_bi", label: "Power BI", description: "Microsoft business analytics" },
    { value: "domo", label: "Domo", description: "Business intelligence platform" },
    { value: "mixpanel", label: "Mixpanel", description: "Product analytics platform" },
    { value: "amplitude", label: "Amplitude", description: "Product analytics platform" },
    { value: "hotjar", label: "Hotjar", description: "User behavior analytics" },
    { value: "fullstory", label: "FullStory", description: "Digital experience analytics" },
    { value: "heap", label: "Heap", description: "Automatic event tracking" },
    { value: "segment", label: "Segment", description: "Customer data platform" },
    { value: "metabase", label: "Metabase", description: "Open-source business intelligence" },
    { value: "redash", label: "Redash", description: "Data visualization platform" },
    { value: "sisense", label: "Sisense", description: "Business intelligence platform" },
    { value: "qlik_sense", label: "Qlik Sense", description: "Data analytics platform" },
    { value: "zoho_analytics", label: "Zoho Analytics", description: "Business intelligence platform" },
    { value: "adobe_analytics", label: "Adobe Analytics", description: "Digital analytics platform" },
    { value: "kissmetrics", label: "Kissmetrics", description: "Product analytics platform" },
    { value: "crazy_egg", label: "Crazy Egg", description: "Website optimization tools" },
    { value: "matomo", label: "Matomo", description: "Privacy-focused analytics" },
    { value: "piwik_pro", label: "Piwik PRO", description: "Privacy-compliant analytics" },
    { value: "plausible_analytics", label: "Plausible Analytics", description: "Privacy-focused web analytics" },
    { value: "snowplow", label: "Snowplow", description: "Data collection platform" },
    { value: "countly", label: "Countly", description: "Product analytics platform" },
    { value: "chartio", label: "Chartio", description: "Data visualization platform" },
  ],
  "Project Management": [
    { value: "asana", label: "Asana", description: "Project management platform" },
    { value: "trello", label: "Trello", description: "Visual project management" },
    { value: "monday", label: "Monday.com", description: "Work operating system" },
    { value: "clickup", label: "ClickUp", description: "All-in-one productivity platform" },
    { value: "notion", label: "Notion", description: "All-in-one workspace" },
    { value: "slack", label: "Slack", description: "Team communication platform" },
    { value: "microsoft_teams", label: "Microsoft Teams", description: "Team collaboration platform" },
    { value: "zoom", label: "Zoom", description: "Video conferencing platform" },
    { value: "google_workspace", label: "Google Workspace", description: "Productivity suite" },
    { value: "microsoft_365", label: "Microsoft 365", description: "Productivity suite" },
    { value: "jira", label: "Jira", description: "Project management for software teams" },
    { value: "confluence", label: "Confluence", description: "Team workspace" },
    { value: "basecamp", label: "Basecamp", description: "Project management platform" },
    { value: "wrike", label: "Wrike", description: "Project management platform" },
    { value: "smartsheet", label: "Smartsheet", description: "Work execution platform" },
    { value: "airtable", label: "Airtable", description: "Database and project management" },
    { value: "figma", label: "Figma", description: "Design collaboration platform" },
    { value: "canva", label: "Canva", description: "Design platform" },
    { value: "mural", label: "Mural", description: "Digital workspace for visual collaboration" },
    { value: "miro", label: "Miro", description: "Visual collaboration platform" },
  ],
  "Finance & Accounting": [
    { value: "quickbooks", label: "QuickBooks", description: "Accounting software" },
    { value: "oracle_netsuite", label: "Oracle NetSuite", description: "Cloud ERP system" },
    { value: "sap_business_one", label: "SAP Business One", description: "ERP for small businesses" },
    { value: "xero", label: "Xero", description: "Cloud accounting platform" },
    { value: "freshbooks", label: "FreshBooks", description: "Accounting software for small business" },
    { value: "wave", label: "Wave", description: "Free accounting software" },
    { value: "sage", label: "Sage", description: "Business management software" },
    { value: "bill_com", label: "Bill.com", description: "AP/AR automation platform" },
    { value: "expensify", label: "Expensify", description: "Expense management platform" },
    { value: "gusto", label: "Gusto", description: "HR and payroll platform" },
    { value: "bamboo_hr", label: "BambooHR", description: "HR software platform" },
    { value: "workday", label: "Workday", description: "Enterprise HR and finance platform" },
    { value: "adp", label: "ADP", description: "HR and payroll services" },
    { value: "paychex", label: "Paychex", description: "HR and payroll services" },
    { value: "square_payroll", label: "Square Payroll", description: "Payroll software" },
  ],
  "Customer Support": [
    { value: "zendesk", label: "Zendesk", description: "Customer service platform" },
    { value: "intercom", label: "Intercom", description: "Customer messaging platform" },
    { value: "freshdesk", label: "Freshdesk", description: "Customer support software" },
    { value: "help_scout", label: "Help Scout", description: "Customer support platform" },
    { value: "desk_com", label: "Desk.com", description: "Customer support platform" },
    { value: "kayako", label: "Kayako", description: "Customer service platform" },
    { value: "livechat", label: "LiveChat", description: "Live chat software" },
    { value: "drift", label: "Drift", description: "Conversational marketing platform" },
    { value: "crisp", label: "Crisp", description: "Customer messaging platform" },
    { value: "tawk_to", label: "Tawk.to", description: "Live chat platform" },
    { value: "olark", label: "Olark", description: "Live chat software" },
    { value: "zoho_desk", label: "Zoho Desk", description: "Customer service platform" },
    { value: "salesforce_service_cloud", label: "Salesforce Service Cloud", description: "Customer service platform" },
    { value: "hubspot_service_hub", label: "HubSpot Service Hub", description: "Customer service platform" },
    { value: "freshservice", label: "Freshservice", description: "IT service management" },
    { value: "jira_service_management", label: "Jira Service Management", description: "IT service management" },
  ],
  "Customer Data Platforms": [
    { value: "segment", label: "Segment", description: "Customer data platform" },
    { value: "mparticle", label: "mParticle", description: "Customer data platform" },
    { value: "rudderstack", label: "RudderStack", description: "Customer data platform" },
    { value: "salesforce_data_cloud", label: "Salesforce Data Cloud", description: "Customer data platform" },
    { value: "oracle_unity", label: "Oracle Unity", description: "Customer data platform" },
    { value: "sap_customer_data_cloud", label: "SAP Customer Data Cloud", description: "Customer data platform" },
    { value: "adobe_real_time_cdp", label: "Adobe Real-Time CDP", description: "Customer data platform" },
    { value: "actioniq", label: "ActionIQ", description: "Customer data platform" },
    { value: "amperity", label: "Amperity", description: "Customer data platform" },
    { value: "blueconic", label: "BlueConic", description: "Customer data platform" },
    { value: "lexer", label: "Lexer", description: "Customer data platform" },
    { value: "lytics", label: "Lytics", description: "Customer data platform" },
    { value: "tealium_audiencestream", label: "Tealium AudienceStream", description: "Customer data platform" },
    { value: "bloomreach_engagement", label: "Bloomreach Engagement", description: "Customer data platform" },
    { value: "celebrus", label: "Celebrus", description: "Customer data platform" },
    { value: "commanders_act", label: "Commanders Act", description: "Customer data platform" },
    { value: "exponea", label: "Exponea (Bloomreach)", description: "Customer data platform" },
    { value: "meiro", label: "Meiro", description: "Customer data platform" },
    { value: "metarouter", label: "MetaRouter", description: "Customer data platform" },
    { value: "ngdata", label: "NGDATA", description: "Customer data platform" },
    { value: "simon_data", label: "Simon Data", description: "Customer data platform" },
    { value: "totango", label: "Totango", description: "Customer data platform" },
    { value: "treasure_data", label: "Treasure Data", description: "Customer data platform" },
    { value: "zeotap", label: "Zeotap", description: "Customer data platform" },
    { value: "zeta_global", label: "Zeta Global", description: "Customer data platform" },
  ],
  "Other Tools": [
    { value: "other", label: "Other (please describe)", description: "Custom tools specific to your business" },
  ],
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
        <EnhancedTextAreaQuestion
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
      <EnhancedMultipleChoiceQuestion
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
