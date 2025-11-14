import { City } from '@/src/types/city';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import { PrayerTimings } from '../services/prayerService';

const db = SQLite.openDatabaseSync('prayer_times.db');

export interface PrayerTimeRecord {
  id: number;
  date: string; // JSON string of Gregorian date object
  date_hijri: string; // JSON string of Hijri date object
  nameArabic: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export function useSetupDatabase() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS prayer_times (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT UNIQUE,
          date_hijri TEXT,
          nameArabic TEXT,
          fajr TEXT,
          dhuhr TEXT,
          asr TEXT,
          maghrib TEXT,
          isha TEXT
        );`
      ).then(() => {
        console.log('✅ تم إنشاء الجدول بنجاح أو هو موجود مسبقًا');
        // Add date_hijri column if it doesn't exist (for existing databases)
        db.execAsync(`
          ALTER TABLE prayer_times ADD COLUMN date_hijri TEXT;
        `).catch(() => {
          // Column already exists, ignore error
        });
        // Add nameArabic column if it doesn't exist (for existing databases)
        db.execAsync(`
          ALTER TABLE prayer_times ADD COLUMN nameArabic TEXT;
        `).catch(() => {
          // Column already exists, ignore error
        });
      })
      .catch((error) => console.error('❌ خطأ في إنشاء الجدول:', error));

    // Create settings table
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS prayer_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          location TEXT,
          method_calculate TEXT,
          method_asr TEXT
        );`
      ).then(() => {
        console.log('✅ تم إنشاء جدول الإعدادات بنجاح أو هو موجود مسبقًا');
      })
      .catch((error) => console.error('❌ خطأ في إنشاء جدول الإعدادات:', error));
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Helper function to extract time from prayer timing string (e.g., "05:12 (GMT)" -> "05:12")
const extractTime = (time: string): string => {
  return time.split(' ')[0];
};

// Save prayer times to database
export const savePrayerTimes = async (gregorianDate: any, timings: PrayerTimings, nameArabic: string, hijriDate?: any): Promise<void> => {

  await db.runAsync(
    `INSERT OR REPLACE INTO prayer_times (date, date_hijri, nameArabic, fajr, dhuhr, asr, maghrib, isha)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      gregorianDate,
      hijriDate,
      nameArabic,
      extractTime(timings.Fajr || ''),
      extractTime(timings.Dhuhr || ''),
      extractTime(timings.Asr || ''),
      extractTime(timings.Maghrib || ''),
      extractTime(timings.Isha || ''),
    ]
  );
};

export const deleteAllPrayerTimesFromDB = async (): Promise<void> => {
  await db.runAsync(`DELETE FROM prayer_times`);
  console.log('✅ تم حذف جميع أوقات الصلاة بنجاح');
};


// Get prayer times from database
export const getPrayerTimesFromDB = async (date: Date): Promise<PrayerTimings | null> => {
  const dateStr = formatDate(date);
  
  // Try to find by formatted date string first (for backward compatibility)
  let result = await db.getFirstAsync<PrayerTimeRecord>(
    `SELECT * FROM prayer_times WHERE date = ?`,
    [dateStr]
  );
  // If not found, try to find by matching the date in the JSON object
  if (!result) {
    // Search for records where the date JSON contains the formatted date
    const allResults = await db.getAllAsync<PrayerTimeRecord>(
      `SELECT * FROM prayer_times`
    );
    const found = allResults.find((row) => {
      try {
        const dateObj = JSON.parse(row.date);
        // Check if the date string matches the day-month-year format
        const rowDateStr = `${dateObj.day}-${dateObj.month.number}-${dateObj.year}`;
        const searchDateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return rowDateStr === searchDateStr;
      } catch {
        // If parsing fails, check if it's a plain string match
        return row.date === dateStr;
      }
    });
    
    result = found || null;
  }
  
  if (result) {
    const timings: PrayerTimings = {
      Fajr: result.fajr,
      Dhuhr: result.dhuhr,
      Asr: result.asr,
      Maghrib: result.maghrib,
      Isha: result.isha,
    };
    return timings;
  }

  return null;
};

export const getDateGregorianAndHijriFromDB = async (date: Date): Promise<{ date: string; date_hijri: string; nameArabic: string } | null> => {
  const dateStr = formatDate(date);
  let result = await db.getFirstAsync<PrayerTimeRecord>(
    `SELECT * FROM prayer_times WHERE date = ?`,
    [dateStr]
  );
  
  // If not found, try to find by matching the date format
  if (!result) {
    const allResults = await db.getAllAsync<PrayerTimeRecord>(
      `SELECT * FROM prayer_times`
    );
    const found = allResults.find((row) => {
      // Check if it's a plain string match
      if (row.date === dateStr) {
        return true;
      }
      // Try to parse and match if it's a different format
      try {
        // The date might be stored in DD-MM-YYYY format
        const parts = row.date.split('-');
        if (parts.length === 3) {
          const searchDateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
          return row.date === searchDateStr;
        }
      } catch {
        // If parsing fails, skip
      }
      return false;
    });
    
    result = found || null;
  }
  
  
  if (!result) {
    return null;
  }
  
  return { 
    date: result.date || '',
    date_hijri: result.date_hijri || '',
    nameArabic: result.nameArabic || '',
  };
};


// Fetch and save 7 days of prayer times
export const saveSevenDaysPrayerTimes = async (selectedCity: City): Promise<void> => {
  const today = new Date();
  const promises: Promise<void>[] = [];
  
  // for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    // date.setDate(today.getDate() + i);
    
    const promise = (async () => {
      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/calendarByCity/${date.getFullYear()}/${date.getMonth() + 1}?country=${selectedCity.country}&city=${selectedCity.apiName}`
        );
        await deleteAllPrayerTimesFromDB();
        for (const item of response.data.data) {
          
          const timings = item.timings as PrayerTimings;
          const gregorianDate = item.date.gregorian.date;
          const hijriDate = item.date.hijri.date;
          const nameArabic = item.date.hijri.weekday.ar;
          await savePrayerTimes(gregorianDate, timings, nameArabic, hijriDate);
        }
      } catch (error) {
        console.error(`Error fetching prayer times for ${formatDate(date)}:`, error);
        // Continue with other dates even if one fails
      }
    })();

    promises.push(promise);
  }

  // await Promise.all(promises);
