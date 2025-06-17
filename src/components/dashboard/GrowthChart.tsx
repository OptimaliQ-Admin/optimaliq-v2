//src/components/dashboard/GrowthChart.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Responsive dimensions
    const updateDimensions = () => {
      const width = svgRef.current?.clientWidth || 0;
      const height = window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 400 : 500;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Chart setup
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create SVG group
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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

    // Grid lines
    const gridLines = svg
      .selectAll(".grid-line")
      .data(yScale.ticks(5))
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

    // Target zone
    const targetZone = svg
      .append("rect")
      .attr("x", 0)
      .attr("y", yScale(4))
      .attr("width", width)
      .attr("height", yScale(3) - yScale(4))
      .style("fill", "#10b981")
      .style("opacity", 0.1);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
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
      .style("stroke-width", 3);

    const industryLine = svg
      .append("path")
      .datum(data)
      .attr("class", "industry-line")
      .attr("d", industryLineGenerator)
      .style("fill", "none")
      .style("stroke", "#6b7280")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5 5");

    const topPerformerLine = svg
      .append("path")
      .datum(data)
      .attr("class", "top-performer-line")
      .attr("d", topPerformerLineGenerator)
      .style("fill", "none")
      .style("stroke", "#10b981")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "2 2");

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
      .style("stroke-width", 2);

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
      });

    // Animate lines
    const totalLength = userLine.node()?.getTotalLength() || 0;
    userLine
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    industryLine
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .delay(200)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    topPerformerLine
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .delay(400)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateDimensions);
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, dimensions.width]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="mb-6">
        <SectionTitleBar
          title="📈 Growth Projection"
          tooltip="Your forecasted growth based on current maturity and best practices."
        />
        <p className="text-gray-500 text-sm mt-2">
          Track your progress against industry benchmarks and top performers over time.
        </p>
      </div>

      <div className="w-full">
        <svg ref={svgRef} className="w-full" />
      </div>

      <div className="flex justify-around text-sm text-gray-700 font-medium pt-6 mt-2">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          You
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-600 rounded-sm"></div>
          Industry Avg
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 rounded-sm"></div>
          Top Performers
        </span>
      </div>
    </div>
  );
};

export default GrowthChart;
