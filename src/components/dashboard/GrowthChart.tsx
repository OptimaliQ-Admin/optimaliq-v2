//src/components/dashboard/GrowthChart.tsx
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import SectionTitleBar from "./SectionTitleBar";

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
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([1, 5])
      .range([height, 0])
      .nice();

    // Target Zone
    const targetZone = svg
      .append("g")
      .attr("class", "target-zone");

    // Add gradient definition
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "targetGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#10b981")
      .attr("stop-opacity", 0.1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#10b981")
      .attr("stop-opacity", 0);

    targetZone
      .append("rect")
      .attr("x", 0)
      .attr("y", yScale(4.5))
      .attr("width", width)
      .attr("height", yScale(3.8) - yScale(4.5))
      .style("fill", "url(#targetGradient)");

    targetZone
      .append("text")
      .attr("x", 10)
      .attr("y", yScale(4.5) + 20)
      .style("font-size", "12px")
      .style("font-style", "italic")
      .style("fill", "#10b981")
      .text("Target Maturity Zone");

    // Grid lines
    const yTicks = yScale.ticks(9); // Every 0.5 from 1 to 5
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
      .style("stroke", "#e5e7eb")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "4 4");

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(9)
      .tickFormat((d) => (d as number).toFixed(1));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .style("color", "#6b7280")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .style("color", "#6b7280")
      .style("font-size", "12px");

    // Axis labels
    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text("Maturity Score");

    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text("Timeline");

    // Line generators
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.month)! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.userScore))
      .curve(d3.curveMonotoneX);

    const industryLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.month)! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.industryScore))
      .curve(d3.curveMonotoneX);

    const topPerformerLineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.month)! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.topPerformerScore))
      .curve(d3.curveMonotoneX);

    // Draw lines
    const userLine = svg
      .append("path")
      .datum(data)
      .attr("class", "user-line")
      .attr("d", lineGenerator)
      .style("fill", "none")
      .style("stroke", "#3b82f6")
      .style("stroke-width", 4)
      .style("filter", "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))");

    const industryLine = svg
      .append("path")
      .datum(data)
      .attr("class", "industry-line")
      .attr("d", industryLineGenerator)
      .style("fill", "none")
      .style("stroke", "#6b7280")
      .style("stroke-width", 2);

    const topPerformerLine = svg
      .append("path")
      .datum(data)
      .attr("class", "top-performer-line")
      .attr("d", topPerformerLineGenerator)
      .style("fill", "none")
      .style("stroke", "#10b981")
      .style("stroke-width", 2);

    // Add benchmark labels
    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", yScale(data[0].industryScore))
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text("Industry Avg");

    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", yScale(data[0].topPerformerScore))
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#10b981")
      .text("Top Performers");

    // Add dots
    const dots = svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d: DataPoint) => xScale(d.month)! + xScale.bandwidth() / 2)
      .attr("cy", (d: DataPoint) => yScale(d.userScore))
      .attr("r", 4)
      .style("fill", "#3b82f6")
      .style("stroke", "#ffffff")
      .style("stroke-width", 2)
      .style("transition", "r 0.2s");

    // Tooltip
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
    const hoverLine = svg
      .append("line")
      .attr("class", "hover-line")
      .style("stroke", "#e5e7eb")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "4 4")
      .style("display", "none");

    svg
      .selectAll(".dot")
      .on("mouseover", function (event: MouseEvent, d: unknown) {
        const dataPoint = d as DataPoint;
        const x = xScale(dataPoint.month)! + xScale.bandwidth() / 2;
        hoverLine
          .attr("x1", x)
          .attr("x2", x)
          .attr("y1", 0)
          .attr("y2", height)
          .style("display", "block");

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6);

        tooltip
          .style("visibility", "visible")
          .html(`
            <div class="font-semibold mb-1">${dataPoint.month}</div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>You: ${dataPoint.userScore.toFixed(1)}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Industry Avg: ${dataPoint.industryScore.toFixed(1)}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Top Performers: ${dataPoint.topPerformerScore.toFixed(1)}</span>
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
          .attr("r", 4);
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

    // Animate line drawing
    const totalLength = userLine.node()?.getTotalLength() || 0;
    userLine
      .style("stroke-dasharray", totalLength)
      .style("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .style("stroke-dashoffset", 0);

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <SectionTitleBar title="Growth Projection" />
      <p className="text-sm text-gray-500 mb-4">
        Track your maturity score progression over time
      </p>
      <div className="relative">
        <svg ref={svgRef} className="w-full" style={{ height: "400px" }} />
      </div>
      <div className="mt-4 text-sm text-gray-500 italic">
        Insight: Based on current trajectory, you&apos;re trending toward higher maturity—potentially nearing 5.0 within 18 months if growth continues.
      </div>
    </div>
  );
};

export default GrowthChart;
