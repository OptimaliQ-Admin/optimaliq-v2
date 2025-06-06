import React from 'react';

interface Roadmap {
  strategy: string;
  process: string;
  technology: string;
}

interface RoadmapDisplayProps {
  roadmap: Roadmap;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ roadmap }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Growth Roadmap</h2>
      
      <div className="space-y-6">
        {/* Strategy Roadmap */}
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-3">Strategy Roadmap</h3>
          <p className="text-gray-700 whitespace-pre-line">{roadmap.strategy}</p>
        </div>

        {/* Process Roadmap */}
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-3">Process Roadmap</h3>
          <p className="text-gray-700 whitespace-pre-line">{roadmap.process}</p>
        </div>

        {/* Technology Roadmap */}
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-3">Technology Roadmap</h3>
          <p className="text-gray-700 whitespace-pre-line">{roadmap.technology}</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay; 