import { ICard } from '../../Entities/Deck';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import CardContent from '../CardModal/components/CardContent';
import React, { useContext } from 'react';
import { GameContext } from '../../context/context';
import { BaseText, FlexColumn, StyledButton } from '../../shardStyles';
import { ActionTypes } from '../../context/reducer';
import { buyCard, canPlayerBuyCard } from '../../utils/cardsUtil';

export default function({ cards, visible, setModalOpen }: {
  cards: ICard[],
  visible: boolean,
  setModalOpen: (b: boolean) => void
}) {
  const { game, game: { players, currentPlayerId }, dispatch } = useContext(GameContext);
  const player = players[currentPlayerId];

  const buyReservedCard = (selectedCard: ICard) => {
    const action = buyCard(selectedCard,player,game);
    dispatch({ ...action,type:ActionTypes.PLAYER_BUY_RESERVED_CARD });
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
                  const disabled = !canPlayerBuyCard(item as ICard, player);
                  return <BorderView>
                    <CardContent selectedCard={item as ICard} hideBackground={true}
                                 children={<CardActions>
                                   <ModalButton onPress={() => buyReservedCard(item as ICard)}
                                                disabled={disabled}>
                                     <BaseText>
                                       Buy card
                                     </BaseText>
                                   </ModalButton>
                                 </CardActions>}
                    />
                  </BorderView>;
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
