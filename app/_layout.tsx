import { AuthProvider } from "@/src/providers/AuthProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

import { useColorScheme } from "@/src/hooks/useColorSchema";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { hasAnyPrayerTimesInDB, useSetupDatabase } from "@/src/features/prayers/db/start";
import { InitialSyncProvider, SelectedCityProvider, useInitialSync, useSelectedCity } from "@/src/features/prayers/hooks";
import { prayerService } from "@/src/features/prayers/services/prayerService";
import * as Network from 'expo-network';
import { useEffect, useRef } from "react";


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

function NetworkSyncHandler() {
  const { selectedCity } = useSelectedCity();
  const { setInitialSyncLoading } = useInitialSync();
  const hasCheckedRef = useRef(false);
;

  useEffect(() => {
    // Only check network connection once when app opens
    if (hasCheckedRef.current || !selectedCity) {
      return;
    }

    const checkAndSync = async () => {
      hasCheckedRef.current = true;
      
      try {
        // Check if database already has data
        const hasData = await hasAnyPrayerTimesInDB();
        if (hasData) {
          // Database has data, no need to fetch
          return;
        }

        // Check network connection
        const state = await Network.getNetworkStateAsync();
        const isConnected = (state.isConnected ?? false) && (state.isInternetReachable ?? false);
        
        if (isConnected && selectedCity) {
          setInitialSyncLoading(true);
          // Fetch 7 days of prayer times from API
          await prayerService.preloadSevenDays(selectedCity);
          console.log('✅ Preloaded seven days of prayer times');
        }
      } catch (error) {
        console.error('❌ Error syncing database:', error);
      } finally {
        setInitialSyncLoading(false);
      }
    };

    checkAndSync();
  }, [selectedCity, setInitialSyncLoading]);

  return null;
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  
  // Initialize database
  useSetupDatabase();

  return (
    <AuthProvider>
      <GluestackUIProvider mode={isDarkColorScheme ? "dark" : "light"}>
        <SelectedCityProvider>
          <InitialSyncProvider>
            <NetworkSyncHandler />
            <StackLayout />
          </InitialSyncProvider>
        </SelectedCityProvider>
       
        <StatusBar
          key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
          style={isDarkColorScheme ? "light" : "dark"}
        />
      </GluestackUIProvider>
    </AuthProvider>
  );
}
