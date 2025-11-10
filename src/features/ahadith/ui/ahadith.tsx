import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ZixActionSheet from "@/src/components/ZixActionSheet";
import { useAhadith } from "@/src/features/ahadith/hooks/useAhadith";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Share2,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

// Helper function to strip HTML tags and convert to plain text
const stripHtmlTags = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Helper function to format explanation text with basic line breaks
const formatExplanation = (html: string): string => {
  let text = stripHtmlTags(html);
  // Add line breaks after numbered items
  text = text.replace(/(\d+\.\s)/g, "\n$1");
  // Add line breaks after colons followed by text
  text = text.replace(/:\s*([^\n])/g, ":\n$1");
  return text.trim();
};

export default function Ahadith() {
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const {
    currentHadith,
    currentHadithIndex,
    totalHadith,
    navigateHadith,
    changeHadith,
  } = useAhadith(1);

  const shareHadith = () => {
    // Share functionality would go here
    console.log("Share Hadith");
  };

  if (!currentHadith) {
    return null;
  }

  return (
    <VStack className="flex-1 px-4 pb-4 mt-4">
      <Card className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <VStack className="gap-6">
          {/* Top Section */}
          <HStack className="items-center justify-between">
            {/* Navigation Buttons */}
            <HStack className="items-center gap-2">
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
                  as={ChevronLeft}
                  size={20}
                  className="text-blue-500"
                />
              </Pressable>
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
                من الأربعين النووية
              </Text>
            </Pressable>
          </HStack>

          {/* Central Content Section */}
          <VStack className="gap-4">
            {/* Title */}
            <Text 
              className="text-gray-900 text-lg font-bold text-right"
              numberOfLines={2}
            >
              {currentHadith.title}
            </Text>

            {/* Hadith Text - Clickable */}
            <Pressable onPress={() => setIsDetailSheetOpen(true)}>
              <Text 
                className="text-gray-700 text-base leading-7 text-right"
                numberOfLines={3}
              >
                {currentHadith.text}
              </Text>
            </Pressable>

            {/* Reference */}
            <Text 
              className="text-gray-500 text-sm text-right"
              numberOfLines={1}
            >
              {currentHadith.reference}
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
              {currentHadithIndex} / {totalHadith}
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

      {/* Detail Action Sheet */}
      <ZixActionSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        title={currentHadith.title}
        subtitle={currentHadith.reference}
        customHeader={
          <Pressable
              onPress={shareHadith}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            >
              <Icon as={Share2} size={20} className="text-blue-500" />
            </Pressable>
        }
      >
        <ScrollView className="h-156 p-5">
        <VStack className="gap-4 pb-4">
          <VStack className="gap-3">
            <Text className="text-gray-900 text-lg font-semibold text-right">
              نص الحديث:
            </Text>
            <Text className="text-gray-700 text-base leading-7 text-right">
              {currentHadith.text}
            </Text>
          </VStack>

          <VStack className="gap-3">
            
            <Text className="text-gray-900 text-lg font-semibold text-right">
              الشرح:
            </Text>
            <Text className="text-gray-700 text-base leading-6 text-right">
              {formatExplanation(currentHadith.explanation)}
            </Text>
            
          </VStack>
        </VStack>
        </ScrollView>
      </ZixActionSheet>
    </VStack>
  );
}