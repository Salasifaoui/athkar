import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import Ahadith from "../ahadith/ui/ahadith";
import Athkar from "../athkar/ui/athkar";
import Names from "../names/ui/names";
import Prayers from "../prayers/ui/prayers";
import Header from "./components/header";

export default function HomeScreen() {




  return (
    <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
    <Header />
    <ScreenLayout >
      <VStack className="gap-4 pt-4">
        <Prayers />
        <Ahadith />
        <VStack className="gap-4">
          <HStack className="gap-4">
            <Box className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <Athkar />
            </Box>
            <Box className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <Names />
            </Box>
          </HStack>
        </VStack>
      </VStack>
      


      
    </ScreenLayout>
    </ScrollView>
  );
}
