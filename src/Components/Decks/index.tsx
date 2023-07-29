import Card from '../Card/Card';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/native';
import { FlexColumn } from '../../shardStyles';
import { GameContext } from '../../context/context';

export default function() {
  const { game: { dealer } } = useContext(GameContext);
  const getDecks = useMemo(()=>{
    return dealer?.cards.map((deck, i) => {
      return <DeckContainer key={`deck-${i}`}>
        {deck.map((card, index) => {
          return <Card style={{ position: 'absolute', zIndex: index, left: 0.25 * index }}
                       key={`deck-${i}card-${card.id}`} {...card} />;
        })}
      </DeckContainer>;
    });
  },[dealer]);

  return <DeckSection>
    {getDecks}
  </DeckSection>;
}


const DeckContainer = styled(FlexColumn)`
  top: 0;
  flex: 1;
  padding: 5px 0;
  position: relative;
  margin-left: 10px;
`;


const DeckSection = styled(FlexColumn)`
  width: 80px;
`;
