"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { PredictiveAnalytics } from '@/lib/ai/services/dashboard';
import SectionHeader from './SectionHeader';

interface Props {
  userId: string;
  dashboardData: any;
  metric: string;
}

export default function PredictiveAnalyticsCard({ userId, dashboardData, metric }: Props) {
  const [analytics, setAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const generateAnalytics = async () => {
      if (!dashboardData) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/predictive-analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            dashboardData,
            metric
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate predictive analytics');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Error generating predictive analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate analytics');
      } finally {
        setLoading(false);
      }
    };

    generateAnalytics();
  }, [userId, dashboardData, metric]);

  useEffect(() => {
    if (!svgRef.current || !analytics) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 40, right: 60, bottom: 60, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data for visualization
    const predictionData = analytics.predictions.map((pred, index) => ({
      timeframe: pred.timeframe,
      value: pred.value,
      confidence: pred.confidence,
      index: index
    }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, predictionData.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(predictionData, d => d.value) || 0])
      .range([height, 0]);

    // Add background gradient
    const backgroundGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "predictionBackgroundGradient")
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

    // Add background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "url(#predictionBackgroundGradient)")
      .style("rx", "8")
      .style("ry", "8");

    // Add grid lines
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(() => "")
      .ticks(5);

    svg.append("g")
      .attr("class", "grid")
      .call(yGrid)
      .style("stroke", "#e5e7eb")
      .style("stroke-width", 1)
      .style("opacity", 0.5);

    // Create line generator
    const line = d3.line<{timeframe: string, value: number, confidence: number, index: number}>()
      .x(d => xScale(d.index))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add confidence intervals
    predictionData.forEach((d, i) => {
      const confidenceHeight = (1 - d.confidence) * 40;
      svg.append("rect")
        .attr("x", xScale(i) - 10)
        .attr("y", yScale(d.value) - confidenceHeight/2)
        .attr("width", 20)
        .attr("height", confidenceHeight)
        .style("fill", "#3b82f6")
        .style("opacity", 0.2)
        .style("rx", 2);
    });

    // Add prediction line
    svg.append("path")
      .datum(predictionData)
      .attr("class", "prediction-line")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#3b82f6")
      .style("stroke-width", 3)
      .style("stroke-linecap", "round")
      .style("stroke-linejoin", "round");

    // Add data points
    svg.selectAll(".prediction-point")
      .data(predictionData)
      .enter()
      .append("circle")
      .attr("class", "prediction-point")
      .attr("cx", d => xScale(d.index))
      .attr("cy", d => yScale(d.value))
      .attr("r", 6)
      .style("fill", "#3b82f6")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 8);
        
        // Show tooltip
        const tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "white")
          .style("border", "1px solid #ddd")
          .style("border-radius", "4px")
          .style("padding", "8px")
          .style("font-size", "12px")
          .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
          .style("pointer-events", "none");

        tooltip.html(`
          <strong>${d.timeframe}</strong><br/>
          Predicted: ${d.value.toLocaleString()}<br/>
          Confidence: ${Math.round(d.confidence * 100)}%
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 6);
        d3.selectAll(".tooltip").remove();
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d, i) => predictionData[i]?.timeframe || "")
      .tickSize(0);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d) => d.toLocaleString());

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .style("font-size", "12px")
      .style("color", "#6b7280");

    svg.append("g")
      .call(yAxis)
      .style("font-size", "12px")
      .style("color", "#6b7280");

    // Add axis labels
    svg.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .style("fill", "#374151")
      .text("Timeframe");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .style("fill", "#374151")
      .text(metric);

  }, [analytics, metric]);

  const getSeasonalityColor = (pattern: string) => {
    switch (pattern) {
      case 'trending': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'seasonal': return 'text-green-600 bg-green-50 border-green-200';
      case 'cyclical': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'random': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">⚠️ Error Loading Predictive Analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader 
        title="🔮 Predictive Analytics" 
        subtitle={`Advanced forecasting and trend analysis for ${metric}`}
      />

      <div className="space-y-8">
        {/* Prediction Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Trends</h3>
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <svg ref={svgRef} className="w-full" style={{ height: "400px" }} />
          </div>
        </div>

        {/* Seasonality Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonality Analysis</h3>
          <div className={`p-4 rounded-lg border ${getSeasonalityColor(analytics.seasonality.pattern)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold capitalize">{analytics.seasonality.pattern} Pattern</h4>
              <span className="text-sm">
                Strength: {Math.round(analytics.seasonality.strength * 100)}%
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Peak Periods</h5>
                <ul className="space-y-1">
                  {analytics.seasonality.peaks.map((peak, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>
                      {peak}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Low Periods</h5>
                <ul className="space-y-1">
                  {analytics.seasonality.troughs.map((trough, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {trough}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${getRiskColor('high')}`}>
              <h4 className="font-semibold text-red-900 mb-3">High Risk Factors</h4>
              <ul className="space-y-2">
                {analytics.riskAssessment.highRisk.map((risk, index) => (
                  <li key={index} className="text-sm text-red-800 flex items-start">
                    <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg border ${getRiskColor('medium')}`}>
              <h4 className="font-semibold text-amber-900 mb-3">Medium Risk Factors</h4>
              <ul className="space-y-2">
                {analytics.riskAssessment.mediumRisk.map((risk, index) => (
                  <li key={index} className="text-sm text-amber-800 flex items-start">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg border ${getRiskColor('low')}`}>
              <h4 className="font-semibold text-green-900 mb-3">Low Risk Factors</h4>
              <ul className="space-y-2">
                {analytics.riskAssessment.lowRisk.map((risk, index) => (
                  <li key={index} className="text-sm text-green-800 flex items-start">
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mitigation Strategies */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mitigation Strategies</h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <ul className="space-y-3">
              {analytics.riskAssessment.mitigationStrategies.map((strategy, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Factors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Influencing Factors</h3>
          <div className="space-y-3">
            {analytics.predictions[0]?.factors.map((factor, index) => (
              <motion.div
                key={factor.factor}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    factor.impact > 0 ? 'bg-green-100 text-green-800' : 
                    factor.impact < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}% impact
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(factor.confidence * 100)}% confidence
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 