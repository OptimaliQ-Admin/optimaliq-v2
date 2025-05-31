export default function ComparisonBlock() {
  return (
    <section className="max-w-6xl mx-auto my-20 bg-gray-100 rounded-lg p-10 shadow-lg">
      <h2 className="text-5xl font-semibold text-center text-gray-800">
        Why <span className="text-blue-600">OptimaliQ</span> Wins — Every Time
      </h2>
      <p className="text-lg text-gray-600 text-center mt-2">
        AI-powered. Always on. Built for real business momentum.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* OptimaliQ */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-700">
          <h3 className="text-2xl font-bold text-blue-600">OptimaliQ</h3>
          <ul className="mt-4 text-gray-700 space-y-3">
            <li>✅ All this starting at just <strong>$329/month</strong></li>
            <li>✅ Instant Strategy with Zero Ramp-Up</li>
            <li>✅ Real-Time Market & Trend Intelligence (Updated Weekly)</li>
            <li>✅ Monthly Progress Reviews with Actionable Adjustments</li>
            <li>✅ Benchmarking vs. Industry & Top Performers</li>
          </ul>
        </div>

        {/* Traditional Consulting */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <h3 className="text-2xl font-bold text-red-600">Traditional Consulting</h3>
          <ul className="mt-4 text-gray-700 space-y-3">
            <li>❌ $10,000+ Retainers</li>
            <li>❌ Slow, Manual Reporting</li>
            <li>❌ Recommendations Stale by the Time You Get Them</li>
            <li>❌ Limited to Human Bandwidth</li>
            <li>❌ Static Strategy Without Data Refresh</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
