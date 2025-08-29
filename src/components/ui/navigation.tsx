/**
 * Navigation Components
 * Core navigation components with comprehensive patterns and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Home, Settings, User, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Navigation Menu Variants
const navigationVariants = cva(
  "flex items-center space-x-4",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-muted-foreground",
        glass: "text-white bg-white/10 backdrop-blur-md",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col space-x-0 space-y-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal",
    },
  }
)

// Breadcrumb Variants
const breadcrumbVariants = cva(
  "flex items-center space-x-2",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Tab Variants
const tabVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        primary: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        secondary: "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
        outline: "border border-input data-[state=active]:bg-background data-[state=active]:text-foreground",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Pagination Variants
const paginationVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Navigation Item Interface
export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  children?: NavigationItem[]
  disabled?: boolean
  external?: boolean
  badge?: string | number
}

// Navigation Props
export interface NavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navigationVariants> {
  items: NavigationItem[]
  activeItem?: string
  onItemClick?: (item: NavigationItem) => void
  showIcons?: boolean
  collapsible?: boolean
  expanded?: boolean
  onExpandChange?: (expanded: boolean) => void
}

// Navigation Component
const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ 
    className, 
    variant, 
    size, 
    orientation,
    items,
    activeItem,
    onItemClick,
    showIcons = true,
    collapsible = false,
    expanded = true,
    onExpandChange,
    ...props 
  }, ref) => {
    const [expandedState, setExpandedState] = React.useState(expanded)

    const handleExpandToggle = () => {
      const newExpanded = !expandedState
      setExpandedState(newExpanded)
      onExpandChange?.(newExpanded)
    }

    const handleItemClick = (item: NavigationItem) => {
      if (item.disabled) return
      onItemClick?.(item)
    }

    const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
      const isActive = activeItem === item.id
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedState && hasChildren

      return (
        <div key={item.id} className="relative">
          <button
            className={cn(
              "flex items-center w-full px-3 py-2 text-left rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground",
              item.disabled && "opacity-50 cursor-not-allowed",
              level > 0 && "ml-4"
            )}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {showIcons && item.icon && (
              <span className="mr-2 flex-shrink-0">{item.icon}</span>
            )}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDown 
                className={cn(
                  "ml-2 h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )} 
              />
            )}
          </button>
          
          {hasChildren && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 space-y-1">
                    {item.children!.map(child => renderNavigationItem(child, level + 1))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      )
    }

    return (
      <nav
        ref={ref}
        className={cn(
          navigationVariants({ variant, size, orientation }),
          className
        )}
        {...props}
      >
        {collapsible && (
          <button
            onClick={handleExpandToggle}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <span>Navigation</span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform",
                expandedState && "rotate-180"
              )} 
            />
          </button>
        )}
        
        <AnimatePresence>
          {expandedState && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {items.map(item => renderNavigationItem(item))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"

// Breadcrumb Props
export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: Array<{ label: string; href?: string; icon?: React.ReactNode }>
  separator?: React.ReactNode
  showHome?: boolean
  onItemClick?: (item: { label: string; href?: string }) => void
}

// Breadcrumb Component
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 
    className, 
    variant, 
    size,
    items,
    separator = <ChevronRight className="h-4 w-4" />,
    showHome = true,
    onItemClick,
    ...props 
  }, ref) => {
    const breadcrumbItems = showHome 
      ? [{ label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> }, ...items]
      : items

    return (
      <nav
        ref={ref}
        className={cn(breadcrumbVariants({ variant, size }), className)}
        {...props}
      >
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <button
              className={cn(
                "flex items-center space-x-1 hover:text-foreground transition-colors",
                index === breadcrumbItems.length - 1 && "text-foreground font-medium"
              )}
              onClick={() => onItemClick?.(item)}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
            {index < breadcrumbItems.length - 1 && (
              <span className="text-muted-foreground">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

// Tab Props
export interface TabProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabVariants> {
  value: string
  items: Array<{ value: string; label: string; icon?: React.ReactNode; disabled?: boolean }>
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

// Tab Component
const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ 
    className, 
    variant, 
    size,
    value,
    items,
    onValueChange,
    orientation = 'horizontal',
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === 'horizontal' ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <button
            key={item.value}
            data-state={value === item.value ? "active" : "inactive"}
            className={cn(tabVariants({ variant, size }))}
            onClick={() => onValueChange?.(item.value)}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    )
  }
)
Tab.displayName = "Tab"

// Pagination Props
export interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisible?: number
}

// Pagination Component
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ 
    className, 
    variant, 
    size,
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    maxVisible = 5,
    ...props 
  }, ref) => {
    const getVisiblePages = () => {
      const pages: number[] = []
      const halfVisible = Math.floor(maxVisible / 2)
      
      let start = Math.max(1, currentPage - halfVisible)
      let end = Math.min(totalPages, currentPage + halfVisible)
      
      if (end - start + 1 < maxVisible) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisible - 1)
        } else {
          start = Math.max(1, end - maxVisible + 1)
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }

    const visiblePages = getVisiblePages()

    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1", className)}
        {...props}
      >
        {showFirstLast && currentPage > 1 && (
          <button
            className={cn(paginationVariants({ variant, size }))}
            onClick={() => onPageChange(1)}
          >
            First
          </button>
        )}
        
        {showPrevNext && currentPage > 1 && (
          <button
            className={cn(paginationVariants({ variant, size }))}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        )}
        
        {visiblePages.map((page) => (
          <button
            key={page}
            className={cn(
              paginationVariants({ variant, size }),
              page === currentPage && "bg-primary text-primary-foreground"
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {showPrevNext && currentPage < totalPages && (
          <button
            className={cn(paginationVariants({ variant, size }))}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
        
        {showFirstLast && currentPage < totalPages && (
          <button
            className={cn(paginationVariants({ variant, size }))}
            onClick={() => onPageChange(totalPages)}
          >
            Last
          </button>
        )}
      </nav>
    )
  }
)
Pagination.displayName = "Pagination"

export { 
  Navigation, 
  Breadcrumb, 
  Tab, 
  Pagination,
  navigationVariants,
  breadcrumbVariants,
  tabVariants,
  paginationVariants,
}
