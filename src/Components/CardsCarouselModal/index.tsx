import { ICard } from '../../Entities/Deck';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import CardContent from '../CardModal/components/CardContent';
import React, { useContext } from 'react';
import { GemType, IGem } from '../../Entities/Gem';
import { GameContext } from '../../context/context';
import { BaseText, FlexColumn, StyledButton } from '../../shardStyles';
import { forEach, groupBy } from 'lodash';
import { ActionTypes } from '../../context/reducer';

export default function({ cards, visible, setModalOpen }: {
  cards: ICard[],
  visible: boolean,
  setModalOpen: (b: boolean) => void
}) {
  const { game, game: { players, currentPlayerId },dispatch } = useContext(GameContext);
  const player = players[currentPlayerId];
  const canPlayerBuyCard = (selectedCard: ICard) => { //TODO: duplicate move to service
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
      if (playerGemCounts[imageIndex] > 0) {
        playerGemCounts[imageIndex]--;
      } else {
        totalShortfall++;
      }
    }
    return totalShortfall <= player.gold;
  };

  const buyCard = (selectedCard: ICard) => { //TODO: move to service
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
      type: ActionTypes.PLAYER_BUY_RESERVED_CARD,
      card:selectedCard,
      gameState: game,
    });
    setModalOpen(false);
  };


  return <Modal transparent={true} visible={visible} onRequestClose={() => setModalOpen(false)}>
    <ModalContent>
      <Carousel data={cards}
                horizontal={true}
                contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                keyExtractor={(item: unknown) => {
                  return `${(item as ICard).id}`;
                }}
                renderItem={({ item }: { item: unknown }) => {
                  return <BorderView><CardContent selectedCard={item as ICard} hideBackground={true}
                                                  children={<CardActions>
                                                    <ModalButton onPress={()=>buyCard(item as ICard)} disabled={!canPlayerBuyCard(item as ICard)}>
                                                      <BaseText>
                                                        Buy card
                                                      </BaseText>
                                                    </ModalButton>
                                                  </CardActions>}
                  /></BorderView>;
                }} />
    <ModalButton onPress={() => setModalOpen(false)}><BaseText>Cancel</BaseText></ModalButton>
    </ModalContent>
  </Modal>;
}

const ModalButton = styled(StyledButton)<{ disabled?: boolean }>`
  ${({ disabled }) => disabled ? 'opacity: .65' : ''};
  width: 100px;
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const BorderView = styled.View`
  width: 200px;
  height: 200px;
`;

const Carousel = styled.FlatList``;


const ModalContent = styled.View`
  padding: 24px;
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.lightWhite};
`;


const CardActions = styled(FlexColumn)`
  gap: 10px;
`;
