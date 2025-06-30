"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { showToast } from "@/lib/utils/toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSave, FaCog, FaDatabase, FaChartBar, FaShoppingCart, FaEnvelope, FaUsers } from "react-icons/fa";

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

const categoryConfig = {
  crm: {
    title: "CRM & Sales",
    icon: FaDatabase,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    description: "Customer relationship management and sales automation tools"
  },
  esp: {
    title: "Marketing & Email",
    icon: FaEnvelope,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    description: "Email marketing and marketing automation platforms"
  },
  analytics: {
    title: "Analytics & BI",
    icon: FaChartBar,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    description: "Business intelligence and analytics solutions"
  },
  cdp: {
    title: "Customer Data Platforms",
    icon: FaUsers,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Customer data platforms and data management"
  },
  erp: {
    title: "Finance & Accounting",
    icon: FaCog,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    description: "Enterprise resource planning and financial systems"
  },
  commerce: {
    title: "Ecommerce & POS",
    icon: FaShoppingCart,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    description: "E-commerce platforms and point of sale systems"
  }
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

  const getSelectedCount = (category: keyof typeof techOptions) => {
    const categoryKey = category as keyof TechToolsAnswers;
    const toolsKey = `${categoryKey}Tools` as keyof TechToolsAnswers;
    return (answers[toolsKey] as string[])?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => router.push("/premium/assessment")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <FaArrowLeft className="text-gray-600 text-lg" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">What platforms or tools are central to your operations?</h1>
              <p className="text-xl text-gray-600">Select the technologies that power your business across all key areas.</p>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Categories */}
        <div className="space-y-8">
          {Object.entries(categoryConfig).map(([category, config], index) => {
            const Icon = config.icon;
            const categoryKey = category as keyof typeof techOptions;
            const isEnabled = answers[`uses${categoryKey.toUpperCase()}` as keyof TechToolsAnswers] as boolean;
            const selectedCount = getSelectedCount(categoryKey);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${config.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="text-white text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{config.title}</h2>
                        <p className="text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{selectedCount}</div>
                        <div className="text-sm text-gray-500">Selected</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => {
                            const newAnswers = { ...answers };
                            newAnswers[`uses${categoryKey.toUpperCase()}` as keyof TechToolsAnswers] = e.target.checked as any;
                            if (!e.target.checked) {
                              newAnswers[`${categoryKey}Tools` as keyof TechToolsAnswers] = [] as any;
                            }
                            setAnswers(newAnswers);
                          }}
                          className="sr-only"
                        />
                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                          isEnabled ? 'bg-gradient-to-r ' + config.color : 'bg-gray-200'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            isEnabled ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tools Selection */}
                {isEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {techOptions[categoryKey].map((tool) => {
                        const isSelected = (answers[`${categoryKey}Tools` as keyof TechToolsAnswers] as string[])?.includes(tool);
                        
                        return (
                          <motion.label
                            key={tool}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? `border-${config.color.split('-')[1]}-500 bg-${config.color.split('-')[1]}-50`
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const newAnswers = { ...answers };
                                const toolsKey = `${categoryKey}Tools` as keyof TechToolsAnswers;
                                const currentTools = newAnswers[toolsKey] as string[];
                                
                                if (e.target.checked) {
                                  newAnswers[toolsKey] = [...currentTools, tool] as any;
                                } else {
                                  newAnswers[toolsKey] = currentTools.filter(t => t !== tool) as any;
                                }
                                
                                setAnswers(newAnswers);
                              }}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all duration-300 ${
                              isSelected
                                ? `border-${config.color.split('-')[1]}-500 bg-${config.color.split('-')[1]}-500`
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`font-medium transition-colors duration-300 ${
                              isSelected ? `text-${config.color.split('-')[1]}-700` : 'text-gray-700'
                            }`}>
                              {tool}
                            </span>
                          </motion.label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Submit Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex justify-end"
        >
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            <FaSave className="text-xl" />
            {loading ? "Saving..." : "Save Technology Stack"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
} 