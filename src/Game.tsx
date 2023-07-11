import Welcome from './Pages/Welcome';
import Settings from './Pages/Settings';
import React from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameContextProvider } from './context/context';

export type ScreenNames = ['Welcome', 'Settings'];
export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => {
  return (
    <GameContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            autoHideHomeIndicator: true,
            navigationBarHidden: true,
          }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContextProvider>
  );
};
