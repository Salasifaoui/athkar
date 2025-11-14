import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { NavBar } from "@/components/ui/nav-bar";
import { Pressable } from "@/components/ui/pressable";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ZixSelect from "@/components/ui/zix-select/zix-select";
import { ButtonArrowBack } from "@/src/components";
import ButtonAction from "@/src/components/ButtonAction";
import InputForm from "@/src/components/InputForm";
import ZixDialogueBox from "@/src/components/ZixDialogueBox";
import Step from "@/src/features/onboarding/ui/component/step";
import { useSelectedCity, useSetting } from "@/src/features/prayers/hooks";
import { City } from "@/src/types/city";
import * as ExpoLocation from "expo-location";
import { useRouter } from "expo-router";
import { Check, Clock, MapPin, Navigation, Plane, Smartphone } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

// Countries list in Arabic
const countries = [
  { code: "TN", name: "تونس" },
  { code: "SO", name: "الصومال" },
  { code: "DJ", name: "جيبوتي" },
  { code: "KM", name: "جزر القمر" },
  { code: "US", name: "الولايات المتحدة الأمريكية" },
  { code: "CA", name: "كندا" },
  { code: "AF", name: "أفغانستان" },
  { code: "AL", name: "ألبانيا" },
  { code: "AD", name: "أندورا" },
  { code: "AO", name: "أنغولا" },
  { code: "AI", name: "أنغويلا" },
  { code: "AG", name: "أنتيغوا بربودا" },
  { code: "AR", name: "الأرجنتين" },
  { code: "AM", name: "أرمينيا" },
  { code: "AW", name: "آروبا" },
  { code: "AU", name: "أستراليا" },
  { code: "AT", name: "النمسا" },
  { code: "EG", name: "مصر" },
  { code: "SA", name: "المملكة العربية السعودية" },
  { code: "AE", name: "الإمارات العربية المتحدة" },
  { code: "MA", name: "المغرب" },
  { code: "DZ", name: "الجزائر" },
];

