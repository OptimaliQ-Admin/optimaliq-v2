import { z } from 'zod';

// Authentication request schemas
export const SignUpRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  title: z.string().optional(),
  industry: z.enum(['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail', 'Consulting', 'Non-Profit', 'Education', 'Real Estate', 'Other']).optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  revenueRange: z.enum(['Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M']).optional(),
  agreedTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreedMarketing: z.boolean().default(false),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required')
});

export const SignInRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  recaptchaToken: z.string().optional()
});

export const PasswordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required')
});

export const PasswordUpdateRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Authentication response schemas
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    title: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    revenueRange: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
  }).optional(),
  session: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_at: z.number(),
    user: z.any()
  }).optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional()
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.string()
});

// User profile schemas
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  revenueRange: z.string().optional(),
  timezone: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  agreedTerms: z.boolean(),
  agreedMarketing: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const UpdateProfileRequestSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  industry: z.enum(['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail', 'Consulting', 'Non-Profit', 'Education', 'Real Estate', 'Other']).optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  revenueRange: z.enum(['Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M']).optional(),
  timezone: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  agreedMarketing: z.boolean().optional()
});

// Type exports
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordUpdateRequest = z.infer<typeof PasswordUpdateRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
