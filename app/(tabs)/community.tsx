import { Box } from "@/components/ui/box";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function CommunityTab() {
  return (
    <ScreenLayout>
      <NavBar>
        <Text size="lg" bold>Community</Text>
      </NavBar>
      
      <Box className="flex-1 items-center justify-center px-4">
        <VStack space="lg" className="items-center">
          <Text size="xl" bold>Community</Text>
          <Text size="md" className="text-center text-muted-foreground">
            Connect with others, share experiences, and build your community
          </Text>
        </VStack>
      </Box>
    </ScreenLayout>
  );
}

