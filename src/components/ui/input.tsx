/**
 * Input Component
 * Core input component with comprehensive variants, validation states, and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle } from "lucide-react"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
        ghost: "border-transparent bg-transparent",
        filled: "bg-muted/50 border-muted",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
        xl: "h-14 px-6 py-4 text-lg",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  validation?: {
    type: 'error' | 'success' | 'warning'
    message?: string
  }
  fullWidth?: boolean
  loading?: boolean
  passwordToggle?: boolean
  searchable?: boolean
  onSearch?: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    validation,
    fullWidth = false,
    loading = false,
    passwordToggle = false,
    searchable = false,
    onSearch,
    type,
    value,
    onChange,
    onKeyDown,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value || '')
    const [isFocused, setIsFocused] = React.useState(false)

    // Determine variant based on validation
    const finalVariant = validation?.type || variant

    // Handle value changes
    React.useEffect(() => {
      setInputValue(value || '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onChange?.(e)
    }

    const handleClear = () => {
      setInputValue('')
      onClear?.()
      // Trigger onChange with empty value
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(event)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (searchable && e.key === 'Enter') {
        onSearch?.(inputValue)
      }
      onKeyDown?.(e)
    }

    const handleSearch = () => {
      onSearch?.(inputValue)
    }

    const getInputType = () => {
      if (type === 'password' && showPassword) {
        return 'text'
      }
      return type
    }

    const getRightIcon = () => {
      if (loading) {
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      }

      if (validation?.type === 'error') {
        return <AlertCircle className="h-4 w-4 text-destructive" />
      }

      if (validation?.type === 'success') {
        return <CheckCircle className="h-4 w-4 text-green-500" />
      }

      if (validation?.type === 'warning') {
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      }

      if (passwordToggle && type === 'password') {
        return (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )
      }

      if (clearable && inputValue) {
        return (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )
      }

      if (searchable) {
        return (
          <button
            type="button"
            onClick={handleSearch}
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        )
      }

      return rightIcon
    }

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            type={getInputType()}
            className={cn(
              inputVariants({ variant: finalVariant, size, rounded }),
              leftIcon && "pl-10",
              getRightIcon() && "pr-10",
              isFocused && "ring-2 ring-ring ring-offset-2",
              className
            )}
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {getRightIcon() && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getRightIcon()}
            </div>
          )}
        </div>
        
        {validation?.message && (
          <p className={cn(
            "mt-1 text-xs",
            validation.type === 'error' && "text-destructive",
            validation.type === 'success' && "text-green-600",
            validation.type === 'warning' && "text-yellow-600"
          )}>
            {validation.message}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
