import { Animated, TouchableWithoutFeedback } from 'react-native';
import React, { useRef } from 'react';
import theme from '../../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

export default ({ title, onPress }: { title: string, onPress: ((event: GestureResponderEvent) => void) }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const handleButtonDown = async () => {
    try {
      Animated.timing(animatedHeight, {
        toValue: 1,
        duration: 100,
        useNativeDriver:false,
      }).start();
    } catch (e) {}
  };
  const handleButtonUp = () => {
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 50,
      useNativeDriver:false,
    }).start();
  };
  const heightStyle = {
    marginTop: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [-15, 0],
    }),
    paddingBottom:animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 0],
    }),
  };
  const inner = {
    borderRadius: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 16],
    }),
  };
  return <Container>
    <TouchableWithoutFeedback onPressIn={handleButtonDown} onPressOut={handleButtonUp} onPress={onPress}>
      <ButtonView >
        <Outer useAngle angle={55}  colors={[theme.colors.lightGold, theme.colors.gold]}>
          <FakeHeight style={heightStyle}>
            <Inner style={inner}>
              <ButtonText>{title}</ButtonText>
            </Inner>
          </FakeHeight>
        </Outer>
      </ButtonView>
    </TouchableWithoutFeedback>
  </Container>;
};

const Container = styled.View`
  width: 200px;
  align-items: center;
  justify-content: center;
`;
const ButtonView = styled.View`
  height: 80px;
  width: 180px;
`;
const Outer = styled(LinearGradient)`
  flex: 1;
  padding: 10px;
  border-radius: 14px;
`;
const FakeHeight = styled(Animated.View)`
  background-color: ${theme.colors.lightBlue};
  border-radius: 16px;
`;
const Inner = styled(Animated.View)`
  height: 100%;
  background-color: ${theme.colors.darkBlue};
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-weight: 400;
  color: ${theme.colors.white};
`;
