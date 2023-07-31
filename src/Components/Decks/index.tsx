import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlexColumn } from '../../shardStyles';
import { GameContext } from '../../context/context';
import { CardsBack, ICard } from '../../Entities/Deck';
import { TouchableOpacity } from 'react-native';
import { last } from 'lodash';

export default function({setSelectedCard}:{setSelectedCard(card?:ICard):void}) {

  return <DeckSection>
    <Deck deckIndex={2} setSelectedCard={setSelectedCard} />
    <Deck deckIndex={1} setSelectedCard={setSelectedCard} />
    <Deck deckIndex={0} setSelectedCard={setSelectedCard} />
  </DeckSection>;
}
const Deck = ({ deckIndex,setSelectedCard }: { deckIndex: number, setSelectedCard(card?:ICard):void }) => {
  const {game:{dealer,players,currentPlayerId}} = useContext(GameContext);
  const player = players[currentPlayerId];
  const [deck,setDeck] = useState(dealer?.cards[deckIndex]);

  useEffect(()=>{
    if (dealer){
      setDeck(dealer?.cards[deckIndex]);
    }
  },[dealer]);
  const reserveTopCard = () => {
      if (player.savedCards.length < 3){
        setSelectedCard(last(deck));
      }
  };
  const renderDeck = useCallback(() => {
    return deck?.map((card, index) => {
      return <CardBackView source={CardsBack[card.cardBackIndex]}
                           style={{ position: 'absolute', zIndex: index, left: 0.25 * index }}
                           key={`${card.id}`} />;
    });
  }, [deck]);

  return <DeckContainer key={`deck-${2}`}>
    <TouchableOpacity onPress={reserveTopCard}>
      {renderDeck()}
    </TouchableOpacity>
  </DeckContainer>;
};

const CardBackView = styled.Image<{ cardSize?: { width: number, height: number } }>`
  height: ${({ cardSize }) => cardSize ? cardSize.height : 75}px;
  width: ${({ cardSize }) => cardSize ? cardSize.width : 60}px;
`;

const DeckContainer = styled(FlexColumn)`
  top: 0;
  height: 70px;
  margin: 10px 0;
  padding: 5px 0;
  position: relative;
`;


const DeckSection = styled(FlexColumn)`
  width: 80px;
  flex-direction: column;
  justify-content: space-around;
`;
