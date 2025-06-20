"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { usePremiumUser } from '@/hooks/usePremiumUser';
import { useNextBillingDate } from '@/hooks/useNextBillingDate';

interface SubscriptionData {
  status: string;
  plan: string;
  billingCycle: string;
  nextBillingDate: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  amount: number;
  currency: string;
}

export default function BillingPage() {
  const { user } = usePremiumUser();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Use the new hook to get accurate next billing date from Stripe
  const { 
    nextBillingDate: stripeNextBillingDate, 
    loading: nextBillingLoading, 
    error: nextBillingError 
  } = useNextBillingDate(subscriptionData?.stripeCustomerId || null);

  const fetchSubscriptionData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/premium/account/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u_id: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Subscription data fetched:", data);
        setSubscriptionData(data);
      } else {
        console.error("Failed to fetch subscription data:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user?.id]);

  const handleManageBilling = async () => {
    console.log("Manage Billing clicked", { 
      stripeCustomerId: subscriptionData?.stripeCustomerId,
      subscriptionData 
    });
    
    if (!subscriptionData?.stripeCustomerId) {
      console.error("No Stripe customer ID available");
      alert("Unable to access billing portal. Please contact support.");
      return;
    }
    
    setUpdating(true);
    try {
      console.log("Creating billing portal session...");
      const response = await fetch('/api/stripe/createBillingPortalSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: subscriptionData.stripeCustomerId,
          returnUrl: window.location.href 
        }),
      });
      
      console.log("Billing portal response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Billing portal session created:", data);
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No URL returned from billing portal session');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Billing portal error response:", errorData);
        alert(`Unable to access billing portal: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      alert('Failed to access billing portal. Please try again or contact support.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    if (!subscriptionData?.stripeCustomerId) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/stripe/createSetupSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: subscriptionData.stripeCustomerId,
          returnUrl: window.location.href 
        }),
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create setup session');
      }
    } catch (error) {
      console.error('Error creating setup session:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine which next billing date to display
  const displayNextBillingDate = () => {
    if (stripeNextBillingDate?.formattedDate) {
      return stripeNextBillingDate.formattedDate;
    }
    if (subscriptionData?.nextBillingDate) {
      return new Date(subscriptionData.nextBillingDate).toLocaleDateString();
    }
    return 'Not available';
  };

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
            <div className={`p-3 rounded-lg ${subscriptionData?.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
              {subscriptionData?.status === 'active' ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-semibold ${subscriptionData?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {subscriptionData?.status === 'active' ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
            <div className="p-3 rounded-lg bg-blue-100">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="font-semibold text-blue-600">{subscriptionData?.plan || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
            <div className="p-3 rounded-lg bg-purple-100">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Billing Cycle</p>
              <p className="font-semibold text-purple-600">{subscriptionData?.billingCycle || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Billing Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Next Billing Date</h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-600 text-sm">
                  {nextBillingLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    displayNextBillingDate()
                  )}
                </p>
                {stripeNextBillingDate?.formattedDate && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Live from Stripe
                  </span>
                )}
              </div>
              {nextBillingError && (
                <p className="text-xs text-red-600 mt-1">
                  Error: {nextBillingError}
                </p>
              )}
            </div>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Amount</h3>
              <p className="text-gray-600 text-sm">
                {subscriptionData?.amount 
                  ? `${subscriptionData.currency} ${(subscriptionData.amount / 100).toFixed(2)}`
                  : 'Not available'
                }
              </p>
            </div>
            <CreditCardIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Billing Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManageBilling}
            disabled={updating || !subscriptionData?.stripeCustomerId}
            className="flex items-center justify-center gap-3 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
              {updating ? (
                <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {updating ? 'Opening Billing Portal...' : 'Manage Billing'}
              </h3>
              <p className="text-gray-600 text-sm">
                {updating ? 'Please wait...' : 'Update payment method, view invoices, and manage subscription'}
              </p>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdatePaymentMethod}
            disabled={updating || !subscriptionData?.stripeCustomerId}
            className="flex items-center justify-center gap-3 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-3 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
              <ArrowPathIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Update Payment Method
              </h3>
              <p className="text-gray-600 text-sm">
                Add or update your payment information
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Billing Support */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Help?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Billing Questions</h3>
            <p className="text-blue-700 text-sm mb-3">
              Have questions about your subscription or billing?
            </p>
            <a 
              href="mailto:support@optimaliq.com" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Contact Support →
            </a>
          </div>
          
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Plan Changes</h3>
            <p className="text-green-700 text-sm mb-3">
              Want to upgrade, downgrade, or change your plan?
            </p>
            <a 
              href="/Pricing" 
              className="text-green-600 hover:text-green-800 font-medium text-sm"
            >
              View Plans →
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 