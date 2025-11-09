import { useColorScheme } from "@/src/hooks/useColorSchema";
import { THEME } from "@/src/theme/theme";
import { useRouter } from "expo-router";
import {
  Bell,
  BookOpen,
  Filter,
  HelpCircle,
  LogOut,
  MessageCircle,
  Phone,
  Search,
  Settings,
  UserCircle,
} from "lucide-react-native";
import { Button, ButtonIcon } from "../button";
import { HStack } from "../hstack";
import { Text } from "../text";
import { VStack } from "../vstack";

interface NavBarProps {
  children?: React.ReactNode;
  showSearchButton?: boolean;
  showNotificationButton?: boolean;
  showProfileButton?: boolean;
  showSettingsButton?: boolean;
  showLogoutButton?: boolean;
  showHelpButton?: boolean;
  showFeedbackButton?: boolean;
  showAboutButton?: boolean;
  showContactButton?: boolean;
  showFilterButton?: boolean;
  showComponent?: React.ReactNode;
  title?: string;
  subtitle?: string;
}
export function NavBar({
  children,
  showLogoutButton = false,
  showSearchButton = false,
  showNotificationButton = false,
  showProfileButton = false,
  showSettingsButton = false,
  showHelpButton = false,
  showFeedbackButton = false,
  showAboutButton = false,
  showContactButton = false,
  showFilterButton = false,
  showComponent = null,
  title,
  subtitle,
}: NavBarProps) {
  const { isDarkColorScheme } = useColorScheme();
  const theme = THEME[isDarkColorScheme ? "dark" : "light"];
  const router = useRouter();
  return (
    <HStack className="items-center justify-between">
      <HStack className="items-center justify-start py-3">
        {children}
      </HStack>

      <HStack className="items-center justify-end px-4 py-4 gap-2.5">
        {title && (
          <VStack className="items-center justify-center">
            <Text size="lg" bold>{title}</Text>
            {subtitle && (
              <Text size="sm" className="text-gray-500">{subtitle}</Text>
            )}
          </VStack>
        )}
        
        {showSearchButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={Search} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showNotificationButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={Bell} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showProfileButton && (
          <Button variant="link" action="secondary" onPress={() => {
            router.push('/profile');
          }}>
            <ButtonIcon as={UserCircle} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showSettingsButton && (
          <Button variant="link" action="secondary" onPress={() => router.push('/(profile)/edit')}>
            <ButtonIcon as={Settings} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showLogoutButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={LogOut} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showHelpButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={HelpCircle} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showFeedbackButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={MessageCircle} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showAboutButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={BookOpen} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showContactButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={Phone} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showFilterButton && (
          <Button variant="link" action="secondary" onPress={() => {}}>
            <ButtonIcon as={Filter} style={{ width: 25, height: 25 }} className="text-primary-400" />
          </Button>
        )}
        {showComponent && (
          <HStack className="items-center justify-center">{showComponent}</HStack>
        )}
      </HStack>
    </HStack>
  );
}
