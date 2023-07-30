import { BaseText, FlexColumn, FlexRow, FullPageView, StyledButton } from '../../shardStyles';
import theme, { colors } from '../../theme/theme';
import React, { useContext, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Game';
import { ISettings, playersImages } from '../../Entities/Settings';
import { GemsIcons, GemType } from '../../Entities/Gem';
import styled from 'styled-components/native';
import { IPlayer } from '../../Entities/Player';
import RefreshImageIcon from '../../assets/images/icons/activity.svg';
import AddPlayerIcon from '../../assets/images/icons/addPlayerIcon.svg';
import RemovePlayer from '../../assets/images/icons/removePlayer.svg';
import { Keyboard, View } from 'react-native';
import { ActionTypes } from '../../context/reducer';
import { GameContext } from '../../context/context';
import { cloneDeep } from 'lodash';

export type SettingsProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;
const MinPlayers = 2;
const MaxPlayers = 4;
const randomId = () => {
  return Math.random() * 100;
};
export default ({ navigation }: SettingsProps) => {
  const { dispatch, game: { settings } } = useContext(GameContext);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const initialPlayerState = new Array(MinPlayers).fill(0).map((_, index) => {
    return {
      id: randomId(),
      aiPlayer: false,
      playerName: `Player-${index + 1}`,
      imageIndex: index,
      playerGems: {
        [GemType.Ruby]: [],//...new Array(25).fill(getGemByColor('red') as IGem)
        [GemType.Onyx]: [],//...new Array(25).fill(getGemByColor('black') as IGem)
        [GemType.Emerald]: [],//...new Array(25).fill(getGemByColor('green') as IGem)
        [GemType.Sapphire]: [],//...new Array(25).fill(getGemByColor('blue') as IGem)
        [GemType.Diamond]: []//...new Array(25).fill(getGemByColor('white') as IGem)
      },
      cards: [],
      savedCards: [],
      gold: 0
    };
  });
  const [players, setPlayers] = useState<IPlayer[]>(cloneDeep(initialPlayerState));

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
    dispatch({ type: ActionTypes.NEW_GAME, gameState: {} });
    return () => {
      hideSubscription.remove();
    };
  }, []);

  const newGameSettings: ISettings = {
    numberOfTokens: players.length <= 2 ? 4 : players.length === 4 ? 7 : 5,
    winCondition: 15,
    nobles: players.length + 1,
    goldTokens: 5
  };
  const handleChangeName = (index: number, event: string) => {
    const values = [...players];
    values[index].playerName = event;
    setPlayers(values);
  };
  const handleImageChange = (index: number) => {
    const values = [...players];
    values[index].imageIndex =
      (values[index].imageIndex + 1) % playersImages.length;
    setPlayers(values);
  };

  const handleChangePlayer = (index: number, isRemove: boolean = false) => {
    setPlayers(
      !isRemove
        ? [
          ...players,
          {
            id: randomId(),
            playerName: `Player-${index + 1}`,
            imageIndex: index,
            playerGems: {
              [GemType.Ruby]: [],
              [GemType.Onyx]: [],
              [GemType.Emerald]: [],
              [GemType.Sapphire]: [],
              [GemType.Diamond]: []
            },
            cards: [],
            gold: 0,
            savedCards: [],
            aiPlayer: false
          }
        ]
        : players.length > MinPlayers
          ? players.filter((_, indexToRemove) => index !== indexToRemove)
          : players
    );
  };

  useEffect(() => {
    if (settings) {
      navigation.navigate('Game');
    }
  }, [settings]);

  const handleStartGame = () => {
    dispatch?.({
      type: ActionTypes.SETTINGS,
      gameState: { settings: newGameSettings, players }
    });
  };

  const setPlayerAi = (playerNumber: number) => {
    setPlayers([...players.map((p, index) => ({
      ...p,
      aiPlayer: index === playerNumber ? !p.aiPlayer : p.aiPlayer
    } as IPlayer))]);
  };

  return (
    <FullPageView background={colors.lightBlue}>
      <PlayerContainer>
        {new Array(MaxPlayers).fill(0).map((_, index) => {
          return (
            <PlayerCard key={index}>
              {players[index] ? (
                <PlayerDetails>
                  <PlayerImage
                    resizeMethod={'resize'}
                    source={playersImages[players[index].imageIndex]}
                  >
                    <FullRow flex={1}>
                      <ReplaceImage onPress={() => handleImageChange(index)}>
                        <RefreshImageIcon />
                      </ReplaceImage>
                      <RemovePlayerTouch
                        onPress={() => handleChangePlayer(index, true)}>
                        <RemovePlayer height={24} width={24} />
                      </RemovePlayerTouch>
                    </FullRow>
                    <FullRow>
                      <BaseText>AI player</BaseText>
                      <AIPlayerSelector
                        trackColor={{ false: theme.colors.background, true: theme.colors.lightGold }}
                        thumbColor={players[index].aiPlayer ? theme.colors.mediumGold : theme.colors.lightText}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setPlayerAi(index)}
                        value={players[index].aiPlayer}
                      />
                    </FullRow>
                    <PlayerName
                      autoCorrect={true}
                      onFocus={() => setIsKeyboardOpen(true)}
                      value={players[index].playerName ?? ''}
                      onChangeText={(name: string) => {
                        handleChangeName(index, name);
                      }}
                    />
                  </PlayerImage>
                </PlayerDetails>
              ) : (
                <AddPlayerTouch onPress={() => handleChangePlayer(index)}>
                  <AddPlayerIcon />
                </AddPlayerTouch>
              )}
            </PlayerCard>
          );
        })}
      </PlayerContainer>
      <GameDetailsContainer>
        <View>
          <DetailsText>Nobles: {newGameSettings.nobles}</DetailsText>
          <DetailsText>Tokens: {newGameSettings.numberOfTokens}</DetailsText>
          <DetailsText>Gold: {newGameSettings.goldTokens}</DetailsText>
          <DetailsText>Win at: {newGameSettings.winCondition}</DetailsText>
        </View>
        <View>
          {GemsIcons.map((gem, index) => {
            return (<GemImage key={index} source={gem} resizeMethod={'resize'} />);
          })}
        </View>
      </GameDetailsContainer>
      {!isKeyboardOpen ? <StartNewGameButton>
        <StartGameButton
          onPressOut={() => {
            handleStartGame();
          }}
        >
          <ButtonText>
            {'Venture forth'}
          </ButtonText>
        </StartGameButton>
      </StartNewGameButton> : null}
    </FullPageView>
  );
};

