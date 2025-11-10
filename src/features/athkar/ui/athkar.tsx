import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import ZixActionSheet from "@/src/components/ZixActionSheet";
import { BookOpen } from "lucide-react-native";
import { useState } from "react";
import ListAthkar from "./list-athkar";


export default function Athkar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <Pressable onPress={() => setIsOpen(!isOpen)}>
            <HStack className="items-center justify-between">
                <Box className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Icon as={BookOpen} size={24} className="text-primary-600" />
                </Box>
                <Text className="text-gray-800 text-base font-medium flex-1 text-right">
                    أذكار الصباح والمساء
                </Text>
            </HStack>
        </Pressable>
        <ZixActionSheet
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="أذكار الصباح والمساء"
        >
            
            <ListAthkar />
        </ZixActionSheet>
        </>
    )
}