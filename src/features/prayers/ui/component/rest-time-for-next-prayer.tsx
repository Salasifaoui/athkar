import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAtom } from "jotai";
import { Clock } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { CountdownTimer, prayersAtom } from "../../hooks";

export default function RestTimeForNextPrayer({
  countdown,
}: {
  countdown: CountdownTimer;
}) {
  const [prayers] = useAtom(prayersAtom);

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

    const [currentHours, currentMins] = currentPrayer.time
      .split(":")
      .map(Number);
    const [nextHours, nextMins] = nextPrayer.time.split(":").map(Number);

    const currentPrayerMinutes = currentHours * 60 + currentMins;
    const nextPrayerMinutes = nextHours * 60 + nextMins;

    let timeSinceCurrentPrayer: number;
    let totalTimeBetweenPrayers: number;

    if (nextPrayerIndex === 0) {
      timeSinceCurrentPrayer = currentMinutes - currentPrayerMinutes;
      totalTimeBetweenPrayers =
        24 * 60 - currentPrayerMinutes + nextPrayerMinutes;
    } else {
      timeSinceCurrentPrayer = currentMinutes - currentPrayerMinutes;
      totalTimeBetweenPrayers = nextPrayerMinutes - currentPrayerMinutes;
    }

    return (
      Math.min(
        Math.max((timeSinceCurrentPrayer / totalTimeBetweenPrayers) * 100, 0),
        100
      ) / 100
    );
  }, [countdown, prayers]);
  return (
    <VStack className="gap-3 p-6">
      {/* Arabic Label */}
      <Text className="text-white text-xl font-bold text-center">
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
  );
}
