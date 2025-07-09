'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WifiIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = React.useState(false);

  React.useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    checkOnlineStatus();
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <WifiIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600">
            Please check your internet connection and try again.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="mb-2 font-medium">What you can do:</p>
            <ul className="text-left space-y-1">
              <li>• Check your Wi-Fi connection</li>
              <li>• Try using mobile data</li>
              <li>• Restart your router</li>
              <li>• Check if OptimaliQ is down</li>
            </ul>
          </div>

          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isOnline
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            {isOnline ? 'Retry Connection' : 'Waiting for connection...'}
          </button>

          {isOnline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-600 font-medium"
            >
              ✓ Connection restored! Click retry to continue.
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500">
            Need help? Contact support at{' '}
            <a href="mailto:support@optimaliq.com" className="text-blue-600 hover:underline">
              support@optimaliq.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 