import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePrayers, useSelectedCity } from "@/src/features/prayers/hooks";
import { Bell, Moon, Sun, Sunrise, Sunset } from "lucide-react-native";
import { useMemo } from "react";

interface ListPrayerProps {
  currentDate: Date;
}

// Prayer icons mapping
const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

// Helper function to convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to format time to AM/PM
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${period} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
};

export default function ListPrayer({ currentDate }: ListPrayerProps) {
  const { selectedCity } = useSelectedCity();
  // Fetch prayers for the selected date
  const { prayers, loading, error } = usePrayers(selectedCity, currentDate);

  // Find next prayer index (only for today)
  const nextPrayerIndex = useMemo(() => {
    if (!prayers.length) {
      return -1;
    }

    const now = new Date();
    const isToday = currentDate.toDateString() === now.toDateString();
    
    if (!isToday) {
      // For past/future dates, return -1 (no next prayer)
      return -1;
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < prayers.length; i++) {
      const prayerTime = timeToMinutes(prayers[i].time);
      if (currentMinutes < prayerTime) {
        return i;
      }
    }
    // If all prayers have passed, return 0 (first prayer of next day)
    return 0;
  }, [prayers, currentDate]);

  if (loading) {
    return (
      <VStack className="gap-3 px-4 pb-4 items-center justify-center py-8">
        <Spinner size="large" />
        <Text className="text-primary-500">جاري تحميل أوقات الصلاة...</Text>
      </VStack>
    );
  }

  if (error || !prayers.length) {
    return (
      <VStack className="gap-3 px-4 pb-4 items-center justify-center py-8">
        <Text className="text-red-500 text-center">
          {error || "فشل في جلب أوقات الصلاة"}
        </Text>
      </VStack>
    );
  }

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <VStack className="gap-3 px-4 pb-4">
      {prayers.map((prayer, index) => {
        const isNextPrayer = index === nextPrayerIndex;
        const IconComponent = prayerIcons[prayer.name as keyof typeof prayerIcons] || Sun;

        return (
          <Card
            key={prayer.name}
            className={`overflow-hidden rounded-2xl p-0 ${
              isNextPrayer && isToday
                ? "bg-purple-500"
                : "bg-white"
            }`}
          >
            <Pressable className="p-4">
              <HStack className="items-center justify-between">
                {/* Left: Time */}
                <Text
                  className={`text-2xl font-bold ${
                    isNextPrayer && isToday
                      ? "text-white"
                      : prayer.color
                  }`}
                  style={{
                    color: isNextPrayer && isToday ? "#FFFFFF" : prayer.color,
                  }}
                >
                  {formatTime(prayer.time)}
                </Text>

                {/* Right: Arabic name and icon */}
                <HStack className="items-center gap-3">
                  <VStack className="items-end gap-1">
                    <Text
                      className={`text-xl font-bold ${
                        isNextPrayer && isToday ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {prayer.nameArabic}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isNextPrayer && isToday
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      وقت الصلاة
                    </Text>
                  </VStack>

                  {/* Icon */}
                  <Box
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      isNextPrayer && isToday
                        ? "bg-white/20"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      as={IconComponent}
                      size={24}
                      style={{
                        color:
                          isNextPrayer && isToday
                            ? "#FFFFFF"
                            : prayer.color,
                      }}
                    />
                  </Box>
                </HStack>
              </HStack>

              {/* Next button for current/next prayer */}
              {isNextPrayer && isToday && (
                <HStack className="items-center justify-end mt-3">
                  <Pressable className="flex-row items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <Icon as={Bell} size={16} className="text-white" />
                    <Text className="text-white text-sm font-semibold">
                      التالي
                    </Text>
                  </Pressable>
                </HStack>
              )}
            </Pressable>
          </Card>
        );
      })}
    </VStack>
  );
}
