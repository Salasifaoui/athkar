import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ButtonAction from "@/src/components/ButtonAction";
import { Book, Info, Radar } from "lucide-react-native";
import { useState } from "react";
import { usePrayers, useSelectedCity } from "../../prayers/hooks";

// Fake data for dynamic content
const fakeData = {
  backgroundImage:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  date: {
    day: "15",
    month: "نوفمبر",
    hejriDate: "17 جمادى الثانية ",
    hejriYear: "1444",
    year: "2025",
  },
  content: {
    title: "السلام عليكم ورحمة الله وبركاته",
    text: "The best time to plant a tree was 20 years ago",
    source: "Chinese Proverb",
  },
};

export default function Header() {
  const [data] = useState(fakeData);
  const { selectedCity } = useSelectedCity();
  const { currentDay } = usePrayers(selectedCity, new Date());
  return (
    <Box className="relative h-[360px] w-full overflow-hidden rounded-b-3xl">
      {/* Background Image */}
      <Image
        source={{ uri: data.backgroundImage }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
        alt="Header background"
      />

      {/* Overlay for better text readability */}
      <Box className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <VStack className="flex-1 p-4 justify-between relative z-10 pt-16 gap-4">
        {/* Top Part */}
        <HStack className="justify-between items-start w-full">
          {/* Left: Two buttons */}
          <HStack className="gap-2">
            <ButtonAction
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/20 border-white/30"
              iconAs={Radar}
              sizeIcon={20}
              colorIconAs="text-white"
              onPress={() => {}}
            />
            <ButtonAction
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/20 border-white/30"
              iconAs={Info}
              sizeIcon={20}
              colorIconAs="text-white"
              onPress={() => {}}
            />
          </HStack>

          {/* Right: Date boxes (day, month, year) */}
          <VStack className="gap-2">
            <HStack className="gap-2">
              <VStack className="gap-2">
                <Text className="text-white text-lg font-bold text-right">
                  {data.date.month}
                </Text>

                <Box className="justify-center items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                  <Text className="text-white text-lg font-bold">
                    {currentDay?.hijri.day} {currentDay?.hijri.month.ar}
                  </Text>
                </Box>
              </VStack>
              <Box className="justify-center items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                <Text className="text-white text-lg font-bold">
                  {data.date.day}
                </Text>
              </Box>
            </HStack>

            <HStack className="gap-2 justify-end items-end">
              <Text className="text-white text-lg font-bold">
                {currentDay?.hijri.year}
              </Text>
              <Text className="text-white text-lg font-bold">/</Text>

              <Text className="text-white text-lg font-bold">
                {data.date.year}
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Bottom Part: Justified to end */}
        <VStack className="justify-end items-end w-full gap-3">
          <Heading size="2xl" className="text-white">
            {data.content.title}
          </Heading>

          <Box className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/30 max-w-[250px]">
            <Text className="text-white text-sm">{data.content.text}</Text>
          </Box>
          <HStack className="justify-center items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/30 max-w-[250px] gap-2">
            <Icon as={Book} size={20} className="stroke-white" />
            <Text className="text-white text-sm italic">
              {data.content.source}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
