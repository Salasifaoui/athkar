import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  children?: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  authProtected?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, authProtected = false, children, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} >{children}</View>;
}
