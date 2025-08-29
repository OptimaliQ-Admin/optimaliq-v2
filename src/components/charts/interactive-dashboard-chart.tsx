'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  TrendingUp,
  Target
} from 'lucide-react';

// Sample data for different chart types
const growthTrendData = [
  { month: 'Jan', score: 7.2, target: 8.0, industry: 6.8 },
  { month: 'Feb', score: 7.5, target: 8.0, industry: 7.0 },
  { month: 'Mar', score: 7.8, target: 8.2, industry: 7.1 },
  { month: 'Apr', score: 8.1, target: 8.3, industry: 7.3 },
  { month: 'May', score: 8.4, target: 8.5, industry: 7.4 },
  { month: 'Jun', score: 8.7, target: 8.6, industry: 7.6 }
];

const categoryScoreData = [
  { category: 'Strategy', score: 87, fullMark: 100 },
  { category: 'Process', score: 79, fullMark: 100 },
  { category: 'Technology', score: 92, fullMark: 100 },
  { category: 'Team', score: 81, fullMark: 100 },
  { category: 'Market', score: 74, fullMark: 100 },
  { category: 'Finance', score: 83, fullMark: 100 }
];

const departmentPerformance = [
  { name: 'Sales', value: 92, color: '#3b82f6' },
  { name: 'Marketing', value: 87, color: '#10b981' },
  { name: 'Operations', value: 79, color: '#f59e0b' },
  { name: 'Technology', value: 94, color: '#8b5cf6' },
  { name: 'HR', value: 85, color: '#ef4444' }
];

const monthlyMetrics = [
  { month: 'Jan', revenue: 45000, efficiency: 78, growth: 12 },
  { month: 'Feb', revenue: 52000, efficiency: 82, growth: 15 },
  { month: 'Mar', revenue: 48000, efficiency: 79, growth: 8 },
  { month: 'Apr', revenue: 61000, efficiency: 85, growth: 22 },
  { month: 'May', revenue: 58000, efficiency: 88, growth: 18 },
  { month: 'Jun', revenue: 67000, efficiency: 91, growth: 28 }
];

type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'radar';

interface InteractiveDashboardChartProps {
  title: string;
  defaultChartType?: ChartType;
  showControls?: boolean;
  height?: number;
  data?: any[];
  className?: string;
}

export function InteractiveDashboardChart({
  title,
  defaultChartType = 'line',
  showControls = true,
  height = 300,
  data,
  className = ''
}: InteractiveDashboardChartProps) {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [selectedMetric, setSelectedMetric] = useState('score');
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Use provided data or default based on chart type
  const chartData = data || (
    chartType === 'radar' ? categoryScoreData :
    chartType === 'pie' ? departmentPerformance :
    chartType === 'bar' ? monthlyMetrics :
    growthTrendData
  );

  const chartTypeButtons = [
    { type: 'line' as ChartType, icon: LineChartIcon, label: 'Line' },
    { type: 'area' as ChartType, icon: Activity, label: 'Area' },
    { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar' },
    { type: 'pie' as ChartType, icon: PieChartIcon, label: 'Pie' },
    { type: 'radar' as ChartType, icon: Target, label: 'Radar' }
  ];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              animationDuration={animationEnabled ? 1000 : 0}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              animationDuration={animationEnabled ? 1200 : 0}
            />
            <Line
              type="monotone"
              dataKey="industry"
              stroke="#6b7280"
              strokeWidth={2}
              dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
              animationDuration={animationEnabled ? 1400 : 0}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="score"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#scoreGradient)"
              animationDuration={animationEnabled ? 1000 : 0}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar
              dataKey="efficiency"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              animationDuration={animationEnabled ? 1000 : 0}
            />
            <Bar
              dataKey="growth"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              animationDuration={animationEnabled ? 1200 : 0}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              animationDuration={animationEnabled ? 1000 : 0}
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={false}
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" className="text-xs" />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              className="text-xs"
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={animationEnabled ? 1000 : 0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {title}
          </CardTitle>
          {showControls && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Live Data
              </Badge>
            </div>
          )}
        </div>
        
        {showControls && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {chartTypeButtons.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={chartType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType(type)}
                className="h-8"
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <motion.div
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        </motion.div>
        
        {showControls && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Last updated: 2 minutes ago</span>
              <span>•</span>
              <span>Auto-refresh: On</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="text-xs"
            >
              {animationEnabled ? 'Disable' : 'Enable'} Animations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
