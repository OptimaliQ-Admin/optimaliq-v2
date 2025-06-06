import React from 'react';

interface Insight {
  score: number;
  insight: string;
}

interface Insights {
  strategy: Insight;
  process: Insight;
  technology: Insight;
  overall: number;
}

interface InsightsDisplayProps {
  insights: Insights;
}

const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ insights }) => {
  const roundToNearestHalf = (num: number) => Math.floor(num * 2) / 2;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Overall Score Card */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Overall Growth Score</h2>
        <div className="flex items-center justify-center">
          <div className="text-6xl font-bold text-blue-600">
            {roundToNearestHalf(insights.overall)}
          </div>
          <div className="text-gray-500 ml-2">/ 5</div>
        </div>
      </div>

      {/* Strategy Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Strategy</h3>
        <div className="flex items-center mb-4">
          <div className="text-4xl font-bold text-blue-600">
            {roundToNearestHalf(insights.strategy.score)}
          </div>
          <div className="text-gray-500 ml-2">/ 5</div>
        </div>
        <p className="text-gray-700">{insights.strategy.insight}</p>
      </div>

      {/* Process Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Process</h3>
        <div className="flex items-center mb-4">
          <div className="text-4xl font-bold text-blue-600">
            {roundToNearestHalf(insights.process.score)}
          </div>
          <div className="text-gray-500 ml-2">/ 5</div>
        </div>
        <p className="text-gray-700">{insights.process.insight}</p>
      </div>

      {/* Technology Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-blue-700 mb-2">Technology</h3>
        <div className="flex items-center mb-4">
          <div className="text-4xl font-bold text-blue-600">
            {roundToNearestHalf(insights.technology.score)}
          </div>
          <div className="text-gray-500 ml-2">/ 5</div>
        </div>
        <p className="text-gray-700">{insights.technology.insight}</p>
      </div>
    </div>
  );
};

export default InsightsDisplay; 