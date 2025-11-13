import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ButtonAction from "@/src/components/ButtonAction";
import ZixDialogueBox from "@/src/components/ZixDialogueBox";
import { useSelectedCity, useSetting } from "@/src/features/prayers/hooks";
import { City } from "@/src/types/city";
import * as Location from "expo-location";
import {
  Calculator,
  Check,
  Clock,
  MapPin,
  RefreshCcw,
  Settings,
  Stars,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";

interface RadioSelectProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

function RadioSelect({ options, selected, onSelect }: RadioSelectProps) {
  return (
    <VStack className="gap-2 mt-2 p-6">
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          className=" gap-3 p-3 rounded-lg border border-gray-200"
        >
          <HStack className="items-center justify-end gap-3">
            <Text className="text-right text-gray-900">{option}</Text>
            <Box
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                selected === option ? "border-primary-500" : "border-gray-300"
              }`}
            >
              {selected === option && (
                <Box className="w-3 h-3 rounded-full bg-primary-500 items-center justify-center" />
              )}
            </Box>
          </HStack>
        </Pressable>
      ))}
    </VStack>
  );
}

// Settings Section Component
interface SettingsSectionProps {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  color: string;
}

function SettingsSection({
  icon: IconComponent,
  color,
  title,
  subtitle,
  children,
}: SettingsSectionProps) {
  return (
    <VStack className="mb-6 border-2 border-gray-200 rounded-lg">
      <HStack className={`items-center gap-3 mb-2 p-6 bg-${color}-100`}>
        <VStack className="flex-1">
          <Text className="text-base font-semibold text-gray-900 text-right">
            {title}
          </Text>
          <Text className="text-sm text-gray-500 mt-1 text-right">
            {subtitle}
          </Text>
        </VStack>
        <Box className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center">
          <Icon
            as={IconComponent as any}
            size={20}
            className="text-primary-500"
          />
        </Box>
      </HStack>
      {children}
    </VStack>
  );
}

export default function SettingCard({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { selectedCity, setSelectedCity } = useSelectedCity();
  const {
    settings,
    loading: settingsLoading,
    updateSettings,
    updateLocation,
    updateCalculationMethod,
    updateAsrMethod,
  } = useSetting();

  const [calculationMethod, setCalculationMethod] = useState(
    "رابطة العالم الاسلامية"
  );
  const [asrMethod, setAsrMethod] = useState("الشافعي");

  const calculationMethods = [
    "رابطة العالم الاسلامية",
    "الهيئة المصرية العامة للمساحة",
    "جامعة العلوم الاسلامية",
    "جامعة الزيتونة",
  ];

  const asrMethods = ["الشافعي", "الحنفي"];

  // Load settings when component opens or settings are loaded
  useEffect(() => {
    if (isOpen && settings) {
      setCalculationMethod(settings.method_calculate);
      setAsrMethod(settings.method_asr);
    } else if (isOpen && !settings && !settingsLoading) {
      // Initialize with default values if no settings exist
      setCalculationMethod("رابطة العالم الاسلامية");
      setAsrMethod("الشافعي");
    }
  }, [isOpen, settings, settingsLoading]);

  const handleReloadLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "الإذن مطلوب",
          "يجب السماح بالوصول إلى الموقع لتحديث الموقع الحالي",
          [{ text: "حسناً" }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address information
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.region || address.name || "Unknown";
        const countryCode = address.isoCountryCode || "US";
        
        // Create City object
        const newCity: City = {
          id: `${latitude}-${longitude}`, // Generate unique ID from coordinates
          name: cityName,
          apiName: cityName, // Use city name as API name
          country: countryCode,
        };

        // Update location in settings
        await updateLocation(newCity);
        
        // Update selected city in context
        setSelectedCity(newCity);

        console.log("Location updated successfully:", newCity);
      } else {
        throw new Error("Unable to get address from location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert(
        "خطأ",
        "فشل في تحديث الموقع. يرجى المحاولة مرة أخرى.",
        [{ text: "حسناً" }]
      );
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    try {
      if (settings) {
        // Update existing settings
        await updateSettings({
          location: selectedCity,
          method_calculate: calculationMethod,
          method_asr: asrMethod,
        });
      } else {
        // Create new settings
        await updateSettings({
          location: selectedCity,
          method_calculate: calculationMethod,
          method_asr: asrMethod,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      // Optionally show error message to user
    }
  };
  return (
    <ZixDialogueBox
      isOpen={isOpen}
      onClose={onClose}
      header={
        <VStack className="flex-1 items-center justify-start h-30 gap-3 p-4">
          <HStack className="items-center justify-center gap-2">
            <Text size="xl" className="font-semibold text-white">
              اعدادت مواقيت الصلاة
            </Text>
            <Box className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center">
              <Icon as={Settings} size={20} className="text-primary-500" />
            </Box>
          </HStack>

          <HStack className="items-center justify-center gap-2">
            <Divider className="w-20 bg-white" />
            <Icon as={Stars} size={20} className="text-white" />
            <Divider className="w-20 bg-white" />
          </HStack>

          <Text size="sm" className="text-white mt-1">
            تخصيص اعدادات مواقيت الصلاة
          </Text>
        </VStack>
      }
      footer={
        <HStack className="justify-between w-full">
          <Button
            action="secondary"
            variant="solid"
            className="border-none bg-primary-500"
            onPress={handleConfirm}
          >
            <ButtonIcon
              as={Check}
              width={20}
              height={20}
              className="text-white "
            />
            <ButtonText className="text-white">تم</ButtonText>
          </Button>
          <Button
            action="secondary"
            variant="outline"
            className="border-none"
            onPress={handleClose}
          >
            <ButtonIcon
              as={X}
              width={20}
              height={20}
              className="text-primary-500"
            />
            <ButtonText className="text-primary-500">اغلاق</ButtonText>
          </Button>
        </HStack>
      }
    >
      <ScrollView
        style={{ height: 500, padding: 26 }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection
          icon={Calculator}
          color="primary"
          title="اعدادات طريقة الحساب"
          subtitle="اختر الطريقة المناسبة لحساب المواقيت حسب منطقتك"
        >
          <RadioSelect
            options={calculationMethods}
            selected={calculationMethod}
            onSelect={setCalculationMethod}
          />
        </SettingsSection>

        <SettingsSection
          icon={Clock}
          color="secondary"
          title="طريقة حساب وقت صلاة العصر"
          subtitle="اختر الطريقة المناسبة لحساب وقت العصر حسب المذهب"
        >
          <RadioSelect
            options={asrMethods}
            selected={asrMethod}
            onSelect={setAsrMethod}
          />
        </SettingsSection>

        <SettingsSection
          icon={MapPin}
          color="tertiary"
          title="تحديث الموقع"
          subtitle="تحديث الموقع الحالي لحساب مواقيت الصلاة بدقة"
        >
          <Box className="p-6 items-center justify-center">
            <HStack className="w-full items-center justify-end gap-3 mb-3">
              <VStack>
                <Text className="text-sm text-gray-500 text-right">
                  الموقع الحالي
                </Text>
                <Text className="text-base font-semibold text-gray-900 text-right">
                  {selectedCity.name}
                </Text>
              </VStack>
              <Icon as={MapPin} size={20} className="text-primary-500" />
            </HStack>
            <ButtonAction
              text="تحديث الموقع"
              action="primary"
              variant="solid"
              iconAs={RefreshCcw}
              colorIconAs="text-white"
              onPress={handleReloadLocation}
              className="w-full bg-tertiary-500"
            />
          </Box>
        </SettingsSection>
      </ScrollView>
    </ZixDialogueBox>
  );
}
