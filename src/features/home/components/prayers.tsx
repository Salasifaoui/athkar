import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
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
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

// Prayer colors
const prayerColors = {
  الفجر: "#4A90E2", // Blue
  الظهر: "#F5A623", // Orange
  العصر: "#50C878", // Green
  المغرب: "#E74C3C", // Red
  العشاء: "#9B59B6", // Purple
};

// Prayer icons
const prayerIcons = {
  الفجر: Sunrise,
  الظهر: Sun,
  العصر: Sun,
  المغرب: Sunset,
  العشاء: Moon,
};

// Fake data for prayers
const fakePrayersData = {
  location: "Thyna",
  prayers: [
    { name: "الفجر", time: "05:30", color: prayerColors.الفجر },
    { name: "الظهر", time: "12:15", color: prayerColors.الظهر },
    { name: "العصر", time: "15:45", color: prayerColors.العصر },
    { name: "المغرب", time: "18:20", color: prayerColors.المغرب },
    { name: "العشاء", time: "19:45", color: prayerColors.العشاء },
  ],
};

// Helper function to get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Helper function to convert time string to minutes
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to get current prayer index
const getCurrentPrayerIndex = (prayers: typeof fakePrayersData.prayers) => {
  const currentTime = getCurrentTime();
  const currentMinutes = timeToMinutes(currentTime);

  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = timeToMinutes(prayers[i].time);
    if (currentMinutes < prayerTime) {
      return i === 0 ? prayers.length - 1 : i - 1; // Previous prayer
    }
  }
  return prayers.length - 1; // Last prayer of the day
};

// Helper function to get next prayer index
const getNextPrayerIndex = (prayers: typeof fakePrayersData.prayers) => {
  const currentTime = getCurrentTime();
  const currentMinutes = timeToMinutes(currentTime);

  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = timeToMinutes(prayers[i].time);
    if (currentMinutes < prayerTime) {
      return i;
    }
  }
  return 0; // First prayer of next day
};

// Helper function to calculate time difference in minutes
const getTimeDifference = (time1: string, time2: string) => {
  const minutes1 = timeToMinutes(time1);
  const minutes2 = timeToMinutes(time2);
  if (minutes2 < minutes1) {
    // Next day
    return 24 * 60 - minutes1 + minutes2;
  }
  return minutes2 - minutes1;
};

export default function Prayers() {
  const [data] = useState(fakePrayersData);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(
    getCurrentPrayerIndex(data.prayers)
  );
  const [nextPrayerIndex, setNextPrayerIndex] = useState(
    getNextPrayerIndex(data.prayers)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getCurrentTime();
      setCurrentTime(newTime);
      setCurrentPrayerIndex(getCurrentPrayerIndex(data.prayers));
      setNextPrayerIndex(getNextPrayerIndex(data.prayers));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data.prayers]);

  const nextPrayer = data.prayers[nextPrayerIndex];
  const currentPrayer = data.prayers[currentPrayerIndex];
  const timeUntilNext = getTimeDifference(currentTime, nextPrayer.time);

  // Calculate progress: time elapsed since current prayer / total time between current and next prayer
  const currentPrayerTime = timeToMinutes(currentPrayer.time);
  const nextPrayerTime = timeToMinutes(nextPrayer.time);
  const currentTimeMinutes = timeToMinutes(currentTime);

  let timeSinceCurrentPrayer: number;
  let totalTimeBetweenPrayers: number;

  if (nextPrayerIndex === 0) {
    // Next prayer is tomorrow (Fajr)
    timeSinceCurrentPrayer = currentTimeMinutes - currentPrayerTime;
    totalTimeBetweenPrayers = 24 * 60 - currentPrayerTime + nextPrayerTime;
  } else {
    timeSinceCurrentPrayer = currentTimeMinutes - currentPrayerTime;
    totalTimeBetweenPrayers = nextPrayerTime - currentPrayerTime;
  }

  const progressPercentage = Math.min(
    Math.max((timeSinceCurrentPrayer / totalTimeBetweenPrayers) * 100, 0),
    100
  );

  const formatTimeRemaining = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  const renderPrayers = (
    prayer: (typeof fakePrayersData.prayers)[0],
    isCurrent: boolean
  ) => (
    <Box
      key={prayer.name}
      className="rounded-xl p-4 min-w-[120px] bg-transparent border"
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
            as={prayerIcons[prayer.name as keyof typeof prayerIcons]}
            size={24}
            style={{ color: prayer.color }}
          />
        </Box>
        <Text
          className="text-sm font-semibold"
          style={{ color: isCurrent ? "#FFFFFF" : prayer.color }}
        >
          {prayer.name}
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

  return (
    <VStack className="gap-4">
      {/* Header */}
      <VStack className="gap-3">
        <HStack className="justify-between items-center w-full">
          <Button
            action="secondary"
            variant="link"
            className="border-none"
            onPress={() => {}}
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
        <HStack className="items-center gap-2 flex-1 justify-center">
          <HStack className="bg-primary-100 rounded-xl p-2 items-center gap-2">
            <Icon
              as={MapPin}
              size={16}
              className="stroke-foreground text-primary-500"
            />
            <Text className="text-sm text-primary-500">{data.location}</Text>
          </HStack>
        </HStack>
      </VStack>

      {/* Content: Horizontal Scrollable List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 8,
          gap: 12,
          flexDirection: "row-reverse",
        }}
      >
        {[...data.prayers].map((prayer, reversedIndex) => {
          const originalIndex = data.prayers.length - 1 - reversedIndex;
          const isCurrent = originalIndex === currentPrayerIndex;
          return renderPrayers(prayer, isCurrent);
        })}
      </ScrollView>

      {/* Footer: Progress Bar */}
      <VStack className="gap-2 p-4 bg-primary-100 rounded-xl w-1/2 mx-auto justify-center">
        <HStack className="justify-center items-center">
          <Text className="text-sm text-gray-600">
            الوقت المتبقي لصلاة {nextPrayer.name}
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
            {formatTimeRemaining(timeUntilNext)}
          </Text>
      </VStack>
    </VStack>
  );
}
