"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import SectionTitleBar from "./SectionTitleBar";

interface Props {
  strategy: number;
  process: number;
  technology: number;
  industryAvg: number;
  topPerformer: number;
}

interface GaugeData {
  category: string;
  value: number;
  industryAvg: number;
  topPerformer: number;
  color: string;
  icon: string;
  description: string;
}

const CapabilityGaugeCluster: React.FC<Props> = ({
  strategy,
  process,
  technology,
  industryAvg,
  topPerformer,
}) => {
  const [hoveredGauge, setHoveredGauge] = useState<string | null>(null);
  const [selectedGauge, setSelectedGauge] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const svgRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

  const gaugeData: GaugeData[] = [
    {
      category: "Strategy",
      value: strategy,
      industryAvg,
      topPerformer,
      color: "#3b82f6",
      icon: "🎯",
      description: "Clarity, positioning, and strategic alignment"
    },
    {
      category: "Process",
      value: process,
      industryAvg,
      topPerformer,
      color: "#10b981",
      icon: "⚙️",
      description: "Consistency, execution, and scalability"
    },
    {
      category: "Technology",
      value: technology,
      industryAvg,
      topPerformer,
      color: "#8b5cf6",
      icon: "🚀",
      description: "Growth, automation, and efficiency"
    }
  ];

  const getPerformanceZone = (value: number, topPerformer: number) => {
    const percentage = (value / topPerformer) * 100;
    if (percentage >= 90) return { zone: "Excellence", color: "#10b981", bg: "#d1fae5" };
    if (percentage >= 75) return { zone: "Competitive", color: "#f59e0b", bg: "#fef3c7" };
    if (percentage >= 60) return { zone: "Developing", color: "#ef4444", bg: "#fee2e2" };
    return { zone: "Needs Focus", color: "#dc2626", bg: "#fecaca" };
  };

  const getTrendDirection = (value: number, industryAvg: number) => {
    const diff = value - industryAvg;
    if (diff > 0.5) return { direction: "up", color: "#10b981", percentage: Math.round((diff / industryAvg) * 100) };
    if (diff < -0.5) return { direction: "down", color: "#ef4444", percentage: Math.round((Math.abs(diff) / industryAvg) * 100) };
    return { direction: "stable", color: "#6b7280", percentage: 0 };
  };

  const getExplanation = (data: GaugeData) => {
    const vsIndustry = ((data.value / data.industryAvg) * 100 - 100);
    const vsTopPerformer = (data.value / data.topPerformer) * 100;
    
    return {
      vsIndustry: vsIndustry > 0 
        ? `You&apos;re performing ${Math.round(vsIndustry)}% better than the typical company in your industry`
        : `You&apos;re performing ${Math.round(Math.abs(vsIndustry))}% below the typical company in your industry`,
      vsTopPerformer: `You&apos;re operating at ${Math.round(vsTopPerformer)}% of what the best companies in your industry achieve`,
      performanceZone: getPerformanceZone(data.value, data.topPerformer).zone
    };
  };

  useEffect(() => {
    gaugeData.forEach((data) => {
      const svgRef = svgRefs.current[data.category];
      if (!svgRef) return;

      // Clear previous content
      d3.select(svgRef).selectAll("*").remove();

      // Setup dimensions - making gauges larger
      const margin = { top: 30, right: 30, bottom: 30, left: 30 };
      const width = svgRef.clientWidth - margin.left - margin.right;
      const height = svgRef.clientHeight - margin.top - margin.bottom;
      const radius = Math.min(width, height) / 2 - 15; // Increased radius for better visibility

      // Create SVG
      const svg = d3
        .select(svgRef)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

      // Create gauge arc
      const arc = d3
        .arc<d3.DefaultArcObject>()
        .innerRadius(radius * 0.5) // Reduced inner radius for larger arc
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

      // Background arc
      svg
        .append("path")
        .datum({
          innerRadius: radius * 0.5,
          outerRadius: radius,
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2
        })
        .attr("d", arc)
        .style("fill", "#f3f4f6")
        .style("stroke", "#e5e7eb")
        .style("stroke-width", 2);

      // Performance zones
      const zones = [
        { start: 0, end: 0.6, color: "#fee2e2" },
        { start: 0.6, end: 0.75, color: "#fef3c7" },
        { start: 0.75, end: 0.9, color: "#d1fae5" },
        { start: 0.9, end: 1, color: "#10b981" }
      ];

      zones.forEach((zone) => {
        const zoneArc = d3
          .arc<d3.DefaultArcObject>()
          .innerRadius(radius * 0.5)
          .outerRadius(radius)
          .startAngle(-Math.PI / 2 + (zone.start * Math.PI))
          .endAngle(-Math.PI / 2 + (zone.end * Math.PI));

        svg
          .append("path")
          .datum({
            innerRadius: radius * 0.5,
            outerRadius: radius,
            startAngle: -Math.PI / 2 + (zone.start * Math.PI),
            endAngle: -Math.PI / 2 + (zone.end * Math.PI)
          })
          .attr("d", zoneArc)
          .style("fill", zone.color)
          .style("opacity", 0.3);
      });

      // Value arc with animation
      const valuePercentage = data.value / 5;
      const valueArc = d3
        .arc<d3.DefaultArcObject>()
        .innerRadius(radius * 0.5)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(-Math.PI / 2 + (valuePercentage * Math.PI));

      const valuePath = svg
        .append("path")
        .datum({
          innerRadius: radius * 0.5,
          outerRadius: radius,
          startAngle: -Math.PI / 2,
          endAngle: -Math.PI / 2 + (valuePercentage * Math.PI)
        })
        .attr("d", valueArc)
        .style("fill", data.color)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

      // Animate the value arc
      const totalLength = valuePath.node()?.getTotalLength() || 0;
      valuePath
        .style("stroke-dasharray", totalLength)
        .style("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeElastic)
        .style("stroke-dashoffset", 0);

      // Center text - making it larger and more prominent
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.3em")
        .style("font-size", "28px") // Increased font size
        .style("font-weight", "bold")
        .style("fill", data.color)
        .style("text-shadow", "0 1px 2px rgba(0,0,0,0.1)") // Added text shadow for better readability
        .text(data.value.toFixed(1));

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.2em")
        .style("font-size", "14px") // Increased font size
        .style("fill", "#6b7280")
        .style("font-weight", "500")
        .text("Score");

      // Industry average line
      const industryPercentage = data.industryAvg / 5;
      const industryAngle = -Math.PI / 2 + (industryPercentage * Math.PI);
      
      svg
        .append("line")
        .attr("x1", (radius * 0.4) * Math.cos(industryAngle))
        .attr("y1", (radius * 0.4) * Math.sin(industryAngle))
        .attr("x2", (radius * 0.9) * Math.cos(industryAngle))
        .attr("y2", (radius * 0.9) * Math.sin(industryAngle))
        .style("stroke", "#6b7280")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "4,4");

      // Top performer line
      const topPercentage = data.topPerformer / 5;
      const topAngle = -Math.PI / 2 + (topPercentage * Math.PI);
      
      svg
        .append("line")
        .attr("x1", (radius * 0.4) * Math.cos(topAngle))
        .attr("y1", (radius * 0.4) * Math.sin(topAngle))
        .attr("x2", (radius * 0.9) * Math.cos(topAngle))
        .attr("y2", (radius * 0.9) * Math.sin(topAngle))
        .style("stroke", "#10b981")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "2,2");
    });
  }, [strategy, process, technology, industryAvg, topPerformer]);

  const overallPerformance = ((strategy + process + technology) / 3 / topPerformer) * 100;
  const industryPosition = ((strategy + process + technology) / 3 / industryAvg) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      <div className="mb-6">
        <SectionTitleBar
          title="🎯 Capability Maturity Dashboard"
          tooltip="Real-time view of your performance across all key business dimensions with industry benchmarks and top performer targets."
        />
        <p className="text-gray-500 text-sm leading-relaxed mt-2">
          Track your maturity levels against industry benchmarks and top performers. Each gauge shows your current performance with trend indicators and performance zones.
        </p>
      </div>

      {/* Gauge Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {gaugeData.map((data) => {
          const performanceZone = getPerformanceZone(data.value, data.topPerformer);
          const trend = getTrendDirection(data.value, data.industryAvg);
          const explanation = getExplanation(data);
          const isSelected = selectedGauge === data.category;
          
          return (
            <motion.div
              key={data.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: gaugeData.indexOf(data) * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-blue-400 shadow-lg bg-blue-50"
                  : hoveredGauge === data.category
                  ? "border-blue-300 shadow-lg"
                  : "border-gray-100 hover:border-gray-200"
              }`}
              onMouseEnter={() => setHoveredGauge(data.category)}
              onMouseLeave={() => setHoveredGauge(null)}
              onClick={() => {
                setSelectedGauge(isSelected ? null : data.category);
                setShowExplanation(isSelected ? null : data.category);
              }}
              role="button"
              tabIndex={0}
              aria-label={`${data.category} capability gauge showing ${data.value.toFixed(1)} out of 5`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const newSelected = isSelected ? null : data.category;
                  setSelectedGauge(newSelected);
                  setShowExplanation(newSelected);
                }
              }}
            >
              {/* Gauge Icon and Title */}
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{data.icon}</div>
                <h3 className="text-lg font-bold text-gray-800">{data.category}</h3>
                <p className="text-xs text-gray-500 mt-1">{data.description}</p>
              </div>

              {/* Gauge SVG - Made larger */}
              <div className="flex justify-center mb-4">
                <svg
                  ref={(el) => {
                    svgRefs.current[data.category] = el;
                  }}
                  className="w-40 h-40" // Increased from w-32 h-32
                  style={{ maxWidth: "100%" }}
                  aria-hidden="true"
                />
              </div>

              {/* Performance Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance Zone:</span>
                  <span 
                    className="text-sm font-semibold px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: performanceZone.bg,
                      color: performanceZone.color
                    }}
                  >
                    {performanceZone.zone}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">vs Industry:</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-semibold ${trend.color}`}>
                      {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                      {trend.percentage}%
                    </span>
                    {trend.direction !== "stable" && (
                      <span className={`text-sm ${trend.color}`}>
                        {trend.direction === "up" ? "↗️" : "↘️"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">vs Top Performer:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {Math.round((data.value / data.topPerformer) * 100)}%
                  </span>
                </div>
              </div>

              {/* Click to see explanation hint */}
              <div className="text-center mt-3">
                <span className="text-xs text-blue-600 font-medium">
                  {isSelected ? "Click to hide details" : "Click for detailed explanation"}
                </span>
              </div>

              {/* Detailed Explanation Modal */}
              <AnimatePresence>
                {isSelected && showExplanation === data.category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                      📊 {data.category} Performance Analysis
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{explanation.vsIndustry}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span>{explanation.vsTopPerformer}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Performance Zone: <strong>{explanation.performanceZone}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
      >
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          📊 Performance Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              +{Math.round(industryPosition - 100)}%
            </div>
            <div className="text-sm text-gray-600">Above Industry Average</div>
            <div className="text-xs text-gray-500 mt-1">
              You&apos;re performing {Math.round(industryPosition - 100)}% better than the typical company in your industry
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(overallPerformance)}%
            </div>
            <div className="text-sm text-gray-600">of Top Performer Level</div>
            <div className="text-xs text-gray-500 mt-1">
              You&apos;re operating at {Math.round(overallPerformance)}% of what the best companies in your industry achieve
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              Top {Math.round(100 - overallPerformance)}%
            </div>
            <div className="text-sm text-gray-600">Industry Percentile</div>
            <div className="text-xs text-gray-500 mt-1">
              You&apos;re in the top {Math.round(100 - overallPerformance)}% of companies in your industry
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Strongest Area:</span>
            <span className="text-sm font-semibold text-green-600">
              {gaugeData.reduce((max, current) => 
                (current.value / current.topPerformer) > (max.value / max.topPerformer) ? current : max
              ).category}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">Growth Opportunity:</span>
            <span className="text-sm font-semibold text-orange-600">
              {gaugeData.reduce((min, current) => 
                (current.value / current.topPerformer) < (min.value / min.topPerformer) ? current : min
              ).category}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>Your Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-gray-600 rounded-full"></div>
          <span>Industry Avg</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-green-500 rounded-full"></div>
          <span>Top Performers</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CapabilityGaugeCluster; 