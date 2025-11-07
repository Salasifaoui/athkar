import { VStack } from "../vstack";

export function ScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <VStack className="bg-background-0 h-full w-full pt-20 px-4">
      {children}
    </VStack>
  );
}