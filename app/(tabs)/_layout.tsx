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
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
    
      <Tabs.Screen
        name="historique"
        options={{
          title: 'Historique',
          tabBarLabel: 'Historique',
        }}
      />
    </Tabs>
  );
}

