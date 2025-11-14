import { HStack } from "@/components/ui/hstack";
import { Calculator, MapPin, User, UserCircle } from "lucide-react-native";
import { View } from "react-native";

interface StepProps {
  currentStep: "location" | "add-methode-calulate" | "gender" | "account";
}

const steps = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "add-methode-calulate", label: "Add Method Calculate", icon: Calculator },
  { id: "gender", label: "Gender", icon: User },
  { id: "account", label: "Account", icon: UserCircle },
] as const;

export default function Step({ currentStep }: StepProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <View className="w-full px-4 py-4">
      <HStack className="items-center justify-between relative">
        {/* Horizontal line */}
        <View className="absolute left-0 right-0 h-0.5 bg-gray-300" style={{ top: '50%', marginTop: -1 }} />

        {/* Step markers */}
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const IconComponent = step.icon;

          return (
            <View key={step.id} className="items-center relative z-10 flex-1">
              {/* Icon above active step */}
              {isActive && (
                <View className="mb-2">
                  <IconComponent
                    size={18}
                    color="rgb(74, 112, 169)"
                    fill="rgb(74, 112, 169)"
                  />
                </View>
              )}

              {/* Step circle */}
              <View
                className={`${
                  isActive
                    ? "w-6 h-6 border-2 border-gray-300 bg-white"
                    : "w-4 h-4 bg-gray-300"
                } rounded-full items-center justify-center`}
              >
                {isActive && (
                  <View className="w-3 h-3 bg-primary-500 rounded-full" />
                )}
              </View>
            </View>
          );
        })}
      </HStack>
    </View>
  );
}