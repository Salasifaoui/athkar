import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { Github, Heart, Linkedin, Share2, X } from "lucide-react-native";
import { Alert, Share } from "react-native";

interface AboutMeProps {
    onClose?: () => void;
}

export default function AboutMe({ onClose }: AboutMeProps) {
    const router = useRouter();
    const handleShare = async () => {
        try {
            await Share.share({
                message: "سبيلي - تطبيق إسلامي مفيد للأذكار والأدعية",
            });
        } catch {
            Alert.alert("خطأ", "فشل مشاركة التطبيق");
        }
    };

    const handleSupport = () => {
        // Add support functionality here (e.g., open donation link, etc.)
        Alert.alert("دعم المطور", "شكراً لدعمك! يمكنك التواصل مع المطور عبر الروابط أدناه.");
    };

    return (
        <Box className="w-full p-5">
            {/* Header with Title and Close Button */}
            <HStack className="justify-between items-center mb-6">
                <Heading size="xl" className="font-bold text-right flex-1">
                    عن المطور
                </Heading>
                {onClose && (
                    <Pressable onPress={onClose} className="p-2">
                        <Icon as={X} size={24} className="text-primary-500" />
                    </Pressable>
                )}
            </HStack>

            <VStack className="items-center gap-4">
                {/* Profile Picture */}
                <Image
                    source={require("@/assets/images/profil.jpeg")}
                    alt="Profile"
                    className="w-28 h-28 rounded-full"
                />

                {/* Developer Name */}
                <Heading size="lg" className="font-bold text-center">
                    صالح عيفاوي 
                </Heading>

                {/* Developer Title */}
                <Text className="text-gray-600 text-lg text-center">
                      تقني سامي في الشبكات و أستاذ اعلامية
                </Text>

                {/* Message Box */}
                <Box className="bg-gray-100 rounded-xl p-4 w-full mt-2">
                    <Text className="text-gray-700 text-2xl leading-6 text-center">
                        هذا العمل أقدمه صدقة جارية لوجه الله، فادعوا لي بالقبول والمغفرة؛ وإن رأيتم فائدة، فشاركوها، ف &quot;الدال على الخير كفاعله&quot;.
                    </Text>
                </Box>

                {/* Social Media Icons */}
                <HStack className="gap-4 mt-2 justify-center">
                    <Pressable
                        onPress={() => {
                            router.push("https://x.com/salahifaoui");
                        }}
                        className="w-12 h-12 rounded-full bg-white border border-primary-200 items-center justify-center"
                    >
                        <Icon as={X} size={20} className="text-primary-500" />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            router.push("https://www.linkedin.com/in/salah-ifaoui/");
                        }}
                        className="w-12 h-12 rounded-full bg-white border border-primary-200 items-center justify-center"
                    >
                        <Icon as={Linkedin} size={20} className="text-primary-500" />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            router.push("https://github.com/Salasifaoui");
                        }}
                        className="w-12 h-12 rounded-full bg-white border border-primary-200 items-center justify-center"
                    >
                        <Icon as={Github} size={20} className="text-primary-500" />
                    </Pressable>
                    {/* <Pressable
                        onPress={() => {
                            
                        }}
                        className="w-12 h-12 rounded-full bg-white border border-primary-200 items-center justify-center"
                    >
                        <Icon as={Youtube} size={20} className="text-primary-500" />
                    </Pressable> */}
                </HStack>

                {/* Action Buttons */}
                <VStack className="w-full gap-3 mt-4">
                    {/* Support Button - Green */}
                    <Button
                        action="positive"
                        variant="solid"
                        onPress={handleSupport}
                        className="w-full h-14 rounded-xl bg-green-500"
                    >
                        <Icon as={Heart} size={20} fill="white" stroke="white" />
                        <ButtonText className="text-white font-semibold">
                            ادعم المطور
                        </ButtonText>
                    </Button>

                    {/* Share App Button - Dark Blue */}
                    <Button
                        action="primary"
                        variant="solid"
                        onPress={handleShare}
                        className="w-full h-14 rounded-xl bg-primary-600"
                    >
                        <ButtonIcon as={Share2} width={20} height={20} className="text-white" />
                        <ButtonText className="text-white font-semibold">
                            مشاركة التطبيق
                        </ButtonText>
                    </Button>
                </VStack>
                <HStack className="w-full justify-center items-center gap-2">
                    
                    <Link
                    href="https://zixdev.com/"
                    className="text-gray-700 text-sm text-center">
                        <Text>
                            ZixDev
                        </Text>
                    </Link>
                    <Icon as={Heart} size={20} fill="red" stroke="red" />
                    <Text className="text-gray-700 text-sm text-center">بمساهمة</Text>
                    
                </HStack>
            </VStack>
        </Box>
    );
}