import { City } from '@/src/types/city';
import { useEffect, useState } from 'react';
import {
    getPrayerSettings,
    PrayerSettingsInput,
    savePrayerSettings,
} from '../services/settingService';

export interface UseSettingReturn {
  settings: PrayerSettingsInput | null;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: PrayerSettingsInput) => Promise<void>;
  updateLocation: (location: City) => Promise<void>;
  updateCalculationMethod: (method: string) => Promise<void>;
  updateAsrMethod: (method: string) => Promise<void>;
}

export function useSetting(): UseSettingReturn {
  const [settings, setSettings] = useState<PrayerSettingsInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedSettings = await getPrayerSettings();
        setSettings(loadedSettings);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err instanceof Error ? err.message : 'فشل في تحميل الإعدادات');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = async (newSettings: PrayerSettingsInput) => {
    try {
      setError(null);
      await savePrayerSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'فشل في حفظ الإعدادات');
      throw err;
    }
  };

  // Update location only
  const updateLocation = async (location: City) => {
    const currentSettings: PrayerSettingsInput = settings || {
      location,
      method_calculate: 'رابطة العالم الاسلامية',
      method_asr: 'الشافعي',
    };
    await updateSettings({
      ...currentSettings,
      location,
    });
  };

  // Update calculation method only
  const updateCalculationMethod = async (method: string) => {
    if (!settings) {
      throw new Error('Settings not loaded');
    }
    await updateSettings({
      ...settings,
      method_calculate: method,
    });
  };

  // Update Asr method only
  const updateAsrMethod = async (method: string) => {
    if (!settings) {
      throw new Error('Settings not loaded');
    }
    await updateSettings({
      ...settings,
      method_asr: method,
    });
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateLocation,
    updateCalculationMethod,
    updateAsrMethod,
  };
}

