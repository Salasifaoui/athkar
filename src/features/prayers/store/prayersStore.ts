import { atom } from 'jotai';
import { Prayer } from '../hooks/usePrayers';
import { PrayerTimings } from '../services/prayerService';

// Atom for prayers list
export const prayersAtom = atom<Prayer[]>([]);

// Atom for prayer timings
export const timingsAtom = atom<PrayerTimings | null>(null);

// Atom for current day information
export const currentDayAtom = atom<{ day: string; date_hijri: string; nameArabic: string } | null>(null);

// Atom for loading state
export const prayersLoadingAtom = atom<boolean>(false);

// Atom for error state
export const prayersErrorAtom = atom<string | null>(null);

