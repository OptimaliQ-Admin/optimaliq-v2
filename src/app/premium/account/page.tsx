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
  ExclamationTriangleIcon,
  CalendarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function AccountOverviewPage() {
  const { user } = usePremiumUser();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user?.u_id) return;
      setLoading(true);
      setLoadError(false);
      try {
        const response = await fetch('/api/premium/account/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ u_id: user.u_id }),
        });
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        } else {
          setLoadError(true);
        }
      } catch (error) {
        setLoadError(true);
      } finally {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };
    if (!user?.u_id) return;
    fetchSubscriptionData();
    // Set a timeout for fallback error UI
    const id = setTimeout(() => {
      setLoadError(true);
      setLoading(false);
    }, 5000);
    setTimeoutId(id);
    return () => clearTimeout(id);
  }, [user?.u_id]);

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

  // Determine which next billing date to display
  const displayNextBillingDate = () => {
    if (subscriptionData?.nextBillingDate) {
      return new Date(subscriptionData.nextBillingDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    return 'Not available';
  };

  const accountStats = [
    {
      label: "Account Status",
      value: subscriptionData?.status === 'active' ? "Active" : "Inactive",
      icon: subscriptionData?.status === 'active' ? CheckCircleIcon : ExclamationTriangleIcon,
      color: subscriptionData?.status === 'active' ? "text-green-600" : "text-red-600",
      bgColor: subscriptionData?.status === 'active' ? "bg-green-100" : "bg-red-100"
    },
    {
      label: "Plan",
      value: subscriptionData?.plan || "Unknown",
      icon: ChartBarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Next Billing",
      value: displayNextBillingDate(),
      icon: CalendarIcon,
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

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-red-600 font-semibold">Failed to load subscription data.</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try Again
        </button>
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
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${stat.color}`}>{stat.value}</p>
                    {stat.label === "Next Billing" && subscriptionData?.nextBillingDate && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Live
                      </span>
                    )}
                  </div>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={action.href}
                  className="block p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
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

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
            <div className="p-3 rounded-lg bg-blue-100">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Account Created</p>
              <p className="text-sm text-gray-600">
                Welcome to GMF Plus! Your account is now active.
              </p>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 