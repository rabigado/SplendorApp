import { forEach, groupBy, isUndefined } from 'lodash';
import { ButtonText, FlexColumn, StyledButton } from '../../shardStyles';
import { Modal } from 'react-native';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/native';
import { ICard } from '../../Entities/Deck';
import { GameContext } from '../../context/context';
import { ActionTypes } from '../../context/reducer';
import { GemType, IGem } from '../../Entities/Gem';
import CardContent from './components/CardContent';

export default function CardModal ({ selectedCard, setSelectedCard }: {
  selectedCard?: ICard,
  setSelectedCard: (arg: ICard | undefined) => void
}){
  const { game, dispatch } = useContext(GameContext);
  const player = game.players[game.currentPlayerId];
  const canPlayerBuyCard = useMemo(() => {
    if (!selectedCard) {
      return false;
    }
    const playerGemCounts = {
      [GemType.Ruby]: player.playerGems[GemType.Ruby].length,
      [GemType.Onyx]: player.playerGems[GemType.Onyx].length,
      [GemType.Emerald]: player.playerGems[GemType.Emerald].length,
      [GemType.Sapphire]: player.playerGems[GemType.Sapphire].length,
      [GemType.Diamond]: player.playerGems[GemType.Diamond].length,
    };

    player.cards.forEach(card => {
      playerGemCounts[card.gemValue.imageIndex]++;
    });

    // Check if the player can afford the card
    let totalShortfall = 0;
    for (let costGem of selectedCard.cost) {
      const { imageIndex } = costGem;
      if (playerGemCounts[imageIndex] > 0){
        playerGemCounts[imageIndex]--;
      } else {
        totalShortfall++;
      }
    }
    return totalShortfall <= player.gold;
  }, [player, selectedCard]);


  const reserveCard = (card: ICard) => {
    if (game.bank.Gold.length) {
      player.gold++;
      game.bank.Gold.pop();
    }
    dispatch({
      type: ActionTypes.PLAYER_RESERVE_CARD,
      card,
      gameState: game,
    });
    setSelectedCard(undefined);
  };


  const buyCard = (card: ICard) => { //TODO: move to service
    const freePoints = groupBy(player.cards.map(card => card.gemValue), card => card.color);
    const payPoints = groupBy(selectedCard?.cost, gem => gem.color);
    forEach(payPoints, (value, key) => {
      if (freePoints[key]) {
        value.splice(0, freePoints[key].length);
      }
      if (value.length){
        const deleteCount = player.playerGems[value[0].imageIndex]?.length ?? 0;
        value.forEach(remainingCost => {
          const coin = player.playerGems[remainingCost.imageIndex].pop() as IGem;
          game.bank[coin.imageIndex].push(coin);
        });
        value.splice(0, deleteCount);
      }

      if (value.length > 0) {
        if (player.gold < value.length) {
          throw 'Player can not buy this card, no gold left!';
        }
        player.gold -= value.length;
        value.forEach(_ => {
          game.bank.Gold.push({
            imageIndex: 0,
            coinIndex: 0,
            color: 'yellow',
          });
        });
      }
    });
    dispatch({
      type: ActionTypes.PLAYER_BUY_CARD,
      card,
      gameState: game,
    });
    setSelectedCard(undefined);
  };

  return <Modal transparent={true}
                onRequestClose={() => setSelectedCard(undefined)}
                visible={!isUndefined(selectedCard)}
                animationType={'fade'}
  >
    {selectedCard ? <CardContent selectedCard={selectedCard} children={<CtaContainer>
      <FloatingModalButton disabled={false} onPress={() => setSelectedCard(undefined)}>
        <ButtonText>Cancel</ButtonText>
      </FloatingModalButton>
      <FloatingModalButton disabled={!canPlayerBuyCard} onPress={() => selectedCard && buyCard(selectedCard)}>
        <ButtonText>Buy card</ButtonText>
      </FloatingModalButton>
      <FloatingModalButton disabled={player.savedCards?.length === 3}
                           onPress={() => selectedCard && reserveCard(selectedCard)}>
        <ButtonText>Reserve card</ButtonText>
      </FloatingModalButton>
    </CtaContainer>} /> : null}
  </Modal>;
};


const CtaContainer = styled(FlexColumn)`
  gap: 10px;
`;
const FloatingModalButton = styled(StyledButton)<{ disabled: boolean }>`
  ${({ disabled }) => disabled ? 'opacity:.6;' : ''}
  width: 100px;
`;
