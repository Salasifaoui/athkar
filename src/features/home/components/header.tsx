import JaweebIcon from "@/components/icons/jaweeb.svg";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import ButtonAction from "@/src/components/ButtonAction";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Info, Radar, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  timingsAtom,
  usePrayerCountdown,
  usePrayers,
  useSelectedCity,
} from "../../prayers/hooks";
import { getCurrentDay } from "../../prayers/hooks/usePrayers";
import RestTimeForNextPrayer from "../../prayers/ui/component/rest-time-for-next-prayer";
import CurrentDay from "./current-day";

// Fake data for dynamic content
const fakeData = {
  backgroundImage:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
};

export default function Header({
  currentDate,
  setIsAboutMeOpen,
}: {
  currentDate: Date;
  setIsAboutMeOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const [data] = useState(fakeData);
  const { selectedCity } = useSelectedCity();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDay, setCurrentDay] = useState<{
    date: string;
    date_hijri: string;
    nameArabic: string;
  } | null>(null);

  usePrayers(selectedCity, currentDate);
  // Use atom directly

  useEffect(() => {
    const fetchCurrentDay = async () => {
      const currentDay = await getCurrentDay(currentDate);
      setCurrentDay(currentDay);
    };
    fetchCurrentDay();
  }, [currentDate]);

  const [timings] = useAtom(timingsAtom);

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const countdown = usePrayerCountdown(isToday ? timings : null);

  return (
    <Box className="relative h-[380px] w-full overflow-hidden rounded-b-3xl">
      {/* Background Image */}
      <Image
        source={{ uri: data.backgroundImage }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
        alt="Header background"
      />

      {/* Content Container */}
      <VStack className="flex-1 p-4  relative z-10 pt-16 gap-2">
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
              onPress={() => {
                router.push("/al-kibla");
              }}
            />
            <ButtonAction
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/20 border-white/30"
              iconAs={Info}
              sizeIcon={20}
              colorIconAs="text-white"
              onPress={() => {
                setIsAboutMeOpen(true);
              }}
            />
            <Button
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/20 border-white/30"
              onPress={() => {
                // Add your action here
              }}
            >
              <JaweebIcon width={25} height={25} fill="white" />
            </Button>
          </HStack>
          <VStack className="justify-end items-end  gap-3">
            {/* Profile user if exist and not online show offline icon */}
            {currentUser !== null ? (
              <Icon as={User} size={20} className="text-white" />
            ) : null}
          </VStack>
        </HStack>
        {countdown && <RestTimeForNextPrayer countdown={countdown} />}

        {/* Bottom Part: Justified to end */}
      </VStack>

      <CurrentDay currentDay={currentDay} />
    </Box>
  );
}
