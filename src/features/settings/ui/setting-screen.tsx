import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ButtonArrowBack } from "@/src/components";
import RadioSelect from "@/src/components/RadioSelect";
import SettingSection from "@/src/components/SettingSection";
import ZixDialogueBox from "@/src/components/ZixDialogueBox";
import { useColorScheme } from "@/src/hooks/useColorSchema";
import {
    Bell,
    BellOff,
    ChevronLeft,
    Globe,
    Info,
    Languages,
    MessageSquare,
    Moon,
    Palette,
    Settings,
    Shield,
    Sparkles,
    Sun,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Switch } from "react-native";

interface InfoCardProps {
  icon: any;
  title: string;
  subtitle: string;
}

function InfoCard({ icon: IconComponent, title, subtitle }: InfoCardProps) {
  return (
    <VStack className="items-center justify-center gap-2 flex-1">
      <Box className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
        <Icon as={IconComponent as any} size={24} className="text-white" />
      </Box>
      <Text className="text-white text-lg font-semibold">{title}</Text>
      <Text className="text-white/80 text-sm text-center">{subtitle}</Text>
    </VStack>
  );
}

interface SettingCardProps {
  icon: any;
  title: string;
  subtitle: string | React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
}

function SettingCard({
  icon: IconComponent,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightComponent,
}: SettingCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
    >
      <HStack className="items-center justify-between">
        {showArrow && (
          <Icon as={ChevronLeft} size={20} className="text-gray-400" />
        )}
        <HStack
          className="items-center gap-3 flex-1"
          style={{ flexDirection: "row-reverse" }}
        >
          <VStack className="flex-1" style={{ alignItems: "flex-end" }}>
            <Text className="text-gray-900 text-base font-semibold text-right">
              {title}
            </Text>
            {typeof subtitle === "string" ? (
              <Text className="text-gray-500 text-sm mt-1 text-right">
                {subtitle}
              </Text>
            ) : (
              <Box className="mt-1">{subtitle}</Box>
            )}
          </VStack>
          {rightComponent || (
            <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center">
              <Icon
                as={IconComponent as any}
                size={24}
                className="text-primary-500"
              />
            </Box>
          )}
        </HStack>
      </HStack>
    </Pressable>
  );
}

