import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Copy, LucideIcon, Share2 } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Share } from "react-native";
import { useAthkar } from "../hooks/useAthkar";

export default function AthkarDetails() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const router = useRouter();
    const { categoryData } = useAthkar(name as string);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [count, setCount] = useState(0);
    const [autoTransition, setAutoTransition] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentAthkar = categoryData?.array[currentIndex];
    const totalItems = categoryData?.array.length || 0;
    const progress = totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0;
    const colorClasses = {
        blue: {
          dark: "bg-blue-500",
          light: "bg-blue-100",
        },
        red: {
          dark: "bg-red-500",
          light: "bg-red-100",
        },
        yellow: {
          dark: "bg-yellow-500",
          light: "bg-yellow-100",
        },
        green: {
          dark: "bg-green-500",
          light: "bg-green-100",
        },
      } as const;

    const colorClass = categoryData?.color && categoryData?.color in colorClasses ? colorClasses[categoryData?.color as keyof typeof colorClasses] : colorClasses.blue;

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => {
            if (prev < totalItems - 1) {
                return prev + 1;
            }
            return prev;
        });
    }, [totalItems]);

    // Handle automatic transition
    useEffect(() => {
        if (autoTransition && currentAthkar) {
            // Clear any existing interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // Set up new interval based on the count required for current athkar
            const requiredCount = currentAthkar.count || 1;
            const intervalTime = 3000; // 3 seconds per count

            intervalRef.current = setInterval(() => {
                setCount((prev) => {
                    const newCount = prev + 1;
                    if (newCount >= requiredCount) {
                        // Move to next athkar
                        handleNext();
                        return 0; // Reset count for next athkar
                    }
                    return newCount;
                });
            }, intervalTime);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        } else {
            // Clear interval when auto transition is disabled
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [autoTransition, currentIndex, currentAthkar, handleNext]);

    // Reset count when current index changes
    useEffect(() => {
        setCount(0);
    }, [currentIndex]);

    const handleCountIncrement = () => {
        if (currentAthkar) {
            const requiredCount = currentAthkar.count || 1;
            if (count < requiredCount - 1) {
                setCount((prev) => prev + 1);
            } else {
                // Automatically move to next when count is reached
                handleNext();
            }
        }
    };

    const handleCopy = async () => {
        if (currentAthkar?.text) {
            try {
                await Clipboard.setStringAsync(currentAthkar.text);
                Alert.alert("تم النسخ", "تم نسخ الذكر إلى الحافظة");
            } catch {
                Alert.alert("خطأ", "فشل نسخ النص");
            }
        }
    };

    const handleShare = async () => {
        if (currentAthkar?.text) {
            try {
                await Share.share({
                    message: currentAthkar.text,
                });
            } catch {
                Alert.alert("خطأ", "فشل مشاركة النص");
            }
        }
    };

    if (!categoryData || !currentAthkar) {
        return (
            <ScreenLayout>
                <VStack className="flex-1 items-center justify-center">
                    <Text>لا توجد بيانات</Text>
                </VStack>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout className={`${colorClass.light} p-0`}>
            {/* Header with Progress */}
            <Box className={`${colorClass.dark} px-4 pt-16 pb-6 `}>
                <VStack className="gap-4">
                    <HStack className="items-center justify-between">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Icon as={ArrowLeft} size={24} className="text-white" />
                        </Pressable>
                        <HStack className="items-center gap-2 flex-1 justify-center">
                        <Text className="text-white text-xl font-bold text-center">
                                {categoryData.category}
                            </Text>
                            <Icon as={categoryData.icon as unknown as LucideIcon} size={24} className="text-white" />
                            
                        </HStack>
                        <Box className="w-10" />
                    </HStack>

                    {/* Progress Bar */}
                    <VStack className="gap-2">
                        <HStack className="items-center justify-between">
                            <Pressable
                                onPress={() => setAutoTransition(!autoTransition)}
                                className="flex-row items-center gap-2"
                            >
                                <Text className="text-white text-sm">
                                    الانتقال التلقائي
                                </Text>
                                <Box
                                    className={`w-12 h-6 rounded-full ${
                                        "bg-white/30"
                                    }`}
                                >
                                    <Box
                                        className={`w-5 h-5 rounded-full ${autoTransition ? colorClass.dark : colorClass.light} mt-0.5 ${
                                            autoTransition ? "ml-6" : "ml-0.5"
                                        }`}
                                    />
                                </Box>
                            </Pressable>
                            <Text className="text-white text-sm font-semibold">
                                {currentIndex + 1}/{totalItems}
                            </Text>
                        </HStack>
                        <Box className="h-2 bg-white/30 rounded-full overflow-hidden">
                            <Box
                                className="h-full bg-white rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </Box>
                    </VStack>
                </VStack>
            </Box>

            {/* Main Content */}
            <VStack className="flex-1 px-4 py-6">
                {/* Athkar Card */}
                <Card className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <VStack className="flex-1 justify-center">
                        <Text className="text-gray-900 text-lg leading-8 text-right">
                            {currentAthkar.text}
                        </Text>
                    </VStack>
                </Card>

                {/* Bottom Controls */}
                <VStack className="items-center gap-4 mt-6">
                    <HStack className="items-center justify-center gap-6">
                        {/* Share Button */}
                        <Pressable
                            onPress={handleShare}
                            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm border border-gray-200"
                        >
                            <Icon as={Share2} size={20} className={`text-${colorClass.dark}`} />
                        </Pressable>

                        {/* Counter */}
                        <Pressable
                            onPress={handleCountIncrement}
                            className={`w-20 h-20 rounded-full border-2 border-${colorClass.dark} items-center justify-center bg-white`}
                        >
                            <Text className={`text-${colorClass.light} text-2xl font-bold`}>
                                {count}
                            </Text>
                        </Pressable>

                        {/* Copy Button */}
                        <Pressable
                            onPress={handleCopy}
                            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm border border-gray-200"
                        >
                            <Icon as={Copy} size={20} className={`text-${colorClass.dark}`} />
                        </Pressable>
                    </HStack>

                    {/* Continue Button */}
                    <Pressable
                        onPress={handleNext}
                        disabled={currentIndex >= totalItems - 1}
                        className={`px-8 py-3 rounded-full ${
                            currentIndex >= totalItems - 1
                                ? "bg-gray-300"
                                : colorClass.dark
                        }`}
                    >
                        <Text
                            className={`text-base font-semibold ${
                                currentIndex >= totalItems - 1
                                    ? "text-gray-500"
                                    : "text-white"
                            }`}
                        >
                            اضغط للمتابعة
                        </Text>
                    </Pressable>
                </VStack>
            </VStack>
        </ScreenLayout>
    );
}