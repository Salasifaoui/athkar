import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePrayerCountdown, usePrayers, useSelectedCity } from "@/src/features/prayers/hooks";
import { currentDayAtom, prayersAtom, prayersLoadingAtom, timingsAtom } from "@/src/features/prayers/store/prayersStore";
import { renderNameMonth, renderNameMonthHijri } from "@/src/utils/utils";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight, Clock, Stars } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";

interface CardPrayerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CardPrayer({ currentDate, onDateChange }: CardPrayerProps) {
  const { selectedCity } = useSelectedCity();
  // Trigger data fetch for the selected date
  usePrayers(selectedCity, currentDate);
  
  // Use atoms directly
  const [prayers] = useAtom(prayersAtom);
  const [timings] = useAtom(timingsAtom);
  const [loading] = useAtom(prayersLoadingAtom);
  const [currentDay] = useAtom(currentDayAtom);

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const countdown = usePrayerCountdown(isToday ? timings : null);



  // Format Gregorian date
  const formatGregorianDate = () => {

    const day = currentDay?.day?.split('-')[0];
    const month = renderNameMonth(currentDay?.day || "")
    const year = currentDay?.day?.split('-')[2];
    return `${day} ${month} ${year}`;
  };

  // Format Hijri date (simplified - in production, use a proper Hijri calendar library)
  const formatHijriDate = () => {

    const hijriYear = currentDay?.date_hijri?.split('-')[2];
    const hijriMonth = renderNameMonthHijri(currentDay?.date_hijri || '');
    const hijriDay = currentDay?.date_hijri?.split('-')[0];
    return `${hijriDay} ${hijriMonth} ${hijriYear}`;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (!countdown || !prayers.length) {
      return 0;
    }

    // Find current and next prayer indices
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let currentPrayerIndex = -1;
    let nextPrayerIndex = 0;

    for (let i = 0; i < prayers.length; i++) {
      const [hours, mins] = prayers[i].time.split(":").map(Number);
      const prayerMinutes = hours * 60 + mins;
      if (currentMinutes < prayerMinutes) {
        nextPrayerIndex = i;
        currentPrayerIndex = i === 0 ? prayers.length - 1 : i - 1;
        break;
      }
    }

    if (currentPrayerIndex === -1) {
      return 0;
    }

    const currentPrayer = prayers[currentPrayerIndex];
    const nextPrayer = prayers[nextPrayerIndex];
    
    const [currentHours, currentMins] = currentPrayer.time.split(":").map(Number);
    const [nextHours, nextMins] = nextPrayer.time.split(":").map(Number);
    
    const currentPrayerMinutes = currentHours * 60 + currentMins;
    const nextPrayerMinutes = nextHours * 60 + nextMins;
    
    let timeSinceCurrentPrayer: number;
    let totalTimeBetweenPrayers: number;

    if (nextPrayerIndex === 0) {
      timeSinceCurrentPrayer = currentMinutes - currentPrayerMinutes;
      totalTimeBetweenPrayers = 24 * 60 - currentPrayerMinutes + nextPrayerMinutes;
    } else {
      timeSinceCurrentPrayer = currentMinutes - currentPrayerMinutes;
      totalTimeBetweenPrayers = nextPrayerMinutes - currentPrayerMinutes;
    }

    return Math.min(
      Math.max((timeSinceCurrentPrayer / totalTimeBetweenPrayers) * 100, 0),
      100
    ) / 100;
  }, [countdown, prayers]);

  return (
    <Card className="overflow-hidden rounded-2xl p-0 m-4">
      <Box className="bg-primary-500">
        <VStack className="gap-6">
          {/* Date Section */}
          <VStack className="items-center gap-3 p-6">
            {/* Gregorian Date with Navigation */}
            <HStack className="items-center justify-between gap-4 w-full">
              <Pressable
                onPress={() => navigateDate("next")}
                className="w-14 h-14 rounded-full bg-primary-200/50 items-center justify-center"
              >
                <Icon as={ChevronLeft} size={20} className="text-white" />
              </Pressable>
              <VStack className="items-center justify-center gap-2">
                <Text className="text-white text-lg font-bold">
                  {formatGregorianDate()}
                </Text>
                <HStack className="items-center justify-center gap-2">
                  <Divider className="w-20 bg-white" />
                  <Icon as={Stars} size={20} className="text-white" />
                  <Divider className="w-20 bg-white" />
                </HStack>
                <Text className="text-white text-lg font-bold">
                  {formatHijriDate()}
                </Text>
              </VStack>

              <Pressable
                onPress={() => navigateDate("prev")}
                className="w-14 h-14 rounded-full bg-primary-200/50 items-center justify-center"
              >
                <Icon as={ChevronRight} size={20} className="text-white" />
              </Pressable>
            </HStack>
          </VStack>

          {/* Dotted Separator */}
          <Divider className="bg-white mx-auto w-full" />

          {/* Countdown Section */}
          {loading ? (
            <VStack className="gap-3 p-6 items-center justify-center">
              <Spinner size="large" className="text-white" />
              <Text className="text-white text-base">جاري التحميل...</Text>
            </VStack>
          ) : countdown && isToday ? (
            <VStack className="gap-3 p-6">
              {/* Arabic Label */}
              <Text className="text-white text-base text-center">
                الوقت المتبقي حتى {countdown.nextPrayerNameArabic}
              </Text>

              {/* Countdown Container with Frosted Glass Effect */}
              <Box className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
                <HStack className="items-center justify-center gap-3 mb-3">
                  <Text className="text-white text-4xl font-bold">
                    {String(countdown.hours).padStart(2, "0")}:
                    {String(countdown.minutes).padStart(2, "0")}:
                    {String(countdown.seconds).padStart(2, "0")}
                  </Text>
                  <Icon as={Clock} size={24} className="text-white" />
                </HStack>

                {/* Progress Bar */}
                <View className="h-2 bg-gray-300/30 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-gray-600 rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </View>
              </Box>
            </VStack>
          ) : (
            <VStack className="gap-3 p-6">
              <Text className="text-white text-base text-center">
                {isToday ? "لا توجد بيانات" : "اختر تاريخ اليوم لعرض العد التنازلي"}
              </Text>
            </VStack>
          )}
        </VStack>
      </Box>
    </Card>
  );
}
