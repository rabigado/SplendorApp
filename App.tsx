import React from 'react';
import { Appearance, SafeAreaView, StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import theme from './src/theme/theme';
import Game from './src/Game';

function App(): JSX.Element {
  Appearance.setColorScheme('light');

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={{height: '100%', flex: 1}}>
        <StatusBar barStyle={'dark-content'}  />
        <Game />
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
