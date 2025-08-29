/**
 * Feedback Components
 * Core feedback components with comprehensive patterns and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Bell, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as ToastPrimitive from "@radix-ui/react-toast"

// Tooltip Variants
const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        info: "bg-blue-500 text-white",
      },
      size: {
        default: "px-3 py-1.5 text-sm",
        sm: "px-2 py-1 text-xs",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Popover Variants
const popoverVariants = cva(
  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        glass: "bg-white/10 backdrop-blur-md border-white/20",
      },
      size: {
        default: "w-72 p-4",
        sm: "w-56 p-3",
        lg: "w-96 p-6",
        xl: "w-[500px] p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Toast Variants
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-500 text-white",
        warning: "border-yellow-500 bg-yellow-500 text-white",
        info: "border-blue-500 bg-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Alert Variants
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "border-primary/50 bg-primary/10 text-primary",
        secondary: "border-secondary/50 bg-secondary/10 text-secondary-foreground",
        destructive: "border-destructive/50 bg-destructive/10 text-destructive",
        success: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
        warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        info: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Tooltip Provider
const TooltipProvider = TooltipPrimitive.Provider

// Tooltip Root
const TooltipRoot = TooltipPrimitive.Root

// Tooltip Trigger
const TooltipTrigger = TooltipPrimitive.Trigger

// Tooltip Props
export interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  content: string
  children: React.ReactNode
  delayDuration?: number
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
  showArrow?: boolean
}

// Tooltip Component
const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps
>(({ 
  className, 
  variant, 
  size,
  content,
  children,
  delayDuration = 500,
  side = "top",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  showArrow = true,
  ...props 
}, ref) => {
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipPrimitive.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn(tooltipVariants({ variant, size }), className)}
          {...props}
        >
          {content}
          {showArrow && (
            <TooltipPrimitive.Arrow className="fill-current" />
          )}
        </TooltipPrimitive.Content>
      </TooltipRoot>
    </TooltipProvider>
  )
})
Tooltip.displayName = "Tooltip"

// Popover Provider
const PopoverProvider = PopoverPrimitive.Provider

// Popover Root
const PopoverRoot = PopoverPrimitive.Root

// Popover Trigger
const PopoverTrigger = PopoverPrimitive.Trigger

// Popover Props
export interface PopoverProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverVariants> {
  children: React.ReactNode
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
  showArrow?: boolean
}

// Popover Component
const Popover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverProps
>(({ 
  className, 
  variant, 
  size,
  children,
  trigger,
  open,
  onOpenChange,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  showArrow = true,
  ...props 
}, ref) => {
  return (
    <PopoverProvider>
      <PopoverRoot open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverPrimitive.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn(popoverVariants({ variant, size }), className)}
          {...props}
        >
          {children}
          {showArrow && (
            <PopoverPrimitive.Arrow className="fill-current" />
          )}
        </PopoverPrimitive.Content>
      </PopoverRoot>
    </PopoverProvider>
  )
})
Popover.displayName = "Popover"

// Toast Provider
const ToastProvider = ToastPrimitive.Provider

// Toast Viewport
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

// Toast Root
const ToastRoot = ToastPrimitive.Root

// Toast Action
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitive.Action.displayName

// Toast Close
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

// Toast Title
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

// Toast Description
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

// Toast Props
export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  showClose?: boolean
  duration?: number
  icon?: React.ReactNode
}

// Toast Component
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ 
  className, 
  variant,
  title,
  description,
  action,
  showClose = true,
  duration = 5000,
  icon,
  children,
  ...props 
}, ref) => {
  return (
    <ToastRoot
      ref={ref}
      duration={duration}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          {children}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      {showClose && <ToastClose />}
    </ToastRoot>
  )
})
Toast.displayName = "Toast"

// Alert Props
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  description?: string
  icon?: React.ReactNode
  showClose?: boolean
  onClose?: () => void
  dismissible?: boolean
}

// Alert Component
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant,
    title,
    description,
    icon,
    showClose = false,
    onClose,
    dismissible = false,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleClose = () => {
      if (dismissible) {
        setIsVisible(false)
        onClose?.()
      }
    }

    const getDefaultIcon = () => {
      switch (variant) {
        case 'success': return <CheckCircle className="h-4 w-4" />
        case 'warning': return <AlertTriangle className="h-4 w-4" />
        case 'destructive': return <AlertCircle className="h-4 w-4" />
        case 'info': return <Info className="h-4 w-4" />
        default: return <Info className="h-4 w-4" />
      }
    }

    if (!isVisible) return null

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start space-x-3">
          {icon || getDefaultIcon()}
          <div className="flex-1">
            {title && (
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            {description && (
              <div className="text-sm [&_p]:leading-relaxed">
                {description}
              </div>
            )}
            {children}
          </div>
          {(showClose || dismissible) && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }
)
Alert.displayName = "Alert"

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    title?: string
    description?: string
    variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'
    duration?: number
    icon?: React.ReactNode
  }>>([])

  const toast = React.useCallback(({
    title,
    description,
    variant = 'default',
    duration = 5000,
    icon,
  }: {
    title?: string
    description?: string
    variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'
    duration?: number
    icon?: React.ReactNode
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, title, description, variant, duration, icon }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  Tooltip,
  PopoverProvider,
  PopoverRoot,
  PopoverTrigger,
  Popover,
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  Toast,
  Alert,
  tooltipVariants,
  popoverVariants,
  toastVariants,
  alertVariants,
}
