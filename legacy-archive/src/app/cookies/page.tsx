import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | OptimaliQ.ai",
  description: "Cookie Policy for OptimaliQ.ai - how we use cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Inter']">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 font-['Inter']">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Effective Date:</strong> June 22, 2025<br />
                <strong>Company:</strong> OptimaliQ.ai LLC
              </p>
            </div>

            <p className="text-lg mb-8">
              This Cookie Policy explains how OptimaliQ uses cookies and similar technologies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. What Are Cookies?</h2>
            <p className="mb-6">
              Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you use our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for core site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage and performance (e.g., Google Analytics)</li>
              <li><strong>Marketing Cookies:</strong> May be used in future for advertising purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Managing Your Preferences</h2>
            <p className="mb-4">You can control cookie preferences via:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Our cookie banner (powered by Usercentrics)</li>
              <li>Your browser settings</li>
            </ul>
            <p className="mb-6">
              Refusing cookies may impact site performance.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Specific Cookies We Use</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Authentication Cookies</h3>
              <p className="mb-4">Used to keep you logged in and maintain your session:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Supabase authentication tokens</li>
                <li>Session management cookies</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Analytics Cookies</h3>
              <p className="mb-4">Help us understand how visitors use our site:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Google Analytics (_ga, _gid, _gat)</li>
                <li>Page view tracking</li>
                <li>User behavior analysis</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Cookies</h3>
              <p className="mb-4">Used for secure payment processing:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Stripe payment session cookies</li>
                <li>Fraud prevention tokens</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Third-Party Cookies</h2>
            <p className="mb-4">Some cookies are set by third-party services we use:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Stripe:</strong> Payment processing and security</li>
              <li><strong>Google Analytics:</strong> Website analytics and performance</li>
              <li><strong>Usercentrics:</strong> Consent management</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Updates</h2>
            <p className="mb-6">
              This policy may be updated to reflect changes in technology or law. We recommend reviewing it periodically.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                For questions about our use of cookies, please contact us at{" "}
                <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800">
                  support@optimaliq.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 