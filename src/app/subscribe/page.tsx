// src/app/subscribe/page.tsx

import SubscribeForm from "@/components/subscribe/SubscribeForm";
import ValueCarousel from "@/components/subscribe/ValueCarousel";

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Value Props Carousel */}
        <div className="hidden md:block">
          <ValueCarousel />
        </div>

        {/* Right: Form Card */}
        <SubscribeForm />
      </div>
    </div>
  );
}