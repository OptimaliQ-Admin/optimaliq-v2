// src/components/ui/Badge.tsx
// Badge component for status indicators and labels

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon, IconName } from './Icon';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

const badgeVariants = {
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  outline: 'bg-transparent text-gray-700 border-gray-300'
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className,
  onClick,
  removable = false,
  onRemove,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center font-medium rounded-full border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    badgeVariants[variant],
    badgeSizes[size],
    onClick && 'cursor-pointer hover:opacity-80',
    className
  );

  const iconClasses = cn(
    iconSizes[size],
    iconPosition === 'left' ? 'mr-1' : 'ml-1'
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon name={icon} size={size} className={iconClasses} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon name={icon} size={size} className={iconClasses} />
      )}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            'ml-1 inline-flex items-center justify-center rounded-full',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'hover:bg-black hover:bg-opacity-10',
            iconSizes[size]
          )}
          aria-label="Remove badge"
        >
          <Icon name="close" size={size} />
        </button>
      )}
    </span>
  );
};

// Specialized badge components
export const StatusBadge: React.FC<Omit<BadgeProps, 'variant'> & { status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed' }> = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success' as const, icon: 'check' as IconName },
    inactive: { variant: 'secondary' as const, icon: 'close' as IconName },
    pending: { variant: 'warning' as const, icon: 'clock' as IconName },
    completed: { variant: 'success' as const, icon: 'check' as IconName },
    failed: { variant: 'danger' as const, icon: 'close' as IconName }
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const PriorityBadge: React.FC<Omit<BadgeProps, 'variant'> & { priority: 'low' | 'medium' | 'high' | 'critical' }> = ({ priority, ...props }) => {
  const priorityConfig = {
    low: { variant: 'info' as const, icon: 'info' as IconName },
    medium: { variant: 'warning' as const, icon: 'warning' as IconName },
    high: { variant: 'danger' as const, icon: 'warning' as IconName },
    critical: { variant: 'danger' as const, icon: 'warning' as IconName }
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

export const TagBadge: React.FC<Omit<BadgeProps, 'variant'> & { tag: string; onRemove?: () => void }> = ({ tag, onRemove, ...props }) => {
  return (
    <Badge
      variant="outline"
      removable={!!onRemove}
      onRemove={onRemove}
      {...props}
    >
      {tag}
    </Badge>
  );
}; 