import Avatar from '../Avatar';
import { playersImages } from '../../Entities/Settings';
import { sum } from 'lodash';
import { BaseText, ButtonText, FlexColumn, StyledButton } from '../../shardStyles';
import theme from '../../theme/theme';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import { GameContext } from '../../context/context';
import { ActionTypes } from '../../context/reducer';
import { TouchableOpacity } from 'react-native';
import PlayerDetailsModal from '../PlayerDetailsModal';
import { IPlayer } from '../../Entities/Player';

export default ()=>{
  const {game:{players,currentPlayerId},setPlayerAction,currentPlayerAction,dispatch} = useContext(GameContext);
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer>();
  const commit = () => {
    if (currentPlayerAction) {
      dispatch(currentPlayerAction);
      setPlayerAction(undefined);
    } else {
      dispatch({
        type: ActionTypes.END_TURN,
        gameState:{},
      });
    }
  };


  return <PlayerSection>
    {players.map((player, index) => <PlayerView isCurrent={currentPlayerId === index}
                                                     key={`${player.playerName}-${index}`}>
      <TouchableOpacity onPress={()=>setSelectedPlayer(player)}>
        <Avatar size={currentPlayerId === index ? 80 : 60} imageUrl={playersImages[player.imageIndex]} />
      </TouchableOpacity>
      <PointIndicator diameter={currentPlayerId === index ? 80 : 60}>
        <PointText>
          {sum(player.cards.map(c => c.value ?? 0))}
        </PointText>
      </PointIndicator>
      {currentPlayerId !== index ? <PlayerName>{player.playerName}</PlayerName> : null}
      {currentPlayerId === index ? <FloatingStyledButton onPress={() => commit()}>
        <ButtonText fontSize={theme.fontSizes.body1}>Finish round</ButtonText>
      </FloatingStyledButton> : null}
    </PlayerView>)}
    <PlayerDetailsModal player={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
  </PlayerSection>
}


const PlayerSection = styled(FlexColumn)`
  width: 100px;
`;

const PlayerView = styled.View<{ isCurrent: boolean }>`
  flex: 1;
`;

const FloatingStyledButton = styled(StyledButton)`
  position: absolute;
  height: 25px;
  width: 100px;
  top: 20%;
  z-index: 100;
  left: 60px;
`;


const PointIndicator = styled.View<{ diameter: number }>`
  height: 25px;
  width: 25px;
  border-radius: 12.5px;
  border: 1px solid ${theme.colors.gold};
  justify-content: center;
  background-color: ${theme.colors.mediumBlue};
  bottom: 25px;
  left: ${({ diameter }) => (diameter - 25)}px;
`;
const PointText = styled(BaseText)`
  text-align: center;
  font-weight: 800;
  color: ${theme.colors.lightGold};
`;

const PlayerName = styled(BaseText)`
  position: absolute;
  margin-top: 60px;
`;
