import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { X } from "lucide-react-native";
import { Pressable } from "react-native";

export interface ZixActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  customHeader?: React.ReactNode;
}
export default function ZixActionSheet({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  customHeader,
}: ZixActionSheetProps) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />

      <ActionsheetContent className="px-5">
     
        <HStack className="justify-between w-full mt-3 mb-4">
          {customHeader ? customHeader : <VStack className="flex-1">
            <Heading size="md" className="font-semibold">
              {title}
            </Heading>
            {subtitle && (
              <Text size="sm" className="text-gray-500 mt-1">
                {subtitle}
              </Text>
            )}
          </VStack>}
          <Pressable onPress={onClose} className="p-2">
            <Icon as={X} size="lg" className="stroke-black" />
          </Pressable>
        </HStack>
        {children}
      </ActionsheetContent>
    </Actionsheet>
  );
}
