//src/components/growthstudio/QuadrantChart.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

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

export default function QuadrantChart({ userId }: { userId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 460 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background rectangle
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "#f9fafb")
      .style("rx", "8")
      .style("ry", "8")
      .style("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))");

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

    const minX = Math.floor(Math.min(...strategyValues)) - 0.2;
    const maxX = Math.ceil(Math.max(...strategyValues)) + 0.2;
    const minY = Math.floor(Math.min(...processValues)) - 0.2;
    const maxY = Math.ceil(Math.max(...processValues)) + 0.2;

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
      .range([40, 400]);

    // Add quadrant backgrounds
    const quadrants = [
      { x1: minX, x2: quadrantMidX, y1: quadrantMidY, y2: maxY, fill: "#DBEAFE", label: "Strategic Builders" },
      { x1: quadrantMidX, x2: maxX, y1: quadrantMidY, y2: maxY, fill: "#DCFCE7", label: "Accelerated Performers" },
      { x1: minX, x2: quadrantMidX, y1: minY, y2: quadrantMidY, fill: "#FEF9C3", label: "Emerging Foundations" },
      { x1: quadrantMidX, x2: maxX, y1: minY, y2: quadrantMidY, fill: "#EDE9FE", label: "Efficient Executors" },
    ];

    quadrants.forEach(quad => {
      svg
        .append("rect")
        .attr("x", xScale(quad.x1))
        .attr("y", yScale(quad.y2))
        .attr("width", xScale(quad.x2) - xScale(quad.x1))
        .attr("height", yScale(quad.y1) - yScale(quad.y2))
        .style("fill", quad.fill)
        .style("fill-opacity", 0.2);

      // Add quadrant labels
      const color = d3.color(quad.fill);
      const darkerColor = color ? color.darker(0.5).toString() : quad.fill;
      
      svg
        .append("text")
        .attr("x", xScale((quad.x1 + quad.x2) / 2))
        .attr("y", yScale((quad.y1 + quad.y2) / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", darkerColor)
        .text(quad.label);
    });

    // Add midlines
    svg
      .append("line")
      .attr("x1", xScale(quadrantMidX))
      .attr("x2", xScale(quadrantMidX))
      .attr("y1", yScale(minY))
      .attr("y2", yScale(maxY))
      .style("stroke", "#d1d5db")
      .style("stroke-width", 1.5);

    svg
      .append("line")
      .attr("x1", xScale(minX))
      .attr("x2", xScale(maxX))
      .attr("y1", yScale(quadrantMidY))
      .attr("y2", yScale(quadrantMidY))
      .style("stroke", "#d1d5db")
      .style("stroke-width", 1.5);

    // Add company dots
    svg
      .selectAll(".company-dot")
      .data(normalizedCompanies)
      .enter()
      .append("circle")
      .attr("class", "company-dot")
      .attr("cx", d => xScale(d.strategy_score))
      .attr("cy", d => yScale(d.process_score))
      .attr("r", d => Math.sqrt(sizeScale(d.technology_score)) / 2)
      .style("fill", "#CBD5E1")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("opacity", 0.8)
      .style("transition", "r 0.2s, opacity 0.2s");

    // Add user dot
    svg
      .append("circle")
      .attr("class", "user-dot")
      .attr("cx", xScale(normalizedUser.strategy_score))
      .attr("cy", yScale(normalizedUser.process_score))
      .attr("r", Math.sqrt(sizeScale(normalizedUser.technology_score)) / 2)
      .style("fill", "#2563eb")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("filter", "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))");

    // Add user label
    svg
      .append("text")
      .attr("class", "user-label")
      .attr("x", xScale(normalizedUser.strategy_score))
      .attr("y", yScale(normalizedUser.process_score) - Math.sqrt(sizeScale(normalizedUser.technology_score)) / 2 - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#2563eb")
      .text("You");

    // Add tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #e5e7eb")
      .style("border-radius", "0.5rem")
      .style("padding", "0.75rem")
      .style("font-size", "0.875rem")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)");

    // Add hover effects
    svg
      .selectAll(".company-dot")
      .on("mouseover", function(event: MouseEvent, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.sqrt(sizeScale(d.technology_score)) / 2 + 5)
          .style("opacity", 1);

        tooltip
          .style("visibility", "visible")
          .html(`
            <div class="font-semibold mb-1">${d.name}</div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Strategy: ${d.strategy_score.toFixed(1)}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Process: ${d.process_score.toFixed(1)}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Technology: ${d.technology_score.toFixed(1)}</span>
            </div>
          `)
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mousemove", function(event: MouseEvent) {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.sqrt(sizeScale((this as any).__data__.technology_score)) / 2)
          .style("opacity", 0.8);

        tooltip.style("visibility", "hidden");
      });

    // Add branding
    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", height - 10)
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#9ca3af")
      .style("font-style", "italic")
      .text("OptimaliQ.ai");

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-[460px] bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">⚠️ Error Loading Quadrant</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 pt-6">
        <SectionTitleBar
          title="📊 Strategic Growth Quadrant"
          tooltip="Visualize how businesses compare based on Strategy and Process. Larger bubbles reflect higher Tech maturity."
        />
      </div>

      <div className="relative px-6 pt-10 pb-12">
        <svg ref={svgRef} className="w-full" style={{ height: "460px" }} />
      </div>
    </motion.div>
  );
}
