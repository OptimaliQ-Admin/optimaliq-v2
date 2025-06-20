"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

interface FunnelData {
  category: string;
  score: number;
  contribution: number;
  target: number;
  color: string;
  icon: string;
}

interface Props {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  overallScore: number;
  industryAvg: number;
  topPerformer: number;
}

const PerformanceFunnelChart: React.FC<Props> = ({
  strategyScore,
  processScore,
  technologyScore,
  overallScore,
  industryAvg,
  topPerformer,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data
    const funnelData: FunnelData[] = [
      {
        category: "Strategy",
        score: strategyScore,
        contribution: (strategyScore / 3) * 100,
        target: topPerformer,
        color: "#3b82f6",
        icon: "🎯",
      },
      {
        category: "Process",
        score: processScore,
        contribution: (processScore / 3) * 100,
        target: topPerformer,
        color: "#f59e0b",
        icon: "⚙️",
      },
      {
        category: "Technology",
        score: technologyScore,
        contribution: (technologyScore / 3) * 100,
        target: topPerformer,
        color: "#10b981",
        icon: "🚀",
      },
    ];

    // Setup dimensions
    const margin = { top: 40, right: 60, bottom: 80, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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
      .attr("id", "funnelBackgroundGradient")
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
      .style("fill", "url(#funnelBackgroundGradient)")
      .style("rx", "12")
      .style("ry", "12")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))");

    // Scales - Define yScale before using it in zones
    const xScale = d3
      .scaleBand()
      .domain(funnelData.map((d) => d.category))
      .range([0, width])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, 5])
      .range([height, 0])
      .nice();

    // Grid lines
    const yTicks = yScale.ticks(5);
    svg
      .selectAll(".grid-line")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .style("stroke", "#e2e8f0")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "2 4");

    // Performance zones
    const zones = [
      { name: "Excellence", start: 4.5, end: 5.0, color: "#10b981", opacity: 0.1 },
      { name: "Competitive", start: 3.5, end: 4.5, color: "#f59e0b", opacity: 0.08 },
      { name: "Developing", start: 2.5, end: 3.5, color: "#ef4444", opacity: 0.06 },
      { name: "Foundation", start: 1.0, end: 2.5, color: "#6b7280", opacity: 0.04 }
    ];

    zones.forEach(zone => {
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", yScale(zone.end))
        .attr("width", width)
        .attr("height", yScale(zone.start) - yScale(zone.end))
        .style("fill", zone.color)
        .style("opacity", zone.opacity)
        .style("rx", "4");
    });

    // Draw bars with gradients
    funnelData.forEach((item, index) => {
      const barGradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", `barGradient${index}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      barGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", item.color)
        .attr("stop-opacity", 0.8);

      barGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", item.color)
        .attr("stop-opacity", 0.4);

      const barWidth = xScale.bandwidth();
      const barHeight = height - yScale(item.score);
      const barX = xScale(item.category)!;
      const barY = yScale(item.score);

      // Main bar
      svg
        .append("rect")
        .attr("x", barX)
        .attr("y", barY)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .style("fill", `url(#barGradient${index})`)
        .style("stroke", item.color)
        .style("stroke-width", 2)
        .style("rx", "6")
        .style("filter", "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))")
        .style("transition", "all 0.3s ease");

      // Target line
      svg
        .append("line")
        .attr("x1", barX)
        .attr("x2", barX + barWidth)
        .attr("y1", yScale(topPerformer))
        .attr("y2", yScale(topPerformer))
        .style("stroke", "#ef4444")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "4 4");

      // Industry average line
      svg
        .append("line")
        .attr("x1", barX)
        .attr("x2", barX + barWidth)
        .attr("y1", yScale(industryAvg))
        .attr("y2", yScale(industryAvg))
        .style("stroke", "#64748b")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "2 4");

      // Score text
      svg
        .append("text")
        .attr("x", barX + barWidth / 2)
        .attr("y", barY - 10)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "700")
        .style("fill", item.color)
        .text(item.score.toFixed(1));

      // Category label with icon
      svg
        .append("text")
        .attr("x", barX + barWidth / 2)
        .attr("y", height + 20)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", "#475569")
        .text(`${item.icon} ${item.category}`);

      // Contribution percentage
      svg
        .append("text")
        .attr("x", barX + barWidth / 2)
        .attr("y", height + 40)
        .style("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#64748b")
        .text(`${item.contribution.toFixed(0)}% contribution`);

      // Target label
      svg
        .append("text")
        .attr("x", barX + barWidth + 5)
        .attr("y", yScale(topPerformer) - 5)
        .style("text-anchor", "start")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .style("fill", "#ef4444")
        .text(`Target: ${topPerformer}`);

      // Industry label
      svg
        .append("text")
        .attr("x", barX + barWidth + 5)
        .attr("y", yScale(industryAvg) - 5)
        .style("text-anchor", "start")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .style("fill", "#64748b")
        .text(`Industry: ${industryAvg}`);
    });

    // Y-axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => (d as number).toFixed(1));

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .style("color", "#64748b")
      .style("font-size", "11px")
      .style("font-weight", "500");

    // Y-axis label
    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#475569")
      .text("Performance Score");

    // Overall score indicator
    const overallX = width / 2;
    const overallY = yScale(overallScore);

    svg
      .append("line")
      .attr("x1", overallX - 20)
      .attr("x2", overallX + 20)
      .attr("y1", overallY)
      .attr("y2", overallY)
      .style("stroke", "#8b5cf6")
      .style("stroke-width", 4)
      .style("stroke-linecap", "round");

    svg
      .append("text")
      .attr("x", overallX)
      .attr("y", overallY - 15)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", "#8b5cf6")
      .text(`Overall: ${overallScore.toFixed(1)}`);

    // Performance gap analysis
    const gaps = funnelData.map(item => ({
      category: item.category,
      gap: topPerformer - item.score,
      percentage: (item.score / topPerformer) * 100
    }));

    // Add gap analysis text
    const maxGap = Math.max(...gaps.map(g => g.gap));
    const biggestGap = gaps.find(g => g.gap === maxGap);

    if (biggestGap) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + 70)
        .style("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#64748b")
        .text(`Biggest opportunity: ${biggestGap.category} (${biggestGap.gap.toFixed(1)} points gap)`);
    }

  }, [strategyScore, processScore, technologyScore, overallScore, industryAvg, topPerformer]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <SectionHeader title="📊 Performance Contribution Analysis" />
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        How each capability area contributes to your overall performance score
      </p>
      <div className="relative">
        <svg ref={svgRef} className="w-full" style={{ height: "400px" }} />
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="text-purple-600 text-lg">🎯</div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Performance Insights</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your <strong>Strategy</strong> is your strongest area, while <strong>Process</strong> offers the biggest improvement opportunity. 
              Focus on operational efficiency to close the gap with top performers.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceFunnelChart; 