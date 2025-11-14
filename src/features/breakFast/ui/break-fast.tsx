import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { LucideIcon } from "lucide-react-native";

export default function BreakFast({
  className,
  color,
  title,
  subtitle,
  icon,
  componentButton
}: {
  className?: string;
  color?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  componentButton?: React.ReactNode;
}) {
  return (
    <Card
      className={`w-96 bg-${color}-200 p-2 rounded-xl gap-4 items-center justify-end shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Water pellets background */}
      <Box
        className={`absolute top-4 left-8 w-16 h-16 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute top-4 left-2 w-10 h-10 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute top-14 left-10 w-10 h-10 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute top-12 right-12 w-12 h-12 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute bottom-0 right-0 w-20 h-20 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute bottom-16 right-8 w-14 h-14 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute top-24 right-16 w-10 h-10 rounded-full bg-${color}-100`}
      />
      <Box
        className={`absolute bottom-24 right-20 w-18 h-18 rounded-full bg-${color}-100`}
      />

      <HStack className="items-center justify-between w-full shadow-hard-1 relative z-10">
        {componentButton}
        {icon && <Icon
          as={icon as unknown as LucideIcon}
          size={24}
          className={`text-black`}
        />}
        <VStack className="gap-2 items-center justify-center p-6">
          <Heading size="lg">{title}</Heading>
          <Text size="sm" className="text-center">
            {subtitle}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
}
