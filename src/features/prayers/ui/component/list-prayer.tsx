import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Bell, Moon, Sun, Sunrise, Sunset } from "lucide-react-native";
import { useMemo } from "react";

interface ListPrayerProps {
  currentDate: Date;
}

interface Prayer {
  name: string;
  nameArabic: string;
  time: string;
  color: string;
  icon: typeof Sunrise;
}

// Prayer data structure
const prayerData: Prayer[] = [
  {
    name: "Fajr",
    nameArabic: "الفجر",
    time: "05:12",
    color: "#4A90E2", // Blue
    icon: Sunrise,
  },
  {
    name: "Sunrise",
    nameArabic: "الشروق",
    time: "06:45",
    color: "#F5A623", // Orange
    icon: Sun,
  },
  {
    name: "Dhuhr",
    nameArabic: "الظهر",
    time: "12:02",
    color: "#F5A623", // Yellow/Orange
    icon: Sun,
  },
  {
    name: "Asr",
    nameArabic: "العصر",
    time: "14:55",
    color: "#50C878", // Green
    icon: Sun,
  },
  {
    name: "Maghrib",
    nameArabic: "المغرب",
    time: "17:16",
    color: "#E74C3C", // Red
    icon: Sunset,
  },
  {
    name: "Isha",
    nameArabic: "العشاء",
    time: "18:40",
    color: "#9B59B6", // Purple
    icon: Moon,
  },
];

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

// Helper function to get current/next prayer index based on selected date
const getNextPrayerIndex = (
  prayers: Prayer[],
  selectedDate: Date,
  currentTime?: Date
): number => {
  const now = currentTime || new Date();
  const isToday =
    selectedDate.toDateString() === now.toDateString();
  
  if (!isToday) {
    // For past/future dates, return the first prayer
    return 0;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = timeToMinutes(prayers[i].time);
    if (currentMinutes < prayerTime) {
      return i;
    }
  }
  // If all prayers have passed, return the first prayer of next day (index 0)
  return 0;
};

export default function ListPrayer({ currentDate }: ListPrayerProps) {
  const nextPrayerIndex = useMemo(() => {
    const now = new Date();
    const isToday = currentDate.toDateString() === now.toDateString();
    return getNextPrayerIndex(prayerData, currentDate, isToday ? now : undefined);
  }, [currentDate]);

  return (
   
      <VStack className="gap-3 px-4 pb-4">
        {prayerData.map((prayer, index) => {
          const isNextPrayer = index === nextPrayerIndex;
          const isToday = currentDate.toDateString() === new Date().toDateString();

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
                        : index === 0
                        ? "text-blue-500"
                        : index === 1
                        ? "text-orange-500"
                        : index === 2
                        ? "text-yellow-500"
                        : index === 3
                        ? "text-green-500"
                        : index === 4
                        ? "text-red-500"
                        : "text-purple-500"
                    }`}
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
                        as={prayer.icon}
                        size={24}
                        className={
                          isNextPrayer && isToday
                            ? "text-white"
                            : `text-[${prayer.color}]`
                        }
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
