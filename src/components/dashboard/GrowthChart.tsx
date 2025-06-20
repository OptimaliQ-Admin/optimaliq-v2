//src/components/dashboard/GrowthChart.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

interface DataPoint {
  month: string;
  userScore: number;
  industryScore: number;
  topPerformerScore: number;
}

interface Props {
  data: DataPoint[];
}

const GrowthChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 50, right: 80, bottom: 60, left: 70 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

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
      .attr("id", "backgroundGradient")
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
      .style("fill", "url(#backgroundGradient)")
      .style("rx", "12")
      .style("ry", "12")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))");

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

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([height, 0])
      .nice();

    // Grid lines with Salesforce-style
    const yTicks = yScale.ticks(8);
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

    // Axes with Salesforce styling
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(8)
      .tickFormat((d) => (d as number).toFixed(1));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .style("color", "#64748b")
      .style("font-size", "11px")
      .style("font-weight", "500");

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .style("color", "#64748b")
      .style("font-size", "11px")
      .style("font-weight", "500");

    // Axis labels with Salesforce styling
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
      .text("Maturity Score");

    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#475569")
      .text("Projected Timeline");

    // Line generators with smooth curves
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.month)!)
      .y((d) => yScale(d.userScore))
      .curve(d3.curveCatmullRom.alpha(0.7));

    const industryLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.month)!)
      .y((d) => yScale(d.industryScore))
      .curve(d3.curveCatmullRom.alpha(0.7));

    const topPerformerLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.month)!)
      .y((d) => yScale(d.topPerformerScore))
      .curve(d3.curveCatmullRom.alpha(0.7));

    // Draw lines with Salesforce-style gradients
    const userGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "userGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    userGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6");

    userGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1d4ed8");

    const industryGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "industryGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    industryGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#64748b");

    industryGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#475569");

    const topPerformerGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "topPerformerGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    topPerformerGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#10b981");

    topPerformerGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#059669");

    // Draw lines with enhanced styling
    const userLine = svg
      .append("path")
      .datum(data)
      .attr("class", "user-line")
      .attr("d", lineGenerator)
      .style("fill", "none")
      .style("stroke", "url(#userGradient)")
      .style("stroke-width", 4)
      .style("filter", "drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))");

    const industryLine = svg
      .append("path")
      .datum(data)
      .attr("class", "industry-line")
      .attr("d", industryLineGenerator)
      .style("fill", "none")
      .style("stroke", "url(#industryGradient)")
      .style("stroke-width", 2.5)
      .style("stroke-dasharray", "6 3");

    const topPerformerLine = svg
      .append("path")
      .datum(data)
      .attr("class", "top-performer-line")
      .attr("d", topPerformerLineGenerator)
      .style("fill", "none")
      .style("stroke", "url(#topPerformerGradient)")
      .style("stroke-width", 2.5)
      .style("stroke-dasharray", "3 6");

    // Add benchmark labels with Salesforce styling
    svg
      .append("text")
      .attr("x", width + 10)
      .attr("y", yScale(data[0].industryScore))
      .style("text-anchor", "start")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("fill", "#64748b")
      .text("Industry Average");

    svg
      .append("text")
      .attr("x", width + 10)
      .attr("y", yScale(data[0].topPerformerScore))
      .style("text-anchor", "start")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("fill", "#10b981")
      .text("Top Performers");

    // Add enhanced dots with Salesforce styling
    const dots = svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d: DataPoint) => xScale(d.month)!)
      .attr("cy", (d: DataPoint) => yScale(d.userScore))
      .attr("r", 5)
      .style("fill", "#3b82f6")
      .style("stroke", "#ffffff")
      .style("stroke-width", 3)
      .style("filter", "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4))")
      .style("transition", "all 0.3s ease");

    // Enhanced tooltip with Salesforce styling
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #e2e8f0")
      .style("border-radius", "8px")
      .style("padding", "12px")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("box-shadow", "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)")
      .style("z-index", "1000")
      .style("min-width", "200px");

    // Add hover effects
    const hoverLine = svg
      .append("line")
      .attr("class", "hover-line")
      .style("stroke", "#cbd5e1")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "4 4")
      .style("display", "none");

    svg
      .selectAll(".dot")
      .on("mouseover", function (event: MouseEvent, d: unknown) {
        const dataPoint = d as DataPoint;
        const x = xScale(dataPoint.month)!;
        hoverLine
          .attr("x1", x)
          .attr("x2", x)
          .attr("y1", 0)
          .attr("y2", height)
          .style("display", "block");

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .style("stroke-width", 4);

        const performanceGap = dataPoint.userScore - dataPoint.industryScore;
        const gapText = performanceGap > 0 ? `+${performanceGap.toFixed(1)} above industry` : `${performanceGap.toFixed(1)} below industry`;

        tooltip
          .style("visibility", "visible")
          .html(`
            <div class="font-bold text-gray-900 mb-2">${dataPoint.month}</div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span class="font-semibold">Your Score</span>
                </div>
                <span class="font-bold text-blue-600">${dataPoint.userScore.toFixed(1)}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Industry Avg</span>
                </div>
                <span class="text-gray-600">${dataPoint.industryScore.toFixed(1)}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Top Performers</span>
                </div>
                <span class="text-green-600">${dataPoint.topPerformerScore.toFixed(1)}</span>
              </div>
              <div class="pt-2 border-t border-gray-100">
                <div class="text-xs text-gray-500">${gapText}</div>
              </div>
            </div>
          `)
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mousemove", function (event: MouseEvent) {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        hoverLine.style("display", "none");
        tooltip.style("visibility", "hidden");
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .style("stroke-width", 3);
      });

    // Add performance zone labels
    zones.forEach((zone, index) => {
      if (index < zones.length - 1) {
        svg
          .append("text")
          .attr("x", 10)
          .attr("y", yScale(zone.end) + 15)
          .style("font-size", "10px")
          .style("font-weight", "600")
          .style("fill", zone.color)
          .style("opacity", 0.7)
          .text(zone.name);
      }
    });

    // Animate line drawing with Salesforce-style animation
    const totalLength = userLine.node()?.getTotalLength() || 0;
    userLine
      .style("stroke-dasharray", totalLength)
      .style("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .style("stroke-dashoffset", 0);

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <SectionHeader title="📈 Growth Trajectory Forecast" />
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Projected maturity score progression with industry benchmarks and performance zones
      </p>
      <div className="relative">
        <svg ref={svgRef} className="w-full" style={{ height: "350px" }} />
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-lg">💡</div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Trajectory Insight</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on your current momentum, you&apos;re projected to reach <strong>4.8+ maturity</strong> within 18 months, 
              positioning you in the <strong>top 15%</strong> of companies in your industry.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GrowthChart;
