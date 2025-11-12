import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { ChevronLeft, LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { useAthkar } from "../../hooks/useAthkar";

export default function FavoriteCadre({name}: {name: string}) {
  const router = useRouter();
  const { categoryData } = useAthkar(name);
  const { icon, category, colorLow, colorHigh, array } = categoryData || {};
  return (
    <Pressable className="rounded-2xl p-6 h-40" style={{ backgroundColor: colorHigh }} onPress={() => router.push(`/athkar-details?name=${name}`)}>
      <HStack className="justify-between items-center">
        <Icon as={ChevronLeft} size={24} className="text-white" />
        <VStack className="gap-3 items-end justify-end">
          <Box className="rounded-lg p-3" style={{ backgroundColor: colorLow }}>
            <Icon
              as={icon as unknown as LucideIcon}
              size={24}
              stroke={colorHigh}
            />
          </Box>

          <Text className="text-white text-lg font-bold">{category}</Text>
          <Text className="text-white text-sm font-normal">{array?.length} أذكار</Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
