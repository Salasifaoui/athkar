import { City } from '@/src/types/city';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('prayer_times.db');

export interface PrayerSettings {
  id: number;
  location: string; // JSON string of City object
  method_calculate: string;
  method_asr: string;
}

export interface PrayerSettingsInput {
  location?: City;
  method_calculate?: string;
  method_asr?: string;
}

// Get prayer settings from database
export const getPrayerSettings = async (): Promise<PrayerSettingsInput | null> => {
  try {
    const result = await db.getFirstAsync<PrayerSettings>(
      `SELECT * FROM prayer_settings ORDER BY id DESC LIMIT 1`
    );

    if (result) {
      // Parse location from JSON string
      let location: City;
      try {
        location = JSON.parse(result.location);
      } catch {
        // If parsing fails, return null
        return null;
      }

      return {
        location,
        method_calculate: result.method_calculate,
        method_asr: result.method_asr,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting prayer settings:', error);
    return null;
  }
};

// Save prayer settings to database
export const savePrayerSettings = async (
  settings: PrayerSettingsInput
): Promise<void> => {
  try {
    // Check if settings already exist
    const existing = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM prayer_settings`
    );

    const locationJson = settings.location ? JSON.stringify(settings.location) : undefined;
    const methodCalculate = settings.method_calculate ? settings.method_calculate : undefined;
    const methodAsr = settings.method_asr ? settings.method_asr : undefined;

    if (existing && existing.count > 0) {
      // Update existing settings
      await db.runAsync(
        `UPDATE prayer_settings 
         SET location = ?, method_calculate = ?, method_asr = ? 
         WHERE id = (SELECT id FROM prayer_settings ORDER BY id DESC LIMIT 1)`,
        [locationJson, methodCalculate, methodAsr]
      );
      console.log('✅ تم تحديث الإعدادات بنجاح');
    } else {
      // Insert new settings
      await db.runAsync(
        `INSERT INTO prayer_settings (location, method_calculate, method_asr)
         VALUES (?, ?, ?)`,
        [locationJson, methodCalculate, methodAsr]
      );
      console.log('✅ تم حفظ الإعدادات بنجاح');
    }
  } catch (error) {
    console.error('Error saving prayer settings:', error);
    throw error;
  }
};

// Delete all prayer settings
export const deletePrayerSettings = async (): Promise<void> => {
  try {
    await db.runAsync(`DELETE FROM prayer_settings`);
    console.log('✅ تم حذف جميع الإعدادات بنجاح');
  } catch (error) {
    console.error('Error deleting prayer settings:', error);
    throw error;
  }
};

