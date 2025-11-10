import { City } from '@/src/types/city';
import { Hijri } from '@/src/types/hijri';
import axios from 'axios';
export interface PrayerTimings {
  Fajr: string;
  Sunrise?: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string | undefined;
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
    if (prayerTime) {
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
  getPrayers: async (selectedCity: City, date?: Date) => {
    const dateParam = date 
      ? `&date=${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      : '';
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=${selectedCity.country}&city=${selectedCity.apiName}${dateParam}`
    );
    return response.data.data.timings as PrayerTimings;
  },
  
  setupCountdownTimer: (timings: PrayerTimings): CountdownTimer => {
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const nextPrayerIndex = getNextPrayerIndex(timings);
    const nextPrayerKey = prayerOrder[nextPrayerIndex];
    const nextPrayerTime = timings[nextPrayerKey] || '';
    
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
  getCurrentDayHijri: async (date: Date) => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/hToG?${date}`
    );
    return response.data.data as Hijri;
  },
};
