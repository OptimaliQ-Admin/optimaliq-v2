import { supabase } from "@/lib/supabase";

/**
 * Comprehensive logout function that cleans up all client-side data
 * This can be used anywhere in the app for consistent logout behavior
 */
export const performLogout = async (): Promise<void> => {
  try {
    // 1. Clear all localStorage items
    const localStorageKeys = [
      "userId",
      "tier2_email",
      "userEmail", 
      "tier2_user_id",
      "tier2_full_user_info",
      "tier2_user",
      "u_id", // From growth assessment
      "onboarding_assessment_data"
    ];
    
    localStorageKeys.forEach(key => localStorage.removeItem(key));
    
    // 2. Clear all sessionStorage items
    const sessionStorageKeys = [
      "dashboard_welcome_shown"
    ];
    
    sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
    
    // 3. Sign out from Supabase (this clears auth tokens)
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if cleanup fails, clear all storage as fallback
    localStorage.clear();
    sessionStorage.clear();
    throw error; // Re-throw so calling code can handle it
  }
};

/**
 * Get all localStorage keys that should be cleared on logout
 */
export const getLocalStorageKeysToClear = (): string[] => [
  "userId",
  "tier2_email",
  "userEmail", 
  "tier2_user_id",
  "tier2_full_user_info",
  "tier2_user",
  "u_id",
  "onboarding_assessment_data"
];

/**
 * Get all sessionStorage keys that should be cleared on logout
 */
export const getSessionStorageKeysToClear = (): string[] => [
  "dashboard_welcome_shown"
];

/**
 * Clear all authentication-related data without signing out
 * Useful for partial cleanup or testing
 */
export const clearAuthData = (): void => {
  const localStorageKeys = getLocalStorageKeysToClear();
  const sessionStorageKeys = getSessionStorageKeysToClear();
  
  localStorageKeys.forEach(key => localStorage.removeItem(key));
  sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
}; 