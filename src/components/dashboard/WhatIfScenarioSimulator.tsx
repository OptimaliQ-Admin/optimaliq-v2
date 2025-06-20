"use client";

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

interface SimulationResult {
  revenueImpact: number;
  costSavings: number;
  efficiencyGain: number;
}

interface SimulationData {
  strategyChange: number;
  processChange: number;
  techChange: number;
  revenue: number;
  costs: number;
  efficiency: number;
}

export default function WhatIfScenarioSimulator() {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    strategyChange: 0,
    processChange: 0,
    techChange: 0,
    revenue: 100000,
    costs: 50000,
    efficiency: 50
  });
  
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate impact in real-time
  const calculateImpact = (data: SimulationData): SimulationResult => {
    const strategyWeight = 0.6;
    const processWeight = 0.3;
    const techWeight = 0.4;

    const strategyEffect = Math.pow(Math.abs(data.strategyChange), 1.1) * Math.sign(data.strategyChange);
    const processEffect = Math.pow(Math.abs(data.processChange), 1.05) * Math.sign(data.processChange);
    const techEffect = Math.pow(Math.abs(data.techChange), 1.05) * Math.sign(data.techChange);

    const efficiencyMultiplier = (100 - data.efficiency) / 100;

    const revenueImpact = Math.round(
      (strategyEffect * strategyWeight + processEffect * processWeight + techEffect * techWeight) *
      data.revenue * 0.12
    );

    const costSavings = Math.round(
      (strategyEffect * 0.4 + techEffect * 0.6) * data.costs * 0.07
    );

    const efficiencyGain = Math.round(
      (processEffect + techEffect) * 1.8 * efficiencyMultiplier * 10
    ) / 10;

    return { revenueImpact, costSavings, efficiencyGain };
  };

  // Update results when simulation data changes
  useEffect(() => {
    const newResults = calculateImpact(simulationData);
    setResults(newResults);
    
    // Update chart data
    const newChartData = [
      { category: "Revenue Impact", value: newResults.revenueImpact, color: "#10b981", icon: "📈" },
      { category: "Cost Savings", value: newResults.costSavings, color: "#3b82f6", icon: "💸" },
      { category: "Efficiency Gain", value: newResults.efficiencyGain, color: "#f59e0b", icon: "⚙️" }
    ];
    setChartData(newChartData);
  }, [simulationData]);

  // Render chart
  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background with gradient
    const backgroundGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "simulatorBackgroundGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    backgroundGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8fafc")
      .attr("stop-opacity", 0.8);

    backgroundGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.3);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "url(#simulatorBackgroundGradient)")
      .style("rx", "12")
      .style("ry", "12")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))");

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(chartData.map(d => d.category))
      .range([0, width])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
      .range([height, 0])
      .nice();

    // Add bars with Salesforce styling
    const bars = svg
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("g")
      .attr("class", "bar");

    // Create gradients for bars
    chartData.forEach((d, i) => {
      const gradient = svg.append("defs").append("linearGradient")
        .attr("id", `barGradient${i}`)
        .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
      
      gradient.append("stop").attr("offset", "0%").attr("stop-color", d.color).attr("stop-opacity", 0.8);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", d.color).attr("stop-opacity", 0.4);
    });

    bars.append("rect")
      .attr("x", d => xScale(d.category)!)
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.value))
      .style("fill", (d, i) => `url(#barGradient${i})`)
      .style("stroke", d => d.color)
      .style("stroke-width", 2)
      .style("rx", 6)
      .style("ry", 6)
      .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))")
      .style("transition", "all 0.3s ease")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("filter", "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))")
          .style("transform", "scale(1.02)");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))")
          .style("transform", "scale(1)");
      });

    // Add value labels on bars
    bars.append("text")
      .attr("x", d => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", d => d.color)
      .text(d => {
        if (d.category === "Efficiency Gain") return `${d.value.toFixed(1)}%`;
        return `$${(d.value / 1000).toFixed(0)}k`;
      });

    // Add category labels
    bars.append("text")
      .attr("x", d => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr("y", height + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", "#64748b")
      .text(d => `${d.icon} ${d.category}`);

    // Add grid lines
    const yTicks = yScale.ticks(5);
    svg.selectAll(".grid-line")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .style("stroke", "#e2e8f0")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "2 4");

  }, [chartData]);

  const handleSliderChange = (field: keyof SimulationData, value: number) => {
    setSimulationData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof SimulationData, value: number) => {
    setSimulationData(prev => ({ ...prev, [field]: value }));
  };

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/growth_studio/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to run simulation");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err instanceof Error ? err.message : "Failed to run simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader title="🔮 What-If Scenario Simulator" subtitle="Adjust metrics to see how improvements in strategy, process, and tech affect business outcomes" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Strategy Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Strategy Change
              </label>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {simulationData.strategyChange > 0 ? '+' : ''}{simulationData.strategyChange}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={simulationData.strategyChange}
              onChange={(e) => handleSliderChange('strategyChange', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-2 (Decline)</span>
              <span>0 (No Change)</span>
              <span>+2 (Improvement)</span>
            </div>
          </div>

          {/* Process Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                Process Change
              </label>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {simulationData.processChange > 0 ? '+' : ''}{simulationData.processChange}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={simulationData.processChange}
              onChange={(e) => handleSliderChange('processChange', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-2 (Decline)</span>
              <span>0 (No Change)</span>
              <span>+2 (Improvement)</span>
            </div>
          </div>

          {/* Technology Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-lg">🚀</span>
                Technology Change
              </label>
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {simulationData.techChange > 0 ? '+' : ''}{simulationData.techChange}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={simulationData.techChange}
              onChange={(e) => handleSliderChange('techChange', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-2 (Decline)</span>
              <span>0 (No Change)</span>
              <span>+2 (Improvement)</span>
            </div>
          </div>

          {/* Business Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">Business Metrics</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Annual Revenue ($)</label>
                <input
                  type="number"
                  value={simulationData.revenue}
                  onChange={(e) => handleInputChange('revenue', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Annual Costs ($)</label>
                <input
                  type="number"
                  value={simulationData.costs}
                  onChange={(e) => handleInputChange('costs', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Current Efficiency (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={simulationData.efficiency}
                  onChange={(e) => handleInputChange('efficiency', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Run Simulation Button */}
          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running Simulation...
              </span>
            ) : (
              "Run Advanced Simulation"
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Impact Analysis</h4>
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Real-time Preview
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <svg ref={svgRef} className="w-full" style={{ height: "300px" }} />
          </div>

          {/* Quick Stats */}
          {results && (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-green-700">
                  ${(results.revenueImpact / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-green-600">Revenue Impact</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-lg font-bold text-blue-700">
                  ${(results.costSavings / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-blue-600">Cost Savings</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-lg font-bold text-yellow-700">
                  {results.efficiencyGain.toFixed(1)}%
                </div>
                <div className="text-xs text-yellow-600">Efficiency Gain</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            AI-powered simulation
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </motion.div>
  );
} 