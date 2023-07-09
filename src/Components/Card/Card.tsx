import React from 'react';
import {ICard} from '../../Entities/Deck';
import styled from 'styled-components/native';

export default (props: ICard) => {
  return (
    <CardContainer>
      <CardHeader></CardHeader>
      <CardCost />
    </CardContainer>
  );
};

const CardContainer = styled.View``;
const CardHeader = styled.View``;
const CardCost = styled.View``;
