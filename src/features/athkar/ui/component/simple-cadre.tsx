import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { useAthkar } from "../../hooks/useAthkar";

// Color mapping for Tailwind classes
const colorClasses = {
  blue: {
    border: "border-blue-300",
    bg: "bg-blue-200",
    text: "text-blue-700",
  },
  red: {
    border: "border-red-300",
    bg: "bg-red-200",
    text: "text-red-700",
  },
  yellow: {
    border: "border-yellow-300",
    bg: "bg-yellow-200",
    text: "text-yellow-700",
  },
  green: {
    border: "border-green-300",
    bg: "bg-green-200",
    text: "text-green-700",
  },
} as const;

export default function SimpleCadre({ name }: { name: string }) {
  const router = useRouter();
  const { categoryData } = useAthkar(name);
  const { icon, category, color, array } = categoryData || {};
  
  // Get color classes with fallback to blue
  const colorClass = color && color in colorClasses 
    ? colorClasses[color as keyof typeof colorClasses]
    : colorClasses.blue;

  return (
    <Pressable
      className={`gap-2 bg-transparent rounded-2xl p-6 h-40 w-1/2 border-2 items-end justify-start ${colorClass.border}`}
      onPress={() => router.push(`/athkar-details?name=${name}`)}
    >
      <Box
        className={`rounded-2xl p-2 w-10 h-10 items-center justify-center ${colorClass.bg}`}
      >
        <Icon
          as={icon as unknown as LucideIcon}
          size={24}
          className={colorClass.text}
        />
      </Box>
      <Text className="text-black text-md font-bold line-clamp-2 text-right">
        {category}
      </Text>
      <Text className="text-gray-500 text-sm font-normal">
        {array?.length} أذكار
      </Text>
    </Pressable>
  );
}
