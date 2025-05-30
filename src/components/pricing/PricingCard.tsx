import Link from "next/link";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  plan: "Free" | "Accelerator" | "Enterprise";
  price: number | string;
  cycle: "monthly" | "annual";
  features: string[];
  disabled?: string[];
  cta: string;
}

export default function PricingCard({ plan, price, cycle, features, disabled = [], cta }: PricingCardProps) {
  const router = useRouter();
  const emojiMap = {
    Free: "🌟",
    Accelerator: "🚀",
    Enterprise: "🏆",
  };

  const handleClick = () => {
    if (plan === "Free") {
      router.push("/dashboard/Page1");
      return;
    }

    const planSlug = plan.toLowerCase();
    router.push(`/subscribe?plan=${planSlug}&cycle=${cycle}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 border-l-4 border-blue-700 hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col min-h-[500px]">
      <h2 className="text-3xl font-bold text-gray-800">{emojiMap[plan]} {plan} Plan</h2>
      <p className="text-5xl font-bold text-blue-600 mt-4">{price === "FREE" ? price : `$${price}`} <span className="text-lg font-medium">/mo</span></p>
      <p className="text-gray-500 text-sm mb-4">(Billed {cycle})</p>
      <ul className="mt-6 text-gray-700 space-y-2 flex-grow">
        {features.map(f => <li key={f}>✅ {f}</li>)}
        {disabled.map(f => <li key={f} className="opacity-50">❌ {f}</li>)}
      </ul>
      <button
        onClick={handleClick}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-800 transition"
      >
        {cta}
      </button>
    </div>
  );
}
