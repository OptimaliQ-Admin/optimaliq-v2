/**
 * OptimaliQ Blog & Resources Page
 * Enterprise AI platform thought leadership and insights
 * Recreated with enterprise-grade feel and strategic content positioning
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Lightbulb,
  Award,
  Zap,
  Eye,
  Heart,
  Share2,
  Download,
  Play,
  FileText,
  Video,
  Headphones,
  ExternalLink,
  Brain,
  Rocket,
  Shield,
  Globe,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'

// Enterprise AI platform blog data
const blogData = {
  featured: {
    id: 1,
    title: 'The Future of AI-Powered Business Intelligence: 5 Trends to Watch in 2024',
    excerpt: 'Discover how artificial intelligence is transforming business intelligence and what organizations need to know to stay competitive in the evolving landscape.',
    content: '',
    author: 'Sarah Chen',
    authorRole: 'CEO & Co-Founder',
    publishedAt: '2024-08-25',
    readTime: '8 min read',
    category: 'AI & Technology',
    tags: ['AI', 'Business Intelligence', 'Trends', 'Strategy'],
    image: '/api/placeholder/800/400',
    featured: true,
    views: 2847,
    likes: 156
  },
  categories: [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'strategy', name: 'Strategic Intelligence', count: 8 },
    { id: 'ai-technology', name: 'AI & Technology', count: 6 },
    { id: 'growth', name: 'Growth Optimization', count: 5 },
    { id: 'case-studies', name: 'Enterprise Case Studies', count: 3 },
    { id: 'how-to', name: 'Implementation Guides', count: 2 }
  ],
  posts: [
    {
      id: 2,
      title: 'How Enterprise Organizations Can Leverage AI for Strategic Planning',
      excerpt: 'Learn practical strategies for implementing AI-powered planning tools in enterprise organizations, with real examples and actionable insights.',
      author: 'Michael Rodriguez',
      authorRole: 'CTO & Co-Founder',
      publishedAt: '2024-08-22',
      readTime: '6 min read',
      category: 'Strategic Intelligence',
      tags: ['Enterprise', 'AI', 'Strategic Planning'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 1923,
      likes: 89
    },
    {
      id: 3,
      title: 'Case Study: How TechFlow Increased Efficiency by 40% with OptimaliQ',
      excerpt: 'Discover how a mid-sized technology company used OptimaliQ assessments to identify bottlenecks and implement strategic improvements.',
      author: 'Emily Johnson',
      authorRole: 'Head of Product',
      publishedAt: '2024-08-20',
      readTime: '10 min read',
      category: 'Enterprise Case Studies',
      tags: ['Case Study', 'Technology', 'Efficiency', 'Results'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 3456,
      likes: 234
    },
    {
      id: 4,
      title: 'Multi-Tenant AI Architecture: Building Scalable Enterprise Solutions',
      excerpt: 'Explore the technical architecture behind enterprise-grade AI platforms and how to design for scale, security, and performance.',
      author: 'David Kim',
      authorRole: 'Head of AI',
      publishedAt: '2024-08-18',
      readTime: '12 min read',
      category: 'AI & Technology',
      tags: ['Architecture', 'Enterprise', 'AI', 'Scalability'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 1876,
      likes: 145
    },
    {
      id: 5,
      title: 'RAG vs Traditional AI: Why Retrieval-Augmented Generation is Revolutionizing Business Intelligence',
      excerpt: 'Understand the key differences between RAG and traditional AI approaches, and why RAG is becoming the standard for enterprise AI applications.',
      author: 'Michael Rodriguez',
      authorRole: 'CTO & Co-Founder',
      publishedAt: '2024-08-15',
      readTime: '9 min read',
      category: 'AI & Technology',
      tags: ['RAG', 'AI', 'Business Intelligence', 'Technology'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 2987,
      likes: 178
    },
    {
      id: 6,
      title: 'Enterprise Security in AI Platforms: SOC 2, GDPR, and Beyond',
      excerpt: 'Learn about the critical security considerations for enterprise AI platforms and how OptimaliQ maintains the highest standards.',
      author: 'Sarah Chen',
      authorRole: 'CEO & Co-Founder',
      publishedAt: '2024-08-12',
      readTime: '7 min read',
      category: 'Strategic Intelligence',
      tags: ['Security', 'Compliance', 'Enterprise', 'AI'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 2341,
      likes: 123
    }
  ]
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogData.posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const selectedCategoryData = blogData.categories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <Section className="py-20 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-indigo-900/85 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/25 backdrop-blur-md rounded-xl border border-blue-400/40 shadow-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500/25 backdrop-blur-md rounded-xl border border-indigo-400/40 shadow-lg animate-pulse delay-1000"></div>
        
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Blog & Resources
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Enterprise AI{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              <p className="text-2xl font-semibold text-blue-300 mb-8">
                Strategic intelligence and thought leadership for the AI-powered enterprise
              </p>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Stay ahead of the curve with expert insights on AI-powered business intelligence, strategic planning, and enterprise transformation. Our thought leadership content helps organizations understand and leverage cutting-edge AI technology.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Featured Post Section */}
      <Section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Featured Insight
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our latest strategic analysis on the future of AI-powered business intelligence
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-xl"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Featured
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {blogData.featured.title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {blogData.featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{blogData.featured.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{blogData.featured.publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{blogData.featured.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  {blogData.featured.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-gray-500">Featured Image</span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
                  {blogData.featured.views} views
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Search and Filter Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Explore Our Insights
              </h2>
              <p className="text-lg text-gray-700">
                Discover strategic insights, technical deep-dives, and enterprise case studies
              </p>
            </motion.div>

            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Articles
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title, content, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    options={blogData.categories.map(cat => ({
                      value: cat.id,
                      label: `${cat.name} (${cat.count})`
                    }))}
                    placeholder="Select category"
                  />
                </div>
              </div>
            </motion.div>

            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 mb-8 justify-center"
            >
              {blogData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </motion.div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-gray-500">Post Image</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{post.publishedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results Message */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Stay Ahead with Strategic Intelligence
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Get the latest insights on AI-powered business intelligence and enterprise transformation delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No spam, unsubscribe anytime. Read our privacy policy.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
