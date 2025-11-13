import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { RefreshCw, Volume2 } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { getAudioSource } from "../../../services/audioServices";
import { useAthkar } from "../hooks/useAthkar";
import LecteurAudio from "./component/lecteur-audio";

// Circular Progress Component
function CircularProgress({ progress, size = 50, strokeWidth = 5 }: { progress: number; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const center = size / 2;
    
    // Color based on progress
    const getColor = () => {
        if (progress >= 100) return '#10b981'; // green
        if (progress >= 75) return '#3b82f6'; // blue
        if (progress >= 50) return '#f59e0b'; // yellow
        if (progress >= 25) return '#ef4444'; // red
        return '#9ca3af'; // gray
    };
    
    const color = getColor();
    
    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                {/* Background circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle - rotated to start from top */}
                <G rotation={-90} originX={center} originY={center}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <Text className="text-xs font-semibold" style={{ color: color, fontSize: 10 }}>
                {Math.round(progress)}%
            </Text>
        </View>
    );
}

// Item component with state
function AthkarItemCard({ item, categoryId }: { item: any; categoryId: string }) {
    const [currentCount, setCurrentCount] = useState(0);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [audioPlayKey, setAudioPlayKey] = useState(0);
    
    const targetCount = item.count || 1;
    const progress = targetCount > 0 ? Math.min((currentCount / targetCount) * 100, 100) : 0;
    
    const handleIncrement = () => {
        setCurrentCount((prev) => {
            const newCount = Math.min(prev + 1, targetCount);
            // If audio is enabled, trigger audio playback by updating key
            if (isAudioEnabled && newCount <= targetCount) {
                setAudioPlayKey((prev) => prev + 1);
            }
            return newCount;
        });
    };
    
    const handleReset = () => {
        setCurrentCount(0);
        setAudioPlayKey(0);
    };
    
    const handleToggleAudio = () => {
        setIsAudioEnabled((prev) => !prev);
    };
    
    const audioSource = getAudioSource(item.audio, categoryId, item.filename);
    
    return (
        <Card
            className="bg-gray-100 rounded-xl p-4"
        >
            <HStack id="header" className="items-center justify-between mb-2">
                <HStack className="items-center gap-3">
                    {/* Circular Progress */}
                    <Pressable onPress={handleIncrement}>
                        <CircularProgress progress={progress} size={50} strokeWidth={5} />
                    </Pressable>
                    
                    {/* Reset Button */}
                    <Pressable
                        onPress={handleReset}
                        className="w-8 h-8 items-center justify-center rounded-full bg-gray-200"
                    >
                        <Icon as={RefreshCw} size={18} className="text-gray-600" />
                    </Pressable>
                </HStack>
                
                {/* Audio Switch */}
                <Pressable
                    onPress={handleToggleAudio}
                    className="flex-row items-center gap-2"
                >
                    <Icon 
                        as={Volume2} 
                        size={20} 
                        className={isAudioEnabled ? "text-blue-500" : "text-gray-400"} 
                    />
                    <Box
                        className={`w-12 h-6 rounded-full ${isAudioEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        <Box
                            className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                                isAudioEnabled ? "ml-6" : "ml-0.5"
                            }`}
                        />
                    </Box>
                </Pressable>
            </HStack>
            
            {/* Hidden audio player - only active when switch is on */}
            {isAudioEnabled && audioSource && audioPlayKey > 0 && (
                <View style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}>
                    <LecteurAudio
                        key={`${item.id}-${audioPlayKey}`}
                        audioSource={audioSource}
                        count={targetCount}
                        autoPlay={true}
                        onComplete={() => {
                            // Audio completed
                        }}
                    />
                </View>
            )}
            
            <VStack className="gap-2">
                <Pressable onPress={handleIncrement}>
                    <Text className="text-base text-gray-700 text-right leading-6">
                        {item.text}
                    </Text>
                </Pressable>
                {item.count > 1 && (
                    <Text className="text-sm text-gray-500 text-right mt-1">
                        {currentCount} / {item.count} مرات
                    </Text>
                )}
            </VStack>
        </Card>
    );
}

export default function ListAthkar({category}: {category: string}) {
    const { items, categoryData } = useAthkar(category);
    // Get category ID from categoryData
    const categoryId = categoryData?.id?.toString() || '1';

    return (
        <ScrollView style={{ height: 684 }} showsVerticalScrollIndicator={false}>
            <VStack className="gap-3 px-4 pb-4 pt-2">
                {items.map((item) => (
                    <AthkarItemCard 
                        key={item.id} 
                        item={item} 
                        categoryId={categoryId}
                    />
                ))}
            </VStack>
        </ScrollView>
    )
}