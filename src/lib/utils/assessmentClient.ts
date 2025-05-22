import { logAssessmentInput, logAssessmentError } from './logger';
import { toast } from 'react-hot-toast';

interface AssessmentResponse {
  error?: string;
  details?: any;
  [key: string]: any;
}

export async function submitAssessment(
  endpoint: string,
  data: { answers: any; score: number; userId: string }
): Promise<AssessmentResponse> {
  try {
    // Log what's being submitted
    logAssessmentInput(`client-${endpoint}`, data);

    const response = await fetch(`/api/assessments/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      const error = {
        error: 'Invalid response format',
        status: response.status,
        body: text
      };
      logAssessmentError(`client-${endpoint}`, error);
      toast.error('Failed to process assessment. Please try again.');
      throw error;
    }

    const result = await response.json();

    if (!response.ok) {
      const error = {
        error: result.error || 'Unknown error',
        details: result.details,
        status: response.status
      };
      logAssessmentError(`client-${endpoint}`, error);
      toast.error(error.error);
      throw error;
    }

    return result;
  } catch (error) {
    // Handle network errors or other exceptions
    const errorDetails = {
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
    logAssessmentError(`client-${endpoint}`, errorDetails);
    toast.error('Failed to submit assessment. Please try again.');
    throw errorDetails;
  }
}

// Helper function to format error messages for display
export function formatAssessmentError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.error) return error.error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
} 