import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react-native";
import { ScrollView } from "react-native";

interface ZixSelectProps {
  options: { label: string; value: string }[];
  selected: { label: string; value: string };
  onSelect: (value: { label: string; value: string }) => void;
}

export default function ZixSelect({
  options,
  selected,
  onSelect,
}: ZixSelectProps) {
  return (
    <Select onValueChange={(value) => onSelect({ label: value, value })}>
      <SelectTrigger
        variant="outline"
        size="md"
        className="justify-between p-2 rounded-xl border-2 border-primary-300 bg-primary-100 h-14"
      >
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
        <SelectInput placeholder={selected.label} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <ScrollView className="max-h-[300px] w-full p-4">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </ScrollView>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
