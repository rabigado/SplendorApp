import Card from '../../Card/Card';
import { noop } from 'lodash';
import React, { JSX } from 'react';
import styled from 'styled-components/native';
import theme from '../../../theme/theme';
import { ICard } from '../../../Entities/Deck';

export default function({selectedCard, children, hideBackground}:{selectedCard:ICard,children:JSX.Element, hideBackground?:boolean}){
  return <ModalContent hideBackground={hideBackground}>
    {selectedCard ? <Card
      cardSize={{ width: 100, height: 150 }}
      onPress={noop}
      faceUp={true}
      {...selectedCard} /> : null}
    {children}
  </ModalContent>
}

const ModalContent = styled.View<{hideBackground?:boolean}>`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: ${({hideBackground})=>hideBackground ? 'transparent' : theme.colors.lightWhite};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
