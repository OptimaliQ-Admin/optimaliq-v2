"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TechOption {
  value: string;
  label: string;
  description?: string;
  category: string;
}

interface Props {
  question: string;
  description?: string;
  selected: string[];
  onChange: (values: string[]) => void;
  maxSelect?: number;
}

const TECH_STACK_CATEGORIES = {
  "CRM & Sales": [
    { value: "salesforce", label: "Salesforce", description: "Enterprise CRM platform" },
    { value: "hubspot_crm", label: "HubSpot CRM", description: "All-in-one marketing & sales platform" },
    { value: "pipedrive", label: "Pipedrive", description: "Sales CRM focused on pipeline management" },
    { value: "zoho_crm", label: "Zoho CRM", description: "Comprehensive CRM solution" },
    { value: "microsoft_dynamics_365", label: "Microsoft Dynamics 365", description: "Enterprise CRM and ERP" },
    { value: "oracle_netsuite_crm", label: "Oracle NetSuite CRM", description: "Cloud-based CRM solution" },
    { value: "sap_sales_cloud", label: "SAP Sales Cloud", description: "Enterprise sales automation" },
    { value: "sugarcrm", label: "SugarCRM", description: "Flexible CRM platform" },
    { value: "freshsales", label: "Freshsales", description: "AI-powered sales CRM" },
    { value: "close_crm", label: "Close CRM", description: "Inside sales CRM" },
    { value: "copper", label: "Copper", description: "CRM built for Google Workspace" },
    { value: "zendesk_sell", label: "Zendesk Sell", description: "Sales CRM by Zendesk" },
    { value: "monday_crm", label: "Monday.com CRM", description: "Visual CRM platform" },
    { value: "nimble", label: "Nimble", description: "Social CRM for small business" },
    { value: "nutshell", label: "Nutshell", description: "Simple CRM for growing teams" },
    { value: "insightly", label: "Insightly", description: "CRM and project management" },
    { value: "keap", label: "Keap (formerly Infusionsoft)", description: "CRM and marketing automation" },
    { value: "less_annoying_crm", label: "Less Annoying CRM", description: "Simple CRM for small teams" },
    { value: "capsule_crm", label: "Capsule CRM", description: "Simple CRM for small business" },
    { value: "vtiger", label: "Vtiger", description: "Open source CRM" },
    { value: "creatio", label: "Creatio", description: "No-code CRM platform" },
    { value: "agile_crm", label: "Agile CRM", description: "All-in-one CRM solution" },
    { value: "apptivo", label: "Apptivo", description: "Business app suite" },
    { value: "bigin", label: "Bigin by Zoho CRM", description: "Simple CRM for small business" },
  ],
  "Marketing & Email": [
    { value: "mailchimp", label: "Mailchimp", description: "Email marketing automation" },
    { value: "klaviyo", label: "Klaviyo", description: "E-commerce marketing automation" },
    { value: "convertkit", label: "ConvertKit", description: "Creator-focused email marketing" },
    { value: "activecampaign", label: "ActiveCampaign", description: "Marketing automation & CRM" },
    { value: "drip", label: "Drip", description: "E-commerce marketing automation" },
    { value: "constant_contact", label: "Constant Contact", description: "Email marketing platform" },
    { value: "sendinblue", label: "Sendinblue", description: "Email marketing and SMS" },
    { value: "aweber", label: "AWeber", description: "Email marketing automation" },
    { value: "getresponse", label: "GetResponse", description: "Email marketing and automation" },
    { value: "campaign_monitor", label: "Campaign Monitor", description: "Email marketing platform" },
    { value: "mailerlite", label: "MailerLite", description: "Email marketing for growing businesses" },
    { value: "sendgrid", label: "SendGrid", description: "Email delivery platform" },
    { value: "hubspot_marketing", label: "HubSpot Marketing", description: "Marketing automation platform" },
    { value: "pardot", label: "Pardot", description: "B2B marketing automation" },
    { value: "marketo", label: "Marketo", description: "Marketing automation platform" },
    { value: "eloqua", label: "Eloqua", description: "Marketing automation" },
    { value: "infusionsoft", label: "Infusionsoft", description: "CRM and marketing automation" },
    { value: "ontraport", label: "Ontraport", description: "Business automation platform" },
    { value: "autopilot", label: "Autopilot", description: "Visual marketing automation" },
    { value: "customer_io", label: "Customer.io", description: "Behavioral email marketing" },
    { value: "intercom", label: "Intercom", description: "Customer messaging platform" },
    { value: "drift", label: "Drift", description: "Conversational marketing platform" },
    { value: "zendesk_chat", label: "Zendesk Chat", description: "Live chat and messaging" },
    { value: "tawk_to", label: "Tawk.to", description: "Free live chat widget" },
    { value: "crisp", label: "Crisp", description: "Customer messaging platform" },
  ],
  "Ecommerce & POS": [
    { value: "shopify", label: "Shopify", description: "E-commerce platform" },
    { value: "woocommerce", label: "WooCommerce", description: "WordPress e-commerce plugin" },
    { value: "magento", label: "Magento", description: "Enterprise e-commerce platform" },
    { value: "bigcommerce", label: "BigCommerce", description: "E-commerce platform" },
    { value: "squarespace", label: "Squarespace", description: "Website builder with e-commerce" },
    { value: "wix", label: "Wix", description: "Website builder with e-commerce" },
    { value: "prestashop", label: "PrestaShop", description: "Open source e-commerce" },
    { value: "opencart", label: "OpenCart", description: "Open source e-commerce" },
    { value: "volusion", label: "Volusion", description: "E-commerce platform" },
    { value: "3dcart", label: "3dcart", description: "E-commerce platform" },
    { value: "ecwid", label: "Ecwid", description: "E-commerce widget" },
    { value: "squarespace_commerce", label: "Squarespace Commerce", description: "E-commerce for Squarespace" },
    { value: "stripe_checkout", label: "Stripe Checkout", description: "Payment processing" },
    { value: "paypal", label: "PayPal", description: "Digital payment platform" },
    { value: "square", label: "Square", description: "Payment & business solutions" },
    { value: "square_pos", label: "Square POS", description: "Point of sale system" },
    { value: "lightspeed", label: "Lightspeed", description: "Retail POS system" },
    { value: "vend", label: "Vend", description: "Retail POS software" },
    { value: "shopkeep", label: "ShopKeep", description: "Cloud-based POS" },
    { value: "clover", label: "Clover", description: "POS system" },
    { value: "toast", label: "Toast", description: "Restaurant POS system" },
    { value: "aloha", label: "Aloha", description: "Restaurant POS system" },
    { value: "revel", label: "Revel", description: "iPad POS system" },
    { value: "touchbistro", label: "TouchBistro", description: "Restaurant POS" },
  ],
  "Analytics & BI": [
    { value: "google_analytics", label: "Google Analytics", description: "Web analytics platform" },
    { value: "google_analytics_4", label: "Google Analytics 4", description: "Next-generation analytics" },
    { value: "mixpanel", label: "Mixpanel", description: "Product analytics for user behavior" },
    { value: "amplitude", label: "Amplitude", description: "Product analytics & user insights" },
    { value: "hotjar", label: "Hotjar", description: "User behavior analytics" },
    { value: "segment", label: "Segment", description: "Customer data platform" },
    { value: "tableau", label: "Tableau", description: "Business intelligence platform" },
    { value: "power_bi", label: "Power BI", description: "Microsoft business analytics" },
    { value: "looker", label: "Looker", description: "Business intelligence platform" },
    { value: "qlik", label: "Qlik", description: "Business intelligence platform" },
    { value: "snowflake", label: "Snowflake", description: "Cloud data platform" },
    { value: "databricks", label: "Databricks", description: "Data engineering platform" },
    { value: "kissmetrics", label: "Kissmetrics", description: "Customer analytics" },
    { value: "heap", label: "Heap", description: "Automatic event tracking" },
    { value: "plausible", label: "Plausible", description: "Privacy-focused analytics" },
    { value: "fathom", label: "Fathom", description: "Privacy-focused analytics" },
    { value: "matomo", label: "Matomo", description: "Open source analytics" },
    { value: "crazy_egg", label: "Crazy Egg", description: "Heatmap and user behavior" },
    { value: "fullstory", label: "FullStory", description: "Digital experience analytics" },
    { value: "lucky_orange", label: "Lucky Orange", description: "User behavior analytics" },
    { value: "mouseflow", label: "Mouseflow", description: "User behavior analytics" },
    { value: "sessioncam", label: "SessionCam", description: "Session recording" },
    { value: "inspectlet", label: "Inspectlet", description: "User behavior analytics" },
    { value: "smartlook", label: "Smartlook", description: "User behavior analytics" },
  ],
  "Project Management": [
    { value: "asana", label: "Asana", description: "Project management platform" },
    { value: "trello", label: "Trello", description: "Visual project management" },
    { value: "monday", label: "Monday.com", description: "Work operating system" },
    { value: "jira", label: "Jira", description: "Agile project management" },
    { value: "clickup", label: "ClickUp", description: "All-in-one productivity platform" },
    { value: "notion", label: "Notion", description: "All-in-one workspace" },
    { value: "basecamp", label: "Basecamp", description: "Project management and team communication" },
    { value: "wrike", label: "Wrike", description: "Project management platform" },
    { value: "smartsheet", label: "Smartsheet", description: "Work execution platform" },
    { value: "teamgantt", label: "TeamGantt", description: "Project planning software" },
    { value: "microsoft_project", label: "Microsoft Project", description: "Project management software" },
    { value: "airtable", label: "Airtable", description: "Database and project management" },
    { value: "slack", label: "Slack", description: "Team communication platform" },
    { value: "microsoft_teams", label: "Microsoft Teams", description: "Collaboration platform" },
    { value: "zoom", label: "Zoom", description: "Video conferencing platform" },
    { value: "google_meet", label: "Google Meet", description: "Video conferencing" },
    { value: "webex", label: "Webex", description: "Video conferencing platform" },
    { value: "discord", label: "Discord", description: "Communication platform" },
    { value: "telegram", label: "Telegram", description: "Messaging platform" },
    { value: "whatsapp_business", label: "WhatsApp Business", description: "Business messaging" },
    { value: "skype", label: "Skype", description: "Communication platform" },
    { value: "gotomeeting", label: "GoToMeeting", description: "Video conferencing" },
    { value: "join_me", label: "Join.me", description: "Screen sharing and meetings" },
  ],
  "Finance & Accounting": [
    { value: "quickbooks", label: "QuickBooks", description: "Accounting software" },
    { value: "xero", label: "Xero", description: "Cloud accounting platform" },
    { value: "freshbooks", label: "FreshBooks", description: "Accounting software" },
    { value: "wave", label: "Wave", description: "Free accounting software" },
    { value: "sage", label: "Sage", description: "Business management software" },
    { value: "netsuite", label: "NetSuite", description: "Cloud ERP system" },
    { value: "sap", label: "SAP", description: "Enterprise resource planning" },
    { value: "oracle_financials", label: "Oracle Financials", description: "Financial management" },
    { value: "microsoft_dynamics_gp", label: "Microsoft Dynamics GP", description: "Business management" },
    { value: "intuit_proconnect", label: "Intuit ProConnect", description: "Tax software" },
    { value: "turbotax", label: "TurboTax", description: "Tax preparation software" },
    { value: "hr_block", label: "H&R Block", description: "Tax preparation" },
    { value: "expensify", label: "Expensify", description: "Expense management" },
    { value: "concur", label: "Concur", description: "Travel and expense management" },
    { value: "bill_com", label: "Bill.com", description: "AP/AR automation" },
    { value: "stripe", label: "Stripe", description: "Payment processing platform" },
    { value: "square_payments", label: "Square Payments", description: "Payment processing" },
    { value: "paypal_business", label: "PayPal Business", description: "Business payment processing" },
    { value: "adyen", label: "Adyen", description: "Payment platform" },
    { value: "braintree", label: "Braintree", description: "Payment gateway" },
    { value: "authorize_net", label: "Authorize.net", description: "Payment gateway" },
    { value: "worldpay", label: "Worldpay", description: "Payment processing" },
    { value: "merchant_services", label: "Merchant Services", description: "Payment processing" },
  ],
  "Customer Support": [
    { value: "zendesk", label: "Zendesk", description: "Customer service platform" },
    { value: "intercom", label: "Intercom", description: "Customer messaging platform" },
    { value: "freshdesk", label: "Freshdesk", description: "Customer support software" },
    { value: "help_scout", label: "Help Scout", description: "Customer support platform" },
    { value: "zoho_desk", label: "Zoho Desk", description: "Customer service software" },
    { value: "kayako", label: "Kayako", label: "Customer service platform" },
    { value: "groove", label: "Groove", description: "Customer support software" },
    { value: "desk", label: "Desk.com", description: "Customer support platform" },
    { value: "happyfox", label: "HappyFox", description: "Help desk software" },
    { value: "livechat", label: "LiveChat", description: "Live chat software" },
    { value: "olark", label: "Olark", description: "Live chat software" },
    { value: "tawk_to", label: "Tawk.to", description: "Free live chat widget" },
    { value: "crisp", label: "Crisp", description: "Customer messaging platform" },
    { value: "drift", label: "Drift", description: "Conversational marketing platform" },
    { value: "zendesk_chat", label: "Zendesk Chat", description: "Live chat and messaging" },
    { value: "intercom_chat", label: "Intercom Chat", description: "Customer messaging" },
    { value: "freshchat", label: "Freshchat", description: "Modern messaging software" },
    { value: "tidio", label: "Tidio", description: "Live chat and chatbot" },
    { value: "chatwoot", label: "Chatwoot", description: "Open source customer engagement" },
    { value: "rocket_chat", label: "Rocket.Chat", description: "Open source team chat" },
    { value: "mattermost", label: "Mattermost", description: "Open source team collaboration" },
    { value: "discord", label: "Discord", description: "Communication platform" },
    { value: "slack", label: "Slack", description: "Team communication platform" },
  ],
  "Customer Data Platforms": [
    { value: "segment", label: "Segment", description: "Customer data platform" },
    { value: "microsoft_dynamics_customer_insights", label: "Microsoft Dynamics Customer Insights", description: "Customer data platform" },
    { value: "salesforce_cdp", label: "Salesforce CDP", description: "Customer data platform" },
    { value: "oracle_cdp", label: "Oracle CDP", description: "Customer data platform" },
    { value: "adobe_experience_platform", label: "Adobe Experience Platform", description: "Customer data platform" },
    { value: "bloomreach", label: "Bloomreach", description: "Digital experience platform" },
    { value: "actioniq", label: "ActionIQ", description: "Customer data platform" },
    { value: "blueshift", label: "Blueshift", description: "Customer data platform" },
    { value: "mapp", label: "Mapp", description: "Customer data platform" },
    { value: "redpoint", label: "Redpoint", description: "Customer data platform" },
    { value: "tealium", label: "Tealium", description: "Customer data platform" },
    { value: "amperity", label: "Amperity", description: "Customer data platform" },
    { value: "rudderstack", label: "RudderStack", description: "Customer data platform" },
    { value: "meltano", label: "Meltano", description: "Data platform" },
    { value: "fivetran", label: "Fivetran", description: "Data integration platform" },
    { value: "stitch", label: "Stitch", description: "Data integration platform" },
    { value: "airbyte", label: "Airbyte", description: "Open source data integration" },
    { value: "dbt", label: "dbt", description: "Data transformation tool" },
    { value: "snowflake", label: "Snowflake", description: "Cloud data platform" },
    { value: "bigquery", label: "BigQuery", description: "Cloud data warehouse" },
    { value: "redshift", label: "Amazon Redshift", description: "Cloud data warehouse" },
    { value: "databricks", label: "Databricks", description: "Data engineering platform" },
    { value: "looker", label: "Looker", description: "Business intelligence platform" },
  ],
  "Other Tools": [
    { value: "github", label: "GitHub", description: "Code repository & collaboration" },
    { value: "gitlab", label: "GitLab", description: "DevOps platform" },
    { value: "bitbucket", label: "Bitbucket", description: "Code repository" },
    { value: "aws", label: "AWS", description: "Cloud computing platform" },
    { value: "google_cloud", label: "Google Cloud", description: "Cloud computing services" },
    { value: "azure", label: "Azure", description: "Microsoft cloud platform" },
    { value: "digitalocean", label: "DigitalOcean", description: "Cloud infrastructure" },
    { value: "heroku", label: "Heroku", description: "Cloud application platform" },
    { value: "vercel", label: "Vercel", description: "Cloud platform for frontend" },
    { value: "netlify", label: "Netlify", description: "Web development platform" },
    { value: "wordpress", label: "WordPress", description: "Content management system" },
    { value: "drupal", label: "Drupal", description: "Content management system" },
    { value: "joomla", label: "Joomla", description: "Content management system" },
    { value: "squarespace", label: "Squarespace", description: "Website builder" },
    { value: "wix", label: "Wix", description: "Website builder" },
    { value: "webflow", label: "Webflow", description: "Web design platform" },
    { value: "figma", label: "Figma", description: "Design and prototyping tool" },
    { value: "sketch", label: "Sketch", description: "Design tool for Mac" },
    { value: "adobe_creative_suite", label: "Adobe Creative Suite", description: "Creative software suite" },
    { value: "canva", label: "Canva", description: "Graphic design platform" },
    { value: "piktochart", label: "Piktochart", description: "Infographic maker" },
    { value: "venngage", label: "Venngage", description: "Infographic maker" },
    { value: "visme", label: "Visme", description: "Visual content creator" },
    { value: "snapseed", label: "Snapseed", description: "Photo editing app" },
    { value: "lightroom", label: "Lightroom", description: "Photo editing software" },
  ],
};

