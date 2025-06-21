"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock blog post data - in production this would come from a CMS or API
const blogPosts = {
  "1": {
    id: 1,
    title: "AI-Powered Business Strategy: How Mid-Market Leaders Drive Competitive Advantage",
    excerpt: "Nearly 70% of strategic initiatives fail to meet their objectives, not because of poor intent, but due to misaligned execution and unclear priorities. In a world where business moves faster than ever, how can mid-market companies build a strategy that not only survives, but wins?",
    content: `
      <h2>Bridging the Strategy-Execution Gap with AI</h2>
      <p>Many organizations operate with a persistent gap between the boardroom&apos;s intent and frontline execution. AI-powered platforms like OptimaliQ serve as the connective tissue, transforming static plans into living, adaptive strategies driven by real-time data.</p>
      
      <blockquote class="border-l-4 border-blue-600 pl-4 italic text-gray-800 text-lg">
        &ldquo;Strategy is only as strong as its ability to adapt in real-time. AI enables a continuous feedback loop, turning plans from annual rituals into daily disciplines.&rdquo;
      </blockquote>
      
      <p><strong>Example:</strong> Consider a mid-market manufacturer that cut time-to-market by 30% using AI-driven scenario analysis, aligning product launches to shifting customer demand in weeks, not quarters.</p>
      
      <h2>From Gut Instinct to Data-Driven Decisions</h2>
      <p>Intuition has its place, but in a world of complexity, relying solely on gut feeling is like navigating with a foggy compass. AI aggregates and analyzes vast datasets, surfacing insights that human teams might overlook and empowering leaders to make high-confidence decisions.</p>
      
      <blockquote class="border-l-4 border-blue-600 pl-4 italic text-gray-800 text-lg">
        &ldquo;The best strategy teams blend human judgment with machine intelligence, using data to challenge assumptions and uncover hidden opportunities.&rdquo;
      </blockquote>
      
      <p><strong>Example:</strong> A SaaS provider used OptimaliQ to identify underperforming markets, reallocating resources and boosting regional growth by 20%—a pivot that would have been missed using manual analysis.</p>
      
      <h2>Dynamic Scenario Planning: Navigating Uncertainty with Confidence</h2>
      <p>Traditional strategy is often linear—plan, execute, review. But business reality is anything but predictable. AI-powered scenario modeling enables leaders to pressure-test strategies against multiple futures, building organizational resilience.</p>
      
      <blockquote class="border-l-4 border-blue-600 pl-4 italic text-gray-800 text-lg">
        &ldquo;In uncertain markets, the winners are those who prepare for volatility, not just stability. Scenario planning with AI turns uncertainty into a source of competitive advantage.&rdquo;
      </blockquote>
      
      <p><strong>Example:</strong> A retail chain used OptimaliQ to simulate supply chain disruptions, proactively diversifying suppliers and avoiding costly inventory shortfalls during global logistics shocks.</p>
      
      <h2>Aligning Teams and Incentives in Real Time</h2>
      <p>Even the sharpest strategy fails without organizational alignment. AI makes it possible to cascade objectives, track progress, and adjust incentives dynamically—ensuring that every function pulls in the same direction as conditions evolve.</p>
      
      <blockquote class="border-l-4 border-blue-600 pl-4 italic text-gray-800 text-lg">
        &ldquo;Alignment is not a one-off event, but an ongoing process. AI provides the visibility and agility to keep teams synchronized and accountable.&rdquo;
      </blockquote>
      
      <p><strong>Example:</strong> A healthcare company leveraged OptimaliQ to connect executive KPIs with frontline metrics, resulting in a 15% improvement in cross-functional project delivery.</p>
      
      <h2>Conclusion</h2>
      <p>The future of strategy belongs to those who can combine vision with velocity—harnessing AI to close the gap between ambition and execution. For mid-market leaders, the opportunity is clear: embrace AI-powered platforms not as a replacement for strategic thinking, but as a catalyst for smarter, faster, and more resilient decision-making.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Ready to see where your strategy stands?</h3>
        <p class="text-gray-700 mb-4">Try OptimaliQ&apos;s free Strategic Agility Assessment to benchmark your organization&apos;s readiness and identify immediate opportunities for AI-driven improvement.</p>
        <a href="/growth-assessment" class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
          Take the Assessment
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    `,
    category: "Strategy",
    readTime: "8 min read",
    author: "Dr. Sarah Chen",
    authorRole: "AI Strategy Director",
    authorBio: "Dr. Sarah Chen is a leading expert in AI strategy with over 15 years of experience helping Fortune 500 companies implement AI-driven decision-making frameworks. She holds a PhD in Computer Science from MIT and has published over 50 peer-reviewed papers on AI applications in business.",
    publishDate: "2024-01-15",
    views: "12.5K",
    tags: ["AI Strategy", "Business Strategy", "Digital Transformation", "Strategic Planning", "Data-Driven Decisions"],
    relatedArticles: [2, 3, 4]
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['Inter']">Article Not Found</h1>
          <p className="text-gray-600 mb-8 font-['Inter']">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-['Inter']">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20 font-['Inter']"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {post.category}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold text-white leading-tight font-['Inter']"
            >
              {post.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-['Inter']"
            >
              {post.excerpt}
            </motion.p>

            {/* Article Meta */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center gap-6 text-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold font-['Inter']">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold font-['Inter']">{post.author}</p>
                  <p className="text-sm text-blue-200 font-['Inter']">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-['Inter']">
                <span>{post.readTime}</span>
                <span>•</span>
                <span>{post.views} views</span>
                <span>•</span>
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="max-w-[750px] mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-12"
        >
          {/* Article Body with Premium Typography */}
          <article className="max-w-none text-left space-y-6 font-['Inter']">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-['Inter'] prose-headings:text-gray-900 prose-headings:font-semibold
                prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:font-bold prose-h1:leading-tight
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-semibold prose-h2:leading-snug
                prose-h3:text-xl prose-h3:font-semibold prose-h3:leading-snug
                prose-p:text-base prose-p:md:text-lg prose-p:font-normal prose-p:leading-relaxed prose-p:text-gray-700
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:text-base prose-ul:md:text-lg prose-ul:text-gray-700
                prose-li:text-base prose-li:md:text-lg prose-li:text-gray-700
                prose-ol:text-base prose-ol:md:text-lg prose-ol:text-gray-700
                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-800
                prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:font-medium"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium font-['Inter']">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3 font-['Inter']">About the Author</h3>
            <p className="text-gray-700 leading-relaxed font-['Inter']">{post.authorBio}</p>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-['Inter']">Related Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {post.relatedArticles.map((articleId) => {
              const relatedPost = blogPosts[articleId.toString() as keyof typeof blogPosts];
              if (!relatedPost) return null;
              
              return (
                <Link key={articleId} href={`/blog/${articleId}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold font-['Inter']">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 font-['Inter']">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2 font-['Inter']">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 font-['Inter']">
                        <span>{relatedPost.readTime}</span>
                        <span>{relatedPost.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Back to Blog */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 font-['Inter']"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Insights
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 