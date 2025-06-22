/**
 * Get the visitor's country code from the cookie set by middleware
 * @returns The country code (e.g., "US", "CA", "FR") or "US" as fallback
 */
export const getCountryCode = (): string => {
  if (typeof window === 'undefined') {
    return 'US'; // Server-side fallback
  }

  // Get country code from cookie
  const cookies = document.cookie.split(';');
  const countryCookie = cookies.find(cookie => 
    cookie.trim().startsWith('country_code=')
  );
  
  if (countryCookie) {
    return countryCookie.split('=')[1] || 'US';
  }

  return 'US'; // Fallback if cookie not found
};

/**
 * Check if the visitor is from a specific country
 * @param countryCode - The country code to check (e.g., "US", "CA")
 * @returns boolean indicating if visitor is from the specified country
 */
export const isFromCountry = (countryCode: string): boolean => {
  return getCountryCode().toUpperCase() === countryCode.toUpperCase();
};

/**
 * Check if the visitor is from the United States
 * @returns boolean indicating if visitor is from the US
 */
export const isFromUS = (): boolean => {
  return isFromCountry('US');
};

/**
 * Check if the visitor is from Canada
 * @returns boolean indicating if visitor is from Canada
 */
export const isFromCanada = (): boolean => {
  return isFromCountry('CA');
};

/**
 * Check if the visitor is from the European Union
 * @returns boolean indicating if visitor is from an EU country
 */
export const isFromEU = (): boolean => {
  const euCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
  ];
  return euCountries.includes(getCountryCode().toUpperCase());
};

/**
 * Get country-specific settings or configurations
 * @returns Object with country-specific settings
 */
export const getCountrySettings = () => {
  const country = getCountryCode();
  
  switch (country) {
    case 'US':
      return {
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        phoneFormat: '+1 (XXX) XXX-XXXX'
      };
    case 'CA':
      return {
        currency: 'CAD',
        timezone: 'America/Toronto',
        dateFormat: 'MM/DD/YYYY',
        phoneFormat: '+1 (XXX) XXX-XXXX'
      };
    case 'GB':
      return {
        currency: 'GBP',
        timezone: 'Europe/London',
        dateFormat: 'DD/MM/YYYY',
        phoneFormat: '+44 XXXX XXXXXX'
      };
    default:
      return {
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        phoneFormat: '+XX XXX XXX XXXX'
      };
  }
}; 