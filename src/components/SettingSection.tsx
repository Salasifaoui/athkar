import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface SettingSectionProps {
    icon: React.ComponentType<any>;
    color: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
}

export default function SettingSection({
    icon: IconComponent,
    color,
    title,
    subtitle,
    children,
    className,
}: SettingSectionProps) {
    return (
        <VStack className={`border-2 border-gray-200 rounded-lg ${className}`}>
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
    )
}