/**
 * Card Component
 * Core card component with comprehensive variants, interactive states, and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        elevated: "bg-card border-border shadow-lg",
        outlined: "bg-transparent border-border",
        filled: "bg-muted/50 border-muted",

        gradient: "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20",
        interactive: "bg-card border-border hover:shadow-md transition-all duration-200 cursor-pointer",
        success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
        error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
        info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
        compact: "p-3",
      },
      rounded: {
        default: "rounded-lg",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        default: "shadow",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      shadow: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
  interactive?: boolean
  loading?: boolean
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  disabled?: boolean
  animated?: boolean
  gradient?: boolean
  status?: 'success' | 'warning' | 'error' | 'info'
  elevation?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    shadow,
    interactive = false,
    loading = false,
    hoverable = false,
    clickable = false,
    onClick,
    disabled = false,
    animated = false,
    gradient = false,
    status,
    elevation,
    children,
    ...props 
  }, ref) => {
    // Determine variant based on props
    let finalVariant = variant
    if (gradient) finalVariant = 'gradient'
    if (status) finalVariant = status
    if (interactive || clickable) finalVariant = 'interactive'

    // Determine shadow based on elevation
    let finalShadow = shadow
    if (elevation) finalShadow = elevation

    const isClickable = clickable || interactive || !!onClick
    const isDisabled = disabled || loading

    const handleClick = () => {
      if (isClickable && !isDisabled && onClick) {
        onClick()
      }
    }

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant: finalVariant, size, rounded, shadow: finalShadow }),
          hoverable && "hover:shadow-lg transition-shadow duration-200",
          isClickable && !isDisabled && "cursor-pointer",
          isDisabled && "opacity-50 cursor-not-allowed",
          loading && "animate-pulse",
          className
        )}
        onClick={handleClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable && !isDisabled ? 0 : undefined}
        onKeyDown={(e) => {
          if (isClickable && !isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleClick()
          }
        }}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {children}
      </div>
    )

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={hoverable ? { y: -2, transition: { duration: 0.2 } } : undefined}
          whileTap={isClickable ? { scale: 0.98 } : undefined}
        >
          {cardContent}
        </motion.div>
      )
    }

    return cardContent
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
