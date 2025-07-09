import { motion } from "framer-motion";
import { FaUser, FaShieldAlt, FaCog } from "react-icons/fa";

export default function AccountHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-8"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
      >
        <FaUser className="text-sm" />
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
        Update your profile information, manage your password, and customize your notification preferences to get the most out of OptimaliQ.
      </motion.p>

      {/* Feature Highlights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-blue-600 text-sm" />
          </div>
          <span className="text-gray-700 font-medium">Profile Management</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FaShieldAlt className="text-green-600 text-sm" />
          </div>
          <span className="text-gray-700 font-medium">Security Settings</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FaCog className="text-purple-600 text-sm" />
          </div>
          <span className="text-gray-700 font-medium">Preferences</span>
        </div>
      </motion.div>
    </motion.div>
  );
} 