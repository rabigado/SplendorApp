import React from 'react';
import Welcome from './Pages/Welcome';
import Settings from './Pages/Settings';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameContextProvider } from './context/context';
import Board from './Pages/Board';

export type ScreenNames = ['Welcome', 'Settings', 'Game'];
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
          <Stack.Screen name="Game" options={{orientation: 'landscape'}} component={Board} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContextProvider>
  );
};
