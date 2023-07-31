import { isUndefined, map, sum } from 'lodash';
import { ButtonText, FlexColumn, StyledButton } from '../../shardStyles';
import { Modal } from 'react-native';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/native';
import { ICard } from '../../Entities/Deck';
import { GameContext } from '../../context/context';
import { ActionTypes } from '../../context/reducer';
import CardContent from './components/CardContent';
import { buyCard, canPlayerBuyCard } from '../../utils/cardsUtil';

export default function CardModal ({ selectedCard, setSelectedCard }: {
  selectedCard?: ICard,
  setSelectedCard: (arg: ICard | undefined) => void
}){
  const { game, dispatch } = useContext(GameContext);
  const player = game.players[game.currentPlayerId];
  const canBuyCard = useMemo(() => {
   return selectedCard ? canPlayerBuyCard(selectedCard,player) : false;
  }, [player, selectedCard]);
  const isCardFaceUp = !![...game.board.row1,...game.board.row2,...game.board.row3].find(card=>card?.id === selectedCard?.id);

  const reserveCard = (card: ICard) => {
    if (game.bank.Gold.length && sum([...map(player.playerGems,(value)=>value.length),player.gold]) < 10) {
      player.gold++;
      game.bank.Gold.pop();
    } else {//TODO: toast?
      console.log('cant take more gold, has already 10 token or bank is out of gold');
    }
    dispatch({
      type: isCardFaceUp ? ActionTypes.PLAYER_RESERVE_CARD_FROM_DECK : ActionTypes.PLAYER_RESERVE_CARD,
      card,
      gameState: game,
    });
    setSelectedCard(undefined);
  };

  const playerBuyCard = (cardToBuy: ICard) => {
    const action = buyCard(cardToBuy,player,game);
    dispatch(action);
    setSelectedCard(undefined);
  };

  return <Modal transparent={true}
                onRequestClose={() => setSelectedCard(undefined)}
                visible={!isUndefined(selectedCard)}
                animationType={'fade'}
  >
    {selectedCard ? <CardContent isCardFaceUp={isCardFaceUp} selectedCard={selectedCard} children={<CtaContainer>
      <FloatingModalButton disabled={false} onPress={() => setSelectedCard(undefined)}>
        <ButtonText>Cancel</ButtonText>
      </FloatingModalButton>
      <FloatingModalButton disabled={!canBuyCard} onPress={() => selectedCard && playerBuyCard(selectedCard)}>
        <ButtonText>Buy card</ButtonText>
      </FloatingModalButton>
      <FloatingModalButton disabled={player.savedCards?.length === 3}
                           onPress={() => selectedCard && reserveCard(selectedCard)}>
        <ButtonText>Reserve card</ButtonText>
      </FloatingModalButton>
    </CtaContainer>} /> : null}
  </Modal>;
}


const CtaContainer = styled(FlexColumn)`
  gap: 10px;
`;
const FloatingModalButton = styled(StyledButton)<{ disabled: boolean }>`
  ${({ disabled }) => disabled ? 'opacity:.6;' : ''}
  width: 100px;
`;
