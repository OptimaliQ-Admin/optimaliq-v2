// src/lib/utils/gdpr.ts

// GDPR countries list (EU + EEA + UK)
export const GDPR_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU",
  "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "CH", "UK"
] as const;

export type GDPRCountry = typeof GDPR_COUNTRIES[number];

/**
 * Check if a country is subject to GDPR regulations
 * @param countryCode - The country code to check (e.g., "US", "FR")
 * @returns boolean indicating if the country is subject to GDPR
 */
export const isGDPRCountry = (countryCode: string): boolean => {
  return GDPR_COUNTRIES.includes(countryCode.toUpperCase() as GDPRCountry);
};

/**
 * Get a human-readable list of GDPR countries
 * @returns Array of country names
 */
export const getGDPRCountryNames = (): string[] => {
  const countryNames: Record<GDPRCountry, string> = {
    "AT": "Austria",
    "BE": "Belgium", 
    "BG": "Bulgaria",
    "HR": "Croatia",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "EE": "Estonia",
    "FI": "Finland",
    "FR": "France",
    "DE": "Germany",
    "GR": "Greece",
    "HU": "Hungary",
    "IS": "Iceland",
    "IE": "Ireland",
    "IT": "Italy",
    "LV": "Latvia",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MT": "Malta",
    "NL": "Netherlands",
    "NO": "Norway",
    "PL": "Poland",
    "PT": "Portugal",
    "RO": "Romania",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "ES": "Spain",
    "SE": "Sweden",
    "CH": "Switzerland",
    "UK": "United Kingdom"
  };

  return GDPR_COUNTRIES.map(code => countryNames[code]);
};

/**
 * Log GDPR access attempt for analytics
 * @param countryCode - The country code
 * @param path - The requested path
 * @param userAgent - The user agent string
 */
export const logGDPRAccessAttempt = async (
  countryCode: string,
  path: string,
  userAgent?: string
): Promise<void> => {
  try {
    // You can send this to your analytics service or Supabase
    const logData = {
      timestamp: new Date().toISOString(),
      country: countryCode,
      path: path,
      userAgent: userAgent || 'Unknown',
      action: 'blocked_gdpr_access'
    };

    console.log('🚫 GDPR Access Blocked:', logData);

    // Optional: Send to Supabase for analytics
    // const { error } = await supabase
    //   .from('access_logs')
    //   .insert([logData]);
    
    // if (error) {
    //   console.error('Failed to log GDPR access attempt:', error);
    // }
  } catch (error) {
    console.error('Error logging GDPR access attempt:', error);
  }
};

/**
 * Get GDPR compliance status for a country
 * @param countryCode - The country code
 * @returns Object with compliance information
 */
export const getGDPRComplianceStatus = (countryCode: string) => {
  const isGDPR = isGDPRCountry(countryCode);
  
  return {
    isGDPR,
    countryCode: countryCode.toUpperCase(),
    requiresConsent: isGDPR,
    requiresDataProcessingAgreement: isGDPR,
    requiresDataProtectionOfficer: isGDPR,
    requiresBreachNotification: isGDPR,
    requiresDataPortability: isGDPR,
    requiresRightToErasure: isGDPR
  };
}; 