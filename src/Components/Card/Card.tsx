import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CardsBack, CardsImages, ICard } from '../../Entities/Deck';
import styled from 'styled-components/native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default (props: ICard & { faceUp?: boolean, style?: StyleProp<ViewStyle> }) => {
  const spin = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  useEffect(()=>{
    if (props.faceUp){
      setTimeout(()=>{
        spin.value = spin.value ? 0 : 1;
      }, 75 * props.id);
    }
  },[props.faceUp]);

  const bStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  return (<View style={props.style}>
      <Pressable
        onPress={() => (spin.value = spin.value ? 0 : 1)}
      >
        <View>
          <Animated.View style={[Styles.front, rStyle]}>
            <CardBackView
              resizeMethod={'resize'}
              source={CardsBack[props.cardBackIndex]}
            />
          </Animated.View>
          <Animated.View style={[Styles.back, bStyle]}>
            <CardFrontView resizeMethod={'resize'}
                           source={CardsImages[props.imageIndex]}
            />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
};
const Styles = StyleSheet.create({
  front: {
    height: 100,
    width: 75,
    borderRadius: 16,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  back: {
    height: 100,
    width: 75,
    borderRadius: 16,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CardFrontView = styled.Image`
  height: 100px;
  width: 75px;
  backface-visibility: hidden;
`;

const CardBackView = styled.Image`
  height: 100px;
  width: 75px;
  position: absolute;
`;
