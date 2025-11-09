import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import Ahadith from "./components/ahadith";
import Header from "./components/header";
import Prayers from "./components/prayers";

export default function HomeScreen() {
  const router = useRouter();




  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <Header />
    <ScreenLayout >
      <Prayers />
      <Ahadith />
      


      
    </ScreenLayout>
    </ScrollView>
  );
}
