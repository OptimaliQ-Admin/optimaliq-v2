//src/app/page.tsx
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import KeyFeatures from "@/components/home/KeyFeatures";
import WhyOptimaliQ from "@/components/home/WhyOptimaliQ";
import NewsletterSignup from "@/components/shared/NewsletterSignup";
import FaqSection from "@/components/home/FaqSection";
import PageNavigation from "@/components/shared/PageNavigation";

export const metadata: Metadata = {
  title: "OptimaliQ | AI-Powered Growth Strategy Platform",
  description: "Smarter decisions. Faster growth. OptimaliQ helps businesses unlock opportunities with real-time AI insights and strategic benchmarking.",
  openGraph: {
    title: "OptimaliQ",
    description: "Smarter decisions. Faster growth. Real-time AI insights for business performance.",
    url: "https://optimaliq.ai",
    siteName: "OptimaliQ",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OptimaliQ - AI-Powered Growth Strategy Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptimaliQ",
    description: "Smarter decisions. Faster growth. Real-time AI insights for business performance.",
    images: ["/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const pageSections = [
    { id: "hero", label: "Home", icon: "🏠" },
    { id: "how-it-works", label: "How It Works", icon: "⚙️" },
    { id: "key-features", label: "Features", icon: "✨" },
    { id: "why-optimaliq", label: "Why OptimaliQ", icon: "🎯" },
    { id: "newsletter", label: "Newsletter", icon: "📧" },
    { id: "faq", label: "FAQ", icon: "❓" },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GMF Plus",
    "description": "AI-powered growth management framework for businesses",
    "url": "https://yourdomain.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free growth assessment available"
    },
    "provider": {
      "@type": "Organization",
      "name": "GMF Plus",
      "url": "https://yourdomain.com"
    },
    "featureList": [
      "AI-powered growth assessment",
      "Strategic insights and recommendations",
      "Competitive benchmarking",
      "Data-driven growth strategies",
      "Real-time analytics"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageNavigation sections={pageSections} />
      <HeroSection />
      <HowItWorks />
      <KeyFeatures />
      <WhyOptimaliQ />
      <section id="newsletter" className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <NewsletterSignup 
            variant="hero"
            source="homepage_newsletter"
          />
        </div>
      </section>
      <FaqSection />
    </>
  );
}
