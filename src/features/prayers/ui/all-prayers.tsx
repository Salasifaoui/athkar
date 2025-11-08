import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { VStack } from "@/components/ui/vstack";
import { ButtonArrowBack } from "@/src/components";
import ButtonAction from "@/src/components/ButtonAction";
import { Settings } from "lucide-react-native";
import { useState } from "react";
import { ImageBackground } from "react-native";
import SettingCard from "./component/setting-card";
// Radio Select Component

export default function AllPrayersScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Placeholder background image - replace with actual image
  const backgroundImage = {
    uri: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
  };

  return (
    <>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        className="flex-1"
      >
        <Box className="absolute inset-0 bg-black/20" />
        <ScreenLayout>
          <NavBar title="مواعيد الصلاة" subtitle="الصلوات اليومية">
            <HStack className="items-center justify-end gap-3">
            <ButtonArrowBack />
            <ButtonAction
              variant="link"
              action="secondary"
              className="w-10 h-10 rounded-2xl border-none justify-center items-center"
              iconAs={Settings}
              colorIconAs="text-primary-500"
              onPress={() => setIsSettingsOpen(true)}
            />
            
            </HStack>
          </NavBar>
          <VStack className="flex-1">{/* Prayer cards will go here */}</VStack>
        </ScreenLayout>
      </ImageBackground>

      {/* Settings ActionSheet */}
      <SettingCard
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
