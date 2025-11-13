import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface RadioSelectProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}
export default function RadioSelect({
  options,
  selected,
  onSelect,
  className,
}: RadioSelectProps) {
  return (
    <VStack className="gap-2 p-6">
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          className=" gap-3 p-3 rounded-lg border border-gray-200"
        >
          <HStack className="items-center justify-end gap-3">
            <Text className="text-right">{option}</Text>
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
