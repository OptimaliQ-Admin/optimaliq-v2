"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";

interface EmailSubscription {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  title: string | null;
  industry: string | null;
  company_size: string | null;
  revenue_range: string | null;
  linkedin_url: string | null;
  source: string;
  status: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  last_email_sent_at: string | null;
  email_count: number;
  created_at: string;
  updated_at: string;
}

export default function EmailSubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("email_subscriptions")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) {
        console.error("Error fetching subscriptions:", error);
        showToast.error("Failed to fetch subscriptions");
        return;
      }

      setSubscriptions(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter(sub => sub.status === 'active').length || 0;
      const unsubscribed = data?.filter(sub => sub.status === 'unsubscribed').length || 0;
      const bounced = data?.filter(sub => sub.status === 'bounced').length || 0;

      setStats({ total, active, unsubscribed, bounced });

    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      showToast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from("email_subscriptions")
        .update({ 
          status,
          unsubscribed_at: status === 'unsubscribed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating subscription:", error);
        showToast.error("Failed to update subscription");
        return;
      }

      showToast.success("Subscription updated successfully");
      fetchSubscriptions(); // Refresh the list

    } catch (error) {
      console.error("Error updating subscription:", error);
      showToast.error("Failed to update subscription");
    }
  };

  const exportSubscriptions = () => {
    const csvContent = [
      // CSV header
      ["Email", "First Name", "Last Name", "Company", "Title", "Industry", "Company Size", "Revenue Range", "LinkedIn URL", "Source", "Status", "Subscribed At", "Email Count"].join(","),
      // CSV data
      ...subscriptions.map(sub => [
        sub.email,
        sub.first_name || "",
        sub.last_name || "",
        sub.company || "",
        sub.title || "",
        sub.industry || "",
        sub.company_size || "",
        sub.revenue_range || "",
        sub.linkedin_url || "",
        sub.source,
        sub.status,
        sub.subscribed_at,
        sub.email_count
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Subscribers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-green-50 rounded-xl shadow-lg p-6"
        >
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-green-600">Active</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-yellow-50 rounded-xl shadow-lg p-6"
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.unsubscribed}</div>
          <div className="text-sm text-yellow-600">Unsubscribed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-red-50 rounded-xl shadow-lg p-6"
        >
          <div className="text-2xl font-bold text-red-600">{stats.bounced}</div>
          <div className="text-sm text-red-600">Bounced</div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Email Subscriptions</h2>
        <button
          onClick={exportSubscriptions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subscription.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscription.first_name && subscription.last_name 
                      ? `${subscription.first_name} ${subscription.last_name}`
                      : subscription.first_name || subscription.last_name || "-"
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscription.company || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subscription.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'unsubscribed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={subscription.status}
                      onChange={(e) => updateSubscriptionStatus(subscription.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                      <option value="bounced">Bounced</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No email subscriptions found.</p>
        </div>
      )}
    </div>
  );
} 