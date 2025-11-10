import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import { useNames } from "../hooks";

export default function ListNames() {
    const { names } = useNames();
    
    return (
        <ScrollView className="h-96 p-5">
            <VStack className="gap-3 px-4 pb-4 pt-2">
                {names.map((item) => (
                    <Card
                        key={item.id}
                        className="bg-gray-100 rounded-xl p-4"
                    >
                        <VStack className="gap-2">
                        
                            <Text className="text-xl f0nt-bold text-primary-700 text-center">
                                {item.name}
                            </Text>
                            <Text className="text-base text-gray-700 text-right leading-6">
                                {item.text}
                            </Text>
                        </VStack>
                    </Card>
                ))}
            </VStack>
        </ScrollView>
    )
}