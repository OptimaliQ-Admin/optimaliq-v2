// src/components/ui/Button.tsx
// Enhanced button component with multiple variants and states

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon, IconName } from './Icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-blue-600',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 border-gray-600',
  outline: 'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-red-600',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-green-600',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 border-yellow-600'
};

const buttonSizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6'
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  type = 'button',
  target,
  rel,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-105 active:scale-95',
    buttonVariants[variant],
    buttonSizes[size],
    fullWidth && 'w-full',
        className
  );

  const iconClasses = cn(
    iconSizes[size],
    iconPosition === 'left' ? 'mr-2' : 'ml-2'
  );

  const content = (
    <>
      {loading && (
        <Icon
          name="settings"
          size={size}
          className="animate-spin mr-2"
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <Icon name={icon} size={size} className={iconClasses} />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <Icon name={icon} size={size} className={iconClasses} />
      )}
    </>
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        target={target}
        rel={rel}
        onClick={onClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {content}
    </motion.button>
  );
};

// Specialized button components
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="success" {...props} />
);

export const WarningButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="warning" {...props} />
);
