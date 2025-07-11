import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface CardLoadingAnimationProps {
  title?: string;
  className?: string;
}

export default function CardLoadingAnimation({ 
  title = "Insights are loading...", 
  className = "" 
}: CardLoadingAnimationProps) {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <p className="text-gray-600 text-sm max-w-md leading-relaxed">
            Gathering the latest insights and market intelligence...
          </p>
        </div>
        
        <motion.div 
          className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 