"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";
import { FaEnvelope, FaUsers, FaChartLine, FaClock, FaCheckCircle, FaExclamationTriangle, FaPlus, FaTrash } from "react-icons/fa";
import { showToast } from "@/lib/utils/toast";

interface Invitation {
  id: string;
  invitee_email: string;
  invitee_name: string;
  assessment_type: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at?: string;
  score?: number;
}

interface Delegation {
  id: string;
  delegate_email: string;
  delegate_name: string;
  assessment_type: string;
  question_keys: string[];
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at?: string;
}

export default function AssessmentManagementPage() {
  const { user } = usePremiumUser();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [invitationForm, setInvitationForm] = useState({
    assessmentType: '',
    inviteeEmail: '',
    inviteeName: '',
    customMessage: ''
  });

  // Assessment options
  const assessmentOptions = [
    { value: 'sales', label: 'Sales Performance Assessment' },
    { value: 'bpm', label: 'Business Process Maturity Assessment' },
    { value: 'tech_stack', label: 'Technology Stack Assessment' },
    { value: 'strategic_maturity', label: 'Strategic Maturity Assessment' },
    { value: 'marketing_effectiveness', label: 'Marketing Effectiveness Assessment' },
    { value: 'ai_readiness', label: 'AI & Automation Readiness Assessment' },
    { value: 'competitive_benchmarking', label: 'Competitive Benchmarking Assessment' },
    { value: 'customer_experience', label: 'Customer Experience Assessment' },
    { value: 'digital_transformation', label: 'Digital Transformation Assessment' },
    { value: 'leadership', label: 'Leadership & Team Performance Assessment' }
  ];

  useEffect(() => {
    if (!user?.u_id) return;
    loadData();
  }, [user?.u_id]);

  const loadData = async () => {
    try {
      // Load invitations
      const { data: invitationData } = await supabase
        .from("assessment_invitations")
        .select("*")
        .eq("inviter_u_id", user?.u_id)
        .order("created_at", { ascending: false });

      // Load delegations
      const { data: delegationData } = await supabase
        .from("question_delegations")
        .select("*")
        .eq("delegator_u_id", user?.u_id)
        .order("created_at", { ascending: false });

      setInvitations(invitationData || []);
      setDelegations(delegationData || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const sendInvitation = async () => {
    if (!invitationForm.assessmentType || !invitationForm.inviteeEmail || !invitationForm.inviteeName) {
      showToast.error("Please fill in all required fields");
      return;
    }

    setSendingInvitation(true);
    try {
      const response = await fetch("/api/premium/assessment/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitationForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send invitation");
      }

      showToast.success("Assessment invitation sent successfully!");
      setInvitationForm({
        assessmentType: '',
        inviteeEmail: '',
        inviteeName: '',
        customMessage: ''
      });
      setShowInvitationForm(false);
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error sending invitation:", error);
      showToast.error(error instanceof Error ? error.message : "Failed to send invitation");
    } finally {
      setSendingInvitation(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'expired':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <FaUsers className="text-white text-3xl" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg font-medium"
          >
            Loading assessment management...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1920px] mx-auto p-8 space-y-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
          >
            Assessment Management
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            Delegate assessments to your team members and track their progress to get comprehensive insights for your organization.
          </motion.p>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
          >
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-2xl">{invitations.length}</h3>
              <p className="text-gray-600">Total Invitations</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-2xl">
                {invitations.filter(i => i.status === 'completed').length}
              </h3>
              <p className="text-gray-600">Completed</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-2xl">{delegations.length}</h3>
              <p className="text-gray-600">Question Delegations</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Send New Invitation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Assessment Invitation</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInvitationForm(!showInvitationForm)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              {showInvitationForm ? 'Cancel' : 'New Invitation'}
            </motion.button>
          </div>

          {showInvitationForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Type *
                  </label>
                  <select
                    value={invitationForm.assessmentType}
                    onChange={(e) => setInvitationForm(prev => ({ ...prev, assessmentType: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Assessment Type</option>
                    {assessmentOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Member Email *
                  </label>
                  <input
                    type="email"
                    value={invitationForm.inviteeEmail}
                    onChange={(e) => setInvitationForm(prev => ({ ...prev, inviteeEmail: e.target.value }))}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Member Name *
                </label>
                <input
                  type="text"
                  value={invitationForm.inviteeName}
                  onChange={(e) => setInvitationForm(prev => ({ ...prev, inviteeName: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={invitationForm.customMessage}
                  onChange={(e) => setInvitationForm(prev => ({ ...prev, customMessage: e.target.value }))}
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendInvitation}
                  disabled={sendingInvitation}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaEnvelope className="text-sm" />
                  {sendingInvitation ? 'Sending...' : 'Send Invitation'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Invitations List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sent Invitations</h2>
          
          {invitations.length === 0 ? (
            <div className="text-center py-12">
              <FaEnvelope className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No invitations sent yet. Send your first assessment invitation to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Team Member</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Assessment</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Sent</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invitation) => (
                    <tr key={invitation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{invitation.invitee_name}</p>
                          <p className="text-sm text-gray-500">{invitation.invitee_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {assessmentOptions.find(opt => opt.value === invitation.assessment_type)?.label || invitation.assessment_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invitation.status)}
                          <span className="text-sm font-medium">{getStatusText(invitation.status)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(invitation.created_at)}
                      </td>
                      <td className="py-4 px-4">
                        {invitation.score ? (
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {invitation.score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Delegations List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Delegations</h2>
          
          {delegations.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No question delegations yet. Delegate specific questions to team members for focused insights.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Team Member</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Assessment</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Questions</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {delegations.map((delegation) => (
                    <tr key={delegation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{delegation.delegate_name}</p>
                          <p className="text-sm text-gray-500">{delegation.delegate_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {assessmentOptions.find(opt => opt.value === delegation.assessment_type)?.label || delegation.assessment_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {delegation.question_keys.length} questions
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(delegation.status)}
                          <span className="text-sm font-medium">{getStatusText(delegation.status)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(delegation.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 