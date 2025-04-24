export default function ComparisonBlock() {
    return (
      <section className="max-w-6xl mx-auto my-20 bg-gray-100 dark:bg-gray-900 rounded-lg p-10 shadow-lg">
        <h2 className="text-5xl font-semibold text-center text-gray-800 dark:text-white">
          Why Choose <span className="text-blue-600">OptimaliQ?</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mt-2">
          Your competition is scaling faster with AI-driven strategy and real-time market intelligence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-700">
            <h3 className="text-2xl font-bold text-blue-600">OptimaliQ</h3>
            <ul className="mt-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>✅ Free Plan to Start</li>
              <li>✅ Instant AI-Powered Insights</li>
              <li>✅ Continuous Business Optimization</li>
              <li>✅ AI Task Execution & Workflow Automation</li>
              <li>✅ CRM & SaaS Integrations</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-red-600">
            <h3 className="text-2xl font-bold text-red-600">Traditional Consulting</h3>
            <ul className="mt-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>❌ $10,000+ Retainers</li>
              <li>❌ Weeks for Reports</li>
              <li>❌ No Continuous Adjustments</li>
              <li>❌ No AI Execution</li>
              <li>❌ No Integrations</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
  