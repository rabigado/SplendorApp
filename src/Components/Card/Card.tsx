import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CardsBack, CardsImages, ICard } from '../../Entities/Deck';
import styled from 'styled-components/native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { groupBy, map, noop } from 'lodash';
import { BaseText, GemImage } from '../../shardStyles';
import { GemsIcons } from '../../Entities/Gem';

export default (props: ICard & {
  processable?: boolean,
  canBuy?:boolean,
  faceUp?: boolean,
  style?: StyleProp<ViewStyle>,
  onPress?: () => void,
  cardSize?: {
    width: number;
    height: number
  }
}) => {
  const spin = useSharedValue<number>(props.faceUp ? 1 : 0);

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
  return (<Card style={props.style} canBuy={props.canBuy}>
      <TouchableOpacity
        onPress={() => {
          props.onPress?.();
          props.processable ? (spin.value = spin.value ? 0 : 1) : noop();
        }}
      >
        <View>
          <Front style={rStyle} cardSize={props.cardSize}>
            <CardBackView
              cardSize={props.cardSize}
              resizeMethod={'resize'}
              source={CardsBack[props.cardBackIndex]}
            />
          </Front>
          <Back style={bStyle} cardSize={props.cardSize}>

            <CardFrontView resizeMethod={'resize'}
                           cardSize={props.cardSize}
                           source={CardsImages[props.imageIndex]}
            >
              <CardHeader>
                <Value cardSize={props.cardSize}>{props.value}</Value>
                {props?.gemValue?.imageIndex ? <GemImage size={props.cardSize?.height ? props.cardSize?.height * 0.2 : 15}
                                                         source={GemsIcons[props.gemValue.imageIndex]}
                                                         resizeMethod={'resize'} /> : null}
              </CardHeader>
              <CardCostContainer>
                {map(groupBy(props.cost, cost => cost.color), (value, index) => {
                  return <CardCost key={index} color={index}>
                    {value.length}
                  </CardCost>;
                })}
              </CardCostContainer>
            </CardFrontView>
          </Back>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const CardCostContainer = styled.View`
  display: flex;
  flex-direction: column-reverse;
  margin-top: auto;
  height: 50px;
  flex-wrap: wrap;
`;

const Value = styled(BaseText)<{cardSize?:{width:number,height:number}}>`
  text-shadow: 1px 2px black;
  text-shadow-radius: 1px;
  font-size: ${({cardSize, theme})=>cardSize ? cardSize.height * 0.15 : theme.fontSizes.h4}px;
`;


const CardCost = styled(Value)<{ color: string }>`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: ${({ color, theme }) => color ?? theme.colors.white};
  padding-top: 2px;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.secondaryBackground};
  opacity: .65;
`;
const CardHeader = styled.View`
  height: 25%;
  background-color: ${({ theme }) => theme.colors.lightWhite};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 4px 0;
`;

const Card = styled.View<{canBuy?:boolean}>`
  ${({canBuy,theme})=>canBuy ? `border:2px solid ${theme.colors.lightGold};`:''}
  border-color: ${({ theme }) => theme.colors.lightText};
  border-radius: 4px;
  overflow: hidden;
`;
const Front = styled(Animated.View)<{cardSize?:{width:number,height:number}}>`
  height: ${({cardSize})=>cardSize ? cardSize.height : 75}px;
  width: ${({cardSize})=>cardSize ? cardSize.width : 60}px;
  border-radius: 16px;
  position: absolute;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
`;

const Back = styled(Animated.View)<{cardSize?:{width:number,height:number}}>`
  height: ${({cardSize})=>cardSize ? cardSize.height : 75}px;
  width: ${({cardSize})=>cardSize ? cardSize.width : 60}px;
  border-radius: 16px;
  backface-visibility: hidden;
  align-items: center;
  justify-content: center;
`;

const CardFrontView = styled.ImageBackground<{cardSize?:{width:number,height:number}}>`
  height: ${({cardSize})=>cardSize ? cardSize.height : 75}px;
  width: ${({cardSize})=>cardSize ? cardSize.width : 60}px;
  backface-visibility: hidden;
`;

const CardBackView = styled.Image<{cardSize?:{width:number,height:number}}>`
  height: ${({cardSize})=>cardSize ? cardSize.height : 75}px;
  width: ${({cardSize})=>cardSize ? cardSize.width : 60}px;
  position: absolute;
`;
