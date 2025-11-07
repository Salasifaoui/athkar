import { ThemedText } from "@/components/themed-text";
import { THEME } from "@/src/theme/theme";
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, useColorScheme, View } from "react-native";

interface TabListProps {
    tabs: string[];
    textStyle: StyleProp<TextStyle>;
    color: string;
    colorSelected: string;
    activeTab: string;
    onTabChange: (tab: string) => void;
    showIndicator?: boolean;
    backgroundColor?: string;
    backgroundColorSelected?: string;
    
}
export function TabList({ 
    tabs, 
    textStyle, 
    color, 
    colorSelected, 
    activeTab, 
    onTabChange, 
    showIndicator = true, 
    backgroundColor = 'transparent', 
    backgroundColorSelected = 'transparent' }: TabListProps) {
    const colorScheme = useColorScheme();
    const theme = THEME[colorScheme ?? 'light'];
    const styles = createStyles(theme);
  return (
    <View style={styles.container}>
        {tabs.map((tab, index) => (
            <TouchableOpacity 
            key={index} 
            onPress={() => onTabChange(tab)} 
            style={[ styles.background, { backgroundColor: tab === activeTab ? backgroundColorSelected : backgroundColor }]}>
                <ThemedText type="title" style={[textStyle, { color: tab === activeTab ? colorSelected : color }]}>{tab}</ThemedText>
               {showIndicator && <View style={[styles.indicator, { width: tab === activeTab ? '30%' : 0}]} />}
            </TouchableOpacity>
        ))}
    </View>

    );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    indicator: {
        height: 2,
        alignSelf: 'center',
        backgroundColor: theme.primary,
        width: '100%',
    },
    background: {
        paddingHorizontal: 16,
        paddingVertical: 2,
        borderRadius: 16,
    },
});