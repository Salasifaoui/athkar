import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useInitialSync, usePrayerCountdown, usePrayers, useSelectedCity } from "@/src/features/prayers/hooks";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronLeft,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Timer,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";

// Prayer icons mapping
const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function Prayers() {
  const router = useRouter();
  const [city, setCity] = useState<string | null>(null);
  const { selectedCity } = useSelectedCity();
  const { isInitialSyncLoading } = useInitialSync();
  
  // Fetch prayers using the hook
  const { prayers, timings, loading, error } = usePrayers(selectedCity);
  
  // Get countdown timer
  const countdown = usePrayerCountdown(timings);

  useEffect(() => {
    if (selectedCity.apiName) {
      setCity(selectedCity.apiName);
    }
  }, [selectedCity.apiName]);

  // Find current and next prayer indices
  const { currentPrayerIndex, nextPrayerIndex } = useMemo(() => {
    if (!prayers.length) {
      return { currentPrayerIndex: -1, nextPrayerIndex: 0 };
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Find next prayer
    let nextIndex = 0;
    for (let i = 0; i < prayers.length; i++) {
      const [hours, mins] = prayers[i].time.split(":").map(Number);
      const prayerMinutes = hours * 60 + mins;
      if (currentMinutes < prayerMinutes) {
        nextIndex = i;
        break;
      }
    }

    // Find current prayer (previous one)
    const currentIndex = nextIndex === 0 ? prayers.length - 1 : nextIndex - 1;

    return { currentPrayerIndex: currentIndex, nextPrayerIndex: nextIndex };
  }, [prayers]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!prayers.length || !countdown || currentPrayerIndex === -1) {
      return 0;
    }

    const currentPrayer = prayers[currentPrayerIndex];
    const nextPrayer = prayers[nextPrayerIndex];
    
    const [currentHours, currentMins] = currentPrayer.time.split(":").map(Number);
    const [nextHours, nextMins] = nextPrayer.time.split(":").map(Number);
    
    const currentPrayerMinutes = currentHours * 60 + currentMins;
    const nextPrayerMinutes = nextHours * 60 + nextMins;
    
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    let timeSinceCurrentPrayer: number;
    let totalTimeBetweenPrayers: number;

    if (nextPrayerIndex === 0) {
      // Next prayer is tomorrow (Fajr)
      timeSinceCurrentPrayer = currentTimeMinutes - currentPrayerMinutes;
      totalTimeBetweenPrayers = 24 * 60 - currentPrayerMinutes + nextPrayerMinutes;
    } else {
      timeSinceCurrentPrayer = currentTimeMinutes - currentPrayerMinutes;
      totalTimeBetweenPrayers = nextPrayerMinutes - currentPrayerMinutes;
    }

    return Math.min(
      Math.max((timeSinceCurrentPrayer / totalTimeBetweenPrayers) * 100, 0),
      100
    );
  }, [prayers, countdown, currentPrayerIndex, nextPrayerIndex]);

  const formatTimeRemaining = (hours: number, minutes: number) => {
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  // Show loading state (during initial sync or when loading prayers)
  if (loading || isInitialSyncLoading) {
    return (
      <VStack className="flex-1 gap-4 items-center justify-center p-8">
        <Spinner size="large" />
      </VStack>
    );
  }

  // Show error state
  if (error) {
    return (
      <VStack className="flex-1 gap-4 items-center justify-center p-8">
        <Text className="text-red-500 text-center">
          {error}
        </Text>
      </VStack>
    );
  }

  // Show no data state
  if (!prayers.length) {
    return (
      <VStack className="flex-1 gap-4 items-center justify-center p-8">
        <Spinner size="large" />
      </VStack>
    );
  }

  const nextPrayer = prayers[nextPrayerIndex];

  const renderPrayers = (
    prayer: typeof prayers[0],
    isCurrent: boolean
  ) => {
    const IconComponent = prayerIcons[prayer.name as keyof typeof prayerIcons] || Sun;
    
    return (
      <Box
        key={prayer.name}
        className="rounded-xl p-4 bg-transparent border w-[120px] h-[150px]"
        style={{
          borderColor: prayer.color,
          backgroundColor: isCurrent ? prayer.color : "transparent",
        }}
      >
        <VStack className="items-center gap-2 relative">
          {isCurrent && (
            <Box
              className="rounded-full p-2 absolute top-0 left-2 z-10"
              style={{
                backgroundColor: "white",
                boxShadow: `0 0 0 2px ${prayer.color}`,
              }}
            >
              <Icon
                as={Bell}
                size={18}
                style={{ color: prayer.color }}
                fill={prayer.color}
              />
            </Box>
          )}
          <Box
            className="rounded-full p-2"
            style={{ backgroundColor: isCurrent ? "white" : `${prayer.color}20` }}
          >
            <Icon
              as={IconComponent}
              size={24}
              style={{ color: prayer.color }}
            />
          </Box>
          <Text
            className="text-sm font-semibold"
            style={{ color: isCurrent ? "#FFFFFF" : prayer.color }}
          >
            {prayer.nameArabic}
          </Text>
          <Box
            className="rounded-2xl p-2"
            style={{ backgroundColor: isCurrent ? "transparent" : `${prayer.color}20` }}
          >
            <Text
              className="text-lg font-bold"
              style={{ color: isCurrent ? "#FFFFFF" : prayer.color }}
            >
              {prayer.time}
            </Text>
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <VStack className="flex-1 gap-4">
      {/* Header */}
      <VStack className="gap-4">
        <HStack className="justify-between items-center w-full">
          <Button
            action="secondary"
            variant="link"
            className="border-none"
            onPress={() => {
              router.push("/all-prayers");
            }}
          >
            <Icon
              as={ChevronLeft}
              size={20}
              className="stroke-foreground text-primary-500"
            />
            <Text className="text-lg font-semibold text-primary-500">
              عرض الكل
            </Text>
          </Button>
          <HStack className="items-center gap-2">
            <Text className="text-lg font-semibold text-primary-500">
              أوقات الصلاة
            </Text>
            <Icon
              as={Timer}
              size={20}
              className="stroke-foreground text-primary-500"
            />
          </HStack>
        </HStack>
          {selectedCity.apiName ? <HStack className="items-center gap-2 flex-1 justify-center">
            <HStack className="bg-primary-100 rounded-xl p-2 items-center gap-2">
              <Icon
                as={MapPin}
                size={16}
                className="stroke-foreground text-primary-500"
              />
              <Text className="text-sm text-primary-500">{selectedCity.apiName}</Text>
            </HStack>
          </HStack> : <Spinner size="large" />}
      </VStack>

      {/* Content: Horizontal Scrollable List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          flexDirection: "row-reverse",
        }}
      >
        {[...prayers].map((prayer, index) => {
          const isCurrent = index === currentPrayerIndex;
          return renderPrayers(prayer, isCurrent);
        })}
      </ScrollView>

      {/* Footer: Progress Bar */}
      {countdown && nextPrayer && (
        <VStack className="gap-2 p-4 bg-primary-100 rounded-xl w-1/2 mx-auto justify-center">
          <HStack className="justify-center items-center">
            <Text className="text-sm text-gray-600">
              الوقت المتبقي لصلاة {countdown.nextPrayerNameArabic}
            </Text>
          </HStack>
          <Box className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <Box
              className="h-full rounded-full"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: nextPrayer.color,
              }}
            />
          </Box>
          <Text className="text-sm font-semibold text-gray-900">
            {formatTimeRemaining(countdown.hours, countdown.minutes)}
          </Text>
        </VStack>
      )}
    </VStack>
  );
}
