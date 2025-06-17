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
  const [preferences, setPreferences] = useState<NotificationPreference>({
    u_id: user?.u_id || '',
    assessment_updates: true,
    growth_insights: true,
    system_updates: true,
    marketing_updates: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
          return;
        }

        if (data) {
          setPreferences(data);
        }
      } catch (error) {
        console.error('Error in fetchPreferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.u_id]);

  const handleToggle = async (key: keyof Omit<NotificationPreference, 'u_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.u_id) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      const updatedPreferences = {
        ...preferences,
        [key]: !preferences[key],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(updatedPreferences);

      if (error) {
        console.error('Error updating preferences:', error);
        setSaveMessage('Failed to save preferences');
        return;
      }

      setPreferences(updatedPreferences);
      setSaveMessage('Preferences saved successfully');
    } catch (error) {
      console.error('Error in handleToggle:', error);
      setSaveMessage('Failed to save preferences');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  if (!user?.u_id) {
    return null;
  }

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose which notifications you'd like to receive
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Assessment Updates
            </label>
            <p className="text-sm text-gray-500">
              Get notified about new assessment results and recommendations
            </p>
          </div>
          <button
            onClick={() => handleToggle('assessment_updates')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences.assessment_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.assessment_updates ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Growth Insights
            </label>
            <p className="text-sm text-gray-500">
              Receive notifications about new growth opportunities and insights
            </p>
          </div>
          <button
            onClick={() => handleToggle('growth_insights')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences.growth_insights ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.growth_insights ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              System Updates
            </label>
            <p className="text-sm text-gray-500">
              Stay informed about platform updates and maintenance
            </p>
          </div>
          <button
            onClick={() => handleToggle('system_updates')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences.system_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.system_updates ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Marketing Updates
            </label>
            <p className="text-sm text-gray-500">
              Receive updates about new features and promotions
            </p>
          </div>
          <button
            onClick={() => handleToggle('marketing_updates')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              preferences.marketing_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.marketing_updates ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`mt-4 p-2 rounded text-sm ${
            saveMessage.includes('Failed')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {saveMessage}
        </div>
      )}
    </div>
  );
} 