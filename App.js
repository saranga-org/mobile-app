import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/Login';
import ScannerScreen from './components/ScannerScreen';
import FuelQuota from './components/FuelQuota';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Fuel" component={FuelQuota} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
