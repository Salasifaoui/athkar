import { City } from '@/src/types/city';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { getPrayerTimesFromDB } from '../db/start';
import { prayerService, PrayerTimings } from '../services/prayerService';
import {
  currentDayAtom,
  prayersAtom,
  prayersErrorAtom,
  prayersLoadingAtom,
  timingsAtom,
} from '../store/prayersStore';

export interface Prayer {
  name: string;
  nameArabic: string;
  time: string;
  color: string;
}

// Prayer mapping configuration
const PRAYER_CONFIG = {
  Fajr: { nameArabic: 'الفجر', color: '#4A90E2' },
  Dhuhr: { nameArabic: 'الظهر', color: '#F5A623' },
  Asr: { nameArabic: 'العصر', color: '#50C878' },
  Maghrib: { nameArabic: 'المغرب', color: '#E74C3C' },
  Isha: { nameArabic: 'العشاء', color: '#9B59B6' },
};

export function usePrayers(selectedCity: City | null, date?: Date) {
  // Use atoms instead of local state
  const [prayers, setPrayers] = useAtom(prayersAtom);
  const [timings, setTimings] = useAtom(timingsAtom);
  const [loading, setLoading] = useAtom(prayersLoadingAtom);
  const [error, setError] = useAtom(prayersErrorAtom);
  const [currentDay, setCurrentDay] = useAtom(currentDayAtom);
  
  // Use ref to store stable default date when date is not provided
  // Initialize with today's date
  const defaultDateRef = useRef<Date>(new Date());
  
  // Store the actual date object to use in the effect
  // Update ref when day changes (for when date is undefined)
  const targetDate = useMemo(() => {
    if (date) return date;
    
    // Check if we need to update the ref (new day)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const storedDate = defaultDateRef.current;
    const storedToday = new Date(storedDate.getFullYear(), storedDate.getMonth(), storedDate.getDate());
    
    // Only update ref if it's a different day (this doesn't trigger re-render)
    if (today.getTime() !== storedToday.getTime()) {
      defaultDateRef.current = now;
    }
    
    return defaultDateRef.current;
  }, [date]);

  useEffect(() => {
    if (!selectedCity) {
      setPrayers([]);
      setTimings(null);
      setCurrentDay(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        // Fetch both prayer times and current day in parallel
        const [fetchedTimings, dateGregorianAndHijri] = await Promise.all([
          getPrayerTimesFromDB(targetDate),
          prayerService.getCurrentDayGregorianAndHijri(targetDate),
        ]);

        // Handle prayer times
        if (fetchedTimings) {
          const formattedPrayers = formatPrayerTimings(fetchedTimings);
          console.log('====================================');
          console.log('formattedPrayers', formattedPrayers);
          console.log('====================================');
          setPrayers(formattedPrayers);
          setTimings(fetchedTimings);
        } else {
          setPrayers([]);
          setTimings(null);
        }

        // Handle current day
        if (dateGregorianAndHijri) {
          setCurrentDay({
            day: dateGregorianAndHijri.date || '',
            date_hijri: dateGregorianAndHijri.date_hijri || '',
            nameArabic: dateGregorianAndHijri.nameArabic || '',
          });
        } else {
          setCurrentDay(null);
        }
      } catch (err) {
        console.error('Error fetching prayer data:', err);
        setError(err instanceof Error ? err.message : 'فشل في جلب أوقات الصلاة');
        setPrayers([]);
        setTimings(null);
        setCurrentDay(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, targetDate]);

  return { prayers, timings, loading, error, currentDay };
}


function formatPrayerTimings(timings: PrayerTimings): Prayer[] {
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const formatted: Prayer[] = [];

  prayerOrder.forEach((prayerKey) => {
    const time = timings[prayerKey];
    if (time && typeof time === 'string') {
      // Convert from "HH:MM (24h)" to "HH:MM" format
      const timeOnly = time.split(' ')[0];
      formatted.push({
        name: prayerKey,
        nameArabic: PRAYER_CONFIG[prayerKey as keyof typeof PRAYER_CONFIG].nameArabic,
        time: timeOnly,
        color: PRAYER_CONFIG[prayerKey as keyof typeof PRAYER_CONFIG].color,
      });
    }
  });

  return formatted;
}

 export async function getCurrentDay(date: Date): Promise<{ date: string, date_hijri: string, nameArabic: string } | null> {
  try {
    const dateGregorianAndHijri = await prayerService.getCurrentDayGregorianAndHijri(date);
    return dateGregorianAndHijri;
  } catch (error) {
    console.error('Error fetching current day:', error);
    return null;
  }
}



