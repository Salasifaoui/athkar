import { HStack } from "@/components/ui/hstack";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { ButtonArrowBack } from "@/src/components";
import ButtonAction from "@/src/components/ButtonAction";
import { Settings } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";
import CardPrayer from "./component/cardPrayer";
import ListPrayer from "./component/list-prayer";
import SettingCard from "./component/setting-card";

// Radio Select Component

export default function AllPrayersScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <ScreenLayout className="bg-islamic">
        
          <NavBar title="مواعيد الصلاة" subtitle="الصلوات اليومية">
            <HStack className="items-center justify-end gap-6">
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
          <ScrollView className="flex-1">
            <CardPrayer currentDate={currentDate} onDateChange={setCurrentDate} />
            <ListPrayer currentDate={currentDate} />
          </ScrollView>
        


      {/* Settings ActionSheet */}
      <SettingCard
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </ScreenLayout>
  );
}
