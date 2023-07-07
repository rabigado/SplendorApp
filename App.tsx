import React from 'react';
import {Appearance, SafeAreaView, StatusBar} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ThemeProvider} from 'styled-components';
import theme from './src/theme/theme';
import Game from './src/Game';

function App(): JSX.Element {
  Appearance.setColorScheme('light');

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={{...Colors.lighter, height: '100%', flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.lighter} />
        <Game />
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
