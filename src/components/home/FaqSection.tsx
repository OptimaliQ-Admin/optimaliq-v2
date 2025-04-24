"use client";

const faqs = [
  {
    question: "How does OptimaliQ compare to hiring a consultant?",
    answer:
      "OptimaliQ delivers continuous, AI-powered insights instantly, while consulting firms charge high retainers for one-time reports.",
  },
  {
    question: "Can this work for small businesses?",
    answer:
      "Yes! Whether you're a startup or enterprise, OptimaliQ adapts to your needs with AI-driven insights that scale as you grow.",
  },
  {
    question: "How does OptimaliQ predict growth?",
    answer:
      "We analyze real-time industry data, past performance, and competitive benchmarks to provide accurate business forecasts.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. OptimaliQ follows strict data privacy policies and uses enterprise-grade security to protect your business data.",
  },
  {
    question: "How often does OptimaliQ update insights?",
    answer:
      "Our AI continuously learns and updates insights in real-time, ensuring you always have the latest competitive intelligence.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto text-center px-4">
        {/* Section Title */}
        <div className="relative flex items-center justify-center mb-10">
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
          <span className="flex-1 border-t-2 border-gray-300 mx-6 w-[100px]"></span>
        </div>

        <div className="mt-10 max-w-4xl mx-auto space-y-4 text-left">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-md transition-all"
            >
              <summary className="font-bold text-lg cursor-pointer flex justify-between items-center text-gray-800 dark:text-white">
                {question}
                <span className="group-open:rotate-180 transition-transform text-xl">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
