//src/app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import KeyFeatures from "@/components/home/KeyFeatures";
import WhyOptimaliQ from "@/components/home/WhyOptimaliQ";
import FaqSection from "@/components/home/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <KeyFeatures />
      <WhyOptimaliQ />
      <FaqSection />
    </>
  );
}
