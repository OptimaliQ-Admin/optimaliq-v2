// src/components/ui/Card.tsx
// Enhanced card component with header, content, and footer sections

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12'
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl'
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  clickable = false,
  onClick,
  padding = 'md',
  shadow = 'md',
  border = true,
  rounded = 'lg'
}) => {
  const baseClasses = cn(
    'bg-white',
    border && 'border border-gray-200',
    roundedClasses[rounded],
    shadowClasses[shadow],
    padding !== 'none' && paddingClasses[padding],
    hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
    clickable && 'cursor-pointer',
    className
  );

  if (clickable || onClick) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
        whileTap={clickable ? { scale: 0.98 } : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  padding = 'md',
  border = false
}) => {
  return (
    <div
      className={cn(
        padding !== 'none' && paddingClasses[padding],
        border && 'border-b border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  padding = 'md'
}) => {
  return (
    <div
      className={cn(
        padding !== 'none' && paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  padding = 'md',
  border = false
}) => {
  return (
    <div
      className={cn(
        padding !== 'none' && paddingClasses[padding],
        border && 'border-t border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = 'h3'
}) => {
  return (
    <Component
      className={cn(
        'text-lg font-semibold text-gray-900 leading-tight',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className
}) => {
  return (
    <p
      className={cn(
        'text-sm text-gray-600 mt-1',
        className
      )}
    >
      {children}
    </p>
  );
};

// Specialized card components
export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, value, description, trend, icon, className }) => {
  return (
    <Card className={cn('text-center', className)}>
      <CardContent padding="lg">
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              {icon}
            </div>
          </div>
        )}
        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
          {value}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-2">
          {title}
        </CardDescription>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
        {trend && (
          <div className="flex items-center justify-center mt-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.direction === 'up' && 'text-green-600',
                trend.direction === 'down' && 'text-red-600',
                trend.direction === 'neutral' && 'text-gray-600'
              )}
            >
              {trend.direction === 'up' && '+'}
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ActionCard: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, description, action, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader border>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div>{action}</div>}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};
