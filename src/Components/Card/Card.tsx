import React, { useEffect, useRef } from 'react';
import { CardsBack, CardsImages, ICard } from '../../Entities/Deck';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export default (props: ICard & { faceUp: boolean, style: StyleProp<ViewStyle> }) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  let flipRotation = 0;
  flipAnimation.addListener(({ value }) => flipRotation = value);
  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };
  const flipToBackStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };
  const flipToFront = () => {
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };
  const flipToBack = () => {
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {

     props.faceUp ? flipToFront() : flipToBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.faceUp]);
  return (
    <CardContainer style={props.style}>
      <Animated.View style={flipToFrontStyle}>
        <CardHeader />
        <CardCost />
        <CardFrontView resizeMethod={'scale'}
                       source={CardsImages[props.imageIndex]}
        />
      </Animated.View>
      <Animated.View style={flipToBackStyle}>
        <CardBackView
          resizeMethod={'resize'}
          source={CardsBack[props.cardBackIndex]}
        />
      </Animated.View>
    </CardContainer>
  );
};

const CardContainer = styled.View`
  flex: 1;
  position: relative;
  height: 100px;
  width: 75px;
`;
const CardHeader = styled.View``;
const CardCost = styled.View``;
const CardFrontView = styled.Image`
  height: 100px;
  width: 75px;
  backface-visibility: hidden;
  top: 0;
`;

const CardBackView = styled.Image`
  height: 100px;
  width: 75px;
  position: absolute;
`;
