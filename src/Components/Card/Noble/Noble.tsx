import { ICard, NobleImages } from '../../../Entities/Deck';
import React from 'react';
import styled from 'styled-components/native';
import theme from '../../../theme/theme';
import { BaseText, FlexColumn, GemImage } from '../../../shardStyles';
import { GemsIcons } from '../../../Entities/Gem';
import { groupBy, map } from 'lodash';

export default function({nobleCard}:{nobleCard:ICard}){
  return  <NobleContainer key={`noble-${nobleCard.id}`}>
    <Noble source={NobleImages[nobleCard.imageIndex]} resizeMethod={'resize'} >
      <CardHeader>
        {
          map(groupBy(nobleCard.cost,gem=>gem.color),(value, index)=>{
            return <PrestigeNeeded key={index} color={index}>
                {value.length}
            </PrestigeNeeded>;
          })
        }
      </CardHeader>
      <Value>{nobleCard.value}</Value>
    </Noble>
  </NobleContainer>;
}

const CardHeader = styled(FlexColumn)`
  background-color: ${theme.colors.lightWhite};
  width: 25%;
  height: 100%;
  justify-content: space-around;
  padding: 5px 0;
`;

const NobleContainer = styled.View<{ tilt?: number }>`
  border-radius: 8px;
  border-width: 2px;
  border-color: ${theme.colors.gold};
  height: 70px;
  width: 70px;
  overflow: hidden;
`;

const Noble = styled.ImageBackground`
  height: 70px;
  width: 70px;
`;

const Value = styled(BaseText)`
  text-shadow: 1px 2px black;
  text-shadow-radius: 1px;
  position: absolute;
  z-index: 2;
  right: 10px;
  bottom: 5px;
`;

const PrestigeNeeded = styled(BaseText)<{color:string}>`
  color: ${({color})=>color === 'white' ? theme.colors.black : theme.colors.white };
  text-align: center;
  width: 15px;
  height: 17px;
  background-color: ${({color})=>color};
  font-size: ${theme.fontSizes.h4}px;
  border: 1px solid ${({color})=>color === 'white' ? theme.colors.mediumBlue : theme.colors.background};
  border-radius: 4px;
  justify-content: center;
  padding-top: 15%;
`;