export default function EnhancedTechStackSelector({
  question,
  description,
  selected,
  onChange,
  maxSelect = 15,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("CRM & Sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      if (selected.length >= maxSelect) return;
      onChange([...selected, value]);
    }
  };

  const filteredTools = showSearch && searchTerm
    ? Object.values(TECH_STACK_CATEGORIES)
        .flat()
        .filter(tool => 
          tool.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : TECH_STACK_CATEGORIES[activeCategory as keyof typeof TECH_STACK_CATEGORIES] || [];

  const categories = Object.keys(TECH_STACK_CATEGORIES);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{question}</h2>
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
        )}
      </div>

      {/* Category Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const categoryTools = TECH_STACK_CATEGORIES[category as keyof typeof TECH_STACK_CATEGORIES];
            const selectedInCategory = categoryTools.filter(tool => selected.includes(tool.value));

            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveCategory(category);
                  setShowSearch(false);
                  setSearchTerm("");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
                {selectedInCategory.length > 0 && (
                  <span className="ml-2 bg-white text-blue-500 text-xs px-2 py-1 rounded-full">
                    {selectedInCategory.length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Search Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) {
                setSearchTerm("");
              }
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showSearch
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>Search for a tool...</span>
          </button>
        </div>

        {/* Search Input */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </motion.div>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isSelected = selected.includes(tool.value);
          const disabled = !isSelected && selected.length >= maxSelect;

          return (
            <motion.div
              key={tool.value}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`relative group cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !disabled && toggleOption(tool.value)}
            >
              <div
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{tool.label}</h3>
                    {tool.description && (
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 group-hover:border-blue-400"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckIcon className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-700">
              {selected.length} tools selected
            </span>
            {maxSelect && ` (max ${maxSelect})`}
          </p>
        </motion.div>
      )}

      {selected.length >= maxSelect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            You can select up to {maxSelect} tools.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 