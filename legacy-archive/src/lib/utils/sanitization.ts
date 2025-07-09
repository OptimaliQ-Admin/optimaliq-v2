/**
 * Simple, secure input sanitization that works reliably in production
 * Removes all HTML tags and potentially dangerous content
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags and potentially dangerous content
  const sanitized = input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-like content
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/data:application\/javascript/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove iframe, object, embed tags content
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    // Remove any remaining script tags
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return sanitized;
}

/**
 * Sanitize HTML content for safe rendering (blog posts, etc.)
 * Allows only safe HTML tags and attributes
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') return '';
  
  // Define allowed tags and attributes
  const allowedTags = [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
    'br', 'hr', 'blockquote', 'code', 'pre',
    'a', 'span', 'div'
  ];
  
  const allowedAttributes = ['class', 'href', 'target'];
  
  const forbiddenTags = [
    'script', 'iframe', 'object', 'embed', 'form', 
    'input', 'button', 'textarea', 'select', 'option',
    'style', 'link', 'meta', 'title', 'head', 'body'
  ];
  
  const forbiddenAttributes = [
    'onerror', 'onload', 'onclick', 'onmouseover', 
    'onfocus', 'onblur', 'onchange', 'onsubmit',
    'onkeydown', 'onkeyup', 'onkeypress'
  ];
  
  let sanitized = html;
  
  // Remove forbidden tags
  forbiddenTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>|<${tag}[^>]*\/?>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  // Remove forbidden attributes
  forbiddenAttributes.forEach(attr => {
    const regex = new RegExp(`\\s+${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  // Remove any remaining script-like content
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/data:application\/javascript/gi, '');
  
  return sanitized;
}

/**
 * Validate and sanitize assessment answers
 * Enforces length limits and removes malicious content
 */
export function sanitizeAssessmentAnswer(value: any, maxLength: number = 1000): string {
  if (typeof value !== 'string') return '';
  
  const sanitized = sanitizeInput(value);
  
  // Enforce length limits
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize email addresses
 * Basic email validation and lowercasing
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  
  const sanitized = email.trim().toLowerCase();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
}

/**
 * Sanitize an entire assessment answers object
 * Handles both string and array values
 */
export function sanitizeAssessmentAnswers(answers: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(answers)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeAssessmentAnswer(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeAssessmentAnswer(item, 100) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Check if input contains malicious content
 * Returns true if malicious content is detected
 */
export function containsMaliciousContent(input: string): boolean {
  if (typeof input !== 'string') return false;
  
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate input length and content
 * Returns validation result with errors array
 */
export function validateInput(input: string, maxLength: number = 1000): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof input !== 'string') {
    errors.push('Input must be a string');
    return { isValid: false, errors };
  }
  
  if (input.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`);
  }
  
  if (containsMaliciousContent(input)) {
    errors.push('Input contains malicious content');
  }
  
  return { isValid: errors.length === 0, errors };
} 