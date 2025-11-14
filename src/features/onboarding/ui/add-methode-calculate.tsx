import { HStack } from "@/components/ui/hstack";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { VStack } from "@/components/ui/vstack";
import { ButtonArrowBack } from "@/src/components";
import ButtonAction from "@/src/components/ButtonAction";
import RadioSelect from "@/src/components/RadioSelect";
import SettingSection from "@/src/components/SettingSection";
import { useRouter } from "expo-router";
import { Calculator, Clock } from "lucide-react-native";
import { useState } from "react";
import { useSetting } from "../../prayers/hooks/useSetting";
import Step from "./component/step";

export default function AddMethodeCalculate() {
  const router = useRouter()
  const {
    updateSettings,
  } = useSetting();
  const [calculationMethod, setCalculationMethod] = useState(
    "رابطة العالم الاسلامية"
  );
  

  const calculationMethods = [
    "رابطة العالم الاسلامية",
    "الهيئة المصرية العامة للمساحة",
    "جامعة العلوم الاسلامية",
    "جامعة الزيتونة",
  ];
  const asrMethods = ["الشافعي", "الحنفي"];
  const [asrMethod, setAsrMethod] = useState("الشافعي");

  const handleConfirm = async () => {
      try {
        // Create new settings
        await updateSettings({
          method_calculate: calculationMethod,
          method_asr: asrMethod,
        });
      
        router.push("/(onboarding)/gender");
    } catch (error) {
      console.error("Error saving settings:", error);
      // Optionally show error message to user
    }
  };
  return (
    <ScreenLayout>
      <NavBar title="اضافة منهج الحساب">
        <ButtonArrowBack />
      </NavBar>
      <VStack className="gap-4 p-6">
      <Step currentStep="add-methode-calulate" />
      <SettingSection
          icon={Calculator}
          color="primary"
          title="اعدادات طريقة الحساب"
          subtitle="اختر الطريقة المناسبة لحساب المواقيت حسب منطقتك"
          className="mb-6"
        >
          <RadioSelect
            options={calculationMethods}
            selected={calculationMethod}
            onSelect={setCalculationMethod}
          />
        </SettingSection>
        <SettingSection
          icon={Clock}
          color="secondary"
          title="طريقة حساب وقت صلاة العصر"
          subtitle="اختر الطريقة المناسبة لحساب وقت العصر حسب المذهب"
          className="mb-6"
        >
          <RadioSelect
            options={asrMethods}
            selected={asrMethod}
            onSelect={setAsrMethod}
          />
        </SettingSection>
        <HStack className="justify-center">
        <ButtonAction
          text="حفظ"
          onPress={handleConfirm}
          sizeText={16}
          className="w-full"
          
        />
        </HStack>
        
      </VStack>
    </ScreenLayout>
  );
}
