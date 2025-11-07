import { Icon } from '@/components/ui/icon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { THEME } from '@/src/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle, Globe, House, Play, Star, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  const activeColor = theme.primary;
  const inactiveColor = theme.mutedForeground;

  const getTabIcon = (routeName: string, focused: boolean) => {
    const color = focused ? activeColor : inactiveColor;
    
    switch (routeName) {
      case 'index':
        return <Icon as={House} size={24} color={color} />;
      case 'explore':
        return <Icon as={Globe} size={24} color={color} />;
      case 'camera':
        return (
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            style={styles.cameraButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon as={Play} size={20} color="#fff" />
          </LinearGradient>
        );
      case 'community':
        return <Icon as={Star} size={24} color={color} />;
      case 'profile':
        return <Icon as={User} size={24} color={color} />;
      default:
        return <Icon as={Circle} size={24} color={color} />;
    }
  };

  const getNotificationBadge = (routeName: string) => {
    switch (routeName) {
      case 'community':
        return (
          <View style={styles.notificationDot}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>12</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined 
          ? options.tabBarLabel 
          : options.title !== undefined 
          ? options.title 
          : route.name;

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
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabItem,
              route.name === 'camera' && styles.cameraTabItem
            ]}
          >
            <View style={styles.tabContent}>
              {getTabIcon(route.name, isFocused)}
              {route.name !== 'camera' && (
                <Text style={[
                  styles.tabLabel,
                  { color: isFocused ? activeColor : inactiveColor }
                ]}>
                  {label}
                </Text>
              )}
              {getNotificationBadge(route.name)}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingBottom: 34, // Safe area for iPhone
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cameraTabItem: {
    flex: 0.8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.destructive,
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: theme.destructive,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: theme.primaryForeground,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
