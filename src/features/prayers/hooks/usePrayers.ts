import { City } from '@/src/types/city';
import { useEffect, useState } from 'react';
import { getPrayerTimesFromDB } from '../db/start';
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
  const [currentDay, setCurrentDay] = useState<{ day: string, date_hijri: string, nameArabic: string } | null>(null);

  useEffect(() => {
    if (!selectedCity) {
      setPrayers([]);
      setTimings(null);
      setCurrentDay(null);
      return;
    }

    const fetchPrayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedTimings = await getPrayerTimesFromDB(date || new Date());
        if (fetchedTimings) {
          const formattedPrayers = formatPrayerTimings(fetchedTimings);
          setPrayers(formattedPrayers);
          setTimings(fetchedTimings);
        } else {
          setPrayers([]);
          setTimings(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل في جلب أوقات الصلاة');
        setPrayers([]);
        setTimings(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentDay = async () => {
      try {
        const dateGregorianAndHijri = await prayerService.getCurrentDayGregorianAndHijri(date || new Date());

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
        console.error('Error fetching Hijri date:', err);
        setCurrentDay(null);
      }
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

