import { Box } from "@/components/ui/box";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ButtonArrowBack } from "@/src/components";
import { getPrayerSettings } from "@/src/features/prayers/services/settingService";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { calculateQiblaDirection } from "../services/qiblaCalculator";

export default function AlKiblaScreen() {
  const [heading, setHeading] = useState(0); // اتجاه الجهاز
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null); // زاوية القبلة
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // 🧭 اشتراك في قراءة البوصلة
    const subscription = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle >= 0 ? angle : angle + 360;
      setHeading(angle);
    });

    // 📍 الحصول على الموقع من جدول prayer_settings
    (async () => {
      try {
        // Get location from prayer_settings table
        const settings = await getPrayerSettings();
        
        if (settings?.location) {
          const city = settings.location;
          let latitude: number;
          let longitude: number;

          // Try to parse coordinates from city ID (format: "lat-lng")
          const idParts = city.id.split('-');
          if (idParts.length >= 2) {
            const parsedLat = parseFloat(idParts[0]);
            const parsedLng = parseFloat(idParts[1]);
            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
              latitude = parsedLat;
              longitude = parsedLng;
            } else {
              // If ID doesn't contain coordinates, use geocoding
              const geocodeResult = await Location.geocodeAsync(
                `${city.name}, ${city.country}`
              );
              if (geocodeResult && geocodeResult.length > 0) {
                latitude = geocodeResult[0].latitude;
                longitude = geocodeResult[0].longitude;
              } else {
                throw new Error("Unable to geocode city");
              }
            }
          } else {
            // Use geocoding to get coordinates from city name and country
            const geocodeResult = await Location.geocodeAsync(
              `${city.name}, ${city.country}`
            );
            if (geocodeResult && geocodeResult.length > 0) {
              latitude = geocodeResult[0].latitude;
              longitude = geocodeResult[0].longitude;
            } else {
              throw new Error("Unable to geocode city");
            }
          }

          // 📐 حساب زاوية القبلة
          const qibla = calculateQiblaDirection(latitude, longitude);
          setQiblaAngle(qibla);
        } else {
          // Fallback: Get location from device GPS if no settings found
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("تم رفض صلاحية الموقع");
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // 📐 حساب زاوية القبلة
          const qibla = calculateQiblaDirection(latitude, longitude);
          setQiblaAngle(qibla);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("حدث خطأ في الحصول على الموقع");
      }
    })();

    return () => subscription.remove();
  }, []);

  // 🔄 حساب الفرق بين اتجاه الهاتف وزاوية القبلة
  const angleDiff = qiblaAngle !== null ? qiblaAngle - heading : 0;

  return (
    <ScreenLayout>
      <NavBar title="القبلة" subtitle="معرفة الاتجاه المطلوب للقبلة">
        <ButtonArrowBack />
      </NavBar>
      <VStack className="flex-1 justify-center items-center px-4">
        <Text className="text-2xl font-bold mb-5 text-center">🕋 اتجاه القبلة</Text>
        {errorMsg ? (
          <Text className="text-red-500 text-center">{errorMsg}</Text>
        ) : (
          <>
            {/* Compass Container */}
            <Box className="w-[250px] h-[250px] justify-center items-center relative">
              {/* Compass Circle */}
              <Box
                className="w-[250px] h-[250px] rounded-full border-4 border-gray-300 bg-white shadow-lg"
                style={{
                  transform: [{ rotate: `${-heading}deg` }],
                }}
              >
                {/* Compass Markings - North (Red) */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 125 - 2,
                    width: 4,
                    height: 16,
                    backgroundColor: '#ef4444',
                    borderRadius: 2,
                  }}
                />
                {/* Compass Markings - South (Blue) */}
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 125 - 2,
                    width: 4,
                    height: 16,
                    backgroundColor: '#3b82f6',
                    borderRadius: 2,
                  }}
                />
                {/* Compass Markings - West */}
                <Box
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: 125 - 2,
                    width: 16,
                    height: 4,
                    backgroundColor: '#6b7280',
                    borderRadius: 2,
                  }}
                />
                {/* Compass Markings - East */}
                <Box
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 125 - 2,
                    width: 16,
                    height: 4,
                    backgroundColor: '#6b7280',
                    borderRadius: 2,
                  }}
                />
                
                {/* Center dot */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 125 - 6,
                    left: 125 - 6,
                    width: 12,
                    height: 12,
                    backgroundColor: '#1f2937',
                    borderRadius: 6,
                  }}
                />
              </Box>

              {/* Qibla Arrow - positioned absolutely to rotate independently */}
              <Box
                className="absolute justify-center items-center"
                style={{
                  transform: [{ rotate: `${angleDiff}deg` }],
                  width: 100,
                  height: 100,
                }}
              >
                {/* Arrow pointing up - using a simple triangle and line */}
                <Box
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 15,
                    borderRightWidth: 15,
                    borderBottomWidth: 50,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: '#dc2626',
                  }}
                />
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: 3,
                    height: 30,
                    backgroundColor: '#dc2626',
                  }}
                />
              </Box>
            </Box>

            {/* Info Text */}
            <VStack className="mt-5 items-center gap-2">
              <Text className="text-base text-center">
                الاتجاه الحالي: {heading.toFixed(0)}°
              </Text>
              {qiblaAngle !== null && (
                <Text className="text-base text-center">
                  زاوية القبلة: {qiblaAngle.toFixed(0)}°
                </Text>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </ScreenLayout>
  );
}