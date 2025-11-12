import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Star } from "lucide-react-native";
import { ScrollView } from "react-native";
import Ahadith from "../ahadith/ui/ahadith";
import Athkar from "../athkar/ui/athkar";
import Names from "../names/ui/names";
import Prayers from "../prayers/ui/prayers";
import Header from "./components/header";

export default function HomeScreen() {
  const colors = {
    primary: "#4A90E2",
    secondary: "#F5A623",
    tertiary: "#50C878",
    quaternary: "#E74C3C",
    quinary: "#9B59B6",
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header />
      <ScreenLayout>
        <VStack className="gap-4 pt-4">
          <Prayers />
          <Ahadith />
          <VStack className="gap-4 mb-4">
            <HStack className="gap-4 items-center p-4">
              <Text className="text-primary-800 text-base font-medium flex-1 text-right">
                مقتطفات اسلامية
              </Text>
              <Icon
                as={Star}
                size={24}
                className="text-primary-600"
                fill="currentColor"
              />
            </HStack>
            <HStack className="gap-4">
              <Box className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <Athkar category="أذكار الصباح والمساء" color={colors.primary} />
              </Box>
              <Box className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <Names/>
              </Box>
            </HStack>
            <HStack className="gap-4">
              <Box className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <Athkar category="أذكار النوم" color={colors.secondary} />
              </Box>
              <Box className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <Athkar category="التسبيح" color={colors.tertiary} />
              </Box>
            </HStack>
          </VStack>
        </VStack>
      </ScreenLayout>
    </ScrollView>
  );
}
