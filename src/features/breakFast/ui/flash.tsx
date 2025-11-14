import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import {
    AudioLines,
    BookOpen,
    Moon
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import BreakFast from "./break-fast";

export default function Flash() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const hasInitialized = useRef(false);
  const listBreakFast = [
    {
      title: "لا تنسى تشغيل نظام الاستماع",
      subtitle:
        "لا تنسى تشغيل نظام الاستماع لتسمع القراءات القرآنية والأذكار أثناء السياقة.",
      icon: AudioLines,
      color: "red",
    },
    {
      title: "أذكار الصباح والمساء",
      subtitle: "ابدأ يومك بأذكار الصباح والمساء",
      color: "blue",
      componentButton: (
        <Pressable
          className="flex-row items-center gap-2 p-2 rounded-2xl bg-blue-500"
          onPress={() => router.push("/athkar-details?name=أذكار الصباح والمساء")}
        >
          <Icon as={BookOpen} size={24} className="text-white" />
          <Text className="text-white text-lg font-bold">ابدأ الان</Text>
        </Pressable>
      ),
    },
    {
      title: "أذكار النوم",
      subtitle: "أذكار النوم لتنمية الصحة والروحية",
      color: "green",
      componentButton: (
        <Pressable
          className="flex-row items-center gap-2 p-2 rounded-2xl bg-green-500"
          onPress={() => router.push("/athkar-details?name=أذكار النوم")}
        >
          <Icon as={Moon} size={24} className="text-white" />
          <Text className="text-white text-lg font-bold">ابدأ الان</Text>
        </Pressable>
      ),
    },
    {
      title: "التسبيح",
      subtitle: "التسبيح لتنمية الصحة والروحية بشكل مستمر",
      color: "yellow",
      componentButton: (
        <Pressable
          className="p-2 rounded-2xl bg-yellow-500"
          onPress={() => router.push("/athkar-details?name=التسبيح")}
        >
          <Text className="text-white text-lg font-bold">ابدأ الان</Text>
        </Pressable>
      ),
    },
  ];

  // Animation effect: show first item immediately, then cycle through items every 5 seconds
  useEffect(() => {
    // Show first item immediately on mount
    if (!hasInitialized.current && listBreakFast.length > 0) {
      hasInitialized.current = true;
      setCurrentIndex(0);
    }
  }, [listBreakFast.length]);

  useEffect(() => {
    // Cycle through items every 5 seconds (breaking news style)
    if (hasInitialized.current && listBreakFast.length > 0) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % listBreakFast.length);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, listBreakFast.length]);
  return (
    <VStack className="gap-4 p-4">
      {listBreakFast.length > 0 && currentIndex < listBreakFast.length && (
        <Animated.View
          key={currentIndex}
          entering={SlideInRight.duration(600)}
          exiting={SlideOutLeft.duration(400)}
        >
          <HStack className="items-center justify-center">
            <BreakFast
              color={listBreakFast[currentIndex].color}
              title={listBreakFast[currentIndex].title}
              subtitle={listBreakFast[currentIndex].subtitle}
              icon={listBreakFast[currentIndex].icon}
              componentButton={listBreakFast[currentIndex].componentButton}
            />
          </HStack>
        </Animated.View>
      )}
    </VStack>
  );
}
