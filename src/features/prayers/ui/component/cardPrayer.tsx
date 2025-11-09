import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChevronLeft, ChevronRight, Clock, Stars } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

interface CardPrayerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CardPrayer({ currentDate, onDateChange }: CardPrayerProps) {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 35,
    seconds: 54,
  });
  const progress = 0.67; // 67% progress

  // Format Gregorian date
  const formatGregorianDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format Hijri date (simplified - in production, use a proper Hijri calendar library)
  const formatHijriDate = (date: Date) => {
    // This is a placeholder - you should use a proper Hijri calendar conversion
    // Simplified calculation (not accurate)
    const hijriYear = 1447;
    const hijriMonth = "جمادى الأولى";
    const hijriDay = 18;
    return `${hijriMonth} ${hijriYear} ${hijriDay}`;
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

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="overflow-hidden rounded-2xl p-0 m-4">
      <Box className="bg-primary-500">
        <VStack className="gap-6">
          {/* Date Section */}
          <VStack className="items-center gap-3 p-6">
            {/* Gregorian Date with Navigation */}
            <HStack className="items-center justify-between gap-4 w-full">
              <Pressable
                onPress={() => navigateDate("prev")}
                className="w-14 h-14 rounded-full bg-primary-200/50 items-center justify-center"
              >
                <Icon as={ChevronLeft} size={20} className="text-white" />
              </Pressable>
              <VStack className="items-center justify-center gap-2">
                <Text className="text-white text-lg font-bold">
                  {formatGregorianDate(currentDate)}
                </Text>
                <HStack className="items-center justify-center gap-2">
                  <Divider className="w-20 bg-white" />
                  <Icon as={Stars} size={20} className="text-white" />
                  <Divider className="w-20 bg-white" />
                </HStack>
                <Text className="text-white text-lg font-bold">
                  {formatHijriDate(currentDate)}
                </Text>
              </VStack>

              <Pressable
                onPress={() => navigateDate("next")}
                className="w-14 h-14 rounded-full bg-primary-200/50 items-center justify-center"
              >
                <Icon as={ChevronRight} size={20} className="text-white" />
              </Pressable>
            </HStack>
          </VStack>

          {/* Dotted Separator */}
          <Divider className="bg-white mx-auto w-full" />

          {/* Countdown Section */}
          <VStack className="gap-3 p-6">
            {/* Arabic Label */}
            <Text className="text-white text-base text-center">
              الوقت المتبقي حتى العشاء
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
        </VStack>
      </Box>
    </Card>
  );
}
