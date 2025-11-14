import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ButtonArrowBack } from "@/src/components";
import {
  timingsAtom,
  usePrayerCountdown,
  usePrayers,
  useSelectedCity,
} from "@/src/features/prayers/hooks";
import { getPrayerSettings } from "@/src/features/prayers/services/settingService";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Circle, Svg } from "react-native-svg";
import { calculateQiblaDirection } from "../services/qiblaCalculator";

// Helper function to get prayer rakats
const getPrayerRakats = (
  prayerName: string,
  isFriday: boolean = false
): string => {
  if (isFriday && prayerName === "Dhuhr") {
    return "Jumu'ah - Sunnah: 4, Fard: 2, Sunnah: 4+2, Nafl: 2";
  }

  const rakats: Record<string, string> = {
    Fajr: "Sunnah: 2, Fard: 2",
    Dhuhr: "Sunnah: 4, Fard: 4, Sunnah: 2, Nafl: 2",
    Asr: "Sunnah: 4, Fard: 4",
    Maghrib: "Fard: 3, Sunnah: 2, Nafl: 2",
    Isha: "Sunnah: 4, Fard: 4, Sunnah: 2, Nafl: 2, Witr: 3",
  };

  return rakats[prayerName] || "";
};

export default function AlKiblaScreen() {
  const [heading, setHeading] = useState(0); // اتجاه الجهاز
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null); // زاوية القبلة
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>("");

  const { selectedCity } = useSelectedCity();
  usePrayers(selectedCity);
  const [prayerTimings] = useAtom(timingsAtom);
  const countdown = usePrayerCountdown(prayerTimings);

  // Check if today is Friday
  const isFriday = useMemo(() => {
    const today = new Date();
    return today.getDay() === 5; // Friday is day 5
  }, []);

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
          const idParts = city.id.split("-");
          if (idParts.length >= 2) {
            const parsedLat = parseFloat(idParts[0]);
            const parsedLng = parseFloat(idParts[1]);
            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
              latitude = parsedLat;
              longitude = parsedLng;

              // Get address from coordinates
              try {
                const reverseGeocode = await Location.reverseGeocodeAsync({
                  latitude,
                  longitude,
                });
                if (reverseGeocode && reverseGeocode.length > 0) {
                  const addr = reverseGeocode[0];
                  const addressParts = [
                    addr.street,
                    addr.district,
                    addr.city || addr.region,
                    addr.country,
                  ].filter(Boolean);
                  setLocationAddress(
                    addressParts.join(", ") || `${city.name}, ${city.country}`
                  );
                } else {
                  setLocationAddress(`${city.name}, ${city.country}`);
                }
              } catch {
                setLocationAddress(`${city.name}, ${city.country}`);
              }
            } else {
              // If ID doesn't contain coordinates, use geocoding
              const geocodeResult = await Location.geocodeAsync(
                `${city.name}, ${city.country}`
              );
              if (geocodeResult && geocodeResult.length > 0) {
                latitude = geocodeResult[0].latitude;
                longitude = geocodeResult[0].longitude;
                setLocationAddress(`${city.name}, ${city.country}`);
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
              setLocationAddress(`${city.name}, ${city.country}`);
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

          // Get address from coordinates
          try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });
            if (reverseGeocode && reverseGeocode.length > 0) {
              const addr = reverseGeocode[0];
              const addressParts = [
                addr.street,
                addr.district,
                addr.city || addr.region,
                addr.country,
              ].filter(Boolean);
              setLocationAddress(addressParts.join(", ") || "Unknown Location");
            }
          } catch {
            setLocationAddress("Unknown Location");
          }

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

  // Format countdown time
  const formatCountdown = () => {
    if (!countdown) return "00:00:00";
    const h = countdown.hours.toString().padStart(2, "0");
    const m = countdown.minutes.toString().padStart(2, "0");
    const s = countdown.seconds.toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Calculate progress for circular timer (0 to 1)
  const timerProgress = useMemo(() => {
    if (!countdown) return 0;
    const totalSeconds =
      countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds;
    // Assuming max time is 24 hours for calculation
    const maxSeconds = 24 * 3600;
    return 1 - totalSeconds / maxSeconds;
  }, [countdown]);

  return (
    <ScreenLayout>
      <NavBar title="القبلة">
        <ButtonArrowBack />
      </NavBar>
      <VStack className="flex-1 px-4 py-4 gap-4">
        {errorMsg ? (
          <Text className="text-red-500 text-center">{errorMsg}</Text>
        ) : (
          <>
            {/* Prayer Information Card */}
            <Card className="p-4 bg-gray-50 rounded-2xl relative overflow-hidden">
              <VStack className="gap-4">
                {/* Next Prayer */}
                <Text className="text-lg font-semibold text-gray-800 text-center">
                  الصلاة التالية : {countdown?.nextPrayerNameArabic || "الظهر"}
                </Text>

                {/* Circular Timer */}
                <Box className="self-center w-32 h-32 relative items-center justify-center">
                  {/* Progress Circle Background */}
                  <Box className="absolute w-32 h-32 rounded-full border-4 border-gray-200" />

                  {/* Progress Circle */}
                  <Svg
                    width={128}
                    height={128}
                    style={{ position: "absolute" }}
                  >
                    <Circle
                      cx={64}
                      cy={64}
                      r={60}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - timerProgress)}
                      transform={`rotate(-90 64 64)`}
                    />
                  </Svg>

                  {/* Timer Text */}
                  <VStack className="items-center justify-center">
                    <Text className="text-xs text-gray-600">Time</Text>
                    <Text className="text-2xl font-bold text-gray-800">
                      {formatCountdown()}
                    </Text>
                    <Text className="text-xs text-gray-600">Left</Text>
                  </VStack>
                </Box>

                {/* Prayer Details */}
                <Text className="text-sm text-gray-700 text-center">
                  {countdown
                    ? getPrayerRakats(countdown.nextPrayerName, isFriday)
                    : "Sunnah: 4, Fard: 4, Sunnah: 2, Nafl: 2"}
                </Text>

                {/* Location Box */}
                <Box className="bg-blue-100 rounded-lg px-3 py-2 mt-2">
                  <Text className="text-sm text-blue-800 text-center">
                    {locationAddress ||
                      `${selectedCity?.name || ""}, ${
                        selectedCity?.country || ""
                      }`}
                  </Text>
                </Box>
              </VStack>
            </Card>

            {/* Compass Container */}
            <Box className="flex-1 justify-center items-center">
              <Box className="w-[280px] h-[280px] justify-center items-center relative">
                {/* Compass Circle */}
                <Box
                  className="w-[280px] h-[280px] rounded-full border-2 border-gray-300 bg-white shadow-lg"
                  style={{
                    transform: [{ rotate: `${-heading}deg` }],
                  }}
                >
                  {/* Cardinal Directions Labels */}
                  <Text
                    className="absolute text-lg font-bold text-red-600"
                    style={{
                      top: 12,
                      left: 140 - 8,
                    }}
                  >
                    N
                  </Text>
                  <Text
                    className="absolute text-lg font-bold text-blue-600"
                    style={{
                      bottom: 12,
                      left: 140 - 8,
                    }}
                  >
                    S
                  </Text>
                  <Text
                    className="absolute text-lg font-bold text-gray-600"
                    style={{
                      left: 12,
                      top: 140 - 10,
                    }}
                  >
                    W
                  </Text>
                  <Text
                    className="absolute text-lg font-bold text-gray-600"
                    style={{
                      right: 12,
                      top: 140 - 10,
                    }}
                  >
                    E
                  </Text>

                  {/* Compass Markings - North (Red) */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 140 - 2,
                      width: 4,
                      height: 20,
                      backgroundColor: "#ef4444",
                      borderRadius: 2,
                    }}
                  />
                  {/* Compass Markings - South (Blue) */}
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 140 - 2,
                      width: 4,
                      height: 20,
                      backgroundColor: "#3b82f6",
                      borderRadius: 2,
                    }}
                  />
                  {/* Compass Markings - West */}
                  <Box
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 140 - 2,
                      width: 20,
                      height: 4,
                      backgroundColor: "#6b7280",
                      borderRadius: 2,
                    }}
                  />
                  {/* Compass Markings - East */}
                  <Box
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 140 - 2,
                      width: 20,
                      height: 4,
                      backgroundColor: "#6b7280",
                      borderRadius: 2,
                    }}
                  />

                  {/* Tick marks around circumference */}
                  {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 10 - 90) * (Math.PI / 180);
                    const radius = 140;
                    const outerRadius = radius - 8;
                    const x = radius + outerRadius * Math.cos(angle);
                    const y = radius + outerRadius * Math.sin(angle);
                    const isMajor = i % 3 === 0;
                    const tickLength = isMajor ? 16 : 8;
                    const tickWidth = isMajor ? 4 : 2;

                    return (
                      <Box
                        key={i}
                        style={{
                          position: "absolute",
                          left: x - tickWidth / 2,
                          top: y - tickLength / 2,
                          width: tickWidth,
                          height: tickLength,
                          backgroundColor: isMajor ? "#3b82f6" : "#9ca3af",
                          borderRadius: 1,
                          transform: [{ rotate: `${i * 10}deg` }],
                        }}
                      />
                    );
                  })}
                </Box>

                {/* Kaaba Icon in Center */}
                <Box
                  className="absolute justify-center items-center"
                  style={{
                    width: 60,
                    height: 60,
                    top: 140 - 30,
                    left: 140 - 30,
                  }}
                >
                  {/* Kaaba outline/glow */}
                  <Box
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#dbeafe",
                      borderRadius: 8,
                      opacity: 0.6,
                    }}
                  />
                  {/* Kaaba cube */}
                  <Box
                    style={{
                      position: "absolute",
                      width: 35,
                      height: 35,
                      backgroundColor: "#1e40af",
                      borderRadius: 4,
                    }}
                  />
                  {/* Kaaba door */}
                  <Box
                    style={{
                      position: "absolute",
                      width: 8,
                      height: 20,
                      backgroundColor: "#1e3a8a",
                      borderRadius: 2,
                      top: 15,
                    }}
                  />
                </Box>

                {/* Qibla Arrow - positioned absolutely to rotate independently */}
                <Box
                  className="absolute justify-center items-center"
                  style={{
                    transform: [{ rotate: `${angleDiff}deg` }],
                    width: 120,
                    height: 120,
                    top: 140 - 60,
                    left: 140 - 60,
                  }}
                >
                  {/* Arrow pointing up - using a simple triangle and line */}
                  <Box
                    style={{
                      width: 0,
                      height: 0,
                      borderLeftWidth: 18,
                      borderRightWidth: 18,
                      borderBottomWidth: 60,
                      borderLeftColor: "transparent",
                      borderRightColor: "transparent",
                      borderBottomColor: "#3b82f6",
                    }}
                  />
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: 4,
                      height: 35,
                      backgroundColor: "#3b82f6",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </VStack>
    </ScreenLayout>
  );
}
