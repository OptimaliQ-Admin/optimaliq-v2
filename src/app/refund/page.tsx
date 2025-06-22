import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | OptimaliQ.ai",
  description: "Refund Policy for OptimaliQ.ai - our policy on subscription refunds and cancellations.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Inter']">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 font-['Inter']">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Effective Date:</strong> June 22, 2025<br />
                <strong>Company:</strong> OptimaliQ.ai LLC
              </p>
            </div>

            <p className="text-lg mb-8">
              At OptimaliQ.ai, we're committed to delivering immediate, high-impact strategic insights from the moment you subscribe. To maintain the integrity of our platform and ensure fair use, our refund policy is outlined below.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Monthly Subscriptions — Non-Refundable</h2>
            <p className="mb-6">
              All monthly subscriptions are final and non-refundable. You may cancel your subscription at any time to avoid future charges, but no partial or prorated refunds will be issued for the current billing cycle.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Annual Subscriptions — 14-Day Partial Refund Eligibility</h2>
            <p className="mb-4">
              If you've purchased an annual subscription, you may request a partial refund within 14 days of your purchase under the following conditions:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You have not excessively used the platform (e.g., bulk exports, data scraping, or multiple users under one license)</li>
            </ul>
            <p className="mb-6">
              Your refund will be calculated as: <strong>Annual fee minus two months at the equivalent monthly rate</strong>
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Refund Calculation Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Plan</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Annual Price</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Monthly Rate</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Refund (if requested within 14 days)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">Accelerator</td>
                      <td className="border border-gray-300 px-4 py-3">$2,999</td>
                      <td className="border border-gray-300 px-4 py-3">$329/month</td>
                      <td className="border border-gray-300 px-4 py-3">$2,999 - ($329 × 2) = <strong>$2,341</strong></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Strategic</td>
                      <td className="border border-gray-300 px-4 py-3">$4,999</td>
                      <td className="border border-gray-300 px-4 py-3">$549/month</td>
                      <td className="border border-gray-300 px-4 py-3">$4,999 - ($549 × 2) = <strong>$3,901</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How to Request a Refund</h2>
            <p className="mb-6">
              To request a refund, email{" "}
              <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800">
                support@optimaliq.ai
              </a>{" "}
              with your name, account email, and date of purchase. All refund decisions are final and reviewed on a case-by-case basis.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">After 14 Days</h2>
            <p className="mb-6">
              Refunds will not be issued after 14 days of purchase on any subscription, regardless of usage. Canceling your plan will prevent future charges but will not trigger a refund for the current term.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Canceling Your Subscription</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Cancellation Steps:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log into your OptimaliQ account</li>
                <li>Go to Account Settings → Billing</li>
                <li>Click "Cancel Subscription"</li>
                <li>Confirm your cancellation</li>
                <li>You'll receive a confirmation email</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What Happens After Cancellation</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your subscription will not renew</li>
              <li>You'll retain access until the end of your current billing period</li>
              <li>Your data will be retained for 30 days after cancellation</li>
              <li>You can reactivate your subscription anytime</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Support?</h3>
                <p className="text-blue-700">
                  Have billing questions or technical issues? Reach out to us at{" "}
                  <a href="mailto:support@optimaliq.ai" className="text-blue-600 hover:text-blue-800 font-semibold">
                    support@optimaliq.ai
                  </a>{" "}
                  — we're happy to help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 