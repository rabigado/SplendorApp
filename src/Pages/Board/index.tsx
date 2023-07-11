import React, { useContext } from 'react';
import { GameContext } from '../../context/context';
import styled from 'styled-components/native';
import { BaseText, FlexColumn, FlexRow } from '../../shardStyles';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Game';
import Avatar from '../../Components/Avatar';
import { playersImages } from '../../Entities/Settings';
import { CardsBack } from '../../Entities/Deck';

export type GameProps = NativeStackScreenProps<
  RootStackParamList,
  'Game'
>;
export default ({navigation}:GameProps)=>{
  const {game} = useContext(GameContext);
  return <GameScreenRoot>
    <PlayerSection>
      {game.players.map(player => <View key={player.playerName}>
        <Avatar imageUrl={playersImages[player.imageIndex]} />
        <BaseText>{player.playerName}</BaseText>
      </View>)}
    </PlayerSection>
    <DeckSection >
      {game.dealer?.cards.reverse().map((deck,index)=>{
        return <DeckView resizeMethod={'resize'} source={CardsBack[deck[0].cardBackIndex]} key={index} />;
      })}
    </DeckSection>
    <BoardSection >
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <BaseText>go back</BaseText>
      </TouchableOpacity>
    </BoardSection>
    <BankSection />
    <NoblesSection />
  </GameScreenRoot>;
};
const DeckView = styled.Image`
  max-width: 80%;
  flex: 1;
`;
const GameScreenRoot = styled(FlexRow)`
  flex: 1;
  background-color: ${({theme})=>theme.colors.lightBlue};
`;

const PlayerSection = styled(FlexColumn)`
  flex: 1;
  background-color: ${({theme})=>theme.colors.gold};
`;
const DeckSection = styled(FlexColumn)`
  flex: 1;
  background-color: ${({theme})=>theme.colors.lightText};
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;
const BoardSection = styled(FlexColumn)`
  flex: 4;
  background-color: ${({theme})=>theme.colors.white};
`;
const BankSection = styled(FlexColumn)`
  flex: 1;
  background-color: ${({theme})=>theme.colors.lightGold};
`;
const NoblesSection = styled(FlexColumn)`
  flex: 2;
  background-color: ${({theme})=>theme.colors.mediumBlue};
`;
