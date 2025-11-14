import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useSelectedCitySafe } from "@/src/features/prayers/hooks";
import { renderNameMonth, renderNameMonthHijri } from "@/src/utils/utils";
import { MoreVertical, Share2 } from "lucide-react-native";
import { useState } from "react";
import ListPrayersInMonth from "../../prayers/ui/component/list-prayers-in-month";

export default function CurrentDay({
  currentDay,
}: {
  currentDay: { date: string; date_hijri: string; nameArabic: string } | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Get selectedCity from context to pass as prop (using safe hook)
  const context = useSelectedCitySafe();
  const selectedCity = context?.selectedCity ?? null;
  
  if (!currentDay) return null;

  const gregorianDate = currentDay.date.split("-");
  const hijriDate = currentDay.date_hijri.split("-");
  const gregorianDay = gregorianDate[2];
  const gregorianMonth = renderNameMonth(currentDay.date);
  const gregorianYear = gregorianDate[0];

  const hijriDay = hijriDate[2];
  const hijriMonth = renderNameMonthHijri(currentDay.date_hijri);
  const hijriYear = hijriDate[0];
  const hijriDayName = currentDay.nameArabic;

  return (
    <>
      <Box className="absolute bottom-4 left-4 right-4 z-20">
        <Box className="bg-white rounded-2xl px-4 py-3 shadow-lg">
          <HStack className="items-center justify-between">
            {/* Left side icons */}
            <HStack className="items-center gap-3">
              <Pressable onPress={() => {setIsOpen(true)}}>
                <Icon as={MoreVertical} size={20} className="text-gray-800" />
              </Pressable>

            </HStack>

            {/* Center: Date information */}
            <HStack className="items-center gap-2 flex-1 justify-center px-2">
              <Text className="text-gray-800 text-base font-medium text-right">
                {hijriDayName} {hijriYear} {hijriMonth} {hijriDay}
              </Text>
              <Text className="text-orange-500 text-base font-medium mx-1">
                -
              </Text>
              <Text className="text-gray-800 text-base font-medium text-right">
                {gregorianYear} {gregorianMonth} {gregorianDay}
              </Text>
            </HStack>

            {/* Right side: Share icon */}
            <Pressable onPress={() => {}}>
              <Icon as={Share2} size={20} className="text-gray-800" />
            </Pressable>
          </HStack>
        </Box>
      </Box>
      
        <ListPrayersInMonth selectedCity={selectedCity} isOpen={isOpen} onClose={() => setIsOpen(false)} />
     
    </>
  );
}
