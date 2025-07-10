import React from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, TrendingUpIcon, Users, Activity } from 'lucide-react';

interface MarketMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: number; // percentage change
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MarketMetricCard: React.FC<MarketMetricCardProps> = ({
  title,
  value,
  description,
  trend,
  trendDirection,
  icon,
  color = 'blue',
  size = 'md',
  className = ''
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getSizeClasses = (size: string) => {
    const sizeMap = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  };

  const getTrendIcon = (direction?: string) => {
    if (!direction) return null;
    
    const iconMap = {
      up: <TrendingUp className="w-4 h-4 text-green-600" />,
      down: <TrendingDown className="w-4 h-4 text-red-600" />,
      neutral: <Minus className="w-4 h-4 text-gray-500" />
    };
    return iconMap[direction as keyof typeof iconMap] || null;
  };

  const getTrendColor = (direction?: string) => {
    const colorMap = {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-500'
    };
    return colorMap[direction as keyof typeof colorMap] || 'text-gray-500';
  };

  const formatTrend = (trend?: number) => {
    if (trend === undefined || trend === null) return null;
    const sign = trend >= 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200
      ${getSizeClasses(size)}
      ${className}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <div className={`
                p-2 rounded-lg ${getColorClasses(color)}
              `}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          </div>
          
          <div className="mb-1">
            <span className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {description}
          </p>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon(trendDirection)}
              <span className={`text-sm font-medium ${getTrendColor(trendDirection)}`}>
                {formatTrend(trend)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Predefined metric cards for common market metrics
export const MarketSizeCard: React.FC<{
  value: string;
  growth: number;
  currency: string;
  description: string;
}> = ({ value, growth, currency, description }) => (
  <MarketMetricCard
    title="Market Size"
    value={value}
    description={description}
    trend={growth}
    trendDirection={growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral'}
    icon={<DollarSign className="w-5 h-5" />}
    color="green"
  />
);

export const GrowthRateCard: React.FC<{
  value: number;
  trend: number;
  period: string;
  description: string;
}> = ({ value, trend, period, description }) => (
  <MarketMetricCard
    title="Growth Rate"
    value={`${value.toFixed(1)}%`}
    description={`${period} ${description}`}
    trend={trend}
    trendDirection={trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'}
    icon={<TrendingUpIcon className="w-5 h-5" />}
    color="blue"
  />
);

export const CompetitionCard: React.FC<{
  level: string;
  trend: string;
  description: string;
}> = ({ level, trend, description }) => (
  <MarketMetricCard
    title="Competition"
    value={level}
    description={description}
    icon={<Users className="w-5 h-5" />}
    color={level === 'High' ? 'red' : level === 'Medium' ? 'orange' : 'green'}
  />
);

export const SentimentCard: React.FC<{
  score: number;
  trend: string;
  description: string;
}> = ({ score, trend, description }) => {
  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'green';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Negative';
  };

  return (
    <MarketMetricCard
      title="Market Sentiment"
      value={`${score}/100`}
      description={description}
      icon={<Activity className="w-5 h-5" />}
      color={getSentimentColor(score)}
    />
  );
};

export default MarketMetricCard; 