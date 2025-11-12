import { CustomTabBarGluestack } from '@/components/custom-tab-bar-gluestack';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBarGluestack {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarLabel: 'الرئيسية',
        }}
      />
    
        <Tabs.Screen
          name="athkar"
          options={{
            title: 'أذكار',
            tabBarLabel: 'أذكار',
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: 'الإعدادات',
            tabBarLabel: 'الإعدادات',
          }}
        />

    </Tabs>
  );
}

