"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface RouteLoadingContextType {
  isLoading: boolean;
}

const RouteLoadingContext = createContext<RouteLoadingContextType>({
  isLoading: false,
});

export function RouteLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleEnd = () => {
      setIsLoading(false);
    };

    // Show loading on route change start
    handleStart();

    // Hide loading after a minimum duration to prevent flickering
    const timer = setTimeout(() => {
      handleEnd();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <RouteLoadingContext.Provider value={{ isLoading }}>
      {children}
    </RouteLoadingContext.Provider>
  );
}

export function useRouteLoading() {
  return useContext(RouteLoadingContext);
} 