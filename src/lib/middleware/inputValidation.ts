import { NextRequest, NextResponse } from 'next/server';
import { sanitizeAssessmentAnswers, validateInput, containsMaliciousContent } from '../utils/sanitization';

/**
 * Middleware to validate and sanitize assessment submissions
 */
export async function validateAssessmentSubmission(req: NextRequest) {
  try {
    const data = await req.json();
    const errors: string[] = [];

    // Validate required fields
    if (!data.answers || typeof data.answers !== 'object') {
      errors.push('Assessment answers are required');
    }

    if (!data.userId || typeof data.userId !== 'string') {
      errors.push('User ID is required');
    }

    // Sanitize answers if they exist
    let sanitizedAnswers = null;
    if (data.answers && typeof data.answers === 'object') {
      sanitizedAnswers = sanitizeAssessmentAnswers(data.answers);
    }

    // Check for malicious content in all string fields
    const checkForMaliciousContent = (obj: any, path: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          if (containsMaliciousContent(value)) {
            errors.push(`Malicious content detected in ${currentPath}`);
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string' && containsMaliciousContent(item)) {
              errors.push(`Malicious content detected in ${currentPath}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkForMaliciousContent(value, currentPath);
        }
      }
    };

    if (data.answers) {
      checkForMaliciousContent(data.answers);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: {
        ...data,
        answers: sanitizedAnswers
      }
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid request format'],
      sanitizedData: null
    };
  }
}

/**
 * Middleware to validate and sanitize onboarding submissions
 */
export async function validateOnboardingSubmission(req: NextRequest) {
  try {
    const data = await req.json();
    const errors: string[] = [];

    // Validate required fields
    if (!data.userId || typeof data.userId !== 'string') {
      errors.push('User ID is required');
    }

    // Sanitize text fields
    const sanitizedData = { ...data };
    
    if (data.businessName && typeof data.businessName === 'string') {
      const validation = validateInput(data.businessName, 200);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      } else {
        sanitizedData.businessName = data.businessName.trim();
      }
    }

    if (data.industry && typeof data.industry === 'string') {
      const validation = validateInput(data.industry, 100);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      } else {
        sanitizedData.industry = data.industry.trim();
      }
    }

    if (data.businessOverview && typeof data.businessOverview === 'string') {
      const validation = validateInput(data.businessOverview, 2000);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      } else {
        sanitizedData.businessOverview = data.businessOverview.trim();
      }
    }

    // Check for malicious content
    const checkForMaliciousContent = (obj: any, path: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          if (containsMaliciousContent(value)) {
            errors.push(`Malicious content detected in ${currentPath}`);
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string' && containsMaliciousContent(item)) {
              errors.push(`Malicious content detected in ${currentPath}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkForMaliciousContent(value, currentPath);
        }
      }
    };

    checkForMaliciousContent(data);

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid request format'],
      sanitizedData: null
    };
  }
}

/**
 * Generic validation middleware for any API route
 */
export async function validateApiRequest(req: NextRequest, schema: {
  requiredFields?: string[];
  maxLengths?: Record<string, number>;
  allowedFields?: string[];
}) {
  try {
    const data = await req.json();
    const errors: string[] = [];

    // Check required fields
    if (schema.requiredFields) {
      for (const field of schema.requiredFields) {
        if (!data[field]) {
          errors.push(`${field} is required`);
        }
      }
    }

    // Validate field lengths
    if (schema.maxLengths) {
      for (const [field, maxLength] of Object.entries(schema.maxLengths)) {
        if (data[field] && typeof data[field] === 'string') {
          const validation = validateInput(data[field], maxLength);
          if (!validation.isValid) {
            errors.push(...validation.errors.map(err => `${field}: ${err}`));
          }
        }
      }
    }

    // Check for malicious content
    const checkForMaliciousContent = (obj: any, path: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          if (containsMaliciousContent(value)) {
            errors.push(`Malicious content detected in ${currentPath}`);
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string' && containsMaliciousContent(item)) {
              errors.push(`Malicious content detected in ${currentPath}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkForMaliciousContent(value, currentPath);
        }
      }
    };

    checkForMaliciousContent(data);

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: data
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid request format'],
      sanitizedData: null
    };
  }
} 