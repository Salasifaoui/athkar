import { City } from '@/src/types/city';
import { Hijri } from '@/src/types/hijri';
import { useEffect, useState } from 'react';
import { prayerService, PrayerTimings } from '../services/prayerService';

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
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<Hijri | null>(null);
  useEffect(() => {
    if (!selectedCity) {
      setPrayers([]);
      setTimings(null);
      return;
    }

    const fetchPrayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedTimings = await prayerService.getPrayers(selectedCity, date);
        const formattedPrayers = formatPrayerTimings(fetchedTimings);
        setPrayers(formattedPrayers);
        setTimings(fetchedTimings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل في جلب أوقات الصلاة');
        setPrayers([]);
        setTimings(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentDay = async () => {
      const currentDay = await prayerService.getCurrentDayHijri(date || new Date());
      setCurrentDay(currentDay);
    };

    fetchPrayers();
    fetchCurrentDay();
  }, [selectedCity, date]);

  return { prayers, timings, loading, error, currentDay };
}

function formatPrayerTimings(timings: PrayerTimings): Prayer[] {
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const formatted: Prayer[] = [];

  prayerOrder.forEach((prayerKey) => {
    const time = timings[prayerKey];
    if (time) {
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