const ButtonText = styled(BaseText)`
  margin: 0 auto;
`;

const StartGameButton = styled(StyledButton)`
  justify-content: center;
  width: 150px;
  margin: 10px;
`;

const AIPlayerSelector = styled.Switch`

`;

const FullRow = styled(FlexRow)<{ flex?: number }>`
  justify-content: space-between;
  margin: 10px;
  ${({ flex }) => flex ? `flex:${flex};` : ''}
`;

const PlayerDetails = styled(FlexColumn)`
  flex: 1;
`;

const StartNewGameButton = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const DetailsText = styled(BaseText)`
  font-size: ${theme.fontSizes.h4}px;
  font-weight: 600;
  margin: 10px;
`;

const GameDetailsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
`;

const AddPlayerTouch = styled.TouchableOpacity`
  padding: 10px;
`;

const ReplaceImage = styled.TouchableOpacity`

`;
const RemovePlayerTouch = styled.TouchableOpacity`

`;

const PlayerName = styled.TextInput`
  margin: 10px;
  height: 34px;
  border-radius: 8px;
  border-color: ${theme.colors.lightGold};
  border-width: 1px;
  font-size: ${theme.fontSizes.body1}px;
  color: ${theme.colors.white};
`;

const PlayerImage = styled.ImageBackground`
  height: 100%;
`;

const GemImage = styled.Image`
  width: 30px;
  height: 30px;
`;

const PlayerContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayerCard = styled.View`
  position: relative;
  overflow: hidden;
  height: 200px;
  width: 150px;
  margin: 10px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gold};
`;
