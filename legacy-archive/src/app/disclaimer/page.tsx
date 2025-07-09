import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - OptimaliQ",
  description: "Important legal information about the use of OptimaliQ's AI-powered insights and recommendations.",
  openGraph: {
    title: "Disclaimer - OptimaliQ",
    description: "Important legal information about the use of OptimaliQ's AI-powered insights and recommendations.",
    url: "https://yourdomain.com/disclaimer",
    siteName: "OptimaliQ",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Inter']">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 font-['Inter']">
            <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Please read this disclaimer carefully before using OptimaliQ services.
              </p>
            </div>

            <p className="text-lg mb-8">
              The insights, recommendations, and projections provided by OptimaliQ are generated using AI and data modeling and are intended for informational and strategic planning purposes only. They do not constitute legal, financial, or professional advice.
            </p>

            <p className="mb-8">
              While we strive to ensure accuracy and value, OptimaliQ makes no guarantees regarding business outcomes, performance improvements, or financial results. Users should consult with their own advisors before making business decisions.
            </p>

            <p className="mb-8">
              By using this platform, you acknowledge that you are solely responsible for the actions you take based on the information provided.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Points:</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>AI-generated insights are for informational purposes only</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>No guarantees regarding business outcomes or financial results</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Consult with your own advisors before making business decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>You are responsible for actions taken based on our insights</span>
                </li>
              </ul>
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