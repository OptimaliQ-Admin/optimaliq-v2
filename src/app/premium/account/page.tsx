"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { 
  UserIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function AccountOverviewPage() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple loading state to ensure user context is loaded
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      title: "Update Profile",
      description: "Edit your personal and company information",
      href: "/premium/account/profile",
      icon: UserIcon,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Change Password",
      description: "Update your account password",
      href: "/premium/account/security",
      icon: ShieldCheckIcon,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Manage Billing",
      description: "View and update your subscription",
      href: "/premium/account/billing",
      icon: CreditCardIcon,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Notification Settings",
      description: "Customize your email preferences",
      href: "/premium/account/notifications",
      icon: BellIcon,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const accountStats = [
    {
      label: "Account Status",
      value: "Active",
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Plan",
      value: "Premium",
      icon: ChartBarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Email",
      value: user?.email || "N/A",
      icon: ChartBarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Account Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50"
              >
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="block p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/50 transition-all duration-300 border border-gray-200/50 hover:border-gray-300/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Welcome Message */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/50"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Your Account Dashboard</h3>
        <p className="text-gray-700 leading-relaxed">
          Manage your profile, security settings, billing, and notifications all in one place. 
          Need help? Contact our support team for assistance.
        </p>
      </motion.div>
    </div>
  );
} 