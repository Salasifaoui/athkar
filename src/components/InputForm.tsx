import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { KeyboardTypeOptions } from "react-native";

interface InputFormProps {
  variant: "outline" | "rounded" | "underlined";
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  className?: string;
  secureTextEntry?: boolean;
  text?: string;
  textAlign?: "left" | "right" | "center";
}
export default function InputForm({
  variant,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType,
  autoCapitalize,
  className,
  secureTextEntry,
  text,
  textAlign = "right",
}: InputFormProps) {
  return (
    <VStack className="gap-2">
      <Text className={`text-${textAlign} text-md font-medium text-gray-700 mb-2`}>
        {text}
      </Text>
      <Input className={`h-14 rounded-lg text-${textAlign} bg-primary-50 border border-primary-300 ${className}`}>
        <InputField
          variant={variant}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textAlign={textAlign}
          secureTextEntry={secureTextEntry}
        />
      </Input>
    </VStack>
  );
}
