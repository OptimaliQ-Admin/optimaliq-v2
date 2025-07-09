"use client";

import { motion } from "framer-motion";

// Base skeleton component with shimmer effect
const SkeletonBase = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
    style={{
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite',
    }}
    {...props}
  />
);

// Shimmer animation keyframes
const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Inject CSS for shimmer animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerAnimation;
  document.head.appendChild(style);
}

export const Skeleton = {
  // Basic skeleton elements
  Circle: ({ size = "w-8 h-8", className = "" }: { size?: string; className?: string }) => (
    <SkeletonBase className={`rounded-full ${size} ${className}`} />
  ),

  Rectangle: ({ width = "w-full", height = "h-4", className = "" }: { width?: string; height?: string; className?: string }) => (
    <SkeletonBase className={`rounded ${width} ${height} ${className}`} />
  ),

  // Card skeleton
  Card: ({ className = "" }: { className?: string }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton.Circle size="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton.Rectangle width="w-3/4" height="h-4" />
            <Skeleton.Rectangle width="w-1/2" height="h-3" />
          </div>
        </div>
        <Skeleton.Rectangle width="w-full" height="h-4" />
        <Skeleton.Rectangle width="w-5/6" height="h-4" />
        <div className="flex gap-2">
          <Skeleton.Rectangle width="w-20" height="h-8" className="rounded-full" />
          <Skeleton.Rectangle width="w-24" height="h-8" className="rounded-full" />
        </div>
      </div>
    </div>
  ),

  // Dashboard skeleton
  Dashboard: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton.Rectangle width="w-1/3" height="h-8" />
        <Skeleton.Rectangle width="w-1/2" height="h-6" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton.Circle size="w-10 h-10" />
                <div className="flex-1">
                  <Skeleton.Rectangle width="w-1/2" height="h-3" />
                </div>
              </div>
              <Skeleton.Rectangle width="w-1/3" height="h-8" />
              <Skeleton.Rectangle width="w-full" height="h-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Skeleton.Chart key={i} />
        ))}
      </div>
    </div>
  ),

  // Chart skeleton
  Chart: ({ className = "" }: { className?: string }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton.Rectangle width="w-1/3" height="h-6" />
          <Skeleton.Rectangle width="w-20" height="h-8" className="rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton.Rectangle width="w-full" height="h-4" />
          <Skeleton.Rectangle width="w-5/6" height="h-4" />
          <Skeleton.Rectangle width="w-4/5" height="h-4" />
          <Skeleton.Rectangle width="w-3/4" height="h-4" />
          <Skeleton.Rectangle width="w-2/3" height="h-4" />
        </div>
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    </div>
  ),

  // Assessment skeleton
  Assessment: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton.Circle size="w-12 h-12" />
            <div className="flex-1 space-y-2">
              <Skeleton.Rectangle width="w-1/2" height="h-8" />
              <Skeleton.Rectangle width="w-1/3" height="h-4" />
            </div>
            <Skeleton.Rectangle width="w-24" height="h-8" className="rounded-full" />
          </div>
          <Skeleton.Rectangle width="w-full" height="h-6" />
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton.Rectangle width="w-1/4" height="h-6" />
            <Skeleton.Rectangle width="w-16" height="h-6" />
          </div>
          <Skeleton.Rectangle width="w-full" height="h-3" className="rounded-full" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton.Rectangle width="w-full" height="h-4" />
                <Skeleton.Rectangle width="w-1/2" height="h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton.Rectangle width="w-1/3" height="h-4" />
            <Skeleton.Rectangle width="w-full" height="h-6" />
            <Skeleton.Rectangle width="w-5/6" height="h-6" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <Skeleton.Circle size="w-6 h-6" />
                  <div className="flex-1 space-y-2">
                    <Skeleton.Rectangle width="w-3/4" height="h-4" />
                    <Skeleton.Rectangle width="w-1/2" height="h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  // Table skeleton
  Table: ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton.Rectangle key={i} width="w-full" height="h-4" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }, (_, colIndex) => (
                <Skeleton.Rectangle 
                  key={colIndex} 
                  width="w-full" 
                  height="h-4" 
                  className={colIndex === 0 ? "w-3/4" : ""}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  // List skeleton
  List: ({ items = 5 }: { items?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Skeleton.Circle size="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton.Rectangle width="w-1/3" height="h-4" />
              <Skeleton.Rectangle width="w-1/2" height="h-3" />
            </div>
            <Skeleton.Rectangle width="w-20" height="h-8" className="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  ),

  // Form skeleton
  Form: ({ fields = 4 }: { fields?: number }) => (
    <div className="space-y-6">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton.Rectangle width="w-1/4" height="h-4" />
          <Skeleton.Rectangle width="w-full" height="h-12" className="rounded-xl" />
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        <Skeleton.Rectangle width="w-24" height="h-12" className="rounded-xl" />
        <Skeleton.Rectangle width="w-32" height="h-12" className="rounded-xl" />
      </div>
    </div>
  ),

  // Profile skeleton
  Profile: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-6">
          <Skeleton.Circle size="w-20 h-20" />
          <div className="flex-1 space-y-3">
            <Skeleton.Rectangle width="w-1/3" height="h-8" />
            <Skeleton.Rectangle width="w-1/2" height="h-4" />
            <div className="flex gap-2">
              <Skeleton.Rectangle width="w-20" height="h-8" className="rounded-full" />
              <Skeleton.Rectangle width="w-24" height="h-8" className="rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="space-y-4">
              <Skeleton.Rectangle width="w-1/2" height="h-4" />
              <Skeleton.Rectangle width="w-1/3" height="h-8" />
              <Skeleton.Rectangle width="w-full" height="h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}; 