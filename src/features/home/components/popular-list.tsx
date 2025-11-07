import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGames } from "@/src/features/games/hooks/useGames";
import { Game } from "@/src/types/game";
import { useRouter } from "expo-router";
import { Diamond } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, ScrollView } from "react-native";

interface PopularItemUI {
  id: string;
  name: string;
  numberUser: number;
  nbre_online: number;
  backgroundColor?: string;
  imageUrl?: string;
}

function PopularItemCard({ item }: { item: PopularItemUI }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(games)/game-details",
      params: {
        id: item.id,
        name: item.name,
        backgroundColor: item.backgroundColor || "#D1FAE5",
        numberUser: String(item.numberUser),
        nbre_online: String(item.nbre_online),
      },
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <Box
        className="rounded-2xl p-4 mx-2"
        style={{ backgroundColor: item.backgroundColor || "#D1FAE5", width: 200 }}
      >
        <VStack space="md">
          {/* Illustration placeholder */}
          <Box className="w-full h-32 bg-white/50 rounded-xl items-center justify-center mb-2">
          {item.imageUrl ?
            <Image source={{ uri: item.imageUrl }} size="2xl" className="w-full h-full rounded-xl" />
            : <Text className="text-gray-400 text-xs">Image</Text>}
          </Box>

          {/* Name */}
          <Text className="text-base font-semibold text-gray-900">
            {item.name}
          </Text>

          {/* Number users and Online */}
          <HStack className="justify-between items-center">
            <Text className="text-sm text-gray-500">{item.numberUser} users</Text>

            {/* Online pill */}
            <Box
              className="flex-row items-center px-3 py-1 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            >
              <Icon
                as={Diamond}
                size={12}
                className="text-white mr-1"
              />
              <Text className="text-white text-sm font-medium">
                {item.nbre_online}
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}

export default function PopularList() {
  const { games } = useGames({ refreshIntervalMs: 15000 });
  const popularData: PopularItemUI[] = useMemo(() => {
    return (games as Game[]).map((g) => ({
      id: g.id,
      name: g.name,
      numberUser: g.numberUser,
      nbre_online: g.nbre_online,
      backgroundColor: g.bgcolor,
      imageUrl: g.imageUrl,
    }));
  }, [games]);

  return (
    <Box className="mt-6">
      {/* Header */}
      <HStack className="justify-between items-center px-5 mb-4">
        <Text className="text-2xl font-bold text-gray-900">
          Popular Now
        </Text>
        <Pressable>
          <Text className="text-sm text-gray-500">View all</Text>
        </Pressable>
      </HStack>

      {/* Horizontal Scrollable List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {popularData.map((item) => (
          <PopularItemCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </Box>
  );
}