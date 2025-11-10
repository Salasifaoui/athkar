import { useEffect, useState } from 'react';
import { CountdownTimer, prayerService, PrayerTimings } from '../services/prayerService';

export function usePrayerCountdown(timings: PrayerTimings | null) {
  const [countdown, setCountdown] = useState<CountdownTimer | null>(null);

  useEffect(() => {
    if (!timings) {
      setCountdown(null);
      return;
    }

    // Calculate initial countdown
    const updateCountdown = () => {
      const timer = prayerService.setupCountdownTimer(timings);
      setCountdown(timer);
    };

    updateCountdown();

    // Update countdown every second
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  return countdown;
}

