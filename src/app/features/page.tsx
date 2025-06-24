'use client';
import Head from "next/head";
import { ChevronRight, TrendingUp, Target, BarChart3, Zap, Users, Lightbulb, ArrowRight } from "lucide-react";

// Sample data for demos
const sampleAssessmentData = {
  overallScore: 78,
  categories: [
    { name: "AI Readiness", score: 85, color: "bg-blue-500" },
    { name: "Digital Maturity", score: 72, color: "bg-green-500" },
    { name: "Customer Focus", score: 81, color: "bg-purple-500" },
    { name: "Operational Excellence", score: 74, color: "bg-orange-500" },
  ]
};

const sampleSimulationData = {
  scenarios: [
    { name: "Current State", revenue: 1000000, growth: 12 },
    { name: "AI Implementation", revenue: 1250000, growth: 18 },
    { name: "Process Optimization", revenue: 1150000, growth: 15 },
    { name: "Market Expansion", revenue: 1400000, growth: 22 },
  ]
};

const sampleBenchmarkData = {
  company: "Your Company",
  competitors: [
    { name: "Industry Average", score: 65 },
    { name: "Top Performers", score: 85 },
    { name: "Your Company", score: 78 },
  ],
  metrics: ["AI Adoption", "Digital Maturity", "Customer Experience", "Operational Efficiency"]
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Head>
        <title>Platform Features - AI-Powered Growth Tools</title>
        <meta name="description" content="Explore our interactive growth management tools: AI assessments, strategic simulations, competitive benchmarking, and real-time insights." />
      </Head>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              See Your Growth Tools in
              <span className="text-blue-600"> Action</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the power of AI-driven growth management with interactive demos of our key features. 
              See how these tools can transform your business strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* AI Assessment Demo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Growth Assessment</h3>
                  <p className="text-gray-600">Comprehensive evaluation of your growth potential</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Overall Score</span>
                  <span className="text-2xl font-bold text-blue-600">{sampleAssessmentData.overallScore}/100</span>
                </div>
                
                <div className="space-y-3">
                  {sampleAssessmentData.categories.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between animate-fade-in-left"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${category.color} animate-progress-bar`}
                            style={{ 
                              width: `${category.score}%`,
                              animationDelay: `${index * 100 + 300}ms`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-8">{category.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>AI Insight:</strong> Your AI readiness is strong, but digital maturity needs attention. 
                  Focus on process automation to unlock 15% growth potential.
                </p>
              </div>
            </div>

            {/* Growth Simulation Demo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Growth Simulation</h3>
                  <p className="text-gray-600">Test different strategies and see their impact</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {sampleSimulationData.scenarios.map((scenario, index) => (
                  <div
                    key={scenario.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">${scenario.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">+{scenario.growth}%</span>
                      <p className="text-xs text-gray-500">Growth Rate</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Recommendation:</strong> AI Implementation shows the highest ROI potential. 
                  Start with pilot programs in customer service and marketing.
                </p>
              </div>
            </div>

            {/* Competitive Benchmarking Demo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Competitive Benchmarking</h3>
                  <p className="text-gray-600">See how you stack up against the competition</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {sampleBenchmarkData.competitors.map((competitor, index) => (
                  <div
                    key={competitor.name}
                    className="flex items-center justify-between p-3 rounded-lg border animate-fade-in-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="font-medium text-gray-900">{competitor.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${competitor.name === "Your Company" ? "bg-purple-500" : "bg-gray-400"} animate-progress-bar`}
                          style={{ 
                            width: `${competitor.score}%`,
                            animationDelay: `${index * 100 + 300}ms`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8">{competitor.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Position:</strong> You&apos;re ahead of industry average but trailing top performers. 
                  Focus on AI adoption to close the gap.
                </p>
              </div>
            </div>

            {/* Real-time Insights Demo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Real-time Insights</h3>
                  <p className="text-gray-600">Live data and actionable recommendations</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div
                  className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <h4 className="font-medium text-blue-900 mb-2">Market Opportunity Detected</h4>
                  <p className="text-sm text-blue-800">
                    Customer satisfaction scores dropped 8% this quarter. 
                    Immediate action recommended.
                  </p>
                </div>
                
                <div
                  className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 animate-fade-in"
                  style={{ animationDelay: "400ms" }}
                >
                  <h4 className="font-medium text-green-900 mb-2">Growth Trend Identified</h4>
                  <p className="text-sm text-green-800">
                    AI-powered marketing campaigns showing 23% higher conversion rates.
                    Consider scaling successful strategies.
                  </p>
                </div>
                
                <div
                  className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 animate-fade-in"
                  style={{ animationDelay: "600ms" }}
                >
                  <h4 className="font-medium text-purple-900 mb-2">Competitive Alert</h4>
                  <p className="text-sm text-purple-800">
                    Competitor launched new AI feature. 
                    Review your product roadmap for opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try It Yourself
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a sample of our growth assessment. See how AI analyzes your business and provides actionable insights.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center animate-fade-in-scale">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Assessment</h3>
                  <p className="text-gray-600">Answer 5 key questions about your business</p>
                </div>
                
                <div className="text-center animate-fade-in-scale" style={{ animationDelay: "100ms" }}>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
                  <p className="text-gray-600">Get instant insights and recommendations</p>
                </div>
                
                <div className="text-center animate-fade-in-scale" style={{ animationDelay: "200ms" }}>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Plan</h3>
                  <p className="text-gray-600">Receive your personalized growth strategy</p>
                </div>
              </div>
              
              <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                  Start Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <p className="text-sm text-gray-600 mt-2">No credit card required • Takes 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Growth?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of companies using AI-powered insights to accelerate their growth. 
              Get access to all these tools and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Start Free Trial
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
              <button className="inline-flex items-center px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes progressBar {
          from {
            width: 0;
          }
          to {
            width: var(--target-width);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }
        
        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-progress-bar {
          animation: progressBar 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 