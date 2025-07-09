import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing & Security - OptimaliQ",
  description: "Learn how OptimaliQ protects your privacy and secures your business data with industry-standard encryption and security measures.",
  openGraph: {
    title: "Data Processing & Security - OptimaliQ",
    description: "Learn how OptimaliQ protects your privacy and secures your business data with industry-standard encryption and security measures.",
    url: "https://yourdomain.com/data-security",
    siteName: "OptimaliQ",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/data-security",
  },
};

export default function DataSecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Inter']">Data Processing & Security</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 font-['Inter']">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Our Commitment:</strong> OptimaliQ values your privacy and the confidentiality of your business data. Here&apos;s how we protect it.
              </p>
            </div>

            <div className="space-y-8">
              {/* Data Collection */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📊</span>
                  </span>
                  Data Collection
                </h2>
                <p className="text-gray-700">
                  We collect only the information necessary to provide personalized insights and improve your experience.
                </p>
              </div>

              {/* Data Storage */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">🔒</span>
                  </span>
                  Data Storage
                </h2>
                <p className="text-gray-700">
                  All user data is securely stored in Supabase with industry-standard encryption protocols.
                </p>
              </div>

              {/* AI Usage */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🤖</span>
                  </span>
                  AI Usage
                </h2>
                <p className="text-gray-700">
                  Some data may be processed through OpenAI or AWS SageMaker to generate insights. We do not sell or share your data with third parties.
                </p>
              </div>

              {/* User Control */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm">👤</span>
                  </span>
                  User Control
                </h2>
                <p className="text-gray-700">
                  You can request data deletion or export at any time by contacting us at{" "}
                  <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800 underline">
                    support@optimaliq.ai
                  </a>
                  .
                </p>
              </div>

              {/* Security Measures */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">🛡️</span>
                  </span>
                  Security Measures
                </h2>
                <p className="text-gray-700">
                  We use HTTPS, role-based access controls, and encrypted storage to protect your information.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions About Data Security?</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about how we handle your data, reach out to us at{" "}
                <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                  support@optimaliq.ai
                </a>
                .
              </p>
              <p className="text-sm text-gray-600">
                We&apos;re committed to transparency and will respond to your inquiries within 24 hours.
              </p>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 