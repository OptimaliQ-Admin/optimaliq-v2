"use client";

interface ReassessmentLearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReassessmentLearnMoreModal({
  isOpen,
  onClose
}: ReassessmentLearnMoreModalProps) {
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
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Growth Progress Tracker
          </h2>

          {/* Description */}
          <div className="space-y-4 text-left text-gray-700 mb-6">
            <p>
              The Growth Progress Tracker is your comprehensive business health check that measures improvements across all key areas of your business.
            </p>
            
            <p>
              <strong>What it measures:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Overall business maturity and growth</li>
              <li>Progress across all assessment categories</li>
              <li>Strategic improvements and optimizations</li>
              <li>Market position and competitive standing</li>
            </ul>
            
            <p>
              <strong>When you can take it:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>First time: After 30 days from account creation</li>
              <li>Subsequent times: Every 30 days after your last assessment</li>
            </ul>
            
            <p className="text-sm text-blue-600 font-medium">
              This regular tracking helps you see the impact of your strategic decisions and identify areas for continued improvement.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
} 