export default function SettingScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [isOpenAbout, setIsOpenAbout] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentLanguage, setCurrentLanguage] = useState("العربية");
  const { setColorScheme } = useColorScheme();

  return (
    <ScreenLayout className="p-0">
      <ScrollView contentContainerClassName="pb-14" showsVerticalScrollIndicator={false}>
        {/* Blue Header Section */}
        <Box className="bg-primary-500 rounded-b-3xl p-6 pt-14">
          <HStack className="items-center justify-between mb-4 gap-4">
            <ButtonArrowBack />
            <VStack className="flex-1 items-end justify-end gap-1">
              <Text className="text-white text-2xl font-bold text-right mb-1">
                الإعدادات
              </Text>
              <Text className="text-white/90 text-sm text-right">
                تخصيص مظهر التطبيق
              </Text>
            </VStack>
            <Box className="w-12 h-12 rounded-full bg-primary-600 items-center justify-center">
              <Icon as={Settings} size={20} className="text-white" />
              <Icon
                as={Sparkles}
                size={12}
                className="text-white absolute -top-1 -right-1"
              />
            </Box>
          </HStack>

          {/* Three Info Cards */}
          <HStack className="gap-3 mt-6">
            <InfoCard icon={Palette} title={currentTheme === "light" ? "فاتح" : "داكن"} subtitle="السمة" />
            <InfoCard icon={Globe} title={currentLanguage === "العربية" ? "AR" : "EN"} subtitle="اللغة" />
            <InfoCard icon={Bell} title="0" subtitle="إشعار" />
          </HStack>
        </Box>

        {/* Main Content */}
        <VStack className="px-4 pb-8">
          {/* Theme Customization */}
          <SettingCard
            icon={Palette}
            title="السمة"
            subtitle="تخصيص مظهر التطبيق"
            onPress={() => {}}
          />

          {/* Theme Selection */}
          <SettingCard
            icon={Sun}
            title="السمة"
            subtitle={currentTheme}
            onPress={() => setIsOpen(true)}
            rightComponent={
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center">
                <Icon as={currentTheme === "light" ? Sun : Moon} size={24} className="text-primary-500" />
              </Box>
            }
          />

          {/* Language Selection */}
          <SettingCard
            icon={Languages}
            title="اللغة"
            subtitle={
              <HStack className="items-center gap-2">
                <Text className="text-gray-500 text-sm">{currentLanguage === "العربية" ? "العربية" : "الانجليزية"}</Text>
                <Text className="text-lg">{currentLanguage === "العربية" ? "🇸🇦" : "🇺🇸"}</Text>
              </HStack>
            }
            onPress={() => setIsOpenLanguage(true)}
            rightComponent={
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center relative">
                <Text className="text-primary-500 text-xl font-bold">{currentLanguage === "العربية" ? "ا" : "A"}</Text>
              </Box>
            }
          />

          {/* Activate Notifications Toggle */}
          <Box className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
            <HStack className="items-center justify-between gap-4">
              <HStack
                className="items-center gap-3 flex-1"
                style={{ flexDirection: "row-reverse" }}
              >
                <VStack className="flex-1" style={{ alignItems: "flex-end" }}>
                  <Text className="text-gray-900 text-base font-semibold text-right">
                    تفعيل التنبيهات
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1 text-right">
                    إرسال تنبيه عند حلول وقت كل صلاة
                  </Text>
                </VStack>
                <Box className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-gray-200 items-center justify-center">
                  <Icon
                    as={notificationsEnabled ? Bell : BellOff}
                    size={24}
                    className={
                      notificationsEnabled
                        ? "text-primary-500"
                        : "text-gray-400"
                    }
                  />
                </Box>
              </HStack>
              <VStack className="items-center justify-center">
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#e5e7eb", true: "#4a70a9" }}
                thumbColor="#ffffff"
              />
              </VStack>
            </HStack>
          </Box>

          {/* About the App Section Header */}
          <Text className="text-gray-900 text-lg font-bold text-right mb-3 mt-4">
            حول التطبيق
          </Text>
          <Text className="text-gray-500 text-sm text-right mb-3">
            معلومات عن التطبيق
          </Text>

          {/* About the App Card */}
          <SettingCard
            icon={Info}
            title="حول التطبيق"
            subtitle="تطبيق وذكر لمساعدتك في شعائر الإسلام"
            onPress={() => setIsOpenAbout(true)}
            rightComponent={
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center">
                <Icon as={Info} size={24} className="text-primary-500" />
              </Box>
            }
          />

          {/* Send Feedback */}
          <SettingCard
            icon={MessageSquare}
            title="إرسال رأيك"
            subtitle="شاركنا رأيك لتحسين التطبيق"
            onPress={() => {}}
            rightComponent={
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center">
                <Icon
                  as={MessageSquare}
                  size={24}
                  className="text-primary-500"
                />
              </Box>
            }
          />

          {/* App Website */}
          <SettingCard
            icon={Globe}
            title="موقع التطبيق"
            subtitle="زيارة موقع التطبيق الرسمي"
            onPress={() => {}}
            rightComponent={
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center">
                <Icon as={Globe} size={24} className="text-primary-500" />
              </Box>
            }
          />

          {/* Privacy Policy */}
          <SettingCard
            icon={Shield}
            title="سياسة الخصوصية"
            subtitle="اطلع على سياسة الخصوصية"
            onPress={() => {}}
            rightComponent={
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 border-2 border-primary-200 items-center justify-center">
                <Icon as={Shield} size={24} className="text-primary-500" />
              </Box>
            }
          />
        </VStack>
      </ScrollView>
      <ZixDialogueBox isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SettingSection
          icon={Palette}
          color="primary"
          title="السمة"
          subtitle="تخصيص مظهر التطبيق"
          className="border-none"
        >
          <RadioSelect
            options={["light", "dark", "system"]}
            selected={currentTheme}
            onSelect={(value) =>{
              setCurrentTheme(value as "light" | "dark" | "system")
              setColorScheme(value as "light" | "dark" | "system")
            }}
          />
        </SettingSection>
      </ZixDialogueBox>
      <ZixDialogueBox isOpen={isOpenLanguage} onClose={() => setIsOpenLanguage(false)}>
        <SettingSection
          icon={Languages}
          color="primary"
          title="اللغة"
          subtitle="تغيير لغة التطبيق"
        >
          <RadioSelect
            options={["العربية", "الانجليزية"]}
            selected={currentLanguage}
            onSelect={(value) => {
              setCurrentLanguage(value as "العربية" | "الانجليزية")
            //   setLanguage(value as "العربية" | "الانجليزية")
            }}
          />
          
        </SettingSection>
      </ZixDialogueBox>
      <ZixDialogueBox isOpen={isOpenAbout} onClose={() => setIsOpenAbout(false)}>
        <SettingSection
          icon={Info}
          color="primary"
          title="حول التطبيق"
          subtitle="تطبيق وذكر لمساعدتك في شعائر الإسلام"
        >
          <Text className="text-gray-900 text-lg font-bold text-right mb-3 mt-4">
            حول التطبيق
          </Text>
          <Text className="text-gray-500 text-sm text-right mb-3">
            معلومات عن التطبيق
          </Text>
          <Text className="text-gray-500 text-sm text-right mb-3">
            معلومات عن التطبيق
          </Text>
        </SettingSection>
      </ZixDialogueBox>
    </ScreenLayout>
  );
}
