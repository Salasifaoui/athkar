import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { THEME } from '@/src/theme/theme';
import { History, Home, Star, User } from 'lucide-react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBarGluestack({ state, descriptors, navigation }: TabBarProps) {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const activeColor = theme.primary;
  const inactiveColor = theme.mutedForeground;

  const getTabIcon = (routeName: string, focused: boolean) => {
    const color = focused ? activeColor : inactiveColor;
    
    switch (routeName) {
      case 'home':
        return <Icon as={Home} size={24} color={color} />;
      case 'community':
        return <Icon as={Star} size={24} color={color} />;
      case 'historique':
        return <Icon as={History} size={24} color={color} />;
      case 'profile':
        return <Icon as={User} size={24} color={color} />;
      default:
        return <Icon as={Home} size={24} color={color} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'home':
        return 'Home';
      case 'community':
        return 'Community';
      case 'historique':
        return 'Historique';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <Box
      style={{
        backgroundColor: theme.background,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}
    >
      <HStack className="flex-row items-center justify-around">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : getTabLabel(route.name);

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-2"
            >
              <Box className="items-center justify-center">
                {getTabIcon(route.name, isFocused)}
                <Text
                  size="xs"
                  className="mt-1"
                  style={{ color: isFocused ? activeColor : inactiveColor }}
                >
                  {label}
                </Text>
              </Box>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
}

