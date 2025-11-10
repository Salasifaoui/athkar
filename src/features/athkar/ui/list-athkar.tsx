import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import { useAthkar } from "../hooks/useAthkar";

export default function ListAthkar({category}: {category: string}) {
    const { items } = useAthkar(category);

    return (
        <ScrollView style={{ height: 684 }} showsVerticalScrollIndicator={false}>
            <VStack className="gap-3 px-4 pb-4 pt-2">
                {items.map((item) => (
                    <Card
                        key={item.id}
                        className="bg-gray-100 rounded-xl p-4"
                    >
                        <VStack className="gap-2">
                            <Text className="text-base text-gray-700 text-right leading-6">
                                {item.text}
                            </Text>
                            {item.count > 1 && (
                                <Text className="text-sm text-gray-500 text-right mt-1">
                                    {item.count} مرات
                                </Text>
                            )}
                        </VStack>
                    </Card>
                ))}
            </VStack>
        </ScrollView>
    )
}