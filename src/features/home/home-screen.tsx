import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import Header from "./components/header";

export default function HomeScreen() {
  const router = useRouter();




  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <Header />
    <ScreenLayout>
      
        

      
    </ScreenLayout>
    </ScrollView>
  );
}
