import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/components/ui/actionsheet";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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

      <ActionsheetContent className="p-0">
        <HStack className="justify-between w-full mt-3 mb-4 p-5">
          {customHeader && customHeader}
          <VStack className="flex-1 items-end justify-end">
            <Heading size="md" className="font-semibold">
              {title}
            </Heading>
            {subtitle && (
              <Text size="sm" className="text-gray-500 mt-1">
                {subtitle}
              </Text>
            )}
            
          </VStack>
          
          
        </HStack>
        <Divider className="w-full border-primary-200" />
      
        {children}
      </ActionsheetContent>
    </Actionsheet>
  );
}
