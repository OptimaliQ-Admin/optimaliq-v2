"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";

interface TrialUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  title: string | null;
  trial_start_date: string;
  trial_end_date: string;
  status: 'active' | 'expired' | 'converted';
  created_at: string;
  updated_at: string;
}

export default function TrialUserManager() {
  const [trialUsers, setTrialUsers] = useState<TrialUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    converted: 0
  });

  const [newTrialUser, setNewTrialUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company: '',
    title: ''
  });

  useEffect(() => {
    fetchTrialUsers();
  }, []);

  const fetchTrialUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("trial_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching trial users:", error);
        showToast.error("Failed to fetch trial users");
        return;
      }

      setTrialUsers(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter(user => user.status === 'active').length || 0;
      const expired = data?.filter(user => user.status === 'expired').length || 0;
      const converted = data?.filter(user => user.status === 'converted').length || 0;

      setStats({ total, active, expired, converted });

    } catch (error) {
      console.error("Error fetching trial users:", error);
      showToast.error("Failed to fetch trial users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrialUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTrialUser.email || !newTrialUser.first_name) {
      showToast.error("Email and first name are required");
      return;
    }

    try {
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial

      const { error } = await supabase
        .from("trial_users")
        .insert([{
          email: newTrialUser.email.toLowerCase(),
          first_name: newTrialUser.first_name,
          last_name: newTrialUser.last_name || null,
          company: newTrialUser.company || null,
          title: newTrialUser.title || null,
          trial_start_date: trialStartDate.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating trial user:", error);
        showToast.error("Failed to create trial user");
        return;
      }

      // Send welcome email
      try {
        const response = await fetch('/api/admin/send-trial-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: newTrialUser.email,
            firstName: newTrialUser.first_name,
            companyName: newTrialUser.company,
            trialEndDate: trialEndDate.toISOString()
          })
        });

        if (!response.ok) {
          console.error("Failed to send welcome email");
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
      }

      showToast.success("Trial user created and welcome email sent!");
      setNewTrialUser({
        email: '',
        first_name: '',
        last_name: '',
        company: '',
        title: ''
      });
      setShowAddForm(false);
      fetchTrialUsers();

    } catch (error) {
      console.error("Error creating trial user:", error);
      showToast.error("Failed to create trial user");
    }
  };

  const updateTrialUserStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("trial_users")
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating trial user:", error);
        showToast.error("Failed to update trial user");
        return;
      }

      showToast.success("Trial user updated successfully");
      fetchTrialUsers();

    } catch (error) {
      console.error("Error updating trial user:", error);
      showToast.error("Failed to update trial user");
    }
  };

  const exportTrialUsers = () => {
    const csvContent = [
      // CSV header
      ["Email", "First Name", "Last Name", "Company", "Title", "Trial Start", "Trial End", "Status", "Created At"].join(","),
      // CSV data
      ...trialUsers.map(user => [
        user.email,
        user.first_name || "",
        user.last_name || "",
        user.company || "",
        user.title || "",
        user.trial_start_date,
        user.trial_end_date,
        user.status,
        user.created_at
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial_users_${new Date().toISOString().split('T')[0]}.csv`;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Trial User Management</h2>
        <div className="flex gap-3">
          <button
            onClick={exportTrialUsers}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Trial User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Trials</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Expired</h3>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Converted</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.converted}</p>
        </div>
      </div>

      {/* Add Trial User Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Trial User</h3>
            <form onSubmit={handleAddTrialUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newTrialUser.email}
                  onChange={(e) => setNewTrialUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={newTrialUser.first_name}
                  onChange={(e) => setNewTrialUser(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={newTrialUser.last_name}
                  onChange={(e) => setNewTrialUser(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newTrialUser.company}
                  onChange={(e) => setNewTrialUser(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTrialUser.title}
                  onChange={(e) => setNewTrialUser(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Trial
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Trial Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trialUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.company || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Start: {new Date(user.trial_start_date).toLocaleDateString()}</div>
                      <div>End: {new Date(user.trial_end_date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={user.status}
                      onChange={(e) => updateTrialUserStatus(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {trialUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No trial users found.</p>
        </div>
      )}
    </div>
  );
} 