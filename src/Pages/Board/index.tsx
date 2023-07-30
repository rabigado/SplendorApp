import React, { Suspense, useContext, useEffect, useState } from 'react';
import { GameContext } from '../../context/context';
import styled from 'styled-components/native';
import { FlexColumn, FlexRow } from '../../shardStyles';
import { ICard } from '../../Entities/Deck';
import CardModal from '../../Components/CardModal';
import Noble from '../../Components/Card/Noble/Noble';
import Players from '../../Components/Players';
import NewRoundModal from '../../Components/NewRoundModal';
import { aiTurn } from '../../utils/aiUtils';
import { ActionTypes } from '../../context/reducer';
import WinnerModal from '../../Components/WinnerModal';

const Bank = React.lazy(() => import('../../Components/Bank'));
const Decks = React.lazy(() => import('../../Components/Decks'));
const GameCards = React.lazy(() => import('../../Components/GameCards'));

// export type GameProps = NativeStackScreenProps<
//   RootStackParamList,
//   'Game'
// >;
export default () => {
  const { game, dispatch } = useContext(GameContext);
  const [selectedCard, setSelectedCard] = useState<ICard | undefined>();
  const nobles = game.nobles;

  useEffect(() => {
    let player = game.players[game.currentPlayerId];
    if (player.aiPlayer) {
      if (player.cards.length) {
        console.log('ai players card');
        console.log(player.cards.map(card => ({ level: card.cardLevel, color: card.color, value: (card.value ?? 0) })));
      }
      if (player.savedCards.length) {
        console.log('ai players savedCards');
        console.log(player.savedCards.map(card => ({ level: card.cardLevel, color: card.color })));
      }
      const aiAction = aiTurn(player, game.bank, [...game.board.row1, ...game.board.row2, ...game.board.row3] as ICard[], game);
      if (aiAction.type === ActionTypes.PLAYER_BUY_CARD || aiAction.type === ActionTypes.PLAYER_BUY_RESERVED_CARD) {
        console.log('action type',aiAction.type);
        console.log('cardCost', aiAction.card?.cost);
      }
      if(aiAction.type === ActionTypes.COIN_TO_PLAYER){
        console.log(aiAction.tempCoins?.map(c=>c.color));
      }
      setTimeout(() => {
        dispatch(aiAction);
      }, 2500);
    }
  }, [game.currentPlayerId]);

  return <GameScreenRoot>
    <Suspense fallback={<GameScreenRoot><NewRoundModal fullScreen={true} /></GameScreenRoot>}>
      <Players />
      <Decks />
      <GameCards setSelectedCard={setSelectedCard} />
      <Bank />
      <NoblesSection>
        {nobles.map((nobleCard, index) => {
          return <Noble key={`${nobleCard.id}-${index}`} nobleCard={nobleCard} />;
        })}
      </NoblesSection>
      <CardModal selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
      <WinnerModal fullScreen={true}/>
      <NewRoundModal />
    </Suspense>
  </GameScreenRoot>;
};


const GameScreenRoot = styled(FlexRow)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lightBlue};
  width: 100%;
`;

const NoblesSection = styled(FlexColumn)`
  flex: 1;
  justify-content: space-around;
  align-items: center;
`;
