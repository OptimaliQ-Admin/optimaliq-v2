//src/app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import KeyFeatures from "@/components/home/KeyFeatures";
import WhyOptimaliQ from "@/components/home/WhyOptimaliQ";
import FaqSection from "@/components/home/FaqSection";
import PageNavigation from "@/components/shared/PageNavigation";

export default function HomePage() {
  const pageSections = [
    { id: "hero", label: "Home", icon: "🏠" },
    { id: "how-it-works", label: "How It Works", icon: "⚙️" },
    { id: "key-features", label: "Features", icon: "✨" },
    { id: "why-optimaliq", label: "Why OptimaliQ", icon: "🎯" },
    { id: "faq", label: "FAQ", icon: "❓" },
  ];

  return (
    <>
      <PageNavigation sections={pageSections} />
      <HeroSection />
      <HowItWorks />
      <KeyFeatures />
      <WhyOptimaliQ />
      <FaqSection />
    </>
  );
}
