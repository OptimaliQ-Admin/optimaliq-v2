/**
 * Privacy Consent Manager
 * Handles user consent for device/location/timeOfDay data collection
 * Ensures GDPR/CCPA compliance and minimal PII storage
 */

import { z } from 'zod';

// Consent Categories
/* eslint-disable no-unused-vars */
export enum ConsentCategory {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  PERSONALIZATION = 'personalization',
  LOCATION = 'location',
  DEVICE = 'device',
  TIMING = 'timing'
}
/* eslint-enable no-unused-vars */

// Consent Status
/* eslint-disable no-unused-vars */
export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
  EXPIRED = 'expired'
}
/* eslint-enable no-unused-vars */

// Consent Record Schema
export const ConsentRecordSchema = z.object({
  userId: z.string(),
  sessionId: z.string().optional(),
  category: z.nativeEnum(ConsentCategory),
  status: z.nativeEnum(ConsentStatus),
  timestamp: z.date(),
  expiryDate: z.date().optional(),
  source: z.enum(['explicit', 'implicit', 'inherited']),
  version: z.string().default('1.0'),
  metadata: z.record(z.any()).optional()
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

// Privacy Settings Schema
export const PrivacySettingsSchema = z.object({
  userId: z.string(),
  consentRecords: z.array(ConsentRecordSchema),
  dataRetentionPeriod: z.number().finite().min(1).max(365).default(90), // days
  anonymizationEnabled: z.boolean().default(true),
  dataMinimizationLevel: z.enum(['minimal', 'standard', 'enhanced']).default('standard'),
  preferences: z.object({
    allowLocationTracking: z.boolean().default(false),
    allowDeviceFingerprinting: z.boolean().default(false),
    allowTimingAnalysis: z.boolean().default(true),
    allowPersonalization: z.boolean().default(true),
    allowAnalytics: z.boolean().default(true)
  }),
  lastUpdated: z.date()
});

export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;

// Device Information Schema (Privacy-Safe)
export const DeviceInfoSchema = z.object({
  // Safe device characteristics (no PII)
  screenResolution: z.string().optional(), // e.g., "1920x1080"
  deviceType: z.enum(['mobile', 'tablet', 'desktop', 'unknown']).optional(),
  browserFamily: z.enum(['chrome', 'firefox', 'safari', 'edge', 'other']).optional(),
  operatingSystem: z.enum(['windows', 'macos', 'linux', 'ios', 'android', 'other']).optional(),
  timezone: z.string().optional(), // e.g., "UTC-5" (not specific location)
  language: z.string().optional(), // e.g., "en-US"
  // NO fingerprinting data, IP addresses, or unique identifiers
});

export type DeviceInfo = z.infer<typeof DeviceInfoSchema>;

// Location Information Schema (Privacy-Safe)
export const LocationInfoSchema = z.object({
  // Only broad geographic information, no precise coordinates
  country: z.string().optional(), // ISO country code
  region: z.string().optional(), // State/province level only
  timezone: z.string().optional(), // Timezone identifier
  // NO city, postal code, coordinates, or precise location data
});

export type LocationInfo = z.infer<typeof LocationInfoSchema>;

// Time Context Schema (Privacy-Safe)
export const TimeContextSchema = z.object({
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
  isWeekend: z.boolean().optional(),
  isBusinessHours: z.boolean().optional(),
  // NO specific timestamps or precise timing data
});

export type TimeContext = z.infer<typeof TimeContextSchema>;

class ConsentManager {
  private static instance: ConsentManager;
  private consentStorage: Map<string, PrivacySettings> = new Map();
  private readonly CONSENT_EXPIRY_DAYS = 365; // 1 year

  private constructor() {}

  public static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  /**
   * Request consent for a specific category
   */
  async requestConsent(
    userId: string,
    category: ConsentCategory,
    purpose: string,
    sessionId?: string
  ): Promise<ConsentStatus> {
    try {
      // Check if consent already exists and is valid
      const existingConsent = await this.getConsent(userId, category);
      if (existingConsent && this.isConsentValid(existingConsent)) {
        return existingConsent.status;
      }

      // For essential services, grant automatically
      if (category === ConsentCategory.ESSENTIAL) {
        await this.recordConsent(userId, category, ConsentStatus.GRANTED, 'implicit', sessionId);
        return ConsentStatus.GRANTED;
      }

      // For other categories, require explicit consent
      // In a real implementation, this would show a consent dialog
      // For now, we'll default to pending and require explicit setting
      await this.recordConsent(userId, category, ConsentStatus.PENDING, 'explicit', sessionId, {
        purpose,
        requestedAt: new Date().toISOString()
      });

      return ConsentStatus.PENDING;

    } catch (error) {
      console.error('Failed to request consent:', error);
      return ConsentStatus.DENIED;
    }
  }

  /**
   * Grant consent for a category
   */
  async grantConsent(
    userId: string,
    category: ConsentCategory,
    sessionId?: string
  ): Promise<void> {
    await this.recordConsent(userId, category, ConsentStatus.GRANTED, 'explicit', sessionId);
  }

  /**
   * Deny consent for a category
   */
  async denyConsent(
    userId: string,
    category: ConsentCategory,
    sessionId?: string
  ): Promise<void> {
    await this.recordConsent(userId, category, ConsentStatus.DENIED, 'explicit', sessionId);
  }

  /**
   * Check if consent is granted for a category
   */
  async hasConsent(userId: string, category: ConsentCategory): Promise<boolean> {
    const consent = await this.getConsent(userId, category);
    return consent?.status === ConsentStatus.GRANTED && this.isConsentValid(consent);
  }

  /**
   * Get privacy-safe device information
   */
  async getDeviceInfo(userId: string): Promise<DeviceInfo | null> {
    const hasDeviceConsent = await this.hasConsent(userId, ConsentCategory.DEVICE);
    if (!hasDeviceConsent) {
      return null;
    }

    // Collect only privacy-safe device information
    const deviceInfo: DeviceInfo = {};

    if (typeof window !== 'undefined') {
      // Screen resolution (not unique identifier)
      if (window.screen) {
        deviceInfo.screenResolution = `${window.screen.width}x${window.screen.height}`;
      }

      // Device type inference (safe)
      if (window.navigator) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad/.test(userAgent)) {
          deviceInfo.deviceType = /ipad|tablet/.test(userAgent) ? 'tablet' : 'mobile';
        } else {
          deviceInfo.deviceType = 'desktop';
        }

        // Browser family (safe)
        if (userAgent.includes('chrome')) deviceInfo.browserFamily = 'chrome';
        else if (userAgent.includes('firefox')) deviceInfo.browserFamily = 'firefox';
        else if (userAgent.includes('safari')) deviceInfo.browserFamily = 'safari';
        else if (userAgent.includes('edge')) deviceInfo.browserFamily = 'edge';
        else deviceInfo.browserFamily = 'other';

        // Operating system (safe)
        if (userAgent.includes('windows')) deviceInfo.operatingSystem = 'windows';
        else if (userAgent.includes('mac')) deviceInfo.operatingSystem = 'macos';
        else if (userAgent.includes('linux')) deviceInfo.operatingSystem = 'linux';
        else if (userAgent.includes('ios')) deviceInfo.operatingSystem = 'ios';
        else if (userAgent.includes('android')) deviceInfo.operatingSystem = 'android';
        else deviceInfo.operatingSystem = 'other';

        // Language preference (safe)
        deviceInfo.language = window.navigator.language;
      }

      // Timezone (safe - no specific location)
      try {
        // Extract only the UTC offset, not the specific timezone
        const offset = new Date().getTimezoneOffset();
        deviceInfo.timezone = `UTC${offset <= 0 ? '+' : '-'}${Math.abs(offset / 60)}`;
      } catch {
        // Ignore timezone detection errors
      }
    }

    return DeviceInfoSchema.parse(deviceInfo);
  }

  /**
   * Get privacy-safe location information
   */
  async getLocationInfo(userId: string): Promise<LocationInfo | null> {
    const hasLocationConsent = await this.hasConsent(userId, ConsentCategory.LOCATION);
    if (!hasLocationConsent) {
      return null;
    }

    // In a real implementation, this would use a privacy-safe geolocation service
    // that only returns country/region level information
    const locationInfo: LocationInfo = {
      // These would be populated by a privacy-safe geolocation service
      // country: 'US',
      // region: 'California',
      // timezone: 'America/Los_Angeles'
    };

    return LocationInfoSchema.parse(locationInfo);
  }

  /**
   * Get privacy-safe time context
   */
  async getTimeContext(userId: string): Promise<TimeContext | null> {
    const hasTimingConsent = await this.hasConsent(userId, ConsentCategory.TIMING);
    if (!hasTimingConsent) {
      return null;
    }

    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    const timeContext: TimeContext = {
      timeOfDay: this.categorizeTimeOfDay(hour),
      dayOfWeek: this.getDayOfWeek(dayOfWeek),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isBusinessHours: hour >= 9 && hour <= 17 && dayOfWeek >= 1 && dayOfWeek <= 5
    };

    return TimeContextSchema.parse(timeContext);
  }

  /**
   * Get user privacy settings
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    return this.consentStorage.get(userId) || null;
  }

  /**
   * Update user privacy settings
   */
  async updatePrivacySettings(
    userId: string,
    settings: Partial<PrivacySettings>
  ): Promise<void> {
    const existing = this.consentStorage.get(userId);
    const updated: PrivacySettings = {
      ...existing,
      ...settings,
      userId,
      lastUpdated: new Date()
    } as PrivacySettings;

    const validated = PrivacySettingsSchema.parse(updated);
    this.consentStorage.set(userId, validated);

    // In production, persist to database
    await this.persistPrivacySettings(validated);
  }

  /**
   * Anonymize or delete user data
   */
  async anonymizeUserData(userId: string): Promise<void> {
    const settings = await this.getPrivacySettings(userId);
    if (!settings) return;

    // Remove all consent records
    settings.consentRecords = [];
    
    // Reset to default privacy settings
    settings.preferences = {
      allowLocationTracking: false,
      allowDeviceFingerprinting: false,
      allowTimingAnalysis: false,
      allowPersonalization: false,
      allowAnalytics: false
    };

    await this.updatePrivacySettings(userId, settings);
  }

  /**
   * Check if data retention period has expired
   */
  async cleanupExpiredData(): Promise<void> {
    const now = new Date();
    
    for (const [userId, settings] of this.consentStorage) {
      const retentionPeriod = settings.dataRetentionPeriod * 24 * 60 * 60 * 1000; // Convert to milliseconds
      const dataAge = now.getTime() - settings.lastUpdated.getTime();
      
      if (dataAge > retentionPeriod) {
        await this.anonymizeUserData(userId);
      }
    }
  }

  private async getConsent(userId: string, category: ConsentCategory): Promise<ConsentRecord | null> {
    const settings = await this.getPrivacySettings(userId);
    if (!settings) return null;

    return settings.consentRecords.find(
      record => record.category === category
    ) || null;
  }

  private async recordConsent(
    userId: string,
    category: ConsentCategory,
    status: ConsentStatus,
    source: 'explicit' | 'implicit' | 'inherited',
    sessionId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const settings = await this.getPrivacySettings(userId) || {
      userId,
      consentRecords: [],
      dataRetentionPeriod: 90,
      anonymizationEnabled: true,
      dataMinimizationLevel: 'standard' as const,
      preferences: {
        allowLocationTracking: false,
        allowDeviceFingerprinting: false,
        allowTimingAnalysis: true,
        allowPersonalization: true,
        allowAnalytics: true
      },
      lastUpdated: new Date()
    };

    // Remove existing consent for this category
    settings.consentRecords = settings.consentRecords.filter(
      record => record.category !== category
    );

    // Add new consent record
    const consentRecord: ConsentRecord = {
      userId,
      sessionId,
      category,
      status,
      timestamp: new Date(),
      expiryDate: new Date(Date.now() + this.CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      source,
      version: '1.0',
      metadata
    };

    settings.consentRecords.push(consentRecord);
    settings.lastUpdated = new Date();

    await this.updatePrivacySettings(userId, settings);
  }

  private isConsentValid(consent: ConsentRecord): boolean {
    if (!consent.expiryDate) return true;
    return new Date() < consent.expiryDate;
  }

  private categorizeTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  private getDayOfWeek(dayIndex: number): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    return days[dayIndex];
  }

  private async persistPrivacySettings(_settings: PrivacySettings): Promise<void> {
    // In production, this would save to database
    // For now, we keep in memory
  }
}

export const consentManager = ConsentManager.getInstance();
