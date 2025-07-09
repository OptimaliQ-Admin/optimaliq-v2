import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | OptimaliQ.ai",
  description: "Terms of Service for OptimaliQ.ai - governing your use of our platform, tools, insights, and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Inter']">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 font-['Inter']">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Effective Date:</strong> June 22, 2025<br />
                <strong>Company:</strong> OptimaliQ.ai LLC<br />
                <strong>Location:</strong> Dayton, TN<br />
                <strong>Contact:</strong> <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800">support@optimaliq.ai</a>
              </p>
            </div>

            <p className="text-lg mb-8">
              Welcome to OptimaliQ.ai. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our platform, tools, insights, and services. By accessing or using our website or services, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Use of Our Services</h2>
            <p className="mb-4">
              You agree to use OptimaliQ only for lawful purposes and in compliance with these Terms. You may not use our services to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Copy, reverse-engineer, or misuse any proprietary information</li>
              <li>Attempt to disrupt or harm our systems or other users</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Account and Access</h2>
            <p className="mb-6">
              You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to create an account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Subscription and Billing</h2>
            <p className="mb-6">
              OptimaliQ is offered as a subscription service. All payments are processed securely via Stripe. Your subscription will automatically renew unless canceled before the next billing cycle.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. No Refunds</h2>
            <p className="mb-6">
              Due to the nature of digital insights and immediate value delivery, all subscription payments are <strong>non-refundable</strong>. However, we may review refund requests on a case-by-case basis at our sole discretion.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Intellectual Property</h2>
            <p className="mb-6">
              All content, models, insights, and software are the property of OptimaliQ.ai LLC. You may not reuse or redistribute any part of the platform without written permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Limitation of Liability</h2>
            <p className="mb-6">
              We do our best to provide accurate insights, but we are not responsible for business outcomes or decisions made based on our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Termination</h2>
            <p className="mb-6">
              We reserve the right to suspend or terminate accounts for violations of these Terms or any misuse of the platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Changes to Terms</h2>
            <p className="mb-6">
              We may update these Terms from time to time. Material changes will be communicated via email or our website.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                For questions about these Terms, please contact us at{" "}
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