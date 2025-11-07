import { Box } from "@/components/ui/box";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function HistoriqueTab() {
  return (
    <ScreenLayout>
      <NavBar>
        <Text size="lg" bold>Historique</Text>
      </NavBar>
      
      <Box className="flex-1 items-center justify-center px-4">
        <VStack space="lg" className="items-center">
          <Text size="xl" bold>Historique</Text>
          <Text size="md" className="text-center text-muted-foreground">
            View your activity history and past transactions
          </Text>
        </VStack>
      </Box>
    </ScreenLayout>
  );
}

