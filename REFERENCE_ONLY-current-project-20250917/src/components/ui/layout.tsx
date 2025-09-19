/**
 * Layout Components
 * Core layout components with comprehensive patterns and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Container Variants
const containerVariants = cva(
  "mx-auto",
  {
    variants: {
      variant: {
        default: "px-4 sm:px-6 lg:px-8",
        fluid: "px-4",
        narrow: "px-4 sm:px-6 lg:px-8 max-w-4xl",
        wide: "px-4 sm:px-6 lg:px-8 max-w-7xl",
        full: "px-0",
      },
      size: {
        default: "max-w-6xl",
        sm: "max-w-4xl",
        lg: "max-w-7xl",
        xl: "max-w-[1400px]",
        "2xl": "max-w-[1600px]",
      },
      padding: {
        default: "py-8",
        sm: "py-4",
        lg: "py-12",
        xl: "py-16",
        none: "py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      padding: "default",
    },
  }
)

// Grid Variants
const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
        12: "grid-cols-12",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        default: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "default",
      align: "stretch",
      justify: "start",
    },
  }
)

// Flex Variants
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse",
      },
      wrap: {
        none: "flex-nowrap",
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        default: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
      },
    },
    defaultVariants: {
      direction: "row",
      wrap: "none",
      align: "stretch",
      justify: "start",
      gap: "default",
    },
  }
)

// Divider Variants
const dividerVariants = cva(
  "border-t",
  {
    variants: {
      variant: {
        default: "border-border",
        primary: "border-primary",
        secondary: "border-secondary",
        muted: "border-muted",
        dashed: "border-dashed border-border",
        dotted: "border-dotted border-border",
      },
      size: {
        default: "border-t",
        sm: "border-t-2",
        lg: "border-t-4",
        xl: "border-t-8",
      },
      orientation: {
        horizontal: "border-t w-full",
        vertical: "border-l h-full",
      },
      spacing: {
        none: "my-0",
        sm: "my-2",
        default: "my-4",
        lg: "my-6",
        xl: "my-8",
        "2xl": "my-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal",
      spacing: "default",
    },
  }
)

// Spacer Variants
const spacerVariants = cva(
  "",
  {
    variants: {
      size: {
        none: "h-0 w-0",
        xs: "h-1 w-1",
        sm: "h-2 w-2",
        default: "h-4 w-4",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
        "2xl": "h-12 w-12",
        "3xl": "h-16 w-16",
        "4xl": "h-24 w-24",
      },
      axis: {
        x: "w-full h-0",
        y: "h-full w-0",
        both: "h-full w-full",
      },
    },
    defaultVariants: {
      size: "default",
      axis: "both",
    },
  }
)

// Container Props
export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
  centered?: boolean
  animated?: boolean
}

// Container Component
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    variant, 
    size, 
    padding,
    as: Component = "div",
    centered = false,
    animated = false,
    children,
    ...props 
  }, ref) => {
    const containerClasses = cn(
      containerVariants({ variant, size, padding }),
      centered && "flex items-center justify-center",
      className
    )

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={containerClasses}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <Component
        ref={ref}
        className={containerClasses}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Container.displayName = "Container"

// Grid Props
export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: React.ElementType
  responsive?: boolean
  animated?: boolean
  staggerDelay?: number
}

// Grid Component
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols, 
    gap, 
    align, 
    justify,
    as: Component = "div",
    responsive = true,
    animated = false,
    staggerDelay = 0.1,
    children,
    ...props 
  }, ref) => {
    const gridClasses = cn(gridVariants({ cols, gap, align, justify }), className)

    if (animated) {
      return (
        <Component
          ref={ref}
          className={gridClasses}
          {...props}
        >
          {React.Children.map(children, (child, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * staggerDelay 
              }}
            >
              {child}
            </motion.div>
          ))}
        </Component>
      )
    }

    return (
      <Component
        ref={ref}
        className={gridClasses}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Grid.displayName = "Grid"

// Flex Props
export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  as?: React.ElementType
  inline?: boolean
  animated?: boolean
}

// Flex Component
const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction, 
    wrap, 
    align, 
    justify, 
    gap,
    as: Component = "div",
    inline = false,
    animated = false,
    children,
    ...props 
  }, ref) => {
    const flexClasses = cn(
      flexVariants({ direction, wrap, align, justify, gap }),
      inline && "inline-flex",
      className
    )

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={flexClasses}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <Component
        ref={ref}
        className={flexClasses}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Flex.displayName = "Flex"

// Divider Props
export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  as?: React.ElementType
  label?: string
  labelPosition?: "left" | "center" | "right"
  animated?: boolean
}

// Divider Component
const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ 
    className, 
    variant, 
    size, 
    orientation, 
    spacing,
    as: Component = "div",
    label,
    labelPosition = "center",
    animated = false,
    children,
    ...props 
  }, ref) => {
    const dividerClasses = cn(
      dividerVariants({ variant, size, orientation, spacing }),
      className
    )

    if (label) {
      return (
        <Component
          ref={ref}
          className={cn("relative", className)}
          {...props}
        >
          <div className={cn(dividerClasses, "absolute inset-0")} />
          <div className={cn(
            "relative flex items-center",
            labelPosition === "left" && "justify-start",
            labelPosition === "center" && "justify-center",
            labelPosition === "right" && "justify-end"
          )}>
            <span className="bg-background px-3 text-sm text-muted-foreground">
              {label}
            </span>
          </div>
        </Component>
      )
    }

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={dividerClasses}
          {...props}
        />
      )
    }

    return (
      <Component
        ref={ref}
        className={dividerClasses}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Divider.displayName = "Divider"

// Spacer Props
export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {
  as?: React.ElementType
  animated?: boolean
}

// Spacer Component
const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ 
    className, 
    size, 
    axis,
    as: Component = "div",
    animated = false,
    children,
    ...props 
  }, ref) => {
    const spacerClasses = cn(spacerVariants({ size, axis }), className)

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className={spacerClasses}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <Component
        ref={ref}
        className={spacerClasses}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Spacer.displayName = "Spacer"

// Section Props
export interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  container?: boolean
  containerVariant?: VariantProps<typeof containerVariants>["variant"]
  containerSize?: VariantProps<typeof containerVariants>["size"]
  containerPadding?: VariantProps<typeof containerVariants>["padding"]
  animated?: boolean
}

// Section Component
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className,
    as: Component = "section",
    container = true,
    containerVariant,
    containerSize,
    containerPadding,
    animated = false,
    children,
    ...props 
  }, ref) => {
    const sectionClasses = cn("w-full", className)

    const content = container ? (
      <Container
        variant={containerVariant}
        size={containerSize}
        padding={containerPadding}
        animated={animated}
      >
        {children}
      </Container>
    ) : children

    if (animated) {
      return (
        <motion.section
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={sectionClasses}
          {...props}
        >
          {content}
        </motion.section>
      )
    }

    return (
      <Component
        ref={ref}
        className={sectionClasses}
        {...props}
      >
        {content}
      </Component>
    )
  }
)
Section.displayName = "Section"

// Stack Props
export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  direction?: "vertical" | "horizontal"
  spacing?: VariantProps<typeof flexVariants>["gap"]
  align?: VariantProps<typeof flexVariants>["align"]
  justify?: VariantProps<typeof flexVariants>["justify"]
  animated?: boolean
}

// Stack Component
const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className,
    as: Component = "div",
    direction = "vertical",
    spacing = "default",
    align = "stretch",
    justify = "start",
    animated = false,
    children,
    ...props 
  }, ref) => {
    const stackClasses = cn(
      flexVariants({
        direction: direction === "vertical" ? "col" : "row",
        gap: spacing,
        align,
        justify,
      }),
      className
    )

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={stackClasses}
          {...props}
        >
          {React.Children.map(children, (child, index) => (
            <motion.div
              initial={{ opacity: 0, x: direction === "vertical" ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      )
    }

    return (
      <Component
        ref={ref}
        className={stackClasses}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Stack.displayName = "Stack"

export {
  Container,
  Grid,
  Flex,
  Divider,
  Spacer,
  Section,
  Stack,
  containerVariants,
  gridVariants,
  flexVariants,
  dividerVariants,
  spacerVariants,
}
