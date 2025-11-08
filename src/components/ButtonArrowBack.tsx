import { Button, ButtonIcon } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function ButtonArrowBack() {
  const router = useRouter();
  return (
    <Button
      variant="link"
      action="secondary"
      className="w-10 h-10  justify-center items-center"
      onPress={() => {
        router.back();
      }}
    >
      <ButtonIcon
        as={ChevronLeft}
        style={{ width: 25, height: 25 }}
        className="text-primary-400"
      />
    </Button>
  );
}
