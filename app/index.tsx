import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Screen() {
  const router = useRouter();

  useEffect(() => {
    // Defer navigation to ensure the router is ready
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box className="flex-1 items-center justify-center">
      <Spinner color="primary" size="large" />
    </Box>
  );
}