// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import CheckInScreen from './screens/CheckInScreen';
import DiaryScreen from './screens/DiaryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Check In') iconName = 'location';
            else if (route.name === 'Diary') iconName = 'book';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1f5c4b',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#1f5c4b',
          },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Check In" component={CheckInScreen} />
        <Tab.Screen name="Diary" component={DiaryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
