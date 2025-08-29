/**
 * Modal Component
 * Core modal component with comprehensive variants, accessibility features, and animations
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const modalVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white",
        dark: "bg-gray-900 border-gray-700 text-white",
        light: "bg-white border-gray-200 text-gray-900",
      },
      size: {
        default: "max-w-lg",
        sm: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] max-h-[95vh]",
      },
      rounded: {
        default: "rounded-lg",
        none: "rounded-none",
        lg: "rounded-xl",
        xl: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants_ = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
}

export interface ModalProps
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  loading?: boolean
  loadingText?: string
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
  variant?: 'default' | 'glass' | 'dark' | 'light'
  rounded?: 'default' | 'none' | 'lg' | 'xl'
  animated?: boolean
  preventScroll?: boolean
  trapFocus?: boolean
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalProps
>(({ 
  className, 
  children, 
  title,
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  loading = false,
  loadingText,
  size,
  variant,
  rounded,
  animated = true,
  preventScroll = true,
  trapFocus = true,
  ...props 
}, ref) => {
  const content = (
    <DialogContent
      ref={ref}
      className={cn(
        modalVariants({ variant, size, rounded }),
        className
      )}
      onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
      onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      onInteractOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            {loadingText && <p className="text-sm text-muted-foreground">{loadingText}</p>}
          </div>
        </div>
      )}
      
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          {title && (
            <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
      )}
      
      {children}
      
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogContent>
  )

  if (animated) {
    return (
      <AnimatePresence>
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            variants={modalVariants_}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {content}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return content
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Convenience Modal component
const Modal = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  ModalProps
>(({ 
  open, 
  onOpenChange, 
  children, 
  ...props 
}, ref) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent ref={ref} {...props}>
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
})
Modal.displayName = "Modal"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Modal,
  modalVariants,
}
