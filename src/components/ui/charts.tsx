/**
 * Chart Components
 * Core chart components with comprehensive data visualization patterns
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Funnel,
  FunnelChart,
  Treemap,
  TreemapChart,
} from "recharts"

// Chart Container Variants
const chartContainerVariants = cva(
  "w-full h-full",
  {
    variants: {
      variant: {
        default: "bg-background",
        card: "bg-card border rounded-lg p-4",

        dark: "bg-gray-900 border border-gray-800 rounded-lg p-4",
      },
      size: {
        default: "h-64",
        sm: "h-48",
        lg: "h-80",
        xl: "h-96",
        full: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Metric Card Variants
const metricCardVariants = cva(
  "rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-card",
        primary: "bg-primary/10 border-primary/20",
        success: "bg-green-500/10 border-green-500/20",
        warning: "bg-yellow-500/10 border-yellow-500/20",
        error: "bg-red-500/10 border-red-500/20",
        info: "bg-blue-500/10 border-blue-500/20",
      },
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Chart Data Interface
export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

// Chart Colors
const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  purple: "#8b5cf6",
  pink: "#ec4899",
  orange: "#f97316",
  teal: "#14b8a6",
  indigo: "#6366f1",
  rose: "#f43f5e",
  amber: "#fbbf24",
  emerald: "#34d399",
  cyan: "#22d3ee",
  violet: "#a78bfa",
  fuchsia: "#d946ef",
  lime: "#84cc16",
  sky: "#0ea5e9",
  slate: "#64748b",
}

// Chart Container Props
export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartContainerVariants> {
  title?: string
  subtitle?: string
  loading?: boolean
  error?: string
  empty?: string
  children: React.ReactNode
}

// Chart Container Component
const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ 
    className, 
    variant, 
    size,
    title,
    subtitle,
    loading = false,
    error,
    empty,
    children,
    ...props 
  }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(chartContainerVariants({ variant, size }), className)}
          {...props}
        >
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div
          ref={ref}
          className={cn(chartContainerVariants({ variant, size }), className)}
          {...props}
        >
          <div className="flex items-center justify-center h-full text-destructive">
            <div className="text-center">
              <p className="text-sm font-medium">Error loading chart</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(chartContainerVariants({ variant, size }), className)}
        {...props}
      >
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// Line Chart Props
export interface LineChartProps {
  data: ChartData[]
  lines: Array<{
    key: string
    color?: string
    strokeWidth?: number
    strokeDasharray?: string
  }>
  xAxisKey?: string
  yAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  animate?: boolean
}

// Line Chart Component
const LineChartComponent = React.forwardRef<HTMLDivElement, LineChartProps>(
  ({ 
    data,
    lines,
    xAxisKey = "name",
    yAxisKey = "value",
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = true,
    ...props 
  }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div ref={ref} className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
          )}
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color || CHART_COLORS.primary}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.strokeDasharray}
              dot={{ fill: line.color || CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: line.color || CHART_COLORS.primary, strokeWidth: 2 }}
              animationDuration={animate ? 1000 : 0}
              animationBegin={animate ? index * 200 : 0}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }
)
LineChartComponent.displayName = "LineChartComponent"

// Area Chart Props
export interface AreaChartProps {
  data: ChartData[]
  areas: Array<{
    key: string
    color?: string
    fillOpacity?: number
  }>
  xAxisKey?: string
  yAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  animate?: boolean
}

// Area Chart Component
const AreaChartComponent = React.forwardRef<HTMLDivElement, AreaChartProps>(
  ({ 
    data,
    areas,
    xAxisKey = "name",
    yAxisKey = "value",
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = true,
    ...props 
  }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div ref={ref} className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
          )}
          {showLegend && <Legend />}
          {areas.map((area, index) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              stroke={area.color || CHART_COLORS.primary}
              fill={area.color || CHART_COLORS.primary}
              fillOpacity={area.fillOpacity || 0.3}
              strokeWidth={2}
              animationDuration={animate ? 1000 : 0}
              animationBegin={animate ? index * 200 : 0}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    )
  }
)
AreaChartComponent.displayName = "AreaChartComponent"

// Bar Chart Props
export interface BarChartProps {
  data: ChartData[]
  bars: Array<{
    key: string
    color?: string
    fillOpacity?: number
  }>
  xAxisKey?: string
  yAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  animate?: boolean
}

// Bar Chart Component
const BarChartComponent = React.forwardRef<HTMLDivElement, BarChartProps>(
  ({ 
    data,
    bars,
    xAxisKey = "name",
    yAxisKey = "value",
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = true,
    ...props 
  }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div ref={ref} className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
          )}
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color || CHART_COLORS.primary}
              fillOpacity={bar.fillOpacity || 0.8}
              radius={[4, 4, 0, 0]}
              animationDuration={animate ? 1000 : 0}
              animationBegin={animate ? index * 200 : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }
)
BarChartComponent.displayName = "BarChartComponent"

// Pie Chart Props
export interface PieChartProps {
  data: ChartData[]
  dataKey?: string
  nameKey?: string
  colors?: string[]
  showTooltip?: boolean
  showLegend?: boolean
  animate?: boolean
  innerRadius?: number
  outerRadius?: number
}

// Pie Chart Component
const PieChartComponent = React.forwardRef<HTMLDivElement, PieChartProps>(
  ({ 
    data,
    dataKey = "value",
    nameKey = "name",
    colors = Object.values(CHART_COLORS),
    showTooltip = true,
    showLegend = true,
    animate = true,
    innerRadius = 0,
    outerRadius = 80,
    ...props 
  }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div ref={ref} className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart {...props}>
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
          )}
          {showLegend && <Legend />}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            animationDuration={animate ? 1000 : 0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }
)
PieChartComponent.displayName = "PieChartComponent"

// Metric Card Props
export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period: string
  }
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

// Metric Card Component
const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ 
    className, 
    variant, 
    size,
    title,
    value,
    change,
    icon,
    trend,
    ...props 
  }, ref) => {
    const getTrendColor = () => {
      if (trend === "up") return "text-green-600"
      if (trend === "down") return "text-red-600"
      return "text-muted-foreground"
    }

    const getTrendIcon = () => {
      if (trend === "up") return "↗"
      if (trend === "down") return "↘"
      return "→"
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(metricCardVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                <span className={cn("text-sm font-medium", getTrendColor())}>
                  {getTrendIcon()} {Math.abs(change.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  vs {change.period}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-4">
              {icon}
            </div>
          )}
        </div>
      </motion.div>
    )
  }
)
MetricCard.displayName = "MetricCard"

// Sparkline Props
export interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
  showArea?: boolean
  showLine?: boolean
  animate?: boolean
}

// Sparkline Component
const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  ({ 
    data,
    color = CHART_COLORS.primary,
    height = 40,
    width = 120,
    showArea = true,
    showLine = true,
    animate = true,
    ...props 
  }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div ref={ref} className="flex items-center justify-center text-muted-foreground" {...props}>
          No data
        </div>
      )
    }

    const chartData = data.map((value, index) => ({ value, index }))
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)

    return (
      <div ref={ref} {...props}>
        <ResponsiveContainer width={width} height={height}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {showArea && (
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="url(#sparklineGradient)"
                animationDuration={animate ? 1000 : 0}
              />
            )}
            {showLine && (
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill="none"
                animationDuration={animate ? 1000 : 0}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
Sparkline.displayName = "Sparkline"

export {
  ChartContainer,
  LineChartComponent as LineChart,
  AreaChartComponent as AreaChart,
  BarChartComponent as BarChart,
  PieChartComponent as PieChart,
  MetricCard,
  Sparkline,
  chartContainerVariants,
  metricCardVariants,
  CHART_COLORS,
}
