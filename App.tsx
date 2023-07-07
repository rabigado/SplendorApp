import type {PropsWithChildren} from 'react';
import React from 'react';
import {
  Appearance,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ThemeProvider} from 'styled-components';
import {SectionDescription, StyledText} from './src/shardStyles';
import theme from './src/theme/theme';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <StyledText>{title}</StyledText>

      <SectionDescription>{children}</SectionDescription>
    </View>
  );
}

function App(): JSX.Element {
  Appearance.setColorScheme('light');

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={Colors.lighter}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.lighter} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={Colors.lighter}>
          <View
            style={{
              backgroundColor: Colors.white,
            }}>
            <Section title="splendor">let the game begin</Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
