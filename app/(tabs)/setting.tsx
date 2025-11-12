import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";

export default function SettingsTab() {
  return (
    <ScreenLayout>
      <NavBar>
        <Text size="lg" bold>الإعدادات</Text>
      </NavBar>
    </ScreenLayout>
  );
}