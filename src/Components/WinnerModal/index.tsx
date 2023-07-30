import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Modal } from 'react-native';
import styled from 'styled-components/native';
import { GameContext } from '../../context/context';
import { maxBy, sum } from 'lodash';
import { IPlayer } from '../../Entities/Player';
import { BaseText, StyledButton } from '../../shardStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../Game';
import Card from '../Card/Card';

const DEFAULT_WIN_CONDITION = 15;

export function calculatePlayerPoints(player: IPlayer) {
  return sum(player.cards.map(c => c.value ?? 0));
}

const WinnerModal = ({ fullScreen }: { fullScreen?: boolean }) => {
  const navigation  = useNavigation<StackNavigation>();
  const { game, game: { currentRound } } = useContext(GameContext);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winner, setWinner] = useState<IPlayer>();

  useEffect(() => {
    const playerOverWinCondition = game.players.filter(player => calculatePlayerPoints(player) >= (game.settings?.winCondition ?? DEFAULT_WIN_CONDITION));
    if (playerOverWinCondition.length) {
      setWinner(maxBy(playerOverWinCondition, calculatePlayerPoints));
      setWinnerModalOpen(true);
      animate();
    }
  }, [currentRound]);

  const rotateY = useRef(new Animated.Value(0)).current;

  function animate() {
    const x = Animated.timing(rotateY, { toValue: 360, duration: 1500, useNativeDriver: true, easing: Easing.ease });
    Animated.loop(x).start();
  }

  const rotate2 = {
    transform: [
      {
        rotateY: rotateY.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg']
        })
      }

    ]
  };
  useEffect(() => {
    if (winnerModalOpen) {
      rotateY.setValue(0);
      animate();
    }
  }, [currentRound]);

  return <Modal
    animationType="slide" transparent={!fullScreen} statusBarTranslucent={true} visible={winnerModalOpen}
                onRequestClose={() => setWinnerModalOpen(false)}>
    <NewRoundBodyContainer>
      <NewRoundBodyText style={rotate2}>
        WINNER: {winner?.playerName}
      </NewRoundBodyText>
      <StyledButton onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Settings' }],
        });
      }}>
        <WinnerText>go again</WinnerText>
      </StyledButton>
      <FlatList horizontal={true} data={winner?.cards} renderItem={({ item }) => {
        return <CardsContainer key={item.id}>
          <BaseText>
            <Card cardSize={{ width: 100, height: 150 }}
                                                      faceUp={true} {...item} />
          </BaseText>
        </CardsContainer>;
      }} />
    </NewRoundBodyContainer>
  </Modal>;
};

export default WinnerModal;

const CardsContainer = styled.View`
  margin: 10px;
`;

const WinnerText = styled(BaseText)`
  align-self: center;
  margin: auto;
`;
const NewRoundBodyContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.lightWhite};
  justify-content: center;
`;
const NewRoundBodyText = styled(Animated.Text)`
  font-size: 48px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.lightGold};
  text-shadow: 1px 2px black;
  text-shadow-radius: 1px;
  margin: 0 auto;
`;
