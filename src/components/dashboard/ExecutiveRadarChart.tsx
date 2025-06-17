//src/components/dashboard/ExecutiveRadarChart.tsx
"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionTitleBar from "./SectionTitleBar";

interface RadarDataPoint {
  category: string;
  You: number;
  "Industry Avg": number;
  "Top Performers": number;
}

interface Props {
  strategy: number;
  process: number;
  technology: number;
  industryAvg: number;
  topPerformer: number;
}

const ExecutiveRadarChart: React.FC<Props> = ({
  strategy,
  process,
  technology,
  industryAvg,
  topPerformer,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const data: RadarDataPoint[] = [
    {
      category: "Strategy",
      You: strategy,
      "Industry Avg": industryAvg,
      "Top Performers": topPerformer,
    },
    {
      category: "Process",
      You: process,
      "Industry Avg": industryAvg,
      "Top Performers": topPerformer,
    },
    {
      category: "Technology",
      You: technology,
      "Industry Avg": industryAvg,
      "Top Performers": topPerformer,
    },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const width = 600;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const angleScale = d3
      .scalePoint()
      .domain(data.map((d) => d.category))
      .range([0, 2 * Math.PI]);

    const radiusScale = d3
      .scaleLinear()
      .domain([0, 5])
      .range([0, Math.min(innerWidth, innerHeight) / 2]);

    // Create gradient definitions
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3B82F6")
      .attr("stop-opacity", 0.8);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#60A5FA")
      .attr("stop-opacity", 0.4);

    // Draw grid circles
    const circles = [1, 2, 3, 4, 5];
    svg
      .selectAll(".grid-circle")
      .data(circles)
      .enter()
      .append("circle")
      .attr("class", "grid-circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d: number) => radiusScale(d))
      .attr("fill", "none")
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1);

    // Draw axes
    const axes = svg
      .selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axes
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: RadarDataPoint) => {
        const angle = angleScale(d.category) ?? 0;
        return radiusScale(5) * Math.cos(angle - Math.PI / 2);
      })
      .attr("y2", (d: RadarDataPoint) => {
        const angle = angleScale(d.category) ?? 0;
        return radiusScale(5) * Math.sin(angle - Math.PI / 2);
      })
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1);

    // Draw labels
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d: RadarDataPoint) => {
        const angle = angleScale(d.category) ?? 0;
        return (radiusScale(5) + 20) * Math.cos(angle - Math.PI / 2);
      })
      .attr("y", (d: RadarDataPoint) => {
        const angle = angleScale(d.category) ?? 0;
        return (radiusScale(5) + 20) * Math.sin(angle - Math.PI / 2);
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d: RadarDataPoint) => d.category)
      .attr("fill", "#4B5563")
      .attr("font-size", "14px");

    // Create line generator
    const lineGenerator = d3
      .lineRadial<RadarDataPoint>()
      .angle((d: RadarDataPoint) => (angleScale(d.category) ?? 0) - Math.PI / 2)
      .radius((d: RadarDataPoint) => radiusScale(d.You))
      .curve(d3.curveLinearClosed);

    // Draw area
    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", lineGenerator)
      .attr("fill", "url(#area-gradient)")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8);

    // Draw points
    svg
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d: RadarDataPoint) => {
        const angle = angleScale(d.category) ?? 0;
        return radiusScale(d.You) * Math.cos(angle - Math.PI / 2);
      })
      .attr("cy", (d: RadarDataPoint) => {
        const angle = angleScale(d.category) ?? 0;
        return radiusScale(d.You) * Math.sin(angle - Math.PI / 2);
      })
      .attr("r", 4)
      .attr("fill", "#3B82F6")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", (event: MouseEvent, d: RadarDataPoint) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = `${event.pageX + 10}px`;
          tooltipRef.current.style.top = `${event.pageY + 10}px`;
          tooltipRef.current.innerHTML = `
            <div class="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <div class="font-semibold">${d.category}</div>
              <div>Your Score: ${d.You}</div>
              <div>Industry Avg: ${d["Industry Avg"]}</div>
              <div>Top Performers: ${d["Top Performers"]}</div>
            </div>
          `;
        }
      })
      .on("mouseout", () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      });

    // Draw industry average line
    const industryLineGenerator = d3
      .lineRadial<RadarDataPoint>()
      .angle((d: RadarDataPoint) => (angleScale(d.category) ?? 0) - Math.PI / 2)
      .radius((d: RadarDataPoint) => radiusScale(d["Industry Avg"]))
      .curve(d3.curveLinearClosed);

    svg
      .append("path")
      .datum(data)
      .attr("class", "industry-line")
      .attr("d", industryLineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#6B7280")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4 4");

    // Draw top performers line
    const topPerformersLineGenerator = d3
      .lineRadial<RadarDataPoint>()
      .angle((d: RadarDataPoint) => (angleScale(d.category) ?? 0) - Math.PI / 2)
      .radius((d: RadarDataPoint) => radiusScale(d["Top Performers"]))
      .curve(d3.curveLinearClosed);

    svg
      .append("path")
      .datum(data)
      .attr("class", "top-performers-line")
      .attr("d", topPerformersLineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#10B981")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "2 2");

  }, [data]);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <SectionTitleBar
          title="🎯 Capability Comparison"
          tooltip="Compare your strategy, process, and technology maturity to industry benchmarks."
        />
        <p className="text-gray-500 text-sm leading-relaxed mt-2">
          Compare your maturity across Strategy, Process, and Technology against industry averages and top performers.
          See how close you are to enterprise excellence.
        </p>
      </div>

      <div className="relative">
        <svg ref={svgRef} className="w-full h-[600px] md:h-[600px] sm:h-[400px]" />
        <div
          ref={tooltipRef}
          className="absolute hidden z-10"
          style={{ pointerEvents: "none" }}
        />
      </div>

      <div className="mt-6 flex justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Your Score</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Industry Average</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Top Performers</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutiveRadarChart;
