/**
 * Formats a phone number for display with area code parentheses
 * @param phone - The phone number string (can be in various formats)
 * @returns Formatted phone number with parentheses around area code, or original if invalid
 */
export function formatPhoneForDisplay(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number (10 or 11 digits)
  if (digits.length === 10) {
    // Format as (XXX) XXX-XXXX
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // Format as (XXX) XXX-XXXX (removing country code)
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 11 && !digits.startsWith('1')) {
    // 11 digits but doesn't start with 1, format as (XXX) XXX-XXXX
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // If it doesn't match expected patterns, return original
  return phone;
}

/**
 * Strips formatting from a phone number to get just digits
 * @param phone - The formatted phone number
 * @returns Phone number with only digits
 */
export function stripPhoneFormatting(phone: string): string {
  return phone.replace(/\D/g, '');
} 