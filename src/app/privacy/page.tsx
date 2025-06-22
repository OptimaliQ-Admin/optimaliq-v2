import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | OptimaliQ.ai",
  description: "Privacy Policy for OptimaliQ.ai - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Inter']">Privacy Policy</h1>
          
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
              Your privacy matters to us. This policy outlines how we collect, use, and protect your information when you use OptimaliQ.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following types of data:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Personal Data:</strong> Name, email, company, job title</li>
              <li><strong>Usage Data:</strong> Pages visited, actions taken, interaction data</li>
              <li><strong>Payment Data:</strong> Handled via Stripe (we do not store full payment details)</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device, and geolocation</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. How We Use Your Data</h2>
            <p className="mb-4">We use your data to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Personalize your dashboard and recommendations</li>
              <li>Communicate important updates</li>
              <li>Maintain platform security and compliance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Third-Party Tools</h2>
            <p className="mb-4">We use the following services:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Stripe</strong> – Payment processing</li>
              <li><strong>Supabase</strong> – Database and authentication</li>
              <li><strong>OpenAI</strong> – Generating insights and recommendations</li>
              <li><strong>AWS</strong> – AI/ML infrastructure</li>
              <li><strong>Google Analytics</strong> – Site analytics</li>
            </ul>
            <p className="mb-6">
              These third parties may process your data on our behalf under data protection agreements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Your Rights</h2>
            <p className="mb-6">
              If you are located in California, you may request access to, correction of, or deletion of your personal data under the <strong>CCPA/CPRA</strong>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Data Retention</h2>
            <p className="mb-6">
              We retain your data for as long as your account is active or as needed for legal, operational, or security purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Cookies</h2>
            <p className="mb-6">
              We use cookies to enhance your experience. See our{" "}
              <a href="/cookies" className="text-blue-600 hover:text-blue-800">Cookie Policy</a> for details.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Contact Us</h2>
            <p className="mb-6">
              For privacy-related inquiries:{" "}
              <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800">
                support@optimaliq.ai
              </a>
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This privacy policy is effective as of June 22, 2025. We may update this policy from time to time to reflect changes in our practices or applicable laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 