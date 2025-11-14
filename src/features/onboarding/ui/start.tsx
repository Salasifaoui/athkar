import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { useSetupDatabase } from "@/src/features/prayers/db/start";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Start() {
  const router = useRouter();
  
  // Initialize database
  useSetupDatabase();

  useEffect(() => {
    // Navigate to location screen after 1 second
    const timer = setTimeout(() => {
      router.replace("/(onboarding)/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box className="flex-1 bg-white justify-center items-center">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-[200px] h-[200px]"
        resizeMode="contain"
        alt="App Logo"
      />
    </Box>
  );
}