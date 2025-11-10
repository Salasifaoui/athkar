import { AuthProvider } from "@/src/providers/AuthProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

import { useColorScheme } from "@/src/hooks/useColorSchema";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SelectedCityProvider } from "@/src/features/prayers/hooks";


export const unstable_settings = {
  anchor: "index",
};

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="all-prayers" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <AuthProvider>
      <GluestackUIProvider mode={isDarkColorScheme ? "dark" : "light"}>
        <SelectedCityProvider>
          <StackLayout />
        </SelectedCityProvider>
       
        <StatusBar
          key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
          style={isDarkColorScheme ? "light" : "dark"}
        />
      </GluestackUIProvider>
    </AuthProvider>
  );
}
