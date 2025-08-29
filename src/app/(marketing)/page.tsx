import { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero-section';
import { TrustIndicators } from '@/components/marketing/trust-indicators';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { KeyFeatures } from '@/components/marketing/key-features';
import { WhyOptimaliQ } from '@/components/marketing/why-optimaliq';
import { SocialProof } from '@/components/marketing/social-proof';
import { NewsletterSignup } from '@/components/marketing/newsletter-signup';
import { FAQ } from '@/components/marketing/faq';
import { CTA } from '@/components/marketing/cta';

export const metadata: Metadata = {
  title: 'OptimaliQ - AI-Powered Business Growth Platform',
  description: 'Transform your business with AI-driven assessments, strategic insights, and growth planning. Get personalized recommendations from our McKinsey-level business intelligence platform.',
  keywords: 'business growth, AI assessment, strategic planning, business intelligence, growth platform, business optimization',
  openGraph: {
    title: 'OptimaliQ - AI-Powered Business Growth Platform',
    description: 'Transform your business with AI-driven assessments and strategic insights',
    url: 'https://optimaliq.com',
    siteName: 'OptimaliQ',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OptimaliQ Platform Preview'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OptimaliQ - AI-Powered Business Growth Platform',
    description: 'Transform your business with AI-driven assessments and strategic insights',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Animated Dashboard Preview */}
      <HeroSection />
      
      {/* Trust Indicators */}
      <TrustIndicators />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Key Features */}
      <KeyFeatures />
      
      {/* Social Proof */}
      <SocialProof />
      
      {/* Why OptimaliQ */}
      <WhyOptimaliQ />
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Final CTA */}
      <CTA />
    </main>
  );
}
