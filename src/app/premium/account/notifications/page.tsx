"use client";

import { motion } from "framer-motion";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
        <NotificationPreferences />
      </motion.div>

      {/* Notification Types Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Dashboard Updates</h3>
            <p className="text-blue-700 text-sm">
              Get notified when your dashboard insights are refreshed with new data and analysis.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Growth Recommendations</h3>
            <p className="text-green-700 text-sm">
              Receive personalized growth recommendations and strategic insights for your business.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Market Trends</h3>
            <p className="text-purple-700 text-sm">
              Stay updated with the latest market trends and industry insights relevant to your business.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Account Updates</h3>
            <p className="text-orange-700 text-sm">
              Important account notifications, billing updates, and security alerts.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Email Frequency */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Frequency</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
              <p className="text-gray-600 text-sm">Summary of your weekly progress and insights</p>
            </div>
            <div className="text-sm text-gray-500">Every Monday</div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Report</h3>
              <p className="text-gray-600 text-sm">Comprehensive monthly analysis and recommendations</p>
            </div>
            <div className="text-sm text-gray-500">First of each month</div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Real-time Alerts</h3>
              <p className="text-gray-600 text-sm">Immediate notifications for important updates</p>
            </div>
            <div className="text-sm text-gray-500">As needed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 