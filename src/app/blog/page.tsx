/**
 * OptimaliQ Blog & Resources Page
 * Comprehensive blog with articles, guides, and resources
 */

import React from 'react'
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
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'

// Sample blog data
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
    { id: 'strategy', name: 'Strategy', count: 8 },
    { id: 'ai-technology', name: 'AI & Technology', count: 6 },
    { id: 'growth', name: 'Growth', count: 5 },
    { id: 'case-studies', name: 'Case Studies', count: 3 },
    { id: 'how-to', name: 'How-To Guides', count: 2 }
  ],
  posts: [
    {
      id: 2,
      title: 'How Non-Profit Organizations Can Leverage AI for Strategic Planning',
      excerpt: 'Learn practical strategies for implementing AI-powered planning tools in non-profit organizations, with real examples and actionable insights.',
      author: 'Michael Rodriguez',
      authorRole: 'CTO & Co-Founder',
      publishedAt: '2024-08-22',
      readTime: '6 min read',
      category: 'Strategy',
      tags: ['Non-Profit', 'AI', 'Strategic Planning'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 1923,
      likes: 89
    },
    {
      id: 3,
      title: 'Case Study: How HealthForward Increased Efficiency by 40% with OptimaliQ',
      excerpt: 'Discover how a mid-sized healthcare non-profit used OptimaliQ assessments to identify bottlenecks and implement strategic improvements.',
      author: 'Emily Johnson',
      authorRole: 'Head of Product',
      publishedAt: '2024-08-20',
      readTime: '10 min read',
      category: 'Case Studies',
      tags: ['Case Study', 'Healthcare', 'Efficiency', 'Results'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 3456,
      likes: 234
    },
    {
      id: 4,
      title: 'The Complete Guide to Organizational Assessment Best Practices',
      excerpt: 'A comprehensive guide covering everything from assessment design to implementation, with templates and checklists for success.',
      author: 'David Kim',
      authorRole: 'Head of AI',
      publishedAt: '2024-08-18',
      readTime: '12 min read',
      category: 'How-To Guides',
      tags: ['Assessment', 'Best Practices', 'Guide', 'Implementation'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 2134,
      likes: 167
    },
    {
      id: 5,
      title: '5 Key Metrics Every Growing Organization Should Track',
      excerpt: 'Essential performance metrics that drive growth, with practical examples of how to measure and improve organizational effectiveness.',
      author: 'Sarah Chen',
      authorRole: 'CEO & Co-Founder',
      publishedAt: '2024-08-15',
      readTime: '7 min read',
      category: 'Growth',
      tags: ['Metrics', 'KPIs', 'Growth', 'Performance'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 1876,
      likes: 123
    },
    {
      id: 6,
      title: 'Understanding AI Assessment Algorithms: Transparency in Decision Making',
      excerpt: 'An inside look at how OptimaliQ\'s AI algorithms work, ensuring transparency and trust in AI-powered business recommendations.',
      author: 'Michael Rodriguez',
      authorRole: 'CTO & Co-Founder',
      publishedAt: '2024-08-12',
      readTime: '9 min read',
      category: 'AI & Technology',
      tags: ['AI', 'Algorithms', 'Transparency', 'Trust'],
      image: '/api/placeholder/600/300',
      featured: false,
      views: 1567,
      likes: 98
    }
  ],
  resources: [
    {
      id: 'assessment-template',
      title: 'Strategic Assessment Template',
      description: 'Free downloadable template for conducting strategic assessments',
      type: 'Template',
      format: 'PDF',
      icon: <FileText className="h-5 w-5" />,
      downloads: 1240
    },
    {
      id: 'webinar-ai-planning',
      title: 'AI-Powered Strategic Planning Webinar',
      description: '60-minute webinar on implementing AI in strategic planning',
      type: 'Webinar',
      format: 'Video',
      icon: <Video className="h-5 w-5" />,
      downloads: 856
    },
    {
      id: 'podcast-growth',
      title: 'Growth Strategy Podcast Series',
      description: 'Weekly podcast featuring growth experts and case studies',
      type: 'Podcast',
      format: 'Audio',
      icon: <Headphones className="h-5 w-5" />,
      downloads: 2134
    },
    {
      id: 'ebook-assessment',
      title: 'The Complete Assessment Guide eBook',
      description: 'Comprehensive guide to organizational assessments and improvement',
      type: 'eBook',
      format: 'PDF',
      icon: <BookOpen className="h-5 w-5" />,
      downloads: 1876
    }
  ]
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredPosts = blogData.posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category.toLowerCase().replace(/[^a-z]/g, '-') === selectedCategory
    const searchMatch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return categoryMatch && searchMatch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OptimaliQ</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-primary font-medium">Blog</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Button asChild>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </nav>
        </Container>
      </header>

      {/* Hero Section */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog & Resources
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Insights & Resources for{' '}
              <span className="text-primary">Organizational Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover expert insights, practical guides, and success stories to help your 
              organization thrive with AI-powered business intelligence.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                options={blogData.categories.map(cat => ({
                  value: cat.id,
                  label: `${cat.name} (${cat.count})`
                }))}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="All Categories"
              />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Featured Article */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <StatusBadge status="primary" className="mb-4">Featured Article</StatusBadge>
                  <h2 className="text-3xl font-bold mb-4">{blogData.featured.title}</h2>
                  <p className="text-muted-foreground mb-6">{blogData.featured.excerpt}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{blogData.featured.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blogData.featured.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{blogData.featured.readTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {blogData.featured.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-muted rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button asChild>
                    <Link href={`/blog/${blogData.featured.id}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8">
                  <div className="text-center">
                    <BookOpen className="h-24 w-24 text-primary mx-auto mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{blogData.featured.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{blogData.featured.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Articles Grid */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Latest Articles' : blogData.categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredPosts.length} articles found
              </span>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <Grid cols={1} gap={8}>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8">
                        <BookOpen className="h-16 w-16 text-primary" />
                      </div>
                      
                      <div className="col-span-2 p-6">
                        <div className="flex items-center justify-between mb-3">
                          <StatusBadge status="info" size="sm">{post.category}</StatusBadge>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                          <Link href={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.id}`}>
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-muted rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          )}
        </Container>
      </Section>

      {/* Resources Section */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Free Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Download our free templates, guides, and tools to help your organization succeed.
            </p>
          </motion.div>

          <Grid cols={2} gap={8}>
            {blogData.resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                        <StatusBadge status="success" size="sm">{resource.type}</StatusBadge>
                      </div>
                      <p className="text-muted-foreground mb-4">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {resource.downloads.toLocaleString()} downloads • {resource.format}
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Newsletter Signup */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get the latest insights on AI, business intelligence, and organizational growth 
                delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <Container className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
            
            <nav className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            <div className="text-sm text-muted-foreground">
              © 2024 OptimaliQ. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
