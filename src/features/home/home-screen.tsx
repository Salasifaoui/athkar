import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const router = useRouter();




  return (
    <ScreenLayout>
      <NavBar showAboutButton showFeedbackButton>
        {/* <WalletButton /> */}
      </NavBar>
      <ScrollView showsVerticalScrollIndicator={false}>

      </ScrollView>
    </ScreenLayout>
  );
}
