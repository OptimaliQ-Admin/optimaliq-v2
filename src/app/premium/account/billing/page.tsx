"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  CreditCardIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { usePremiumUser } from '@/context/PremiumUserContext';

export default function BillingPage() {
  const { user } = usePremiumUser();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stripeCustomerId] = useState<string | null>(null);

  useEffect(() => {
    // Simple loading state to ensure user context is loaded
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleManageBilling = async () => {
    if (!stripeCustomerId) {
      alert("Unable to access billing portal. Please contact support.");
      return;
    }
    
    setUpdating(true);
    try {
      const response = await fetch('/api/stripe/createBillingPortalSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: stripeCustomerId,
          returnUrl: window.location.href 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No URL returned from billing portal session');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
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
    if (!stripeCustomerId) {
      alert("Unable to update payment method. Please contact support.");
      return;
    }
    
    setUpdating(true);
    try {
      const response = await fetch('/api/stripe/createSetupSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: stripeCustomerId,
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
      alert('Failed to update payment method. Please try again or contact support.');
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

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="font-semibold text-blue-600">Premium</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Billing Management */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Management</h2>
        
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Manage Your Subscription</h3>
            <p className="text-gray-700 mb-4">
              Access your Stripe billing portal to view invoices, update payment methods, 
              and manage your subscription details.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={updating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCardIcon className="w-5 h-5" />
              )}
              {updating ? 'Loading...' : 'Manage Billing'}
            </button>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Payment Method</h3>
            <p className="text-gray-700 mb-4">
              Add or update your payment method securely through Stripe.
            </p>
            <button
              onClick={handleUpdatePaymentMethod}
              disabled={updating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCardIcon className="w-5 h-5" />
              )}
              {updating ? 'Loading...' : 'Update Payment Method'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200/50"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Information</h3>
            <p className="text-gray-700 leading-relaxed">
              All billing is handled securely through Stripe. You can view your next billing date, 
              download invoices, and manage your subscription directly in the Stripe portal. 
              For billing support, please contact our team.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 