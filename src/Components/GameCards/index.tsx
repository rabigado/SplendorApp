import Card from '../Card/Card';
import { canPlayerBuyCard } from '../../utils/cardsUtil';
import CurrentPlayerDisplay from '../CurrentPlayerDisplay';
import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { FlexColumn, FlexRow } from '../../shardStyles';
import { GameContext } from '../../context/context';
import { ICard } from '../../Entities/Deck';

export default function({ setSelectedCard }: { setSelectedCard(card: ICard): void }) {
  const { game: { board, players, currentPlayerId } } = useContext(GameContext);
  const player = players[currentPlayerId];

  return <BoardSection>
    <CardLevelRow>
      {board.row3.map(card => card ? <Card
        onPress={() => setSelectedCard(card)}
        canBuy={canPlayerBuyCard(card, player)}
        faceUp={true}
        key={`deck-${1}card-${card.id}`} {...card} /> : null)}
    </CardLevelRow>
    <CardLevelRow>
      {board.row2.map(card => card ? <Card
        onPress={() => setSelectedCard(card)}
        canBuy={canPlayerBuyCard(card, player)}
        faceUp={true}
        key={`deck-${2}card-${card.id}`} {...card} /> : null)}
    </CardLevelRow>
    <CardLevelRow>
      {board.row1.map(card => card ? <Card
        onPress={() => setSelectedCard(card)}
        canBuy={canPlayerBuyCard(card, player)}
        faceUp={true}
        key={`deck-${3}card-${card.id}`} {...card} /> : null)}
    </CardLevelRow>
    <CurrentPlayerDisplay />
  </BoardSection>;
}


const CardLevelRow = styled(FlexRow)`
  align-items: center;
  padding: 5px 10px 0;
  margin-bottom: 5px;
  transform: rotateX(20deg);
  justify-content: space-between;
  gap: 10px;
`;

const BoardSection = styled(FlexColumn)`
  width: 350px;
`;
