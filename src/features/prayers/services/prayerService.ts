import { City } from '@/src/types/city';
import { Hijri } from '@/src/types/hijri';
import axios from 'axios';
import * as Network from 'expo-network';
import {
  getDateGregorianAndHijriFromDB,
  getPrayerTimesByMonthFromDB,
  hasMonthInDB,
  PrayerTimeRecord,
  savePrayerTimesByMonth,
  saveSevenDaysPrayerTimes
} from '../db/start';


export interface PrayerTimings {
  date_hijri?: Hijri["hijri"];
  date?: Hijri["gregorian"];
  Fajr: string;
  Sunrise?: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string | Hijri["hijri"] | Hijri["gregorian"] | undefined;
}

// Type guard to check if a prayer timing value is a string
function isPrayerTimeString(value: string | Hijri["hijri"] | Hijri["gregorian"] | undefined): value is string {
  return typeof value === 'string';
}

export interface CountdownTimer {
  hours: number;
  minutes: number;
  seconds: number;
  nextPrayerName: string;
  nextPrayerNameArabic: string;
  nextPrayerTime: string;
  isNextDay: boolean;
}

// Prayer mapping configuration
const PRAYER_CONFIG = {
  Fajr: { nameArabic: 'الفجر', color: '#4A90E2' },
  Dhuhr: { nameArabic: 'الظهر', color: '#F5A623' },
  Asr: { nameArabic: 'العصر', color: '#50C878' },
  Maghrib: { nameArabic: 'المغرب', color: '#E74C3C' },
  Isha: { nameArabic: 'العشاء', color: '#9B59B6' },
};

// Helper function to convert time string to minutes
const timeToMinutes = (time: string): number => {
  // Handle formats like "05:12 (GMT)" or "05:12"
  const timeOnly = time.split(' ')[0];
  const [hours, minutes] = timeOnly.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to get current time in minutes
const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Helper function to get next prayer index
const getNextPrayerIndex = (timings: PrayerTimings): number => {
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const currentMinutes = getCurrentTimeInMinutes();

  for (let i = 0; i < prayerOrder.length; i++) {
    const prayerKey = prayerOrder[i];
    const prayerTime = timings[prayerKey];
    if (prayerTime && isPrayerTimeString(prayerTime)) {
      const prayerMinutes = timeToMinutes(prayerTime);
      if (currentMinutes < prayerMinutes) {
        return i;
      }
    }
  }
  // If all prayers have passed, next prayer is Fajr tomorrow
  return 0;
};

export const prayerService = {
  preloadSevenDays: async (selectedCity: City): Promise<void> => {
    try {
      console.log("preloadSevenDays")
      await saveSevenDaysPrayerTimes(selectedCity);
    } catch (error) {
      console.error('Error preloading seven days of prayer times:', error);
      throw error;
    }
  },
  
  setupCountdownTimer: (timings: PrayerTimings): CountdownTimer => {
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const nextPrayerIndex = getNextPrayerIndex(timings);
    const nextPrayerKey = prayerOrder[nextPrayerIndex];
    const nextPrayerTimeValue = timings[nextPrayerKey];
    const nextPrayerTime = (nextPrayerTimeValue && isPrayerTimeString(nextPrayerTimeValue)) ? nextPrayerTimeValue : '';
    
    // Get current time
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Parse next prayer time
    const timeOnly = nextPrayerTime.split(' ')[0];
    const [prayerHours, prayerMinutes] = timeOnly.split(':').map(Number);
    
    // Create target date for next prayer
    const targetDate = new Date();
    targetDate.setHours(prayerHours, prayerMinutes, 0, 0);
    
    // Check if next prayer is tomorrow
    const isNextDay = nextPrayerIndex === 0 && timeToMinutes(currentTime) > timeToMinutes(nextPrayerTime);
    if (isNextDay) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    // Calculate time difference in milliseconds
    let diffMs = targetDate.getTime() - now.getTime();
    
    // Handle edge case where we're past the prayer time but it's not tomorrow yet
    if (diffMs < 0 && !isNextDay) {
      // Next prayer is tomorrow
      targetDate.setDate(targetDate.getDate() + 1);
      diffMs = targetDate.getTime() - now.getTime();
    }
    
    // Convert to hours, minutes, seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds),
      nextPrayerName: nextPrayerKey,
      nextPrayerNameArabic: PRAYER_CONFIG[nextPrayerKey as keyof typeof PRAYER_CONFIG].nameArabic,
      nextPrayerTime: timeOnly,
      isNextDay: isNextDay || diffMs < 0,
    };
  },
 
  getCurrentDayGregorianAndHijri: async (date: Date) => {
    const result = await getDateGregorianAndHijriFromDB(date);
    // const result = await getPrayerTimesFromDBAllDates();
    return result;
  },

  // Check network connectivity
  checkNetworkConnection: async (): Promise<boolean> => {
    try {
      const state = await Network.getNetworkStateAsync();
      return (state.isConnected ?? false) && (state.isInternetReachable ?? false);
    } catch (error) {
      console.error('Error checking network connection:', error);
      return false;
    }
  },

  // Get prayer times by month from database
  getPrayerTimesByMonth: async (year: number, month: number): Promise<PrayerTimeRecord[]> => {
    return await getPrayerTimesByMonthFromDB(year, month);
  },

  // Check if month exists in database
  hasMonthInDatabase: async (year: number, month: number): Promise<boolean> => {
    return await hasMonthInDB(year, month);
  },

  // Fetch prayer times by month from API
  fetchPrayerTimesByMonth: async (selectedCity: City, year: number, month: number): Promise<void> => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?country=${selectedCity.country}&city=${selectedCity.apiName}`
      );
      
      const monthData = response.data.data.map((item: any) => ({
        gregorianDate: item.date.gregorian.date,
        timings: item.timings as PrayerTimings,
        nameArabic: item.date.hijri.weekday.ar,
        hijriDate: item.date.hijri.date,
      }));
      
      await savePrayerTimesByMonth(monthData);
      console.log(`✅ تم حفظ أوقات الصلاة لشهر ${month}/${year}`);
    } catch (error) {
      console.error(`❌ خطأ في جلب أوقات الصلاة لشهر ${month}/${year}:`, error);
      throw error;
    }
  },

  // Get or fetch prayer times by month (with network check)
  getOrFetchPrayerTimesByMonth: async (
    selectedCity: City,
    year: number,
    month: number
  ): Promise<{ data: PrayerTimeRecord[]; fromCache: boolean }> => {
    // First, check if month exists in database
    const hasMonth = await hasMonthInDB(year, month);
    
    if (hasMonth) {
      // Get from database
      const data = await getPrayerTimesByMonthFromDB(year, month);
      return { data, fromCache: true };
    }
    
    // Month doesn't exist, check network
    const isConnected = await prayerService.checkNetworkConnection();
    
    if (isConnected) {
      // Fetch from API
      await prayerService.fetchPrayerTimesByMonth(selectedCity, year, month);
      const data = await getPrayerTimesByMonthFromDB(year, month);
      return { data, fromCache: false };
    }
    
    // No network, return empty array
    return { data: [], fromCache: false };
  },
};
