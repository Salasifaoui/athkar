import { Box } from "@/components/ui/box";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ButtonAction from "@/src/components/ButtonAction";
import { useRouter } from "expo-router";
import { Globe, Languages } from "lucide-react-native";
import { useState } from "react";

export default function Language() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    // Auto-navigate to location screen immediately after selection
    router.push("/(onboarding)/location");
  };

  return (
    <ScreenLayout>
      <Box className="flex-1 bg-white">
        <VStack className="flex-1 justify-center px-6 gap-6">
          <VStack className="items-center gap-2 mb-8">
            <Text className="text-2xl font-bold text-gray-900">
              Select Language
            </Text>
            <Text className="text-base text-gray-600 text-center">
              اختر اللغة
            </Text>
          </VStack>

          <VStack className="gap-4 w-full items-center">
            <ButtonAction
              variant="outline"
              text="English"
              iconAs={Globe}
              onPress={() => handleLanguageSelect("english")}
            />
            <ButtonAction
              variant="outline"
              text="Arabic"
              iconAs={Languages}
              onPress={() => handleLanguageSelect("arabic")}
            />
          </VStack>
        </VStack>
      </Box>
    </ScreenLayout>
  );
}