// };

// Check if database has any data
export const hasAnyPrayerTimesInDB = async (): Promise<boolean> => {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM prayer_times`
  );
  return (result?.count ?? 0) > 0;
};

// Get prayer times by month from database
export const getPrayerTimesByMonthFromDB = async (year: number, month: number): Promise<PrayerTimeRecord[]> => {
  const allResults = await db.getAllAsync<PrayerTimeRecord>(
    `SELECT * FROM prayer_times ORDER BY date ASC`
  );
  
  // Filter results by month and year
  const filtered = allResults.filter((row) => {
    try {
      // Try to parse date if it's JSON
      let dateStr = row.date;
      try {
        const dateObj = JSON.parse(row.date);
        // If it's a JSON object, extract the date string
        if (dateObj.date) {
          dateStr = dateObj.date;
        } else if (dateObj.day && dateObj.month && dateObj.year) {
          // Construct date string from JSON object parts
          dateStr = `${dateObj.day}-${dateObj.month.number}-${dateObj.year}`;
        }
      } catch {
        // Not JSON, use as is (likely DD-MM-YYYY format from API)
      }
      
      // Parse date string (API returns DD-MM-YYYY format)
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const rowMonth = parseInt(parts[1], 10);
        const rowYear = parseInt(parts[2], 10);
        
        // Check if it's DD-MM-YYYY format (day > 12 indicates this)
        if (day > 12 || (day <= 12 && rowYear < 1000)) {
          // DD-MM-YYYY format
          return rowMonth === month && rowYear === year;
        } else if (rowYear > 1000) {
          // YYYY-MM-DD format
          return rowMonth === month && rowYear === year;
        }
      }
      return false;
    } catch {
      return false;
    }
  });
  
  return filtered;
};

// Check if month exists in database
export const hasMonthInDB = async (year: number, month: number): Promise<boolean> => {
  const results = await getPrayerTimesByMonthFromDB(year, month);
  return results.length > 0;
};

// Save prayer times for a month
export const savePrayerTimesByMonth = async (monthData: {
  gregorianDate: any;
  timings: PrayerTimings;
  nameArabic: string;
  hijriDate?: any;
}[]): Promise<void> => {
  for (const item of monthData) {
    await savePrayerTimes(
      item.gregorianDate,
      item.timings,
      item.nameArabic,
      item.hijriDate
    );
  }
};
