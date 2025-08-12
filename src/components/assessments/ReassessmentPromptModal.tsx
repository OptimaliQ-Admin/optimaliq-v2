"use client";

interface ReassessmentPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  hasTakenBefore: boolean;
}

export default function ReassessmentPromptModal({
  isOpen,
  onClose,
  onStart,
  hasTakenBefore
}: ReassessmentPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {hasTakenBefore ? "Track Your Progress!" : "Ready to Measure Growth!"}
          </h2>

          {/* Description */}
          <div className="space-y-3 mb-6 text-left">
            <p className="text-gray-700">
              {hasTakenBefore 
                ? "It’s time to see how your business has evolved! Take the Growth Progress Tracker to measure improvements across all key areas."
                : "You’ve been using OptimaliQ for 30+ days. Now it’s time to establish your baseline and start tracking your growth journey."
              }
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-medium">What you’ll get:</p>
              <ul className="text-blue-700 text-sm mt-1 space-y-1">
                <li>• Comprehensive business health score</li>
                <li>• Progress tracking across all areas</li>
                <li>• Strategic improvement insights</li>
                <li>• Updated growth recommendations</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {hasTakenBefore ? "Start Progress Assessment" : "Start Baseline Assessment"}
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 