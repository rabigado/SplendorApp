import React, { useContext, useEffect, useMemo, useState } from 'react';
import { GameContext } from '../../context/context';
import styled from 'styled-components/native';
import { BaseText, ButtonText, FlexColumn, FlexRow, StyledButton } from '../../shardStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Game';
import Avatar from '../../Components/Avatar';
import { playersImages } from '../../Entities/Settings';

import Card from '../../Components/Card/Card';
import { take } from 'lodash';
import theme from '../../theme/theme';
import { ICard, NobleImages } from '../../Entities/Deck';
import CurrentPlayerDisplay from '../../Components/CurrentPlayerDisplay';
import Bank from '../../Components/Bank';
import CardModal from '../../Components/CardModal';
import { ActionTypes } from '../../context/reducer';

export type GameProps = NativeStackScreenProps<
  RootStackParamList,
  'Game'
>;
export default ({ navigation }: GameProps) => {
  const { game,currentPlayerAction,setPlayerAction,dispatch } = useContext(GameContext);
  const [selectedCard, setSelectedCard] = useState<ICard | undefined>();
  const nobles = useMemo(() => {
    return take(game.dealer?.nobles, game.settings?.nobles);
  }, [game.settings]);
  const checkWinCondition = () => {
    console.log('checkWinCondition');
  };

  useEffect(() => {
    checkWinCondition();
    //TODO: new round animation with transparent modal
  }, [game.currentRound]);
  const commit = ()=>{
    if (currentPlayerAction){
      dispatch(currentPlayerAction);
      setPlayerAction(undefined);
    }else{
      dispatch({
        type: ActionTypes.COIN_TO_PLAYER,
        gameState: game,
      })
    }
  };
  return <GameScreenRoot>
    <PlayerSection>
      {game.players.map((player, index) => <PlayerView isCurrent={game.currentPlayerId === index}
                                                       key={`${player.playerName}-${index}`}>
        <Avatar size={game.currentPlayerId === index ? 80 : 60} imageUrl={playersImages[player.imageIndex]} />
        <BaseText>{player.playerName}</BaseText>
        {game.currentPlayerId === index ?  <FloatingStyledButton onPress={() => commit()} >
          <ButtonText fontSize={theme.fontSizes.body1}>Finish round</ButtonText>
        </FloatingStyledButton> : null}
      </PlayerView>)}
    </PlayerSection>
    <DeckSection>
      {game.dealer?.cards.map((deck, i) => {
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
        {game.board.row3.map(card => card ? <Card
          onPress={() => setSelectedCard(card)}
          faceUp={true}
          key={`deck-${1}card-${card.id}`} {...card} /> : null)}
      </CardLevelRow>
      <CardLevelRow>
        {game.board.row2.map(card => card ? <Card
          onPress={() => setSelectedCard(card)}
          faceUp={true}
          key={`deck-${2}card-${card.id}`} {...card} /> : null)}
      </CardLevelRow>
      <CardLevelRow>
        {game.board.row1.map(card => card ? <Card
          onPress={() => setSelectedCard(card)}
          faceUp={true}
          key={`deck-${3}card-${card.id}`} {...card} /> : null)}
      </CardLevelRow>
      <CurrentPlayerDisplay />
    </BoardSection>
    <Bank />
    <NoblesSection>
      {nobles.map((nobleCard, index) => {
        return <NobleContainer key={`noble-${nobleCard.id}`}>
          <Noble source={NobleImages[nobleCard.imageIndex]} resizeMethod={'resize'} />
        </NobleContainer>;
      })}
    </NoblesSection>
    <CardModal selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
  </GameScreenRoot>;
};

const PlayerView = styled.View<{ isCurrent: boolean }>``;

const FloatingStyledButton = styled(StyledButton)`
        position: absolute;
        height: 25px;
        width: 100px;
        top:20%;
        z-index: 100;
        left: 60px;
  `;

const CardLevelRow = styled(FlexRow)`
  align-items: center;
  padding: 5px 10px 0;
  margin-bottom: 5px;
  transform: rotateX(20deg);
  justify-content: space-between;
  gap: 10px;
`;
const DeckContainer = styled(FlexColumn)`
  top: 0;
  flex: 1;
  padding: 5px 0;
  position: relative;
  margin-left: 10px;
`;

const GameScreenRoot = styled(FlexRow)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const PlayerSection = styled(FlexColumn)`
  flex: 1;
`;
const DeckSection = styled(FlexColumn)`
  width: 80px;
`;
const BoardSection = styled(FlexColumn)`
  overflow: hidden;
`;
const NoblesSection = styled(FlexColumn)`
  flex: 1;
  justify-content: space-around;
  align-items: center;
`;

const NobleContainer = styled.View<{ tilt?: number }>`
  border-radius: 8px;
  border-width: 2px;
  border-color: ${theme.colors.gold};
  height: 60px;
  width: 60px;
  overflow: hidden;
`;

const Noble = styled.Image`
  height: 60px;
  width: 60px;
`;

