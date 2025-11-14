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
import { currentDayAtom, prayersLoadingAtom, timingsAtom } from "@/src/features/prayers/store/prayersStore";
import { renderNameMonth, renderNameMonthHijri } from "@/src/utils/utils";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight, Stars } from "lucide-react-native";
import { useState } from "react";
import RestTimeForNextPrayer from "./rest-time-for-next-prayer";

interface CardPrayerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CardPrayer({ currentDate, onDateChange }: CardPrayerProps) {
  const { selectedCity } = useSelectedCity();
  const [isOpen, setIsOpen] = useState(false);
  // Trigger data fetch for the selected date
  usePrayers(selectedCity, currentDate);

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
            <RestTimeForNextPrayer countdown={countdown} />
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
