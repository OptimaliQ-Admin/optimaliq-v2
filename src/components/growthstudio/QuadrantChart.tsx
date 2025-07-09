"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ChartBarIcon, 
  InformationCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

interface QuadrantData {
  name: string;
  x: number;
  y: number;
  category?: string;
  size?: number;
  color?: string;
}

interface QuadrantChartProps {
  data: QuadrantData[];
  onPointClick?: (point: QuadrantData) => void;
  title?: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

interface QuadrantLabelsProps {
  xAxisLabel?: string;
  yAxisLabel?: string;
}

function QuadrantLabels({ xAxisLabel, yAxisLabel }: QuadrantLabelsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* X-axis label */}
      {xAxisLabel && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
          <span className="text-sm font-medium text-gray-600">{xAxisLabel}</span>
        </div>
      )}
      
      {/* Y-axis label */}
      {yAxisLabel && (
        <div className="absolute left-0 top-1/2 transform -translate-x-8 -translate-y-1/2 -rotate-90">
          <span className="text-sm font-medium text-gray-600">{yAxisLabel}</span>
        </div>
      )}
      
      {/* Quadrant labels */}
      <div className="absolute top-4 left-4 text-xs font-semibold text-gray-400">
        High Growth
            </div>
      <div className="absolute top-4 right-4 text-xs font-semibold text-gray-400">
        High Market Share
            </div>
      <div className="absolute bottom-4 left-4 text-xs font-semibold text-gray-400">
        Emerging
            </div>
      <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-400">
        Mature
        </div>
      </div>
    );
  }

export default function QuadrantChart({
  data,
  onPointClick,
  title = "Strategic Positioning",
  subtitle = "Your position relative to competitors",
  xAxisLabel = "Market Share (%)",
  yAxisLabel = "Growth Rate (%)",
  className = ""
}: QuadrantChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<QuadrantData | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<QuadrantData | null>(null);

  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const minX = Math.min(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));

  const getPointColor = (point: QuadrantData) => {
    if (point.color) return point.color;
    
    // Determine quadrant and assign color
    const midX = (maxX + minX) / 2;
    const midY = (maxY + minY) / 2;
    
    if (point.x > midX && point.y > midY) return "#10b981"; // High-High: Green
    if (point.x > midX && point.y <= midY) return "#3b82f6"; // High-Low: Blue
    if (point.x <= midX && point.y > midY) return "#f59e0b"; // Low-High: Yellow
    return "#ef4444"; // Low-Low: Red
  };

  const getPointSize = (point: QuadrantData) => {
    return point.size || 8;
  };

  const handlePointClick = (point: QuadrantData) => {
    setSelectedPoint(point);
    onPointClick?.(point);
  };

    return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            {title}
          </h3>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <InformationCircleIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Click points for details</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-96 bg-gray-50 rounded-xl border border-gray-200 p-4">
        {/* Grid Lines */}
        <div className="absolute inset-4">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-px" />
          {/* Horizontal center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 transform -translate-y-px" />
        </div>

        {/* Data Points */}
        <div className="relative h-full">
          {data.map((point, index) => {
            const x = ((point.x - minX) / (maxX - minX)) * 100;
            const y = 100 - ((point.y - minY) / (maxY - minY)) * 100; // Invert Y for SVG coordinates

  return (
    <motion.div
                key={point.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => handlePointClick(point)}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div
                  className="rounded-full border-2 border-white shadow-lg"
                  style={{
                    width: `${getPointSize(point)}px`,
                    height: `${getPointSize(point)}px`,
                    backgroundColor: getPointColor(point)
                  }}
                />
                
                {/* Tooltip */}
                {hoveredPoint?.name === point.name && (
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10"
                    initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
    >
                    <div className="font-semibold">{point.name}</div>
                    <div className="text-gray-300">
                      {xAxisLabel}: {point.x.toFixed(1)}%
                    </div>
                    <div className="text-gray-300">
                      {yAxisLabel}: {point.y.toFixed(1)}%
                    </div>
                    {point.category && (
                      <div className="text-gray-300">
                        Category: {point.category}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quadrant Labels */}
        <QuadrantLabels xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} />

        {/* Axis Labels */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
          {minX.toFixed(0)}%
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {maxX.toFixed(0)}%
        </div>
        <div className="absolute top-2 left-2 text-xs text-gray-500">
          {maxY.toFixed(0)}%
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          {minY.toFixed(0)}%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600">High Growth & Market Share</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-sm text-gray-600">High Market Share</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-sm text-gray-600">High Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm text-gray-600">Emerging</span>
        </div>
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{selectedPoint.name}</h4>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <div>
              <span className="text-gray-600">{xAxisLabel}:</span>
              <span className="font-semibold ml-2">{selectedPoint.x.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">{yAxisLabel}:</span>
              <span className="font-semibold ml-2">{selectedPoint.y.toFixed(1)}%</span>
            </div>
      </div>
    </motion.div>
      )}
    </div>
  );
}
