"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePremiumUser } from "@/context/PremiumUserContext";

type NotificationPreference = {
  u_id: string;
  assessment_updates: boolean;
  growth_insights: boolean;
  system_updates: boolean;
  marketing_updates: boolean;
  created_at: string;
  updated_at: string;
};

export default function NotificationPreferences() {
  const { user } = usePremiumUser();
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.u_id) {
      setIsLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('u_id', user.u_id)
          .single();

        if (error) {
          console.error('Error fetching preferences:', error);
          setError('Failed to load notification preferences');
          return;
        }

        setPreferences(data);
      } catch (error) {
        console.error('Error in fetchPreferences:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.u_id]);

  const handleToggle = async (key: keyof Omit<NotificationPreference, 'u_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.u_id || !preferences) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedPreferences = {
        ...preferences,
        [key]: !preferences[key],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(updatedPreferences);

      if (error) {
        console.error('Error updating preferences:', error);
        setError('Failed to update preferences');
        return;
      }

      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error in handleToggle:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user?.u_id) return null;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose which notifications you'd like to receive
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="assessment_updates" className="font-medium text-gray-700">
              Assessment Updates
            </label>
            <p className="text-sm text-gray-500">
              Get notified about new assessment results and recommendations
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('assessment_updates')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences?.assessment_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences?.assessment_updates ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="growth_insights" className="font-medium text-gray-700">
              Growth Insights
            </label>
            <p className="text-sm text-gray-500">
              Receive updates about new growth opportunities and market trends
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('growth_insights')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences?.growth_insights ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences?.growth_insights ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="system_updates" className="font-medium text-gray-700">
              System Updates
            </label>
            <p className="text-sm text-gray-500">
              Stay informed about platform updates and new features
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('system_updates')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences?.system_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences?.system_updates ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="marketing_updates" className="font-medium text-gray-700">
              Marketing Updates
            </label>
            <p className="text-sm text-gray-500">
              Receive marketing insights and promotional offers
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('marketing_updates')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences?.marketing_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences?.marketing_updates ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
} 