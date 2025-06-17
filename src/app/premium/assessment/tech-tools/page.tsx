"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { showToast } from "@/lib/utils/toast";
import { supabase } from "@/lib/supabase";

type TechToolsAnswers = {
  usesCRM: boolean;
  crmTools: string[];
  usesESP: boolean;
  espTools: string[];
  usesAnalytics: boolean;
  analyticsTools: string[];
  usesCDP: boolean;
  cdpTools: string[];
  usesERP: boolean;
  erpTools: string[];
  usesCommerce: boolean;
  commerceTools: string[];
};

const techOptions = {
  crm: [
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
    "Other"
  ],
  esp: [
    "Acoustic Campaign",
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
    "Other"
  ],
  analytics: [
    "Adobe Analytics",
    "Amplitude",
    "Chartio",
    "Countly",
    "Crazy Egg",
    "Domo",
    "FullStory",
    "Google Analytics (GA4)",
    "Heap",
    "Hotjar",
    "Kissmetrics",
    "Looker",
    "Matomo",
    "Metabase",
    "Mixpanel",
    "Piwik PRO",
    "Plausible Analytics",
    "Power BI",
    "Qlik Sense",
    "Redash",
    "Segment",
    "Sisense",
    "Snowplow",
    "Tableau",
    "Zoho Analytics",
    "Other"
  ],
  cdp: [
    "ActionIQ",
    "Adobe Real-Time CDP",
    "Amperity",
    "Bloomreach Engagement",
    "BlueConic",
    "Celebrus",
    "Commanders Act",
    "Exponea",
    "Lexer",
    "Lytics",
    "Meiro",
    "MetaRouter",
    "mParticle",
    "NGDATA",
    "Oracle Unity",
    "RudderStack",
    "Salesforce Data Cloud",
    "SAP Customer Data Cloud",
    "Segment",
    "Simon Data",
    "Tealium AudienceStream",
    "Totango",
    "Treasure Data",
    "Zeotap",
    "Zeta Global",
    "Other"
  ],
  erp: [
    "Acumatica",
    "Epicor",
    "Infor",
    "Microsoft Dynamics 365",
    "NetSuite",
    "Oracle ERP Cloud",
    "Sage Intacct",
    "SAP Business One",
    "SAP S/4HANA",
    "Other"
  ],
  commerce: [
    "Adobe Commerce (Magento)",
    "BigCommerce",
    "Commerce Tools",
    "Kibo Commerce",
    "Oracle Commerce",
    "Salesforce Commerce Cloud",
    "Shopify",
    "Shopify Plus",
    "WooCommerce",
    "Other"
  ]
};

