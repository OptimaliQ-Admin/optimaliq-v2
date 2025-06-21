"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Mock blog data - in production this would come from a CMS or API
const featuredArticles = [
  {
    id: 1,
    title: "The Future of AI-Driven Business Strategy: 2024 Insights",
    excerpt: "Discover how artificial intelligence is reshaping strategic decision-making and creating unprecedented opportunities for business growth.",
    category: "Strategy",
    readTime: "8 min read",
    author: "Dr. Sarah Chen",
    authorRole: "AI Strategy Director",
    publishDate: "2024-01-15",
    image: "/images/blog/ai-strategy.jpg",
    featured: true,
    views: "12.5K",
    tags: ["AI", "Strategy", "Innovation"]
  },
  {
    id: 2,
    title: "Scaling Operations: Lessons from 100+ High-Growth Companies",
    excerpt: "Analyzing the operational patterns that separate successful scale-ups from those that struggle to maintain momentum.",
    category: "Operations",
    readTime: "12 min read",
    author: "Marcus Rodriguez",
    authorRole: "Operations Expert",
    publishDate: "2024-01-12",
    image: "/images/blog/scaling-operations.jpg",
    featured: true,
    views: "8.9K",
    tags: ["Scaling", "Operations", "Growth"]
  },
  {
    id: 3,
    title: "Digital Transformation: Beyond Technology Implementation",
    excerpt: "Why 70% of digital transformations fail and how to ensure yours succeeds through cultural change and strategic alignment.",
    category: "Digital",
    readTime: "10 min read",
    author: "Emily Watson",
    authorRole: "Digital Transformation Lead",
    publishDate: "2024-01-10",
    image: "/images/blog/digital-transformation.jpg",
    featured: true,
    views: "15.2K",
    tags: ["Digital", "Transformation", "Culture"]
  }
];

const recentArticles = [
  {
    id: 4,
    title: "Customer-Centric Growth: Building Loyalty in the Digital Age",
    excerpt: "How leading companies are using data and AI to create personalized experiences that drive long-term customer value.",
    category: "Customer Experience",
    readTime: "6 min read",
    author: "Alex Thompson",
    authorRole: "Customer Success Director",
    publishDate: "2024-01-08",
    image: "/images/blog/customer-experience.jpg",
    views: "6.7K",
    tags: ["Customer Experience", "Loyalty", "Personalization"]
  },
  {
    id: 5,
    title: "Financial Modeling for Strategic Decision Making",
    excerpt: "Advanced techniques for building financial models that support strategic planning and investment decisions.",
    category: "Finance",
    readTime: "14 min read",
    author: "Dr. James Wilson",
    authorRole: "Financial Strategy Advisor",
    publishDate: "2024-01-05",
    image: "/images/blog/financial-modeling.jpg",
    views: "4.3K",
    tags: ["Finance", "Modeling", "Strategy"]
  },
  {
    id: 6,
    title: "Market Entry Strategies: A Comprehensive Framework",
    excerpt: "Systematic approach to entering new markets, from initial research to successful market penetration.",
    category: "Strategy",
    readTime: "11 min read",
    author: "Lisa Park",
    authorRole: "Market Strategy Consultant",
    publishDate: "2024-01-03",
    image: "/images/blog/market-entry.jpg",
    views: "7.1K",
    tags: ["Market Entry", "Strategy", "Expansion"]
  }
];

const categories = [
  { name: "Strategy", count: 24, color: "from-blue-500 to-indigo-600" },
  { name: "Operations", count: 18, color: "from-green-500 to-emerald-600" },
  { name: "Digital", count: 22, color: "from-purple-500 to-pink-600" },
  { name: "Finance", count: 15, color: "from-orange-500 to-red-600" },
  { name: "Customer Experience", count: 20, color: "from-teal-500 to-cyan-600" },
  { name: "Leadership", count: 16, color: "from-gray-500 to-slate-600" }
];

const trendingTopics = [
  "AI Strategy", "Digital Transformation", "Customer Experience", 
  "Operational Excellence", "Financial Modeling", "Market Entry"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = [...featuredArticles, ...recentArticles].filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Latest Insights
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-white leading-tight"
            >
              Strategic
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
            >
              Expert insights on business strategy, digital transformation, and operational excellence. 
              Join 50,000+ executives staying ahead of the curve.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search insights, strategies, and expert analysis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300"
                />
                <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Categories Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All Topics
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Articles */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Featured Insights</h2>
            <Link href="/blog/featured" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${article.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>{article.views} views</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {article.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{article.author}</p>
                            <p className="text-xs text-gray-500">{article.authorRole}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(article.publishDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Articles Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Latest Insights</h2>
            <Link href="/blog/latest" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${article.id}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-105">
                    <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.readTime}</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay Ahead of the Curve
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get weekly insights on strategy, operations, and digital transformation delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300">
                Subscribe
              </button>
            </div>
            
            <p className="text-sm text-blue-200 mt-4">
              Join 50,000+ executives. No spam, unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 