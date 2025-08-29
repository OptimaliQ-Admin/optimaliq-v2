/**
 * Data Display Components
 * Core data display components with comprehensive patterns and accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, MoreHorizontal, Filter, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Table Variants
const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      variant: {
        default: "border-collapse",
        striped: "border-collapse [&_tr:nth-child(even)]:bg-muted/50",
        bordered: "border-collapse [&_td]:border [&_th]:border",
        compact: "border-collapse [&_td]:py-1 [&_th]:py-1",
      },
      size: {
        default: "[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3",
        sm: "[&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2",
        lg: "[&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_th]:py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// List Variants
const listVariants = cva(
  "space-y-1",
  {
    variants: {
      variant: {
        default: "",
        bordered: "[&_li]:border-b [&_li]:border-border [&_li:last-child]:border-b-0",
        card: "[&_li]:bg-card [&_li]:border [&_li]:rounded-lg [&_li]:p-3",
        compact: "[&_li]:py-1",
      },
      size: {
        default: "[&_li]:py-2",
        sm: "[&_li]:py-1",
        lg: "[&_li]:py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Progress Variants
const progressVariants = cva(
  "relative overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        primary: "bg-primary/20",
        success: "bg-green-100 dark:bg-green-900/20",
        warning: "bg-yellow-100 dark:bg-yellow-900/20",
        error: "bg-red-100 dark:bg-red-900/20",
      },
      size: {
        default: "h-2",
        sm: "h-1",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Status Badge Variants
const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary text-primary-foreground",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        outline: "border border-input bg-background",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Table Column Interface
export interface TableColumn<T = any> {
  key: string
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, item: T) => React.ReactNode
}

// Table Props
export interface TableProps<T = any>
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  data: T[]
  columns: TableColumn<T>[]
  sortable?: boolean
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  selectable?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedRows: string[]) => void
  rowKey?: keyof T | ((item: T) => string)
  loading?: boolean
  emptyMessage?: string
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

// Table Component
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ 
    className, 
    variant, 
    size,
    data,
    columns,
    sortable = false,
    sortColumn,
    sortDirection,
    onSort,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    rowKey,
    loading = false,
    emptyMessage = "No data available",
    pagination,
    ...props 
  }, ref) => {
    const [selected, setSelected] = React.useState<string[]>(selectedRows)

    const getRowKey = (item: any, index: number) => {
      if (rowKey) {
        return typeof rowKey === 'function' ? rowKey(item) : item[rowKey]
      }
      return index.toString()
    }

    const handleSort = (column: string) => {
      if (!sortable || !onSort) return
      
      const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
      onSort(column, direction)
    }

    const handleSelectAll = (checked: boolean) => {
      const allKeys = data.map((item, index) => getRowKey(item, index))
      const newSelected = checked ? allKeys : []
      setSelected(newSelected)
      onSelectionChange?.(newSelected)
    }

    const handleSelectRow = (rowKey: string, checked: boolean) => {
      const newSelected = checked 
        ? [...selected, rowKey]
        : selected.filter(key => key !== rowKey)
      setSelected(newSelected)
      onSelectionChange?.(newSelected)
    }

    const renderCell = (column: TableColumn, item: any) => {
      const value = typeof column.accessor === 'function' 
        ? column.accessor(item) 
        : item[column.accessor]

      if (column.render) {
        return column.render(value, item)
      }

      return value
    }

    if (loading) {
      return (
        <div className="w-full animate-pulse">
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="w-full">
        <table
          ref={ref}
          className={cn(tableVariants({ variant, size }), className)}
          {...props}
        >
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selected.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "text-left font-medium",
                    column.width && `w-[${column.width}]`,
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right",
                    sortable && column.sortable && "cursor-pointer hover:bg-muted/75"
                  )}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const key = getRowKey(item, index)
                const isSelected = selected.includes(key)

                return (
                  <motion.tr
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {renderCell(column, item)}
                      </td>
                    ))}
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
        
        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)
Table.displayName = "Table"

// List Item Interface
export interface ListItem {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: string | number
  onClick?: () => void
  disabled?: boolean
}

// List Props
export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listVariants> {
  items: ListItem[]
  selectable?: boolean
  selectedItems?: string[]
  onSelectionChange?: (selectedItems: string[]) => void
  loading?: boolean
  emptyMessage?: string
}

// List Component
const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ 
    className, 
    variant, 
    size,
    items,
    selectable = false,
    selectedItems = [],
    onSelectionChange,
    loading = false,
    emptyMessage = "No items available",
    ...props 
  }, ref) => {
    const [selected, setSelected] = React.useState<string[]>(selectedItems)

    const handleSelectItem = (itemId: string, checked: boolean) => {
      const newSelected = checked 
        ? [...selected, itemId]
        : selected.filter(id => id !== itemId)
      setSelected(newSelected)
      onSelectionChange?.(newSelected)
    }

    if (loading) {
      return (
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      )
    }

    return (
      <ul
        ref={ref}
        className={cn(listVariants({ variant, size }), className)}
        {...props}
      >
        <AnimatePresence>
          {items.map((item, index) => {
            const isSelected = selected.includes(item.id)

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={cn(
                  "flex items-center space-x-3 transition-colors",
                  item.onClick && !item.disabled && "cursor-pointer hover:bg-muted/50",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !item.disabled && item.onClick?.()}
              >
                {selectable && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                )}
                
                {item.icon && (
                  <span className="flex-shrink-0 text-muted-foreground">
                    {item.icon}
                  </span>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    )
  }
)
List.displayName = "List"

// Progress Props
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number
  max?: number
  showLabel?: boolean
  labelPosition?: 'top' | 'bottom' | 'left' | 'right'
  animated?: boolean
  striped?: boolean
}

// Progress Component
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    variant, 
    size,
    value,
    max = 100,
    showLabel = false,
    labelPosition = 'top',
    animated = false,
    striped = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {showLabel && labelPosition === 'top' && (
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {showLabel && labelPosition === 'left' && (
            <span className="text-sm text-muted-foreground w-12">
              {Math.round(percentage)}%
            </span>
          )}
          
          <div className={cn("flex-1", progressVariants({ variant, size }))}>
            <motion.div
              className={cn(
                "h-full bg-primary transition-all duration-300",
                striped && "bg-gradient-to-r from-primary via-primary/80 to-primary",
                animated && "animate-pulse"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {showLabel && labelPosition === 'right' && (
            <span className="text-sm text-muted-foreground w-12 text-right">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        
        {showLabel && labelPosition === 'bottom' && (
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

// Status Badge Props
export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  children: React.ReactNode
  dot?: boolean
}

// Status Badge Component
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ 
    className, 
    variant, 
    size,
    status,
    children,
    dot = false,
    ...props 
  }, ref) => {
    const getDotColor = () => {
      switch (status) {
        case 'success': return 'bg-green-500'
        case 'warning': return 'bg-yellow-500'
        case 'error': return 'bg-red-500'
        case 'info': return 'bg-blue-500'
        case 'primary': return 'bg-primary'
        default: return 'bg-gray-500'
      }
    }

    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span className={cn("w-2 h-2 rounded-full mr-1.5", getDotColor())} />
        )}
        {children}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { 
  Table, 
  List, 
  Progress, 
  StatusBadge,
  tableVariants,
  listVariants,
  progressVariants,
  statusBadgeVariants,
}
