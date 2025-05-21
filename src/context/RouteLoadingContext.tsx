"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type RouteLoadingContextType = {
  isLoading: boolean;
};

const RouteLoadingContext = createContext<RouteLoadingContextType>({
  isLoading: false,
});

export function RouteLoadingProvider({ children }: { children: React.ReactNode }) {
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

    // Set loading state when route changes
    handleStart();
    const timeout = setTimeout(handleEnd, 1000); // Minimum loading time of 1 second

    return () => clearTimeout(timeout);
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