import { VStack } from "../vstack";

export function ScreenLayout({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <VStack className={`bg-background-0 h-full w-full pt-20 px-4 ${className}`}>
      {children}
    </VStack>
  );
}