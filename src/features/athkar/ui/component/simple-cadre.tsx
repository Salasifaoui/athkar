import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { useAthkar } from "../../hooks/useAthkar";

export default function SimpleCadre({ name }: { name: string }) {
  const router = useRouter();
  const { categoryData } = useAthkar(name);
  const { icon, category, colorLow, colorHigh, array } = categoryData || {};
  return (
    <Pressable
      className="gap-2 bg-transparent rounded-2xl p-6 h-40 w-1/2 border-2  items-end justify-start"
      style={{ borderColor: colorLow }}
      onPress={() => router.push(`/athkar-details?name=${name}`)}
    >
      <Box className=" rounded-2xl p-2 w-10 h-10 items-center justify-center" style={{ backgroundColor: colorLow }}>
        <Icon as={icon as unknown as LucideIcon} size={24} stroke={colorHigh} />
      </Box>
      <Text className="text-black text-md font-bold line-clamp-2 text-right">{category}</Text>
      <Text className="text-gray-500 text-sm font-normal">
        {array?.length} أذكار
      </Text>
    </Pressable>
  );
}
