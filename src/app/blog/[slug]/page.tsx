"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock blog post data - in production this would come from a CMS or API
const blogPosts = {
  "1": {
    id: 1,
    title: "The Future of AI-Driven Business Strategy: 2024 Insights",
    excerpt: "Discover how artificial intelligence is reshaping strategic decision-making and creating unprecedented opportunities for business growth.",
    content: `
      <h2>The AI Revolution in Strategic Planning</h2>
      <p>Artificial intelligence is fundamentally transforming how organizations approach strategic decision-making. In 2024, we&apos;re witnessing a paradigm shift where AI isn&apos;t just a tool for automation—it&apos;s becoming the foundation for competitive advantage.</p>
      
      <h3>Key Trends Shaping AI Strategy</h3>
      <p>Our analysis of over 500 companies reveals three critical trends:</p>
      <ul>
        <li><strong>Predictive Analytics:</strong> 78% of leading companies now use AI for market forecasting</li>
        <li><strong>Real-time Decision Making:</strong> AI enables strategic pivots in hours, not months</li>
        <li><strong>Personalized Strategy:</strong> Customized approaches for different business units</li>
      </ul>
      
      <h3>Implementation Framework</h3>
      <p>Successful AI strategy implementation requires a systematic approach:</p>
      <ol>
        <li><strong>Assessment Phase:</strong> Evaluate current capabilities and data infrastructure</li>
        <li><strong>Pilot Programs:</strong> Start with high-impact, low-risk initiatives</li>
        <li><strong>Scale and Optimize:</strong> Expand successful pilots across the organization</li>
      </ol>
      
      <h2>Case Study: TechCorp&apos;s Transformation</h2>
      <p>TechCorp, a mid-sized technology company, implemented AI-driven strategy and achieved:</p>
      <ul>
        <li>40% faster decision-making cycles</li>
        <li>25% improvement in market prediction accuracy</li>
        <li>$2.3M in cost savings through optimized resource allocation</li>
      </ul>
      
      <h3>Looking Ahead: 2025 Predictions</h3>
      <p>As we look toward 2025, we anticipate several developments:</p>
      <ul>
        <li>AI will become standard in board-level strategic discussions</li>
        <li>Real-time strategy adjustment will be the norm</li>
        <li>Companies without AI strategy capabilities will face significant competitive disadvantages</li>
      </ul>
    `,
    category: "Strategy",
    readTime: "8 min read",
    author: "Dr. Sarah Chen",
    authorRole: "AI Strategy Director",
    authorBio: "Dr. Sarah Chen is a leading expert in AI strategy with over 15 years of experience helping Fortune 500 companies implement AI-driven decision-making frameworks. She holds a PhD in Computer Science from MIT and has published over 50 peer-reviewed papers on AI applications in business.",
    publishDate: "2024-01-15",
    views: "12.5K",
    tags: ["AI", "Strategy", "Innovation"],
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