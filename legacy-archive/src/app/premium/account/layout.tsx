"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  UserIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  CreditCardIcon,
  CogIcon
} from "@heroicons/react/24/outline";

const accountNavItems = [
  {
    href: "/premium/account",
    label: "Overview",
    icon: CogIcon,
    description: "Account summary and quick actions"
  },
  {
    href: "/premium/account/profile",
    label: "Profile",
    icon: UserIcon,
    description: "Personal and company information"
  },
  {
    href: "/premium/account/security",
    label: "Security",
    icon: ShieldCheckIcon,
    description: "Password and account security"
  },
  {
    href: "/premium/account/notifications",
    label: "Notifications",
    icon: BellIcon,
    description: "Email and notification preferences"
  },
  {
    href: "/premium/account/billing",
    label: "Billing",
    icon: CreditCardIcon,
    description: "Subscription and payment management"
  }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              <span>Account Management</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              Manage Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Account Settings
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              Update your profile, manage security settings, customize notifications, and handle your subscription.
            </motion.p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <nav className="flex flex-wrap justify-center gap-2">
            {accountNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300
                    ${isActive 
                      ? 'bg-white/90 backdrop-blur-sm text-blue-700 shadow-lg border border-white/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span>{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl border border-blue-200/50"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </motion.div>

        {/* Page Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
} 