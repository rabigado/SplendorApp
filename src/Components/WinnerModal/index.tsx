import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal } from 'react-native';
import styled from 'styled-components/native';
import { GameContext } from '../../context/context';
import { maxBy, sum } from 'lodash';
import { IPlayer } from '../../Entities/Player';
import { BaseText, StyledButton } from '../../shardStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../Game';

const DEFAULT_WIN_CONDITION = 15;

function calculatePlayerPoints(player: IPlayer) {
  return sum(player.cards.map(c => c.value ?? 0));
}

const WinnerModal = ({ fullScreen }: { fullScreen?: boolean }) => {
  const { navigate } = useNavigation<StackNavigation>();
  const { game, game: { currentRound } } = useContext(GameContext);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winner, setWinner] = useState<IPlayer>();
  useEffect(() => {
    const playerOverWinCondition = game.players.filter(player => calculatePlayerPoints(player) >= (game.settings?.winCondition ?? DEFAULT_WIN_CONDITION));
    if (playerOverWinCondition.length) {
      setWinner(maxBy(playerOverWinCondition, calculatePlayerPoints));
      setWinnerModalOpen(true);
    }
    setTimeout(() => {
      setWinnerModalOpen(false);
    }, 3000);
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
      setTimeout(() => {
        setWinnerModalOpen(false);
      }, 2500);
    }
  }, [winnerModalOpen]);

  return <Modal animationType="slide" transparent={!fullScreen} statusBarTranslucent={true} visible={winnerModalOpen}
                onRequestClose={() => setWinnerModalOpen(false)}>
    <NewRoundBodyContainer>
      <NewRoundBodyText style={rotate2}>
        WINNER: {winner?.playerName}
      </NewRoundBodyText>
    </NewRoundBodyContainer>
    <StyledButton onPress={()=>{
      navigate('Settings');
    }}>
      <BaseText>again?</BaseText>
    </StyledButton>
  </Modal>;
};

export default WinnerModal;


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
