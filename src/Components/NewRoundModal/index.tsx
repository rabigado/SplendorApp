import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal } from 'react-native';
import styled from 'styled-components/native';
import { GameContext } from '../../context/context';
import { calculatePlayerPoints } from '../WinnerModal';


const NewRoundModal = ({fullScreen}:{fullScreen?:boolean}) => {
  const {game:{ currentRound,players,settings}} = useContext(GameContext);
  const [newRoundModalOpen, setNewRoundModalOpen] = useState(false);

  useEffect(()=>{
    const playerOverWinCondition = players.filter(player => calculatePlayerPoints(player) >= (settings?.winCondition ?? 15));
    if (playerOverWinCondition.length === 0 && currentRound > 1){
      setNewRoundModalOpen(true);
      setTimeout(()=>{
        setNewRoundModalOpen(false);
      },3000);
    }
  },[currentRound]);

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
          outputRange: ['0deg', '360deg'],
        }),
      },

    ],
  };
  useEffect(() => {
    if (newRoundModalOpen) {
      rotateY.setValue(0);
      animate();
      setTimeout(() => {
        setNewRoundModalOpen(false);
      }, 2500);
    }
  }, [newRoundModalOpen]);

  return <Modal
    animationType="slide" transparent={!fullScreen} statusBarTranslucent={true} visible={newRoundModalOpen}
                 onRequestClose={() => setNewRoundModalOpen(false)}>
    <NewRoundBodyContainer>
      <NewRoundBodyText style={rotate2}>
        Round {currentRound}
      </NewRoundBodyText>
    </NewRoundBodyContainer>
  </Modal>;
};

export default NewRoundModal;



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
