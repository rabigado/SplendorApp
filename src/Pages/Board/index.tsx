import React, { useContext, useState } from 'react';
import { GameContext } from '../../context/context';
import styled from 'styled-components/native';
import { BaseText, FlexColumn, FlexRow } from '../../shardStyles';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Game';
import Avatar from '../../Components/Avatar';
import { playersImages } from '../../Entities/Settings';

import Card from '../../Components/Card/Card';

export type GameProps = NativeStackScreenProps<
  RootStackParamList,
  'Game'
>;
export default ({navigation}:GameProps)=>{
  const {game} = useContext(GameContext);
  const [temp,setTemp] = useState(false);
  setTimeout(()=>{
    setTemp(true);
  },3000)
  return <GameScreenRoot>
    <PlayerSection>
      {game.players.map(player => <View key={player.playerName}>
        <Avatar imageUrl={playersImages[player.imageIndex]} />
        <BaseText>{player.playerName}</BaseText>
      </View>)}
    </PlayerSection>
    <DeckSection >
      {game.dealer?.cards.reverse().map((deck,i)=>{
        return <DeckContainer key={i}>
          {deck.slice(0,1).map((card,index) => {
            return <Card style={{zIndex: index, left: 0.25 * index}}
                         faceUp={false}
                         key={`card-${index}`} {...card} />;
            // return <CardBackView
            //   key={`card${index}`}
            //   style={{zIndex: index, left: 0.25 * index}}
            //   resizeMethod={'resize'}
            //   source={CardsBack[card.cardBackIndex]}
            //    />;
          })}
        </DeckContainer>;
      })}
    </DeckSection>
    <BoardSection>
      {game.dealer?.cards.reverse().map((deck,i)=>{
        return <DeckContainer key={i}>
          {deck.slice(0,1).map((card,index) => {
            return <Card style={{zIndex: index, left: 0.25 * index}}
                         faceUp={temp}
                         key={`card-${index}`} {...card} />;
            // return <CardBackView
            //   key={`card${index}`}
            //   style={{zIndex: index, left: 0.25 * index}}
            //   resizeMethod={'resize'}
            //   source={CardsBack[card.cardBackIndex]}
            //    />;
          })}
        </DeckContainer>;
      })}
    </BoardSection>
    <BankSection >
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <BaseText>go back</BaseText>
      </TouchableOpacity>
    </BankSection>
    <NoblesSection />
  </GameScreenRoot>;
};


const DeckContainer = styled(FlexColumn)`
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
