/**
 * Form Components
 * Core form components with comprehensive patterns and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Upload, X, Eye, EyeOff } from "lucide-react"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as LabelPrimitive from "@radix-ui/react-label"

// Select Variants
const selectVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus:ring-destructive",
        success: "border-green-500 focus:ring-green-500",
        warning: "border-yellow-500 focus:ring-yellow-500",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Checkbox Variants
const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  {
    variants: {
      variant: {
        default: "border-primary",
        error: "border-destructive data-[state=checked]:bg-destructive",
        success: "border-green-500 data-[state=checked]:bg-green-500",
        warning: "border-yellow-500 data-[state=checked]:bg-yellow-500",
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Radio Variants
const radioVariants = cva(
  "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary",
        error: "border-destructive text-destructive",
        success: "border-green-500 text-green-500",
        warning: "border-yellow-500 text-yellow-500",
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Switch Variants
const switchVariants = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary",
        error: "data-[state=checked]:bg-destructive",
        success: "data-[state=checked]:bg-green-500",
        warning: "data-[state=checked]:bg-yellow-500",
      },
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Slider Variants
const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      variant: {
        default: "",
        error: "[&_.slider-track]:bg-destructive/20 [&_.slider-range]:bg-destructive",
        success: "[&_.slider-track]:bg-green-500/20 [&_.slider-range]:bg-green-500",
        warning: "[&_.slider-track]:bg-yellow-500/20 [&_.slider-range]:bg-yellow-500",
      },
      size: {
        default: "h-5",
        sm: "h-4",
        lg: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// File Upload Variants
const fileUploadVariants = cva(
  "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50 transition-colors",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/25",
        error: "border-destructive/50 bg-destructive/5",
        success: "border-green-500/50 bg-green-500/5",
        warning: "border-yellow-500/50 bg-yellow-500/5",
      },
      size: {
        default: "h-32",
        sm: "h-24",
        lg: "h-40",
        xl: "h-48",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Label Variants
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        error: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
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

// Select Option Interface
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

// Select Props
export interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[]
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
  clearable?: boolean
  loading?: boolean
  error?: string
  success?: string
  warning?: string
}

// Select Component
const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectProps
>(({ 
  className, 
  variant, 
  size,
  options,
  placeholder = "Select an option",
  searchable = false,
  multiple = false,
  clearable = false,
  loading = false,
  error,
  success,
  warning,
  value,
  onValueChange,
  ...props 
}, ref) => {
  const [searchValue, setSearchValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const getVariant = () => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      onOpenChange={setIsOpen}
      {...props}
    >
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(selectVariants({ variant: getVariant(), size }), className)}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          {searchable && (
            <div className="flex items-center px-3 py-2 border-b">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex h-8 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
          
          <SelectPrimitive.Viewport className="p-1">
            {filteredOptions.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                {option.icon && (
                  <span className="mr-2">{option.icon}</span>
                )}
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
})
Select.displayName = "Select"

// Checkbox Props
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  warning?: string
}

// Checkbox Component
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ 
  className, 
  variant, 
  size,
  label,
  description,
  error,
  success,
  warning,
  ...props 
}, ref) => {
  const getVariant = () => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }

  return (
    <div className="flex items-start space-x-2">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(checkboxVariants({ variant: getVariant(), size }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      {(label || description) && (
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

// Radio Group Props
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioVariants> {
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>
  error?: string
  success?: string
  warning?: string
}

// Radio Group Component
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ 
  className, 
  variant, 
  size,
  options,
  error,
  success,
  warning,
  ...props 
}, ref) => {
  const getVariant = () => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn("grid gap-2", className)}
      {...props}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupPrimitive.Item
            value={option.value}
            disabled={option.disabled}
            className={cn(radioVariants({ variant: getVariant(), size }))}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-current" />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
          <div className="grid gap-1.5 leading-none">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.label}
            </label>
            {option.description && (
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  )
})
RadioGroup.displayName = "RadioGroup"

// Switch Props
export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  warning?: string
}

// Switch Component
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ 
  className, 
  variant, 
  size,
  label,
  description,
  error,
  success,
  warning,
  ...props 
}, ref) => {
  const getVariant = () => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }

  return (
    <div className="flex items-center space-x-2">
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(switchVariants({ variant: getVariant(), size }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
      </SwitchPrimitive.Root>
      
      {(label || description) && (
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
Switch.displayName = "Switch"

// Slider Props
export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {
  label?: string
  showValue?: boolean
  error?: string
  success?: string
  warning?: string
}

// Slider Component
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ 
  className, 
  variant, 
  size,
  label,
  showValue = false,
  error,
  success,
  warning,
  value,
  onValueChange,
  ...props 
}, ref) => {
  const getVariant = () => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }

  const currentValue = Array.isArray(value) ? value[0] : value

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {currentValue}
            </span>
          )}
        </div>
      )}
      
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={cn(sliderVariants({ variant: getVariant(), size }), className)}
        {...props}
      >
        <SliderPrimitive.Track className="slider-track relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="slider-range absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  )
})
Slider.displayName = "Slider"

// File Upload Props
export interface FileUploadProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fileUploadVariants> {
  onFileSelect?: (files: FileList | null) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  error?: string
  success?: string
  warning?: string
  dragAndDrop?: boolean
}

// File Upload Component
const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ 
    className, 
    variant, 
    size,
    onFileSelect,
    accept,
    multiple = false,
    maxSize,
    error,
    success,
    warning,
    dragAndDrop = true,
    children,
    ...props 
  }, ref) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const getVariant = () => {
      if (error) return "error"
      if (success) return "success"
      if (warning) return "warning"
      return variant
    }

    const handleFileSelect = (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const validFiles = fileArray.filter(file => {
        if (maxSize && file.size > maxSize) {
          console.warn(`File ${file.name} is too large`)
          return false
        }
        return true
      })

      setSelectedFiles(validFiles)
      onFileSelect?.(files)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    return (
      <div
        ref={ref}
        className={cn(
          fileUploadVariants({ variant: getVariant(), size }),
          isDragOver && "border-primary bg-primary/10",
          className
        )}
        onDrop={dragAndDrop ? handleDrop : undefined}
        onDragOver={dragAndDrop ? handleDragOver : undefined}
        onDragLeave={dragAndDrop ? handleDragLeave : undefined}
        onClick={handleClick}
        {...props}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          {children}
        </div>

        {selectedFiles.length > 0 && (
          <div className="absolute top-2 left-2 right-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-background/80 backdrop-blur-sm rounded border"
              >
                <span className="text-xs truncate">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                  }}
                  className="ml-2 p-1 hover:bg-muted rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

// Label Props
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  error?: string
  success?: string
  warning?: string
}

// Label Component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size,
  required = false,
  error,
  success,
  warning,
  children,
  ...props 
}, ref) => {
  const getVariant = () => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ variant: getVariant(), size }), className)}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </LabelPrimitive.Root>
  )
})
Label.displayName = "Label"

export {
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  FileUpload,
  Label,
  selectVariants,
  checkboxVariants,
  radioVariants,
  switchVariants,
  sliderVariants,
  fileUploadVariants,
  labelVariants,
}
