import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../context/context';
import styled from 'styled-components/native';
import { BaseText, FlexColumn, FlexRow } from '../../shardStyles';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Game';
import Avatar from '../../Components/Avatar';
import { playersImages } from '../../Entities/Settings';

import Card from '../../Components/Card/Card';
import { ICard } from '../../Entities/Deck';

export type GameProps = NativeStackScreenProps<
  RootStackParamList,
  'Game'
>;
export default ({ navigation }: GameProps) => {
  const { game } = useContext(GameContext);
  return <GameScreenRoot>
    <PlayerSection>
      {game.players.map(player => <View key={player.playerName}>
        <Avatar imageUrl={playersImages[player.imageIndex]} />
        <BaseText>{player.playerName}</BaseText>
      </View>)}
    </PlayerSection>
    <DeckSection>
      {game.dealer?.cards.reverse().map((deck, i) => {
        return <DeckContainer key={`deck-${i}`}>
          {deck.map((card, index) => {
            return <Card style={{ position: 'absolute', zIndex: index, left: 0.25 * index }}
                         key={`deck-${i}card-${card.id}`} {...card} />;
          })}
        </DeckContainer>;
      })}
    </DeckSection>
    <BoardSection>
      <CardLevelRow>
        {game.board.row3.map(card => card ? <Card style={{ flex: 1 }}
                                                  faceUp={true}
                                                  key={`deck-${1}card-${card.id}`} {...card} /> : null)}
      </CardLevelRow>
      <CardLevelRow>
        {game.board.row2.map(card => card ? <Card style={{ flex: 1 }}
                                                  faceUp={true}
                                                  key={`deck-${2}card-${card.id}`} {...card} /> : null)}
      </CardLevelRow>
      <CardLevelRow>
        {game.board.row1.map(card => card ? <Card style={{ flex: 1 }}
                                                  faceUp={true}
                                                  key={`deck-${3}card-${card.id}`} {...card} /> : null)}
      </CardLevelRow>
    </BoardSection>
    <BankSection>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <BaseText>go back</BaseText>
      </TouchableOpacity>
    </BankSection>
    <NoblesSection />
  </GameScreenRoot>;
};

const CardLevelRow = styled(FlexRow)`
  margin-bottom: 5px;
`;
const DeckContainer = styled(FlexColumn)`
  top: 0;
  border: 1px solid black;
  flex: 1;
  padding: 5px 0;
  position: relative;
`;

const GameScreenRoot = styled(FlexRow)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const PlayerSection = styled(FlexColumn)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gold};
`;
const DeckSection = styled(FlexColumn)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lightText};
`;
const BoardSection = styled(FlexColumn)`
  flex: 4;
  background-color: ${({ theme }) => theme.colors.white};
`;
const BankSection = styled(FlexColumn)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lightGold};
`;
const NoblesSection = styled(FlexColumn)`
  flex: 2;
  background-color: ${({ theme }) => theme.colors.mediumBlue};
`;
