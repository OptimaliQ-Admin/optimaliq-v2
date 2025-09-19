'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Settings,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';

interface RadarData {
  category: string;
  score: number;
  benchmark?: number;
  target?: number;
  confidence?: number;
}

interface RadarChartProps {
  data: RadarData[];
  title?: string;
  subtitle?: string;
  showBenchmark?: boolean;
  showTarget?: boolean;
  showConfidence?: boolean;
  interactive?: boolean;
  className?: string;
  height?: number;
  onCategoryClick?: (category: string) => void;
}

const defaultColors = {
  score: '#3b82f6',
  benchmark: '#10b981',
  target: '#f59e0b',
  confidence: '#8b5cf6'
};

export function RadarChartComponent({
  data,
  title = 'Performance Radar',
  subtitle,
  showBenchmark = true,
  showTarget = false,
  showConfidence = false,
  interactive = true,
  className = '',
  height = 400,
  onCategoryClick
}: RadarChartProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'selected'>('all');

  // Process data for radar chart
  const chartData = useMemo(() => {
    return data.map(item => ({
      category: item.category,
      score: item.score,
      ...(showBenchmark && item.benchmark && { benchmark: item.benchmark }),
      ...(showTarget && item.target && { target: item.target }),
      ...(showConfidence && item.confidence && { confidence: item.confidence })
    }));
  }, [data, showBenchmark, showTarget, showConfidence]);

  const filteredData = useMemo(() => {
    if (viewMode === 'all') return chartData;
    return chartData.filter(item => selectedCategories.includes(item.category));
  }, [chartData, selectedCategories, viewMode]);

  const handleCategoryToggle = (category: string) => {
    if (!interactive) return;
    
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleCategoryClick = (category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const resetSelection = () => {
    setSelectedCategories([]);
    setViewMode('all');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {interactive && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLegend(!showLegend)}
                >
                  {showLegend ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSelection}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={filteredData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <PolarRadiusAxis 
                  angle={0} 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                />
                
                {/* Score Line */}
                <Radar
                  name="Your Score"
                  dataKey="score"
                  stroke={defaultColors.score}
                  fill={defaultColors.score}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: defaultColors.score, strokeWidth: 2, r: 4 }}
                />
                
                {/* Benchmark Line */}
                {showBenchmark && (
                  <Radar
                    name="Industry Average"
                    dataKey="benchmark"
                    stroke={defaultColors.benchmark}
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: defaultColors.benchmark, strokeWidth: 2, r: 3 }}
                  />
                )}
                
                {/* Target Line */}
                {showTarget && (
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke={defaultColors.target}
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ fill: defaultColors.target, strokeWidth: 2, r: 3 }}
                  />
                )}
                
                {showLegend && <Legend />}
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                          <p className="font-semibold">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value?.toFixed(1)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((item, index) => (
              <motion.div
                key={item.category}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedCategories.includes(item.category)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleCategoryClick(item.category)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{item.category}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getScoreColor(item.score)}`}
                    >
                      {getScoreStatus(item.score)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score</span>
                      <span className={`font-semibold ${getScoreColor(item.score)}`}>
                        {item.score.toFixed(1)}/10
                      </span>
                    </div>
                    
                    {showBenchmark && item.benchmark && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Industry Avg</span>
                        <span>{item.benchmark.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {showTarget && item.target && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target</span>
                        <span>{item.target.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {showConfidence && item.confidence && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Confidence</span>
                        <span>{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                  
                  {interactive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryToggle(item.category);
                      }}
                    >
                      {selectedCategories.includes(item.category) ? 'Hide' : 'Focus'}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(data.reduce((sum, item) => sum + item.score, 0) / data.length).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.filter(item => item.score >= 8).length}
              </div>
              <div className="text-xs text-muted-foreground">Excellent Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {data.filter(item => item.score >= 6 && item.score < 8).length}
              </div>
              <div className="text-xs text-muted-foreground">Good Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.filter(item => item.score < 6).length}
              </div>
              <div className="text-xs text-muted-foreground">Need Improvement</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Radar Chart for smaller spaces
interface CompactRadarChartProps {
  data: RadarData[];
  title?: string;
  className?: string;
  height?: number;
}

export function CompactRadarChart({
  data,
  title = 'Performance Overview',
  className = '',
  height = 200
}: CompactRadarChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />
              <PolarRadiusAxis 
                angle={0} 
                domain={[0, 10]} 
                tick={false}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
