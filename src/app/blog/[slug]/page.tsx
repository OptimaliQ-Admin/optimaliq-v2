"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getBlogPost } from "@/lib/data/blogPosts";
import { sanitizeHTML } from "@/lib/utils/sanitization";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPost(slug);

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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-16"
        >
          {/* Article Body with Optimized Typography */}
          <article className="max-w-none text-left">
            <div 
              className="prose prose-optimaliq max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
            />
          </article>

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium font-['Inter']">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Inter']">About the Author</h3>
            <p className="text-gray-700 leading-relaxed text-lg font-['Inter']">{post.authorBio}</p>
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
              const relatedPost = getBlogPost(articleId.toString());
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