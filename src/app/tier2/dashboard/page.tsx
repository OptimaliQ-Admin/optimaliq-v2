"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Tier2Dashboard() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setError("No email provided.");
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const insightsResponse = await axios.post("/api/tier2/getInsights", { email });
        const trendsResponse = await axios.post("/api/tier2/getTrends", { industry: "Consulting" });

        console.log("✅ AI Insights Response:", insightsResponse.data);
        console.log("✅ Industry Trends Response:", trendsResponse.data);

        if (insightsResponse.data.error) {
          setError(insightsResponse.data.error);
        } else {
          setInsights({
            ...insightsResponse.data,
            topTrends: trendsResponse.data?.topTrends || [],
          });
        }
      } catch (err) {
        setError("Failed to retrieve insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [email]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Navigation - Maintain User Session */}
      <aside className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">GMF+</h2>
          <nav className="space-y-4">
            <a href={`/tier2/dashboard?email=${encodeURIComponent(email)}`}
              className="block text-gray-700 hover:text-blue-600 font-medium">
              📊 Dashboard
            </a>
            <a href={`/tier2/insights?email=${encodeURIComponent(email)}`}
              className="block text-gray-700 hover:text-blue-600 font-medium">
              📑 Insights
            </a>
            <a href={`/tier2/assessment?email=${encodeURIComponent(email)}`}
              className="block text-gray-700 hover:text-blue-600 font-medium">
              📝 Assessment
            </a>

            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">👥 Community</a>
          </nav>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Placeholder for user avatar */}
          <p className="text-gray-700 font-medium">{email || "User"}</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 space-y-6">
        {loading ? (
          <p className="text-gray-600 text-lg text-center">Loading insights...</p>
        ) : error ? (
          <p className="text-red-500 text-lg text-center">{error}</p>
        ) : (
          <>
            {/* TOP SECTION - Overall Score & Benchmarking */}
            <div className="flex gap-6">
              {/* 🏆 Overall Score */}
              <div className="flex-1 p-6 shadow-lg bg-white text-center rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">🏆 Overall Score</h2>
                <p className="text-5xl font-bold text-blue-600 mt-2">
                  {insights?.score || "N/A"} / 5
                </p>
                <p className="text-gray-600 mt-2">
                  Industry Avg: <strong>{insights?.industryAvgScore || "N/A"} / 5</strong> |
                  Top Performers: <strong>{insights?.topPerformerScore || "N/A"} / 5</strong>
                </p>
                <div className="flex-1 p-6 shadow-lg bg-white rounded-lg text-left">
                  <h2 className="text-lg font-bold text-gray-700">📊 Business Benchmarking</h2>
                  <p className="text-gray-700 mt-2"><strong>📌 Strategy Score:</strong> {insights?.strategyScore} / 5</p>
                  <p className="text-gray-600 italic">{insights?.benchmarking?.strategy || "No insight available."}</p>
                  <p className="text-gray-700 mt-2"><strong>⚙️ Process Score:</strong> {insights?.processScore} / 5</p>
                  <p className="text-gray-600 italic">{insights?.benchmarking?.process || "No insight available."}</p>
                  <p className="text-gray-700 mt-2"><strong>🔧 Technology Score:</strong> {insights?.technologyScore} / 5</p>
                  <p className="text-gray-600 italic">{insights?.benchmarking?.technology || "No insight available."}</p>
                </div>
              </div>

              {/* 📊 Business Benchmarking */}
              <div className="flex-1 p-6 shadow-lg bg-white rounded-lg">
                {/* 📈 Growth Projection Chart */}
                {insights?.chartData && (
                  <div className="flex-1 p-6 shadow-lg bg-white rounded-lg">
                    <h2 className="text-lg font-bold text-gray-700">📈 Growth Projection</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={insights.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[1, 5]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="userScore" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="industryScore" stroke="#E53E3E" strokeWidth={3} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {/* 🚀 Growth Plan */}
                <div className="flex-1 p-6 shadow-lg bg-white rounded-lg">
                  <h2 className="text-lg font-bold text-gray-700">🚀 Next 30-Day Growth Plan</h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {insights?.roadmap && Array.isArray(insights.roadmap)
                      ? insights.roadmap.map((step, index) => (
                        <li key={index}>
                          <strong>{step.task}:</strong> {step.expectedImpact}
                        </li>
                      ))
                      : <li>N/A</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION - Strengths & Weaknesses */}
            <div className="flex gap-6">
              {/* ✅ Strengths */}
              <div className="flex-1 p-6 shadow-lg bg-white rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">✅ Strengths</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {Array.isArray(insights?.strengths) && insights.strengths.length > 0
                    ? insights.strengths.map((strength, index) => (
                      <li key={index}>
                        <strong>{strength.title}:</strong> {strength.impact}
                      </li>
                    ))
                    : <li>N/A</li>}
                </ul>
              </div>

              {/* 🚨 Weaknesses */}
              <div className="flex-1 p-6 shadow-lg bg-white rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">🚨 Weaknesses</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {Array.isArray(insights?.weaknesses) && insights.weaknesses.length > 0
                    ? insights.weaknesses.map((weakness, index) => (
                      <li key={index}>
                        <strong>{weakness.title}:</strong> {weakness.impact}
                      </li>
                    ))
                    : <li>N/A</li>}
                </ul>
              </div>
            </div>
            {/* BOTTOM SECTION - Trends & Insights */}
            <div className="flex-1 p-6 shadow-lg bg-white rounded-lg">
              <h2 className="text-lg font-bold text-gray-700">📊 Trends & Insights</h2>

              {loading ? (
                <p className="text-gray-500 mt-2">Loading trends...</p>
              ) : (
                <>
                  {insights?.topTrends?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {insights.topTrends.map((trend, index) => (
                        <div key={index} className="p-4 shadow-lg bg-white rounded-lg border border-gray-200">
                          <h3 className="text-lg font-bold text-gray-800">{trend.trend}</h3>
                          <p className="text-gray-600 mt-1 italic">{trend.whyItMatters}</p>

                          <p className="text-gray-600 mt-2">
                            <strong>Company Adoption:</strong> {(trend.aiAdoption * 100).toFixed(1)}% of businesses use this.
                          </p>

                          <p className="text-gray-600 mt-1">
                            <strong>Growth Potential:</strong> {trend.growthPotentialExplanation}
                          </p>

                          <p className="text-gray-600 mt-1">
                            <strong>Impact Score:</strong> {trend.impactScore ? trend.impactScore.toFixed(1) : "N/A"}
                          </p>

                          <p className="text-gray-600 mt-1">
                            <strong>Impact Score Explanation:</strong> {trend.impactScoreExplanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No trends available.</p>
                  )}
                </>
              )}
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col p-8 space-y-6">
              {/* 📊 Market Trend Prediction (Placeholder) */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">📊 Market Trend Prediction (Placeholder)</h2>
                <p className="text-gray-600 mt-2">(Includes real market data, stock trends, and sector performance)

                  Shows how an industry is performing over time.
                  Pulls in real-world data from stock markets, economic trends, and business reports.
                  Helps users understand their industry’s trajectory.
                  ✅ Example Insights Shown to the User:
                  📈 “Retail eCommerce growth has slowed to 3% YoY, but luxury brands are still growing at 10%.”
                  💰 “Tech hiring slowed by 8% this quarter, but SaaS investments remain strong.”
                  🔥 “Companies in [Industry] investing in automation are seeing 12% cost savings.”

                  🔹 Tools: Line Chart + Industry Reports</p>
              </div>

              {/* 🔥 Business Trend Predictions (Placeholder) */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">🔥 Business Trend Predictions (Placeholder)</h2>
                <p className="text-gray-600 mt-2">(Broad business trends, not just AI-focused)

                  Top 5 trends impacting businesses today (includes shifts in consumer behavior, operational efficiency, digital transformation, hiring, supply chain).
                  AI is included only when relevant.
                  ✅ Example Insights Shown to the User:
                  📢 “Remote work is stabilizing at 40% adoption—companies are shifting to hybrid policies.”
                  📊 “Subscription-based business models are outperforming one-time purchases.”
                  🚀 “Supply chain resilience is now a major investment area for manufacturers.”

                  🔹 Tools: Scrolling Ticker with Real Business Insights</p>
              </div>

              {/* ⚠️ Top Challenges & Opportunities in Industry (Placeholder) */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">⚠️ Top Challenges & Opportunities in Industry (Placeholder)</h2>
                <p className="text-gray-600 mt-2">(Based on market research, economic trends, and case studies)

                  What businesses are struggling with today & where the opportunities lie.
                  Industry-specific insights, e.g., for eCommerce, SaaS, Manufacturing, Consulting, etc.
                  ✅ Example Insights Shown to the User:
                  ⚠️ “Customer acquisition costs have risen by 30%—brands are shifting to retention strategies.”
                  📈 “B2B buyers are delaying decisions longer—shortening sales cycles is now a priority.”
                  💡 “Companies that adopted subscription models are seeing 3x higher retention.”

                  🔹 Tools: Heatmap or Word Cloud</p>
              </div>

              {/* 📢 Marketing Investment Trends (Placeholder) */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-bold text-gray-700">📢 Marketing Investment Trends (Placeholder)</h2>
                <p className="text-gray-600 mt-2">(Guides businesses on the most effective marketing channels in their industry)

                  Breaks down which marketing channels are giving the best ROI.
                  Shows how businesses in their industry are investing in marketing (SEO, Paid Ads, Social, Events, Email, etc.).
                  ✅ Example Insights Shown to the User:
                  📊 “SEO & content marketing are delivering the highest ROI—paid ads are getting expensive.”
                  📉 “Social media organic reach has dropped by 40%—but influencer marketing is growing.”
                  💰 “Email marketing continues to outperform paid ads in customer retention (5x ROI).”

                  🔹 Tools: Bar Chart or Pie Chart</p>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