export default function Location() {
  const router = useRouter();
  const { setSelectedCity } = useSelectedCity();
  const { updateLocation } = useSetting();
  
  const [locationDetected, setLocationDetected] = useState(false);
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("TN");
  const [cityName, setCityName] = useState("");

  const handleReloadLocation = async () => {
    try {
      setIsLoading(true);
      // Request location permissions
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "الإذن مطلوب",
          "يجب السماح بالوصول إلى الموقع لتحديد الموقع الحالي",
          [{ text: "حسناً" }]
        );
        setIsLoading(false);
        return;
      }

      // Get current location
      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address information
      const reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.region || address.name || "Unknown";
        const countryCode = address.isoCountryCode || "US";
        
        // Create City object
        const newCity: City = {
          id: `${latitude}-${longitude}`,
          name: cityName,
          apiName: cityName,
          country: countryCode,
        };

        setDetectedCity(newCity);
        setLocationDetected(true);
        console.log("Location detected successfully:", newCity);
      } else {
        throw new Error("Unable to get address from location");
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      Alert.alert(
        "خطأ",
        "فشل في تحديد الموقع. يرجى المحاولة مرة أخرى.",
        [{ text: "حسناً" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLocation = async () => {
    if (!detectedCity) return;
    
    try {
      setIsLoading(true);
      // Save location using handleConfirm logic
      await updateLocation(detectedCity);
      setSelectedCity(detectedCity);
      
      // Navigate to next screen
      router.push("/(onboarding)/add_methode_calculate");
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert(
        "خطأ",
        "فشل في حفظ الموقع. يرجى المحاولة مرة أخرى.",
        [{ text: "حسناً" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCity = async () => {
    if (!cityName.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم المدينة");
      return;
    }

    try {
      setIsLoading(true);
      const newCity: City = {
        id: `${selectedCountry}-${cityName}-${Date.now()}`,
        name: cityName.trim(),
        apiName: cityName.trim(),
        country: selectedCountry,
      };

      await updateLocation(newCity);
      setSelectedCity(newCity);
      setShowCityModal(false);
      setCityName("");
      
      // Navigate to next screen
      router.push("/(onboarding)/add_methode_calculate");
    } catch (error) {
      console.error("Error saving city:", error);
      Alert.alert(
        "خطأ",
        "فشل في حفظ المدينة. يرجى المحاولة مرة أخرى.",
        [{ text: "حسناً" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code;
  };

  // Permission request screen
  if (!locationDetected) {
    return (
      <ScreenLayout>
        <NavBar title="تحديد الموقع">
          <ButtonArrowBack />
        </NavBar>
        <Step currentStep="location" />
        
        <Box className="flex-1 bg-white px-6">
          <VStack className="flex-1 justify-center items-center gap-8">
            {/* Illustration */}
            <VStack className="items-center gap-4">
              <HStack className="items-center justify-center gap-4">
                <Box className="items-center justify-center">
                  <Icon as={Smartphone} size={60} className="text-primary-500" />
                </Box>
                <Box className="items-center justify-center">
                  <Icon as={Clock} size={60} className="text-primary-500" />
                </Box>
                <Box className="items-center justify-center">
                  <Icon as={Plane} size={40} className="text-orange-500" />
                </Box>
              </HStack>
            </VStack>

            {/* Text Content */}
            <VStack className="items-center gap-4 px-4">
              <Text className="text-2xl font-bold text-orange-500 text-center">
                مواقيت صلاة دقيقة
              </Text>
              <Text className="text-base text-gray-900 text-center">
                السماح بتحديد الموقع لحساب مواقيت
              </Text>
              <Text className="text-base text-gray-900 text-center">
                صلاة دقيقة وفقا لمكانك
              </Text>
              <Text className="text-sm text-gray-600 text-center mt-2">
                يمكنك تغيير هذا لاحقا من الاعدادات
              </Text>
            </VStack>

            {/* Button */}
            <ButtonAction
              text="السماح بتحديد الموقع"
              action="primary"
              variant="solid"
              iconAs={MapPin}
              colorIconAs="text-white"
              onPress={handleReloadLocation}
              loading={isLoading}
              className="w-full bg-primary-500"
            />
          </VStack>
        </Box>
      </ScreenLayout>
    );
  }

  // Location confirmation screen
  return (
    <ScreenLayout>
      <NavBar title="تحديد الموقع">
        <ButtonArrowBack />
      </NavBar>
      <Step currentStep="location" />
      
      <Box className="flex-1 bg-white px-6">
        <VStack className="flex-1 justify-center items-center gap-6">
          {/* Mosque illustration with checkmark */}
          <VStack className="items-center gap-4 relative">
            <Box className="w-32 h-32 items-center justify-center">
              <Icon as={Navigation} size={80} className="text-primary-500" />
            </Box>
            <Box className="absolute -top-2 -right-2 w-16 h-16 bg-green-500 rounded-full items-center justify-center">
              <Icon as={Check} size={32} className="text-white" />
            </Box>
          </VStack>

          {/* Success message */}
          <VStack className="items-center gap-2">
            <Text className="text-xl font-bold text-orange-500 text-center">
              تم تحديد موقعك بنجاح
            </Text>
            {detectedCity && (
              <Text className="text-lg text-gray-900 text-center mt-2">
                {detectedCity.name} - {getCountryName(detectedCity.country)}
              </Text>
            )}
          </VStack>

          {/* Confirm button */}
          <ButtonAction
            text="الموقع صحيح"
            action="primary"
            variant="solid"
            iconAs={Check}
            colorIconAs="text-white"
            onPress={handleConfirmLocation}
            loading={isLoading}
            className="w-full bg-primary-500"
          />

          {/* Incorrect location link */}
          <Pressable onPress={() => setShowCityModal(true)}>
            <HStack className="items-center gap-2">
              <Text className="text-base text-gray-900">
                موقعك غير صحيح ؟
              </Text>
              <Text className="text-base text-primary-500 underline">
                اضغط هنا
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </Box>

      {/* City Selection Modal */}
      <ZixDialogueBox
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        header={
          <VStack className="flex-1 items-center justify-start h-30 gap-3 p-4">
            <HStack className="items-center justify-center gap-2">
              <Icon as={MapPin} size={40} className="text-primary-500" />
            </HStack>
            <Text size="lg" className="font-semibold text-white text-center">
              لم تجد مدينتك !!! يمكنك اضافتها هنا
            </Text>
          </VStack>
        }
        footer={
          <HStack className="justify-center w-full">
            <Button
              action="secondary"
              variant="solid"
              className="border-none bg-orange-500 w-full"
              onPress={handleSaveCity}
            >
              <ButtonText className="text-white">حفظ</ButtonText>
            </Button>
          </HStack>
        }
      >
        <VStack className="gap-4 p-6">
          {/* Country Selection */}
          <VStack className="gap-2">
            <Text className="text-right text-md font-medium text-gray-700">
              الدولة
            </Text>
            <ZixSelect
              options={countries.map((country) => ({
                label: country.name,
                value: country.code,
              }))}
              selected={{
                label: getCountryName(selectedCountry),
                value: selectedCountry,
              }}
              onSelect={(option) => setSelectedCountry(option.value)}
            />
          </VStack>

          {/* City Input */}
          <InputForm
            variant="outline"
            placeholder="أسم المدينة"
            value={cityName}
            onChangeText={setCityName}
            onBlur={() => {}}
            text="المدينة"
            textAlign="right"
          />
        </VStack>
      </ZixDialogueBox>
    </ScreenLayout>
  );
}