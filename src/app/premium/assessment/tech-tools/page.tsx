"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { showToast } from "@/lib/utils/toast";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaDatabase, 
  FaEnvelope, 
  FaChartBar, 
  FaCog, 
  FaTools, 
  FaShoppingCart, 
  FaCheck, 
  FaSave, 
  FaArrowLeft,
  FaSearch,
  FaTimes
} from "react-icons/fa";

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

const categories = [
  { key: 'crm', label: 'CRM & Sales', icon: FaDatabase, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
  { key: 'esp', label: 'Email & Marketing', icon: FaEnvelope, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
  { key: 'analytics', label: 'Analytics & BI', icon: FaChartBar, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
  { key: 'cdp', label: 'Customer Data', icon: FaCog, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50' },
  { key: 'erp', label: 'ERP & Operations', icon: FaTools, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
  { key: 'commerce', label: 'E-commerce', icon: FaShoppingCart, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' },
];

export default function TechToolsAssessment() {
  const router = useRouter();
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('crm');
  const [searchTerm, setSearchTerm] = useState('');
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

  const getCategoryData = (categoryKey: string) => {
    const category = categories.find(cat => cat.key === categoryKey);
    const tools = techOptions[categoryKey as keyof typeof techOptions] || [];
    const isEnabled = answers[`uses${categoryKey.toUpperCase()}` as keyof TechToolsAnswers] as boolean;
    const selectedTools = answers[`${categoryKey}Tools` as keyof TechToolsAnswers] as string[];
    
    return { category, tools, isEnabled, selectedTools };
  };

  const toggleCategory = (categoryKey: string) => {
    const fieldName = `uses${categoryKey.toUpperCase()}` as keyof TechToolsAnswers;
    setAnswers(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const toggleTool = (categoryKey: string, tool: string) => {
    const fieldName = `${categoryKey}Tools` as keyof TechToolsAnswers;
    const currentTools = answers[fieldName] as string[];
    const newTools = currentTools.includes(tool)
      ? currentTools.filter(t => t !== tool)
      : [...currentTools, tool];
    
    setAnswers(prev => ({
      ...prev,
      [fieldName]: newTools
    }));
  };

  const filteredTools = (tools: string[]) => {
    if (!searchTerm) return tools;
    return tools.filter(tool => 
      tool.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTotalSelectedTools = () => {
    return answers.crmTools.length + answers.espTools.length + 
           answers.analyticsTools.length + answers.cdpTools.length + 
           answers.erpTools.length + answers.commerceTools.length;
  };

  const { category, tools, isEnabled, selectedTools } = getCategoryData(activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/premium/assessment")}
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <FaArrowLeft className="text-gray-600 text-lg" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Technology Stack</h1>
              <p className="text-gray-600 text-lg">Configure your technology infrastructure</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Selected Tools</h2>
              <span className="text-2xl font-bold text-blue-600">{getTotalSelectedTools()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {categories.map((cat) => {
                const catData = getCategoryData(cat.key);
                const Icon = cat.icon;
                return (
                  <div key={cat.key} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                      catData.selectedTools.length > 0 
                        ? `bg-gradient-to-r ${cat.color}` 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`text-lg ${
                        catData.selectedTools.length > 0 ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>
                    <p className="text-xs font-medium text-gray-600">{cat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{catData.selectedTools.length}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const catData = getCategoryData(cat.key);
                const isActive = activeCategory === cat.key;
                const hasTools = catData.selectedTools.length > 0;
                
                return (
                  <motion.button
                    key={cat.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`relative p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 ${
                      isActive 
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="text-xs font-semibold">{cat.label}</span>
                    {hasTools && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Category Header */}
          <div className={`bg-gradient-to-r ${category?.color} p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                {category && <category.icon className="text-3xl" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{category?.label}</h2>
                <p className="text-white/80">Let us know if you use any tools in this area. This helps us tailor your experience.</p>
              </div>
            </div>
            {/* Friendly Yes/No Question Toggle */}
            <div className="flex items-center gap-6 mt-2">
              <span className="text-lg font-semibold text-white">
                Do you use any {category?.label.toLowerCase()}?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => !isEnabled && toggleCategory(activeCategory)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60 ${
                    isEnabled
                      ? 'bg-white text-blue-700 shadow-lg border-2 border-white'
                      : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                  }`}
                  aria-pressed={isEnabled}
                >
                  Yes
                </button>
                <button
                  onClick={() => isEnabled && toggleCategory(activeCategory)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60 ${
                    !isEnabled
                      ? 'bg-white text-blue-700 shadow-lg border-2 border-white'
                      : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                  }`}
                  aria-pressed={!isEnabled}
                >
                  No
                </button>
              </div>
              {isEnabled && (
                <span className="text-white/80 ml-4">
                  {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>

          {/* Tools Selection */}
          <AnimatePresence mode="wait">
            {isEnabled ? (
              <motion.div
                key="enabled"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-8"
              >
                {/* Search Bar */}
                <div className="relative mb-6">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools(tools).map((tool) => {
                    const isSelected = selectedTools.includes(tool);
                    return (
                      <motion.div
                        key={tool}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTool(activeCategory, tool)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? `border-blue-500 bg-blue-50 shadow-lg` 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {tool}
                          </span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <FaCheck className="text-white text-xs" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredTools(tools).length === 0 && (
                  <div className="text-center py-12">
                    <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500">No tools found matching &quot;{searchTerm}&quot;</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="disabled"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-8 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {category && <category.icon className="text-gray-400 text-4xl" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No {category?.label} tools selected
                </h3>
                <p className="text-gray-500 mb-6">
                  If you use any {category?.label.toLowerCase()} tools, click &quot;Yes&quot; above to start adding them to your tech stack.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(activeCategory)}
                  className={`px-6 py-3 rounded-xl font-semibold bg-gradient-to-r ${category?.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  Add {category?.label} Tools
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave className="text-lg" />
                <span>Save Tech Stack ({getTotalSelectedTools()} tools)</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
} 