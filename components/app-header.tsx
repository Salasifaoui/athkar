import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
import { THEME } from '@/src/theme/theme';
import { ThemedView } from './themed-view';

export interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  elevation?: number;
  style?: any;
}

export function AppHeader({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  leftComponent,
  backgroundColor,
  textColor,
  iconColor,
  elevation = 0,
  style,
}: AppHeaderProps) {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const themeBackgroundColor = useThemeColor({}, 'background');
  const themeTextColor = useThemeColor({}, 'text');
  const themeIconColor = useThemeColor({}, 'icon');

  const headerBackgroundColor = backgroundColor || themeBackgroundColor;
  const headerTextColor = textColor || themeTextColor;
  const headerIconColor = iconColor || themeIconColor;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  return (
    <>
      <StatusBar
        barStyle={headerTextColor === '#ECEDEE' ? 'light-content' : 'dark-content'}
        backgroundColor={headerBackgroundColor}
      />
      <ThemedView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: headerBackgroundColor,
            elevation: elevation,
            shadowOpacity: elevation > 0 ? 0.1 : 0,
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {leftComponent || (
              showBackButton && (
                <TouchableOpacity
                  onPress={handleBackPress}
                  style={styles.backButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={headerIconColor}
                  />
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            {title && (
              <Text
                style={[
                  styles.title,
                  { color: headerTextColor },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            )}
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        </View>
      </ThemedView>
    </>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
});
