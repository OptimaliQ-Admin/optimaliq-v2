//src/app/page.tsx
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import KeyFeatures from "@/components/home/KeyFeatures";
import WhyOptimaliQ from "@/components/home/WhyOptimaliQ";
import FaqSection from "@/components/home/FaqSection";
import PageNavigation from "@/components/shared/PageNavigation";

export const metadata: Metadata = {
  title: "AI-Powered Growth Management Framework",
  description: "Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations. Get personalized growth strategies and competitive benchmarking.",
  openGraph: {
    title: "GMF Plus - AI-Powered Growth Management Framework",
    description: "Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations.",
    url: "https://yourdomain.com",
    siteName: "GMF Plus",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GMF Plus - AI-Powered Growth Management Framework",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GMF Plus - AI-Powered Growth Management Framework",
    description: "Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations.",
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
      <FaqSection />
    </>
  );
}
