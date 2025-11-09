import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
    Book,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Share2,
} from "lucide-react-native";
import { useState } from "react";

export default function Ahadith() {
  const [currentHadithIndex, setCurrentHadithIndex] = useState(41);
  const totalHadith = 42;

  // Sample Hadith data
  const hadithData = {
    title: "من الأربعين النووية • الحديث الحادي والأربعون",
    text: "عن أبي محمد عبد الله بن عمرو بن العاص رضي الله عنهما قال : قال رسول الله ﷺ : \"لا يؤمن أحدكم حتى يكون هواه تبعاً لما جئت به.\" (حديث حسن صحي...",
    source: "من الأربعين النووية",
  };

  const navigateHadith = (direction: "prev" | "next") => {
    if (direction === "prev" && currentHadithIndex > 1) {
      setCurrentHadithIndex(currentHadithIndex - 1);
    } else if (direction === "next" && currentHadithIndex < totalHadith) {
      setCurrentHadithIndex(currentHadithIndex + 1);
    }
  };

  const changeHadith = () => {
    // Randomly select a new Hadith (1 to totalHadith)
    const randomIndex = Math.floor(Math.random() * totalHadith) + 1;
    setCurrentHadithIndex(randomIndex);
  };

  const shareHadith = () => {
    // Share functionality would go here
    console.log("Share Hadith");
  };

  return (
    <VStack className="px-4 pb-4 mt-4">
      <Card className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <VStack className="gap-6">
          {/* Top Section */}
          <HStack className="items-center justify-between">
            {/* Navigation Buttons */}
            <HStack className="items-center gap-2">
              <Pressable
                onPress={() => navigateHadith("prev")}
                disabled={currentHadithIndex === 1}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentHadithIndex === 1
                    ? "bg-gray-100 opacity-50"
                    : "bg-gray-100"
                }`}
              >
                <Icon
                  as={ChevronLeft}
                  size={20}
                  className="text-blue-500"
                />
              </Pressable>
              <Pressable
                onPress={() => navigateHadith("next")}
                disabled={currentHadithIndex === totalHadith}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentHadithIndex === totalHadith
                    ? "bg-gray-100 opacity-50"
                    : "bg-gray-100"
                }`}
              >
                <Icon
                  as={ChevronRight}
                  size={20}
                  className="text-blue-500"
                />
              </Pressable>
            </HStack>

            {/* Book Button */}
            <Pressable className="flex-row items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <Icon as={Book} size={18} className="text-blue-500" />
              <Text className="text-blue-500 text-sm font-medium">
                {hadithData.source}
              </Text>
            </Pressable>
          </HStack>

          {/* Central Content Section */}
          <VStack className="gap-4">
            {/* Title */}
            <Text className="text-gray-900 text-xl font-bold text-right">
              {hadithData.title}
            </Text>

            {/* Hadith Text */}
            <Text className="text-gray-700 text-base leading-7 text-right">
              {hadithData.text}
            </Text>
          </VStack>

          {/* Bottom Section */}
          <HStack className="items-center justify-between">
            {/* Share Button */}
            <Pressable
              onPress={shareHadith}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            >
              <Icon as={Share2} size={20} className="text-blue-500" />
            </Pressable>

            {/* Counter */}
            <Text className="text-gray-600 text-base font-medium">
              {totalHadith} / {currentHadithIndex}
            </Text>

            {/* Change Hadith Button */}
            <Pressable
              onPress={changeHadith}
              className="flex-row items-center gap-2 bg-blue-50 px-4 py-2 rounded-full"
            >
              <Icon as={RefreshCw} size={18} className="text-blue-500" />
              <Text className="text-blue-500 text-sm font-medium">
                تغيير الحديث
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </Card>
    </VStack>
  );
}