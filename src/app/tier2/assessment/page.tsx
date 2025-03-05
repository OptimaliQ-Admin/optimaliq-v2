"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function AssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // ✅ Capture email from URL

  // Assessment options
  const assessments = [
    {
      id: "reassessment",
      title: "📊 Business Reassessment",
      description:
        "Re-evaluate your business using the same questions from your initial assessment and track progress over time.",
    },
    {
      id: "tech-stack",
      title: "🛠 Tech Stack Assessment",
      description:
        "Identify and analyze the software solutions used across different business channels and receive AI-driven recommendations for optimization.",
    },
    {
      id: "bpm",
      title: "⚙️ Business Process Management Assessment",
      description:
        "Analyze the efficiency of your internal processes and identify automation opportunities for improved workflow management.",
    },
    {
      id: "strategy",
      title: "🎯 Strategic Maturity Assessment",
      description:
        "Evaluate how well-developed your business strategy is and receive insights on how to refine and strengthen it.",
    },
    {
      id: "marketing-effectiveness",
      title: "📢 Marketing Effectiveness Assessment",
      description:
        "Analyze your marketing performance and receive AI-driven recommendations on where to optimize your efforts.",
    },
    {
      id: "sales-performance",
      title: "🎯 Sales Performance Assessment",
      description:
        "Evaluate your sales pipeline, conversion rates, and customer engagement to optimize your revenue strategy.",
    },
    {
      id: "customer-experience",
      title: "👥 Customer Experience Assessment",
      description:
        "Understand your customer satisfaction levels and discover opportunities to improve retention and engagement.",
    },
    {
      id: "ai-readiness",
      title: "🚀 AI & Automation Readiness Assessment",
      description:
        "Measure how effectively your business is leveraging AI and automation to drive growth and efficiency.",
    },
    {
      id: "digital-transformation",
      title: "📡 Digital Transformation Readiness",
      description:
        "Evaluate how well your business is prepared for digital transformation and modern tech adoption.",
    },
    {
      id: "leadership-team",
      title: "🏢 Leadership & Team Performance Assessment",
      description:
        "Assess leadership effectiveness and team alignment to optimize company culture and execution.",
    },
    {
      id: "competitive-benchmarking",
      title: "📊 Competitive Benchmarking Assessment",
      description:
        "Compare your business performance against industry peers to identify areas of strength and improvement.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">GMF+</h2>
          <nav className="space-y-4">
            <a href={`/tier2/dashboard?email=${encodeURIComponent(email)}`} className="block text-gray-700 hover:text-blue-600 font-medium">📊 Dashboard</a>
            <a href={`/tier2/insights?email=${encodeURIComponent(email)}`} className="block text-gray-700 hover:text-blue-600 font-medium">📑 Insights</a>
            <a href={`/tier2/assessment?email=${encodeURIComponent(email)}`} className="block text-blue-600 font-bold">📝 Assessments</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">👥 Community</a>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <p className="text-gray-700 font-medium">{email || "User"}</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 space-y-6">
        <header className="w-full max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">📝 Business Assessments</h1>
          <p className="text-gray-600 mt-2">Choose an assessment to gain deeper insights into your business.</p>
        </header>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition"
              onClick={() => router.push(`/tier2/assessment/${assessment.id}?email=${encodeURIComponent(email)}`)}
            >
              <h2 className="text-xl font-bold text-gray-800">{assessment.title}</h2>
              <p className="text-gray-600 mt-2">{assessment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}