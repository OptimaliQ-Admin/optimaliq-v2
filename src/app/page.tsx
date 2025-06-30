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
  title: "OptimaliQ | Intelligent Growth Strategy Platform for Smart Business Decisions",
  description: "Make faster, smarter business decisions with OptimaliQ—an intelligent growth platform that delivers real-time insights, strategy benchmarking, and tailored 30-day growth plans.",
  openGraph: {
    title: "OptimaliQ",
    description: "Make faster, smarter business decisions with OptimaliQ—an intelligent growth platform that delivers real-time insights, strategy benchmarking, and tailored 30-day growth plans.",
    url: "https://optimaliq.ai",
    siteName: "OptimaliQ",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OptimaliQ - Intelligent Growth Strategy Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptimaliQ",
    description: "Make faster, smarter business decisions with OptimaliQ—an intelligent growth platform that delivers real-time insights, strategy benchmarking, and tailored 30-day growth plans.",
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
    "name": "OptimaliQ",
    "description": "Intelligent growth strategy platform for smart business decisions",
    "url": "https://optimaliq.ai",
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
      "name": "OptimaliQ",
      "url": "https://optimaliq.ai"
    },
    "featureList": [
      "Intelligent growth assessment",
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