export default function TechToolsAssessment() {
  const router = useRouter();
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<TechToolsAnswers>({
    usesCRM: false,
    crmTools: [],
    usesESP: false,
    espTools: [],
    usesAnalytics: false,
    analyticsTools: [],
    usesCDP: false,
    cdpTools: [],
    usesERP: false,
    erpTools: [],
    usesCommerce: false,
    commerceTools: []
  });

  // Load existing tech stack data
  useEffect(() => {
    const loadTechStack = async () => {
      if (!user?.u_id) return;

      try {
        const { data, error } = await supabase
          .from("user_tech_stack")
          .select("*")
          .eq("u_id", user.u_id)
          .single();

        if (error) throw error;

        if (data) {
          setAnswers({
            usesCRM: data.crm_tools?.length > 0,
            crmTools: data.crm_tools || [],
            usesESP: data.esp_tools?.length > 0,
            espTools: data.esp_tools || [],
            usesAnalytics: data.analytics_tools?.length > 0,
            analyticsTools: data.analytics_tools || [],
            usesCDP: data.cdp_tools?.length > 0,
            cdpTools: data.cdp_tools || [],
            usesERP: data.erp_tools?.length > 0,
            erpTools: data.erp_tools || [],
            usesCommerce: data.commerce_tools?.length > 0,
            commerceTools: data.commerce_tools || []
          });
        }
      } catch (err) {
        console.error("Failed to load tech stack:", err);
        showToast.error("Failed to load tech stack data");
      }
    };

    loadTechStack();
  }, [user?.u_id]);

  const handleSubmit = async () => {
    if (!user?.u_id) {
      showToast.error("User session expired. Please log in again.");
      router.push("/subscribe/login");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_tech_stack")
        .upsert({
          u_id: user.u_id,
          crm_tools: answers.usesCRM ? answers.crmTools : [],
          esp_tools: answers.usesESP ? answers.espTools : [],
          analytics_tools: answers.usesAnalytics ? answers.analyticsTools : [],
          cdp_tools: answers.usesCDP ? answers.cdpTools : [],
          erp_tools: answers.usesERP ? answers.erpTools : [],
          commerce_tools: answers.usesCommerce ? answers.commerceTools : [],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'u_id'
        });

      if (error) throw error;

      showToast.success("Tech stack updated successfully!");
      router.push("/premium/assessment");
    } catch (err) {
      console.error("Failed to update tech stack:", err);
      showToast.error("Failed to update tech stack. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Current Technology Stack</h1>
        
        <div className="space-y-8">
          {/* CRM Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers.usesCRM}
                  onChange={(e) => setAnswers({ ...answers, usesCRM: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium">Do you use a CRM system?</span>
              </label>
            </div>
            
            {answers.usesCRM && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which CRM technologies do you use?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {techOptions.crm.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answers.crmTools.includes(tool)}
                        onChange={(e) => {
                          const newTools = e.target.checked
                            ? [...answers.crmTools, tool]
                            : answers.crmTools.filter((t) => t !== tool);
                          setAnswers({ ...answers, crmTools: newTools });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ESP Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers.usesESP}
                  onChange={(e) => setAnswers({ ...answers, usesESP: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium">Do you use an Email Service Provider (ESP)?</span>
              </label>
            </div>
            
            {answers.usesESP && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which ESP technologies do you use?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {techOptions.esp.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answers.espTools.includes(tool)}
                        onChange={(e) => {
                          const newTools = e.target.checked
                            ? [...answers.espTools, tool]
                            : answers.espTools.filter((t) => t !== tool);
                          setAnswers({ ...answers, espTools: newTools });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers.usesAnalytics}
                  onChange={(e) => setAnswers({ ...answers, usesAnalytics: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium">Do you use Analytics tools?</span>
              </label>
            </div>
            
            {answers.usesAnalytics && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which Analytics technologies do you use?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {techOptions.analytics.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answers.analyticsTools.includes(tool)}
                        onChange={(e) => {
                          const newTools = e.target.checked
                            ? [...answers.analyticsTools, tool]
                            : answers.analyticsTools.filter((t) => t !== tool);
                          setAnswers({ ...answers, analyticsTools: newTools });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CDP Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers.usesCDP}
                  onChange={(e) => setAnswers({ ...answers, usesCDP: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium">Do you use a Customer Data Platform (CDP)?</span>
              </label>
            </div>
            
            {answers.usesCDP && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which CDP technologies do you use?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {techOptions.cdp.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answers.cdpTools.includes(tool)}
                        onChange={(e) => {
                          const newTools = e.target.checked
                            ? [...answers.cdpTools, tool]
                            : answers.cdpTools.filter((t) => t !== tool);
                          setAnswers({ ...answers, cdpTools: newTools });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ERP Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers.usesERP}
                  onChange={(e) => setAnswers({ ...answers, usesERP: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium">Do you use an ERP system?</span>
              </label>
            </div>
            
            {answers.usesERP && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which ERP technologies do you use?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {techOptions.erp.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answers.erpTools.includes(tool)}
                        onChange={(e) => {
                          const newTools = e.target.checked
                            ? [...answers.erpTools, tool]
                            : answers.erpTools.filter((t) => t !== tool);
                          setAnswers({ ...answers, erpTools: newTools });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Commerce Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers.usesCommerce}
                  onChange={(e) => setAnswers({ ...answers, usesCommerce: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-lg font-medium">Do you use E-commerce tools?</span>
              </label>
            </div>
            
            {answers.usesCommerce && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which E-commerce technologies do you use?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {techOptions.commerce.map((tool) => (
                    <label key={tool} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answers.commerceTools.includes(tool)}
                        onChange={(e) => {
                          const newTools = e.target.checked
                            ? [...answers.commerceTools, tool]
                            : answers.commerceTools.filter((t) => t !== tool);
                          setAnswers({ ...answers, commerceTools: newTools });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Tech Stack"}
          </button>
        </div>
      </div>
    </div>
  );
} 