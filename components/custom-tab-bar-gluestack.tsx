import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { BookAIcon, Home, Settings } from 'lucide-react-native';
import React, { useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const AnimatedHStack = Animated.createAnimatedComponent(HStack);
const AnimatedText = Animated.createAnimatedComponent(Text);

export function CustomTabBarGluestack({ state, descriptors, navigation }: TabBarProps) {
  const activeColor = 'white';
  const inactiveColor = 'white';

  const getTabIcon = (routeName: string, focused: boolean) => {
    const color = focused ? activeColor : inactiveColor;
    switch (routeName) {
      case 'home':
        return <Icon as={Home} size={20} color={color} />;
      case 'athkar':
        return <Icon as={BookAIcon} size={20} color={color} />;
      case 'setting':
        return <Icon as={Settings} size={20} color={color} />;
      default:
        return <Icon as={Home} size={20} color={color} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'home':
        return 'Home';
      case 'athkar':
        return 'أذكار';
      case 'settings':
        return 'الإعدادات';
      default:
        return routeName;
    }
  };

  return (
    <Box
    className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-3xl p-2 mb-8 mx-4"
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
            <TabButton
              key={route.key}
              isFocused={isFocused}
              label={label}
              icon={getTabIcon(route.name, isFocused)}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
            />
          );
        })}
      </HStack>
    </Box>
  );
}

interface TabButtonProps {
  isFocused: boolean;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityRole?: string;
  accessibilityState?: { selected?: boolean };
  accessibilityLabel?: string;
  testID?: string;
}

function TabButton({
  isFocused,
  label,
  icon,
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  testID,
}: TabButtonProps) {
  const scale = useSharedValue(isFocused ? 1 : 0.95);
  const opacity = useSharedValue(isFocused ? 1 : 0.7);
  const textOpacity = useSharedValue(isFocused ? 1 : 0);
  const backgroundScale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.95, {
      damping: 18,
      stiffness: 200,
    });
    opacity.value = withTiming(isFocused ? 1 : 0.7, { duration: 200 });
    textOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    backgroundScale.value = withSpring(isFocused ? 1 : 0, {
      damping: 20,
      stiffness: 300,
    });
  }, [isFocused, scale, opacity, textOpacity, backgroundScale]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundScale.value,
      transform: [
        {
          scale: interpolate(backgroundScale.value, [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  return (
    <Pressable
      accessibilityRole={accessibilityRole as any}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center"
    >
      <AnimatedHStack
        className="items-center justify-center gap-2"
        style={animatedContainerStyle}
      >
        {isFocused ? (
          <AnimatedHStack
            className="items-center justify-center gap-2 bg-primary-400 rounded-full p-2 px-4"
            style={animatedBackgroundStyle}
          >
            <AnimatedText
              size="md"
              className="text-center text-white"
              style={animatedTextStyle}
            >
              {label}
            </AnimatedText>
            {icon}
          </AnimatedHStack>
        ) : (
          <HStack className="items-center justify-center gap-2">
            {icon}
          </HStack>
        )}
      </AnimatedHStack>
    </Pressable>
  );
}

