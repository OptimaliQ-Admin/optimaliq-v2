"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

interface CompanyPoint {
  label: string;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
}

interface UserPoint {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
}

interface APIResponse {
  companies: CompanyPoint[];
  user: UserPoint;
}

export default function StrategicQuadrantChart({ userId }: { userId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/growth_studio/quadrant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: userId }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch quadrant data");
        }

        const result = await res.json();
        
        if (!result.companies || !result.user) {
          throw new Error("Invalid data format received");
        }

        setData(result);
      } catch (err) {
        console.error("❌ Failed to load quadrant data:", err);
        setError(err instanceof Error ? err.message : "Failed to load quadrant data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 80, right: 80, bottom: 80, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

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
      .attr("id", "quadrantBackgroundGradient")
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
      .style("fill", "url(#quadrantBackgroundGradient)")
      .style("rx", "16")
      .style("ry", "16")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))");

    // Normalize data
    const normalizedCompanies = data.companies.map((company) => ({
      name: company.label,
      strategy_score: company.strategyScore,
      process_score: company.processScore,
      technology_score: company.technologyScore,
    }));

    const normalizedUser = {
      name: "You",
      strategy_score: data.user.strategyScore,
      process_score: data.user.processScore,
      technology_score: data.user.technologyScore,
    };

    const allData = [...normalizedCompanies, normalizedUser];

    // Calculate bounds with padding
    const strategyValues = allData.map(d => d.strategy_score);
    const processValues = allData.map(d => d.process_score);

    const minX = Math.floor(Math.min(...strategyValues)) - 0.3;
    const maxX = Math.ceil(Math.max(...strategyValues)) + 0.3;
    const minY = Math.floor(Math.min(...processValues)) - 0.3;
    const maxY = Math.ceil(Math.max(...processValues)) + 0.3;

    const quadrantMidX = 3;
    const quadrantMidY = 3;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);

    const sizeScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([30, 120]);

    // Add quadrant backgrounds with Salesforce-style gradients
    const quadrants = [
      { 
        x1: minX, x2: quadrantMidX, y1: quadrantMidY, y2: maxY, 
        fill: "url(#strategicBuildersGradient)", 
        label: "Strategic Builders",
        description: "Strong strategy, developing processes"
      },
      { 
        x1: quadrantMidX, x2: maxX, y1: quadrantMidY, y2: maxY, 
        fill: "url(#acceleratedPerformersGradient)", 
        label: "Accelerated Performers",
        description: "High strategy & process maturity"
      },
      { 
        x1: minX, x2: quadrantMidX, y1: minY, y2: quadrantMidY, 
        fill: "url(#emergingFoundationsGradient)", 
        label: "Emerging Foundations",
        description: "Building core capabilities"
      },
      { 
        x1: quadrantMidX, x2: maxX, y1: minY, y2: quadrantMidY, 
        fill: "url(#efficientExecutorsGradient)", 
        label: "Efficient Executors",
        description: "Strong processes, evolving strategy"
      },
    ];

    // Create quadrant gradients
    const defs = svg.append("defs");
    
    const strategicBuildersGradient = defs.append("linearGradient")
      .attr("id", "strategicBuildersGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    strategicBuildersGradient.append("stop").attr("offset", "0%").attr("stop-color", "#dbeafe").attr("stop-opacity", 0.3);
    strategicBuildersGradient.append("stop").attr("offset", "100%").attr("stop-color", "#bfdbfe").attr("stop-opacity", 0.1);

    const acceleratedPerformersGradient = defs.append("linearGradient")
      .attr("id", "acceleratedPerformersGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    acceleratedPerformersGradient.append("stop").attr("offset", "0%").attr("stop-color", "#dcfce7").attr("stop-opacity", 0.3);
    acceleratedPerformersGradient.append("stop").attr("offset", "100%").attr("stop-color", "#bbf7d0").attr("stop-opacity", 0.1);

    const emergingFoundationsGradient = defs.append("linearGradient")
      .attr("id", "emergingFoundationsGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    emergingFoundationsGradient.append("stop").attr("offset", "0%").attr("stop-color", "#fef9c3").attr("stop-opacity", 0.3);
    emergingFoundationsGradient.append("stop").attr("offset", "100%").attr("stop-color", "#fde68a").attr("stop-opacity", 0.1);

    const efficientExecutorsGradient = defs.append("linearGradient")
      .attr("id", "efficientExecutorsGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    efficientExecutorsGradient.append("stop").attr("offset", "0%").attr("stop-color", "#ede9fe").attr("stop-opacity", 0.3);
    efficientExecutorsGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ddd6fe").attr("stop-opacity", 0.1);

    quadrants.forEach(quad => {
      svg
        .append("rect")
        .attr("x", xScale(quad.x1))
        .attr("y", yScale(quad.y2))
        .attr("width", xScale(quad.x2) - xScale(quad.x1))
        .attr("height", yScale(quad.y1) - yScale(quad.y2))
        .style("fill", quad.fill)
        .style("stroke", "#e2e8f0")
        .style("stroke-width", 1)
        .style("rx", "8")
        .style("ry", "8");

      // Add quadrant labels with Salesforce styling and better spacing
      const labelX = quad.x1 === minX ? xScale(quad.x1) + 40 : xScale(quad.x2) - 40;
      const labelY = quad.y1 === minY ? yScale(quad.y1) - 40 : yScale(quad.y2) + 40;
      const textAnchor = quad.x1 === minX ? "start" : "end";
      const dominantBaseline = quad.y1 === minY ? "auto" : "hanging";
      
      // Add main label
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", textAnchor)
        .attr("dominant-baseline", dominantBaseline)
        .style("font-size", "14px")
        .style("font-weight", "700")
        .style("fill", "#374151")
        .text(quad.label);

      // Add description with proper spacing
      const descY = quad.y1 === minY ? labelY - 20 : labelY + 20;
      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", descY)
        .attr("text-anchor", textAnchor)
        .attr("dominant-baseline", dominantBaseline)
        .style("font-size", "11px")
        .style("font-weight", "500")
        .style("fill", "#6b7280")
        .style("max-width", "120px")
        .text(quad.description);
    });

    // Add midlines with Salesforce styling
    svg
      .append("line")
      .attr("x1", xScale(quadrantMidX))
      .attr("x2", xScale(quadrantMidX))
      .attr("y1", yScale(minY))
      .attr("y2", yScale(maxY))
      .style("stroke", "#d1d5db")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "4 4");

    svg
      .append("line")
      .attr("x1", xScale(minX))
      .attr("x2", xScale(maxX))
      .attr("y1", yScale(quadrantMidY))
      .attr("y2", yScale(quadrantMidY))
      .style("stroke", "#d1d5db")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "4 4");

    // Add company dots with enhanced styling
    svg
      .selectAll(".company-dot")
      .data(normalizedCompanies)
      .enter()
      .append("circle")
      .attr("class", "company-dot")
      .attr("cx", d => xScale(d.strategy_score))
      .attr("cy", d => yScale(d.process_score))
      .attr("r", d => Math.sqrt(sizeScale(d.technology_score)) / 2)
      .style("fill", "#cbd5e1")
      .style("stroke", "#ffffff")
      .style("stroke-width", 4)
      .style("opacity", 0.8)
      .style("transition", "all 0.3s ease")
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))")
      .on("mouseover", function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.sqrt(sizeScale(d.technology_score)) / 2 + 10)
          .style("opacity", 1)
          .style("stroke-width", 5)
          .style("filter", "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))");

        setHoveredPoint(d.name);
      })
      .on("mouseout", function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.sqrt(sizeScale(d.technology_score)) / 2)
          .style("opacity", 0.8)
          .style("stroke-width", 4)
          .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))");

        setHoveredPoint(null);
      });

    // Add user dot with Salesforce styling
    const userRadius = Math.sqrt(sizeScale(normalizedUser.technology_score)) / 2;
    svg
      .append("circle")
      .attr("class", "user-dot")
      .attr("cx", xScale(normalizedUser.strategy_score))
      .attr("cy", yScale(normalizedUser.process_score))
      .attr("r", userRadius)
      .style("fill", "url(#userGradient)")
      .style("stroke", "#ffffff")
      .style("stroke-width", 5)
      .style("filter", "drop-shadow(0 4px 12px rgba(37, 99, 235, 0.4))")
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", userRadius + 10)
          .style("stroke-width", 6)
          .style("filter", "drop-shadow(0 6px 16px rgba(37, 99, 235, 0.6))");
        setHoveredPoint("You");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", userRadius)
          .style("stroke-width", 5)
          .style("filter", "drop-shadow(0 4px 12px rgba(37, 99, 235, 0.4))");
        setHoveredPoint(null);
      });

    // Create user gradient
    const userGradient = defs.append("radialGradient")
      .attr("id", "userGradient")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    userGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6");
    userGradient.append("stop").attr("offset", "100%").attr("stop-color", "#1d4ed8");

    // Add user label
    svg
      .append("text")
      .attr("class", "user-label")
      .attr("x", xScale(normalizedUser.strategy_score))
      .attr("y", yScale(normalizedUser.process_score) - userRadius - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "700")
      .style("fill", "#1d4ed8")
      .text("You");

    // Add axes with Salesforce styling
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .style("color", "#64748b")
      .style("font-size", "12px")
      .style("font-weight", "500");

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .style("color", "#64748b")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Add axis labels
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Strategy Maturity");

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Process Maturity");

    // Add legend
    const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${width + 20}, 0)`);
    
    legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text("Technology Maturity");

    const legendData = [
      { size: 1, label: "Low" },
      { size: 3, label: "Medium" },
      { size: 5, label: "High" }
    ];

    legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 35 + 20})`)
      .each(function(d) {
        const g = d3.select(this);
        const radius = Math.sqrt(sizeScale(d.size)) / 2;
        
        g.append("circle")
          .attr("r", radius)
          .style("fill", "#cbd5e1")
          .style("stroke", "#ffffff")
          .style("stroke-width", 3)
          .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))");
        
        g.append("text")
          .attr("x", radius + 20)
          .attr("y", 4)
          .style("font-size", "11px")
          .style("font-weight", "500")
          .style("fill", "#6b7280")
          .text(d.label);
      });

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-[500px] bg-gray-100 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">⚠️ Error Loading Quadrant</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <SectionHeader title="🎯 Strategic Growth Quadrant" subtitle="Position yourself against industry peers across strategy and process maturity" />
      
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Visualize how businesses compare based on Strategy and Process maturity. Larger bubbles reflect higher Technology maturity.
      </p>

      <div className="relative">
        <svg ref={svgRef} className="w-full" style={{ height: "500px" }} />
        
        {/* Hover tooltip */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs"
          >
            <h4 className="font-semibold text-gray-900 mb-2">{hoveredPoint}</h4>
            <p className="text-sm text-gray-600">
              {hoveredPoint === "You" ? "Your position in the strategic landscape" : "Industry peer comparison"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Salesforce-style footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {data?.companies.length || 0} companies analyzed
          </span>
          <span className="text-blue-600 font-medium">OptimaliQ.ai</span>
        </div>
      </div>
    </motion.div>
  );
} 