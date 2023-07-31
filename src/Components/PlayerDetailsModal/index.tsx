import React, { useContext, useState } from 'react';
import { GameContext } from '../../context/context';
import { FlatList, Modal } from 'react-native';
import { BaseText } from '../../shardStyles';
import Card from '../Card/Card';
import styled from 'styled-components/native';
import Noble from '../Card/Noble/Noble';
import { IPlayer } from '../../Entities/Player';
import CurrentPlayerDisplay from '../CurrentPlayerDisplay';
import { deviceWidth } from '../../utils/dimensionHelper';

export default function({ player, setSelectedPlayer }: {
  player?: IPlayer,
  setSelectedPlayer(player: IPlayer | undefined): void
}) {
  let nobles = player?.cards.filter(card => card.cardLevel === 4);
  let cards = player?.cards.filter(card => card.cardLevel < 4);
  return <Modal
    animationType="slide" transparent={true} statusBarTranslucent={true} visible={!!player}
    onRequestClose={() => setSelectedPlayer(undefined)}>
    <NewRoundBodyContainer onPress={() => setSelectedPlayer(undefined)}>
      <Container>
        <Section flex={1}>
          {player ? <CurrentPlayerDisplay playerId={player.id} /> : null}
        </Section>
        {cards?.length ? <Section flex={2}>
          <BaseText>Owned:</BaseText>
          <FlatList horizontal={true} data={cards}
                    renderItem={({ item }) => {
                      return <CardsContainer key={item.id}>
                        <BaseText>
                          <Card cardSize={{ width: 50, height: 65 }}
                                faceUp={true} {...item} />
                        </BaseText>
                      </CardsContainer>;
                    }} />
        </Section> : null}
        {nobles?.length ? <Section flex={1}>
          <BaseText>nobles:</BaseText>
          <FlatList horizontal={true} data={nobles}
                    renderItem={({ item }) => {
                      return <CardsContainer key={item.id}>
                        <BaseText>
                          <Noble nobleCard={item} />
                        </BaseText>
                      </CardsContainer>;
                    }} />
        </Section> : null}
        {player?.savedCards.length ? <Section flex={2}>
          <BaseText>Saved:</BaseText>
          <FlatList horizontal={true} data={player?.savedCards}
                    renderItem={({ item }) => {
                      return <CardsContainer key={item.id}>
                        <BaseText>
                          <Card cardSize={{ width: 50, height: 65 }}
                                faceUp={true} {...item} />
                        </BaseText>
                      </CardsContainer>;
                    }} />
        </Section>:null}
      </Container>
    </NewRoundBodyContainer>
  </Modal>;
}
const Container = styled.SafeAreaView`
  margin-top: 30px;
  height: ${deviceWidth}px;
`;

const Section = styled.View<{flex?:number}>`
  margin: 5px;
  width: 75%;
  align-self: center;
  max-height: 70px;
  flex: ${({ flex })=> flex ?? 1};
  flex-direction: row;
`;

const CardsContainer = styled.View``;

const NewRoundBodyContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lightWhite};
  justify-content: center;
`;
