import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Settings, WifiOff } from "lucide-react-native";
import { Linking } from "react-native";

interface NetworkErrorProps {
  onRetry?: () => void;
}

export default function NetworkError({ onRetry }: NetworkErrorProps) {
  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <Box className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg m-4">
      <VStack className="items-center justify-center gap-4">
        <Icon as={WifiOff} size={48} className="text-white/80" />
        
        <VStack className="items-center gap-2">
          <Text className="text-white text-xl font-bold text-center">
            لا يوجد اتصال بالإنترنت
          </Text>
          <Text className="text-white/80 text-base text-center px-4">
            يرجى التحقق من إعدادات الشبكة وفتح WiFi أو البيانات الخلوية
          </Text>
        </VStack>

        <HStack className="gap-3 mt-2">
          <Button
            onPress={openSettings}
            className="bg-primary-500 px-6 py-3 rounded-lg"
          >
            <HStack className="items-center gap-2">
              <Icon as={Settings} size={20} className="text-white" />
              <Text className="text-white font-semibold">فتح الإعدادات</Text>
            </HStack>
          </Button>
          
          {onRetry && (
            <Button
              onPress={onRetry}
              className="bg-primary-400 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">إعادة المحاولة</Text>
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}

