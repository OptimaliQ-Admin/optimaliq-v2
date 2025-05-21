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
          { value: "hubspot", label: "HubSpot CRM" },
          { value: "zoho", label: "Zoho CRM" },
          { value: "dynamics365", label: "Microsoft Dynamics 365" },
          { value: "pipedrive", label: "Pipedrive" },
          { value: "sap_crm", label: "SAP CRM" },
          { value: "netsuite", label: "Oracle NetSuite" },
          { value: "freshsales", label: "Freshsales" },
          { value: "insightly", label: "Insightly" },
          { value: "keap", label: "Keap (formerly Infusionsoft)" },
          { value: "sugarcrm", label: "SugarCRM" },
          { value: "nimble", label: "Nimble" },
          { value: "creatio", label: "Creatio" },
          { value: "apptivo", label: "Apptivo" },
          { value: "agile_crm", label: "Agile CRM" },
          { value: "copper", label: "Copper" },
          { value: "bitrix24", label: "Bitrix24" },
          { value: "close", label: "Close CRM" },
          { value: "salesflare", label: "Salesflare" },
          { value: "less_annoying", label: "Less Annoying CRM" },
          { value: "zendesk_sell", label: "Zendesk Sell" },
          { value: "vtiger", label: "Vtiger CRM" },
          { value: "capsule", label: "Capsule CRM" },
          { value: "highrise", label: "Highrise" },
          { value: "streak", label: "Streak CRM" },
          { value: "other", label: "Other" },
          { value: "none", label: "None" }
        ]}
        selected={getStringArrayAnswer(answers["crm_tools"])}
        onChange={(val) => onAnswer("crm_tools", val)}
        maxSelect={5}
      />

      <MultiSelectQuestion
        question="Email Service Providers (Marketing Automation)"
        options={[
          { value: "salesforce_mc", label: "Salesforce Marketing Cloud (ExactTarget)" },
          { value: "emarsys", label: "SAP Emarsys" },
          { value: "hubspot_marketing", label: "HubSpot Marketing Hub" },
          { value: "adobe_campaign", label: "Adobe Campaign (formerly Neolane)" },
          { value: "klaviyo", label: "Klaviyo" },
          { value: "braze", label: "Braze" },
          { value: "iterable", label: "Iterable" },
          { value: "mailchimp", label: "Mailchimp (by Intuit)" },
          { value: "activecampaign", label: "ActiveCampaign" },
          { value: "acoustic", label: "Acoustic Campaign (formerly IBM Watson Campaign Automation)" },
          { value: "eloqua", label: "Oracle Eloqua" },
          { value: "responsys", label: "Oracle Responsys" },
          { value: "zoho_campaigns", label: "Zoho Campaigns" },
          { value: "brevo", label: "Sendinblue (Brevo)" },
          { value: "campaign_monitor", label: "Campaign Monitor" },
          { value: "moengage", label: "MoEngage" },
          { value: "customerio", label: "Customer.io" },
          { value: "dotdigital", label: "Dotdigital Engagement Cloud" },
          { value: "messagegears", label: "MessageGears" },
          { value: "selligent", label: "Selligent Marketing Cloud" },
          { value: "acton", label: "Act-On Software" },
          { value: "sendgrid", label: "SendGrid (by Twilio)" },
          { value: "listrak", label: "Listrak" },
          { value: "mailjet", label: "Mailjet (by Sinch)" },
          { value: "omnisend", label: "Omnisend" },
          { value: "other", label: "Other" },
          { value: "none", label: "None" }
        ]}
        selected={getStringArrayAnswer(answers["esp_tools"])}
        onChange={(val) => onAnswer("esp_tools", val)}
        maxSelect={5}
      />

      <MultiSelectQuestion
        question="Analytics Tools"
        options={[
          { value: "ga4", label: "Google Analytics" },
          { value: "adobe_analytics", label: "Adobe Analytics" },
          { value: "tableau", label: "Tableau" },
          { value: "power_bi", label: "Microsoft Power BI" },
          { value: "looker", label: "Looker" },
          { value: "qlik", label: "Qlik Sense" },
          { value: "cognos", label: "IBM Cognos Analytics" },
          { value: "sas", label: "SAS Analytics" },
          { value: "domo", label: "Domo" },
          { value: "mixpanel", label: "Mixpanel" },
          { value: "heap", label: "Heap Analytics" },
          { value: "matomo", label: "Matomo" },
          { value: "kissmetrics", label: "Kissmetrics" },
          { value: "hotjar", label: "Hotjar" },
          { value: "crazy_egg", label: "Crazy Egg" },
          { value: "chartbeat", label: "Chartbeat" },
          { value: "amplitude", label: "Amplitude" },
          { value: "segment", label: "Segment" },
          { value: "piwik", label: "Piwik PRO" },
          { value: "zoho_analytics", label: "Zoho Analytics" },
          { value: "sisense", label: "Sisense" },
          { value: "alteryx", label: "Alteryx" },
          { value: "rapidminer", label: "RapidMiner" },
          { value: "knime", label: "KNIME" },
          { value: "spotfire", label: "TIBCO Spotfire" },
          { value: "other", label: "Other" },
          { value: "none", label: "None" }
        ]}
        selected={getStringArrayAnswer(answers["analytics_tools"])}
        onChange={(val) => onAnswer("analytics_tools", val)}
        maxSelect={5}
      />

      <MultiSelectQuestion
        question="Content Management Systems"
        options={[
          { value: "wordpress", label: "WordPress" },
          { value: "joomla", label: "Joomla" },
          { value: "drupal", label: "Drupal" },
          { value: "magento", label: "Magento" },
          { value: "shopify", label: "Shopify" },
          { value: "wix", label: "Wix" },
          { value: "squarespace", label: "Squarespace" },
          { value: "ghost", label: "Ghost" },
          { value: "typo3", label: "TYPO3" },
          { value: "blogger", label: "Blogger" },
          { value: "prestashop", label: "PrestaShop" },
          { value: "bigcommerce", label: "BigCommerce" },
          { value: "weebly", label: "Weebly" },
          { value: "concrete5", label: "Concrete5" },
          { value: "contentful", label: "Contentful" },
          { value: "sitecore", label: "Sitecore" },
          { value: "hubspot_cms", label: "HubSpot CMS" },
          { value: "grav", label: "Grav" },
          { value: "silverstripe", label: "SilverStripe" },
          { value: "craft", label: "Craft CMS" },
          { value: "webflow", label: "Webflow" },
          { value: "dotcms", label: "DotCMS" },
          { value: "kentico", label: "Kentico" },
          { value: "umbraco", label: "Umbraco" },
          { value: "plone", label: "Plone" },
          { value: "other", label: "Other" },
          { value: "none", label: "None" }
        ]}
        selected={getStringArrayAnswer(answers["cms_tools"])}
        onChange={(val) => onAnswer("cms_tools", val)}
        maxSelect={5}
      />
    </div>
  );
} 