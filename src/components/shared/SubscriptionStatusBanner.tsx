"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SubscriptionStatusBannerProps {
  subscriptionStatus?: string;
  onDismiss?: () => void;
}

export default function SubscriptionStatusBanner({ 
  subscriptionStatus, 
  onDismiss 
}: SubscriptionStatusBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show banner if subscription is not active
    if (subscriptionStatus && subscriptionStatus !== 'active' && !dismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [subscriptionStatus, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    onDismiss?.();
  };

  const getBannerContent = () => {
    switch (subscriptionStatus) {
      case 'canceled':
        return {
          title: 'Subscription Canceled',
          message: 'Your subscription has been canceled. You can still access your account but premium features are disabled.',
          icon: ExclamationTriangleIcon,
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          iconColor: 'text-yellow-600',
          actionText: 'Resubscribe',
          actionHref: '/subscribe'
        };
      case 'past_due':
        return {
          title: 'Payment Failed',
          message: 'Your payment failed. Please update your payment method to continue accessing premium features.',
          icon: ExclamationTriangleIcon,
          color: 'bg-red-50 border-red-200 text-red-800',
          iconColor: 'text-red-600',
          actionText: 'Update Payment',
          actionHref: '/premium/account/billing'
        };
      case 'incomplete':
        return {
          title: 'Payment Incomplete',
          message: 'Your payment setup is incomplete. Please complete your payment to access premium features.',
          icon: ExclamationTriangleIcon,
          color: 'bg-orange-50 border-orange-200 text-orange-800',
          iconColor: 'text-orange-600',
          actionText: 'Complete Payment',
          actionHref: '/subscribe'
        };
      default:
        return {
          title: 'Subscription Required',
          message: 'You need an active subscription to access premium features.',
          icon: CreditCardIcon,
          color: 'bg-blue-50 border-blue-200 text-blue-800',
          iconColor: 'text-blue-600',
          actionText: 'Subscribe Now',
          actionHref: '/subscribe'
        };
    }
  };

  const content = getBannerContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-0 left-0 right-0 z-50 ${content.color} border-b`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <content.icon className={`h-5 w-5 ${content.iconColor}`} />
                <div>
                  <h3 className="text-sm font-medium">{content.title}</h3>
                  <p className="text-sm opacity-90">{content.message}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href={content.actionHref}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {content.actionText}
                </Link>
                <button
                  onClick={handleDismiss}
                  className="inline-flex items-center p-1.5 rounded-md hover:bg-black/10 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 