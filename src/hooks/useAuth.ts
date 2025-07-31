import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  industry: string;
  company_size: string;
  revenue_range: string;
}

interface AuthData {
  user: User | null;
  subscription: {
    status: string | null;
    hasActiveSubscription: boolean;
  };
  onboarding: {
    hasCompletedOnboarding: boolean;
    sessionId: string | null;
  };
  redirectTo: string | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authData, setAuthData] = useState<AuthData>({
    user: null,
    subscription: { status: null, hasActiveSubscription: false },
    onboarding: { hasCompletedOnboarding: false, sessionId: null },
    redirectTo: null,
    loading: true,
    error: null
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 useAuth: Checking authentication...');
        
        const response = await fetch('/api/auth/me');
        
        if (response.status === 401) {
          // User not authenticated
          setAuthData(prev => ({
            ...prev,
            loading: false,
            redirectTo: '/subscribe/login'
          }));
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch auth data');
        }

        const data = await response.json();
        
        console.log('✅ useAuth: Auth data received:', {
          hasUser: !!data.user,
          hasSubscription: data.subscription.hasActiveSubscription,
          hasOnboarding: data.onboarding.hasCompletedOnboarding,
          redirectTo: data.redirectTo
        });

        setAuthData({
          user: data.user,
          subscription: data.subscription,
          onboarding: data.onboarding,
          redirectTo: data.redirectTo,
          loading: false,
          error: null
        });

        // Auto-redirect if needed
        if (data.redirectTo && data.redirectTo !== window.location.pathname) {
          console.log(`🔄 useAuth: Redirecting to ${data.redirectTo}`);
          router.push(data.redirectTo);
        }

      } catch (error) {
        console.error('❌ useAuth: Error checking auth:', error);
        setAuthData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to check authentication'
        }));
      }
    };

    checkAuth();
  }, [router]);

  return authData;
} 