// src/components/layout/Grid.tsx
// Advanced grid system for consistent layouts

import React from 'react';
import { cn } from '@/lib/utils';

// Grid Container Component
interface GridContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fluid?: boolean;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  maxWidth = '7xl',
  padding = true,
  className,
  fluid = false
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    true: 'px-4 sm:px-6 lg:px-8',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16'
  };

  return (
    <div
      className={cn(
        'mx-auto',
        !fluid && maxWidthClasses[maxWidth],
        padding && paddingClasses[padding === true ? 'true' : padding],
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid Row Component
interface GridRowProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
  wrap?: boolean;
}

export const GridRow: React.FC<GridRowProps> = ({
  children,
  cols = 12,
  gap = 'md',
  alignItems = 'start',
  justifyContent = 'start',
  className,
  wrap = true
}) => {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyContentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
    7: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-7',
    8: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-8',
    9: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-9',
    10: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-10',
    11: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-11',
    12: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-12'
  };

  return (
    <div
      className={cn(
        'grid',
        gridColsClasses[cols],
        gapClasses[gap],
        alignItemsClasses[alignItems],
        justifyContentClasses[justifyContent],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid Column Component
interface GridColProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  className?: string;
  order?: 'first' | 'last' | 'none' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export const GridCol: React.FC<GridColProps> = ({
  children,
  span = 12,
  offset = 0,
  className,
  order = 'none'
}) => {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 sm:col-span-2',
    3: 'col-span-1 sm:col-span-2 lg:col-span-3',
    4: 'col-span-1 sm:col-span-2 lg:col-span-4',
    5: 'col-span-1 sm:col-span-2 lg:col-span-5',
    6: 'col-span-1 sm:col-span-2 lg:col-span-6',
    7: 'col-span-1 sm:col-span-2 lg:col-span-7',
    8: 'col-span-1 sm:col-span-2 lg:col-span-8',
    9: 'col-span-1 sm:col-span-2 lg:col-span-9',
    10: 'col-span-1 sm:col-span-2 lg:col-span-10',
    11: 'col-span-1 sm:col-span-2 lg:col-span-11',
    12: 'col-span-1 sm:col-span-2 lg:col-span-12'
  };

  const offsetClasses = {
    0: '',
    1: 'col-start-2',
    2: 'col-start-3',
    3: 'col-start-4',
    4: 'col-start-5',
    5: 'col-start-6',
    6: 'col-start-7',
    7: 'col-start-8',
    8: 'col-start-9',
    9: 'col-start-10',
    10: 'col-start-11',
    11: 'col-start-12'
  };

  const orderClasses = {
    first: 'order-first',
    last: 'order-last',
    none: '',
    1: 'order-1',
    2: 'order-2',
    3: 'order-3',
    4: 'order-4',
    5: 'order-5',
    6: 'order-6',
    7: 'order-7',
    8: 'order-8',
    9: 'order-9',
    10: 'order-10',
    11: 'order-11',
    12: 'order-12'
  };

  return (
    <div
      className={cn(
        spanClasses[span],
        offset > 0 && offsetClasses[offset],
        orderClasses[order],
        className
      )}
    >
      {children}
    </div>
  );
};

// Flex Container Component
interface FlexContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: boolean;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

export const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  direction = 'row',
  wrap = false,
  gap = 'md',
  alignItems = 'start',
  justifyContent = 'start',
  className
}) => {
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse'
  };

  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyContentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        wrap && 'flex-wrap',
        gapClasses[gap],
        alignItemsClasses[alignItems],
        justifyContentClasses[justifyContent],
        className
      )}
    >
      {children}
    </div>
  );
};

// Stack Component for vertical layouts
interface StackProps {
  children: React.ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  gap = 'md',
  alignItems = 'stretch',
  className
}) => {
  const gapClasses = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12'
  };

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        gapClasses[gap],
        alignItemsClasses[alignItems],
        className
      )}
    >
      {children}
    </div>
  );
};

// HStack Component for horizontal layouts
interface HStackProps {
  children: React.ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
}

export const HStack: React.FC<HStackProps> = ({
  children,
  gap = 'md',
  alignItems = 'center',
  justifyContent = 'start',
  wrap = false,
  className
}) => {
  const gapClasses = {
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12'
  };

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyContentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div
      className={cn(
        'flex',
        gapClasses[gap],
        alignItemsClasses[alignItems],
        justifyContentClasses[justifyContent],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

// Export all components
export const Grid = {
  Container: GridContainer,
  Row: GridRow,
  Col: GridCol,
  Flex: FlexContainer,
  Stack,
  HStack
}; 