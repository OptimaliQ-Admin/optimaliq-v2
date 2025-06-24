import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface PricingCardProps {
  plan: "Free" | "Accelerator" | "Strategic";
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
    Strategic: "🏆",
  };

  const handleClick = () => {
    if (plan === "Free") {
      router.push("/growth-assessment");
      return;
    }

    const planSlug = plan.toLowerCase();
    router.push(`/subscribe?plan=${planSlug}&cycle=${cycle}`);
  };

  const isPopular = plan === "Accelerator";

  // Calculate monthly equivalent for annual plans
  const getDisplayPrice = () => {
    if (price === "FREE") return "FREE";
    
    if (cycle === "annual") {
      const monthlyEquivalent = Math.round(Number(price) / 12);
      return `$${monthlyEquivalent}/Month`;
    } else {
      return `$${price}/mo`;
    }
  };

  // Get the billing text
  const getBillingText = () => {
    if (price === "FREE") return "";
    return cycle === "annual" ? "Billed annual" : "Billed monthly";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[600px] ${
        isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {emojiMap[plan]} {plan}
        </h2>
        <div className="mb-2">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {getDisplayPrice()}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{getBillingText()}</p>
      </div>

      {/* Features List */}
      <div className="flex-grow space-y-4">
        <h3 className="font-semibold text-gray-900 mb-3">What&apos;s included:</h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <motion.li 
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 text-gray-700"
            >
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-sm leading-relaxed">{feature}</span>
            </motion.li>
          ))}
          {disabled.map((feature, index) => (
            <motion.li 
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (features.length + index) * 0.1 }}
              className="flex items-start gap-3 text-gray-400"
            >
              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-400 text-xs">✗</span>
              </div>
              <span className="text-sm leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`mt-8 w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
          plan === "Free"
            ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}
