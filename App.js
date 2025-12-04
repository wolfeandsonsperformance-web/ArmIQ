import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AthleteList from './screens/AthleteList';
import GripTestScreen from './screens/GripTestScreen';
import DeviceScanScreen from './screens/DeviceScanScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Athletes" component={AthleteList} />
        <Stack.Screen name="GripTest" component={GripTestScreen} />
        <Stack.Screen name="Scan" component={DeviceScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
