import Welcome from "./Pages/Welcome";
import Settings from "./Pages/Settings";
import React, { createContext, FC, PropsWithChildren, useState } from "react";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IGame } from "./Entities/Game";


export const GameContext = createContext<{ game?:IGame, setGame:(game:IGame)=>void }|null>(null)

const GameContextProvider:FC<PropsWithChildren> = ({children}) => {
  const [game,setGame] =useState<IGame>();
  return <GameContext.Provider value={{ game,setGame }}>
    {children}
  </GameContext.Provider>
}
export type ScreenNames = ["Welcome", "Settings"]
export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();


export default () => {
  return (<GameContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false, autoHideHomeIndicator:true, navigationBarHidden:true}}>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </Stack.Navigator>
    </NavigationContainer>
    </GameContextProvider>
  );
};


